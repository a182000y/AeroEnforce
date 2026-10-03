import React from 'react';
import {
  Play,
  Pause,
  RefreshCw,
  Repeat,
  Radio,
  BrainCircuit,
  FileCheck,
  Send,
  Sliders,
  CheckCircle,
  AlertCircle,
  History,
} from 'lucide-react';
import { LoopExecutionLog } from '../types';

interface AutonomousLoopControlProps {
  isLoopRunning: boolean;
  onToggleLoop: () => void;
  onRunSingleCycle: () => void;
  cycleIntervalSeconds: number;
  onChangeInterval: (seconds: number) => void;
  autoDispatchThreshold: number;
  onChangeThreshold: (threshold: number) => void;
  nextCycleCountdown: number;
  loopCycleCount: number;
  executionLogs: LoopExecutionLog[];
}

export const AutonomousLoopControl: React.FC<AutonomousLoopControlProps> = ({
  isLoopRunning,
  onToggleLoop,
  onRunSingleCycle,
  cycleIntervalSeconds,
  onChangeInterval,
  autoDispatchThreshold,
  onChangeThreshold,
  nextCycleCountdown,
  loopCycleCount,
  executionLogs,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Repeat className={`w-5 h-5 ${isLoopRunning ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Autonomous Telemetry-to-Enforcement Continuous Loop
              </h2>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isLoopRunning
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                    : 'bg-amber-950/80 text-amber-400 border-amber-800/80'
                }`}
              >
                {isLoopRunning ? 'Continuous Loop Active' : 'Standby Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous pipeline cyclically ingests sensor telemetry, classifies pollution causation, compiles formal CPCB compliance orders, and transmits notices.
            </p>
          </div>
        </div>

        {/* Master Control Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLoop}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg cursor-pointer ${
              isLoopRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
            }`}
          >
            {isLoopRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isLoopRunning ? 'Pause Loop' : 'Activate Continuous Loop'}</span>
          </button>

          <button
            onClick={onRunSingleCycle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer hover:border-slate-600"
            title="Step through one cycle manually"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Step 1 Cycle</span>
          </button>
        </div>
      </div>

      {/* Visual 4-Stage Autonomous Pipeline Diagram */}
      <div className="relative py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800 mb-5 overflow-hidden">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center justify-between">
          <span>Active Loop Pipeline Stages</span>
          {isLoopRunning && (
            <span className="text-cyan-400 font-mono">
              Next loop cycle in: <strong className="text-white text-xs">{nextCycleCountdown}s</strong>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Stage 1: Telemetry */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-blue-400 font-bold uppercase">Stage 01</div>
              <div className="text-xs font-semibold text-slate-100 truncate">Sensor Ingestion</div>
              <div className="text-[10px] text-slate-400 truncate">PM2.5, NO2, Wind, Inversion</div>
            </div>
          </div>

          {/* Stage 2: ML Apportionment */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-purple-400 font-bold uppercase">Stage 02</div>
              <div className="text-xs font-semibold text-slate-100 truncate">ML Cause Diagnosis</div>
              <div className="text-[10px] text-slate-400 truncate">PMF & Gemini Forensics</div>
            </div>
          </div>

          {/* Stage 3: Legal Report */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30 shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-pink-400 font-bold uppercase">Stage 03</div>
              <div className="text-xs font-semibold text-slate-100 truncate">Report Generation</div>
              <div className="text-[10px] text-slate-400 truncate">Section 31A Formal Notice</div>
            </div>
          </div>

          {/* Stage 4: Municipal Dispatch */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-emerald-400 font-bold uppercase">Stage 04</div>
              <div className="text-xs font-semibold text-slate-100 truncate">CPCB Transmission</div>
              <div className="text-[10px] text-slate-400 truncate">Autonomous ACK Dispatch</div>
            </div>
          </div>
        </div>
      </div>

      {/* Loop Parameter Sliders & Execution History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Loop Configuration Sliders */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Autonomous Loop Parameters
          </div>

          {/* Loop Interval */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300">Loop Cadence Interval:</span>
              <span className="font-mono font-bold text-cyan-400">{cycleIntervalSeconds} seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onChangeInterval(5)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition cursor-pointer ${
                  cycleIntervalSeconds === 5
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                5s (Fast Demo)
              </button>
              <button
                onClick={() => onChangeInterval(15)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition cursor-pointer ${
                  cycleIntervalSeconds === 15
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                15s
              </button>
              <button
                onClick={() => onChangeInterval(30)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition cursor-pointer ${
                  cycleIntervalSeconds === 30
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                30s
              </button>
              <button
                onClick={() => onChangeInterval(60)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition cursor-pointer ${
                  cycleIntervalSeconds === 60
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                60s
              </button>
            </div>
          </div>

          {/* Auto-Dispatch Threshold */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300">Auto-Dispatch AQI Trigger:</span>
              <span className="font-mono font-bold text-amber-400">AQI ≥ {autoDispatchThreshold}</span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              step="10"
              value={autoDispatchThreshold}
              onChange={(e) => onChangeThreshold(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Moderate (50)</span>
              <span>Unhealthy (150)</span>
              <span>Severe (250)</span>
            </div>
          </div>

          {/* Loop Metrics */}
          <div className="pt-3 border-t border-slate-700/60 flex justify-between items-center text-xs text-slate-400">
            <span>Completed Execution Cycles:</span>
            <span className="font-mono font-bold text-white text-sm">{loopCycleCount}</span>
          </div>
        </div>

        {/* Right: Live Loop Audit Log */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <History className="w-4 h-4 text-cyan-400" />
              Autonomous Sentinel Cycle History Ledger
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Live Chronological Feed</span>
          </div>

          <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
            {!executionLogs || executionLogs.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-800/30 text-center text-xs text-slate-500">
                Awaiting first autonomous cycle trigger. Click "Activate Continuous Loop" or "Step 1 Cycle".
              </div>
            ) : (
              (executionLogs || []).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {log.status === 'alert' ? (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                    <span className="font-semibold text-slate-200 truncate">{log.stationName}</span>
                    <span className="text-[10px] font-mono px-1.5 rounded bg-slate-900 text-amber-300">
                      AQI {log.aqi}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-300 hidden md:inline truncate max-w-[150px]">
                      {log.dominantCause}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        log.status === 'alert'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {log.actionTaken}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
