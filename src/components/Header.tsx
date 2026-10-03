import React from 'react';
import {
  ShieldAlert,
  Activity,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  Send,
  Building2,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { getAQIColor } from '../utils/aqiUtils';

interface HeaderProps {
  isLoopRunning: boolean;
  onToggleLoop: () => void;
  onRunSingleCycle: () => void;
  onOpenSensorInject: () => void;
  onOpenAuthorityConfig: () => void;
  onOpenReportModal: () => void;
  loopCycleCount: number;
  nextCycleCountdown: number;
  maxAQI: number;
  dispatchesCount: number;
  activeStationName: string;
}

export const Header: React.FC<HeaderProps> = ({
  isLoopRunning,
  onToggleLoop,
  onRunSingleCycle,
  onOpenSensorInject,
  onOpenAuthorityConfig,
  onOpenReportModal,
  loopCycleCount,
  nextCycleCountdown,
  maxAQI,
  dispatchesCount,
  activeStationName,
}) => {
  const aqiStyle = getAQIColor(maxAQI);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <ShieldAlert className="w-6 h-6 text-white" />
              {isLoopRunning && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  AeroEnforce
                </h1>
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Autonomous Loop Engine
                </span>
                <span className="hidden sm:inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  ML + CPCB Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>City Air Quality Telemetry &bull; Forensic Causation &bull; Regulatory Action</span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-cyan-400/90 font-mono text-[11px] truncate max-w-[200px]">
                  Station: {activeStationName}
                </span>
              </p>
            </div>
          </div>

          {/* Center: Live Monitoring Status Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {/* Loop Status Pill */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isLoopRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="font-semibold text-slate-200">
                  Loop: {isLoopRunning ? 'AUTONOMOUS' : 'PAUSED'}
                </span>
              </div>
              {isLoopRunning ? (
                <span className="font-mono text-cyan-400 text-[11px] bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
                  Next in {nextCycleCountdown}s
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Manual Mode</span>
              )}
              <div className="text-slate-500">|</div>
              <div className="text-slate-300 text-[11px]">
                Cycles: <span className="font-mono font-bold text-white">{loopCycleCount}</span>
              </div>
            </div>

            {/* City Peak AQI Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${aqiStyle.badgeBg} text-xs font-medium`}>
              {maxAQI > 150 ? <AlertTriangle className="w-3.5 h-3.5 animate-bounce" /> : <Activity className="w-3.5 h-3.5" />}
              <span>City Peak AQI:</span>
              <span className="font-mono font-black text-sm">{maxAQI}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">({aqiStyle.label})</span>
            </div>

            {/* Dispatches Count */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-xs font-medium transition cursor-pointer"
              title="View Dispatched Regulatory Reports"
            >
              <Send className="w-3.5 h-3.5 text-indigo-400" />
              <span>Notices:</span>
              <span className="font-mono font-bold text-white">{dispatchesCount}</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLoop}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer ${
                isLoopRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
              }`}
            >
              {isLoopRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Loop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Loop</span>
                </>
              )}
            </button>

            <button
              onClick={onRunSingleCycle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer hover:border-slate-600 active:scale-95"
              title="Force One Telemetry -> ML -> Report Loop Cycle"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Run Cycle</span>
            </button>

            <button
              onClick={onOpenSensorInject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer hover:border-slate-600"
              title="Inject Custom Sensor Telemetry"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Test Sensor</span>
            </button>

            <button
              onClick={onOpenAuthorityConfig}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer hover:border-slate-600"
              title="Configure Target Pollution Control Body"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden lg:inline">Agency</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
