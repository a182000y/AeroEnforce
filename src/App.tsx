import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Station,
  TelemetryRecord,
  MLApportionmentAnalysis,
  FormalReport,
  DispatchRecord,
  LoopExecutionLog,
  TargetAuthorityConfig,
} from './types';
import { Header } from './components/Header';
import { StationSelector } from './components/StationSelector';
import { LiveTelemetryCard } from './components/LiveTelemetryCard';
import { MLSourceApportionmentCard } from './components/MLSourceApportionmentCard';
import { AutonomousLoopControl } from './components/AutonomousLoopControl';
import { HistoricalTrendsDashboard } from './components/HistoricalTrendsDashboard';
import { FormalReportModal } from './components/FormalReportModal';
import { DispatchLogCard } from './components/DispatchLogCard';
import { SensorInjectModal } from './components/SensorInjectModal';
import { AuthorityConfigModal } from './components/AuthorityConfigModal';
import { AlertTriangle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export default function App() {
  // State
  const [stations, setStations] = useState<Station[]>([]);
  const [telemetries, setTelemetries] = useState<Map<string, TelemetryRecord>>(new Map());
  const [activeStationId, setActiveStationId] = useState<string>('station-north-ind');
  const [mlAnalysis, setMlAnalysis] = useState<MLApportionmentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Formal Report & Dispatch
  const [formalReport, setFormalReport] = useState<FormalReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [dispatches, setDispatches] = useState<DispatchRecord[]>([]);
  const [isDispatching, setIsDispatching] = useState(false);

  // Historical Trends
  const [trends, setTrends] = useState<TelemetryRecord[]>([]);

  // Modals
  const [isInjectModalOpen, setIsInjectModalOpen] = useState(false);
  const [isAuthorityModalOpen, setIsAuthorityModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Target Authority Config
  const [authorityConfig, setAuthorityConfig] = useState<TargetAuthorityConfig>({
    name: 'Central Pollution Control Board & Directorate of Air Quality Enforcement',
    acronym: 'CPCB-DAQE',
    department: 'Commission for Air Quality Management (CAQM)',
    jurisdiction: 'National Capital Air Shed Regulatory Commission',
    officialEmail: 'enforcement.air@cpcb.gov.in',
    legalFramework: 'Air (Prevention & Control of Pollution) Act, 1981 & Clean Air Standards',
    leadOfficer: 'Director General of Urban Air Quality Inspection',
  });

  // Autonomous Loop State
  const [isLoopRunning, setIsLoopRunning] = useState<boolean>(true);
  const [cycleIntervalSeconds, setCycleIntervalSeconds] = useState<number>(15);
  const [autoDispatchThreshold, setAutoDispatchThreshold] = useState<number>(120);
  const [nextCycleCountdown, setNextCycleCountdown] = useState<number>(15);
  const [loopCycleCount, setLoopCycleCount] = useState<number>(0);
  const [executionLogs, setExecutionLogs] = useState<LoopExecutionLog[]>([]);

  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeStation = stations.find((s) => s.id === activeStationId) || stations[0];
  const activeTelemetry = telemetries.get(activeStationId) || null;

  // Find city peak AQI across all stations
  const telemetryList = Array.from(telemetries.values()).filter((t): t is TelemetryRecord => Boolean(t && typeof t.aqi === 'number'));
  const maxCityAQI = telemetryList.length > 0
    ? Math.max(...telemetryList.map((t) => t.aqi), activeTelemetry?.aqi || 50)
    : (activeTelemetry?.aqi || 50);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // 1. Initial Data Fetching
  useEffect(() => {
    async function initData() {
      try {
        const [stationsRes, telemetryRes, dispatchesRes] = await Promise.all([
          fetch('/api/stations').then((r) => r.json()).catch(() => ({ stations: [] })),
          fetch('/api/telemetry').then((r) => r.json()).catch(() => ({ telemetries: [] })),
          fetch('/api/reports/history').then((r) => r.json()).catch(() => ({ dispatches: [] })),
        ]);

        if (stationsRes?.stations && Array.isArray(stationsRes.stations)) {
          setStations(stationsRes.stations);
          if (stationsRes.stations.length > 0) {
            setActiveStationId(stationsRes.stations[0].id);
          }
        }

        if (telemetryRes?.telemetries && Array.isArray(telemetryRes.telemetries)) {
          const map = new Map<string, TelemetryRecord>();
          telemetryRes.telemetries.forEach((t: TelemetryRecord) => {
            if (t && t.stationId) map.set(t.stationId, t);
          });
          setTelemetries(map);
        }

        if (dispatchesRes?.dispatches && Array.isArray(dispatchesRes.dispatches)) {
          setDispatches(dispatchesRes.dispatches);
        }
      } catch (err) {
        console.error('Failed to initialize app data:', err);
      }
    }
    initData();
  }, []);

  // 2. Fetch Historical Trends when active station changes
  const fetchTrends = useCallback(async (stId: string) => {
    try {
      const res = await fetch(`/api/trends/history?stationId=${stId}`).then((r) => r.json());
      if (res.trends) {
        setTrends(res.trends);
      }
    } catch (err) {
      console.error('Failed to load trends:', err);
    }
  }, []);

  useEffect(() => {
    if (activeStationId) {
      fetchTrends(activeStationId);
    }
  }, [activeStationId, fetchTrends]);

  // 3. Run ML Source Apportionment
  const handleRunMLAnalysis = useCallback(async (customTel?: TelemetryRecord) => {
    const targetTel = customTel || activeTelemetry;
    if (!targetTel) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ml/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telemetry: targetTel }),
      }).then((r) => r.json());

      if (res.success && res.analysis) {
        setMlAnalysis(res.analysis);
      }
    } catch (err: any) {
      console.error('ML Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [activeTelemetry]);

  // Auto-run ML analysis on active station when telemetry changes
  useEffect(() => {
    if (activeTelemetry && (!mlAnalysis || mlAnalysis.station?.id !== activeTelemetry.stationId)) {
      handleRunMLAnalysis();
    }
  }, [activeStationId, activeTelemetry?.id]);

  // 4. Generate Formal Legal Report for CPCB
  const handleGenerateReport = async () => {
    if (!activeTelemetry || !mlAnalysis) return;
    setIsGeneratingReport(true);
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telemetry: activeTelemetry,
          analysis: mlAnalysis,
          authorityConfig,
        }),
      }).then((r) => r.json());

      if (res.success && res.report) {
        setFormalReport(res.report);
        setIsReportModalOpen(true);
      }
    } catch (err) {
      console.error('Report generation error:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // 5. Dispatch Formal Report
  const handleDispatchReport = async (report: FormalReport) => {
    setIsDispatching(true);
    try {
      const res = await fetch('/api/reports/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report }),
      }).then((r) => r.json());

      if (res.success && res.dispatch) {
        setDispatches((prev) => [res.dispatch, ...prev]);
        showToast(
          `Enforcement Notice ${report.reportId} successfully transmitted to ${report.targetAuthority.name}. ACK: ${res.dispatch.ackNumber}`
        );
        setIsReportModalOpen(false);
      }
    } catch (err) {
      console.error('Dispatch error:', err);
    } finally {
      setIsDispatching(false);
    }
  };

  // 6. Autonomous Loop Step Execution
  const executeLoopStep = useCallback(async () => {
    try {
      const targetStationId = activeStationId;
      const res = await fetch('/api/loop/cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stationId: targetStationId,
          autoDispatchThreshold,
          authorityConfig,
        }),
      }).then((r) => r.json());

      if (res.success) {
        // Update live telemetry in map
        setTelemetries((prev) => {
          const next = new Map(prev);
          next.set(targetStationId, res.telemetry);
          return next;
        });

        // Update ML analysis
        if (res.mlAnalysis) {
          setMlAnalysis(res.mlAnalysis);
        }

        // Update historical trends
        setTrends((prev) => [...prev, res.telemetry].slice(-100));

        // If dispatched, update dispatches log & formal report
        if (res.dispatched && res.dispatch) {
          setDispatches((prev) => [res.dispatch, ...prev]);
          setFormalReport(res.report);
          showToast(
            `Autonomous Dispatch Loop: Formal Notice sent to CPCB for AQI ${res.telemetry.aqi}. ACK: ${res.dispatch.ackNumber}`
          );
        }

        // Increment cycle count
        setLoopCycleCount((c) => c + 1);

        // Add execution log
        const newLog: LoopExecutionLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          stationName: res.telemetry.stationId,
          aqi: res.telemetry.aqi,
          dominantCause: res.mlAnalysis?.primaryCause || 'Urban Mixed',
          actionTaken: res.dispatched
            ? 'Dispatched Formal Enforcement Notice'
            : 'Audit Recorded (Below Threshold)',
          status: res.dispatched ? 'alert' : 'success',
        };
        setExecutionLogs((prev) => [newLog, ...prev.slice(0, 30)]);
      }
    } catch (err) {
      console.error('Loop step execution error:', err);
    }
  }, [activeStationId, autoDispatchThreshold, authorityConfig]);

  // Loop Timer effect
  useEffect(() => {
    if (!isLoopRunning) {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      return;
    }

    setNextCycleCountdown(cycleIntervalSeconds);

    countdownTimerRef.current = setInterval(() => {
      setNextCycleCountdown((prev) => {
        if (prev <= 1) {
          executeLoopStep();
          return cycleIntervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [isLoopRunning, cycleIntervalSeconds, executeLoopStep]);

  // 7. Inject Sensor Reading (Manual Testing)
  const handleInjectTelemetry = async (data: Partial<TelemetryRecord>) => {
    try {
      const res = await fetch('/api/telemetry/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json());

      if (res.success && res.telemetry) {
        setTelemetries((prev) => {
          const next = new Map(prev);
          next.set(res.telemetry.stationId, res.telemetry);
          return next;
        });

        // Trigger immediate ML analysis
        handleRunMLAnalysis(res.telemetry);

        // Update trends
        setTrends((prev) => [...prev, res.telemetry].slice(-100));

        showToast(`Injected test telemetry for ${res.telemetry.stationId}. AQI: ${res.telemetry.aqi}`);
      }
    } catch (err) {
      console.error('Sensor injection error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md p-4 rounded-xl bg-slate-900 border border-cyan-500/60 shadow-2xl text-xs text-slate-100 flex items-start gap-3 animate-fade-in backdrop-blur-md">
          <div className="p-1 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-cyan-300">Central Enforcement Dispatch Confirmed</div>
            <div className="text-slate-300 mt-0.5 leading-snug">{toastMessage}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        isLoopRunning={isLoopRunning}
        onToggleLoop={() => setIsLoopRunning((r) => !r)}
        onRunSingleCycle={executeLoopStep}
        onOpenSensorInject={() => setIsInjectModalOpen(true)}
        onOpenAuthorityConfig={() => setIsAuthorityModalOpen(true)}
        onOpenReportModal={() => {
          if (formalReport) {
            setIsReportModalOpen(true);
          } else {
            handleGenerateReport();
          }
        }}
        loopCycleCount={loopCycleCount}
        nextCycleCountdown={nextCycleCountdown}
        maxAQI={maxCityAQI}
        dispatchesCount={dispatches.length}
        activeStationName={activeStation?.name || 'Monitoring Node'}
      />

      {/* Main Command Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* City Severe Smog Alert Banner (if AQI > 150) */}
        {maxCityAQI > 150 && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-rose-900/60 to-purple-950/70 border border-rose-600/60 shadow-lg shadow-rose-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-900/90 text-rose-300 border border-rose-500 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>METROPOLITAN CRITICAL AIR QUALITY EMERGENCY</span>
                  <span className="font-mono px-2 py-0.5 rounded bg-rose-900 text-rose-200 border border-rose-600">
                    AQI {maxCityAQI}
                  </span>
                </div>
                <p className="text-rose-200/90 mt-0.5">
                  Graded Response Action Plan (GRAP) Level 4 mandates active. Continuous sentinel loop is executing automated CPCB dispatch notices.
                </p>
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-md cursor-pointer shrink-0"
            >
              Draft Immediate Emergency Directive
            </button>
          </div>
        )}

        {/* 1. Station Selector Bar */}
        <StationSelector
          stations={stations}
          telemetries={telemetries}
          activeStationId={activeStationId}
          onSelectStation={(id) => {
            setActiveStationId(id);
            const tel = telemetries.get(id);
            if (tel) handleRunMLAnalysis(tel);
          }}
        />

        {/* 2. Live Telemetry Card (Multi-Gas & Aerosol Array + Meteorology) */}
        {activeStation && (
          <div className="mb-6">
            <LiveTelemetryCard
              station={activeStation}
              telemetry={activeTelemetry}
              onOpenInject={() => setIsInjectModalOpen(true)}
              onRunMLAnalysis={() => handleRunMLAnalysis()}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        {/* 3. Machine Learning Source Apportionment & Causation Engine */}
        <MLSourceApportionmentCard
          analysis={mlAnalysis}
          onGenerateReport={handleGenerateReport}
          isGeneratingReport={isGeneratingReport}
        />

        {/* 4. Autonomous Telemetry -> ML -> Report -> Dispatch Loop Control */}
        <AutonomousLoopControl
          isLoopRunning={isLoopRunning}
          onToggleLoop={() => setIsLoopRunning((r) => !r)}
          onRunSingleCycle={executeLoopStep}
          cycleIntervalSeconds={cycleIntervalSeconds}
          onChangeInterval={(s) => setCycleIntervalSeconds(s)}
          autoDispatchThreshold={autoDispatchThreshold}
          onChangeThreshold={(t) => setAutoDispatchThreshold(t)}
          nextCycleCountdown={nextCycleCountdown}
          loopCycleCount={loopCycleCount}
          executionLogs={executionLogs}
        />

        {/* 5. Historical Trends & Diurnal Analytics */}
        <HistoricalTrendsDashboard
          trends={trends}
          stationName={activeStation?.name || 'Monitoring Node'}
        />

        {/* 6. Dispatched Regulatory Reports History Ledger */}
        <DispatchLogCard
          dispatches={dispatches}
          onViewReport={(d) => {
            setFormalReport(d.fullReport);
            setIsReportModalOpen(true);
          }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-slate-400">AeroEnforce System Sentinel</span>
            <span>&bull;</span>
            <span>EPA & CPCB NAAQS Regulatory Standards</span>
          </div>
          <div>
            Autonomous Environmental Intelligence & ML Forensic Causation Dispatch Architecture
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isReportModalOpen && formalReport && (
        <FormalReportModal
          report={formalReport}
          onClose={() => setIsReportModalOpen(false)}
          onDispatch={handleDispatchReport}
          isDispatching={isDispatching}
        />
      )}

      {isInjectModalOpen && activeStation && (
        <SensorInjectModal
          station={activeStation}
          currentTelemetry={activeTelemetry}
          onClose={() => setIsInjectModalOpen(false)}
          onInject={handleInjectTelemetry}
        />
      )}

      {isAuthorityModalOpen && (
        <AuthorityConfigModal
          currentConfig={authorityConfig}
          onClose={() => setIsAuthorityModalOpen(false)}
          onSave={(cfg) => {
            setAuthorityConfig(cfg);
            showToast(`Updated target authority to ${cfg.name}`);
          }}
        />
      )}
    </div>
  );
}
