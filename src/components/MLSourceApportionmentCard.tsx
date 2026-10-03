import React from 'react';
import { MLApportionmentAnalysis } from '../types';
import {
  BrainCircuit,
  Compass,
  FileCheck,
  AlertTriangle,
  Flame,
  Truck,
  Factory,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface MLSourceApportionmentCardProps {
  analysis: MLApportionmentAnalysis | null;
  onGenerateReport: () => void;
  isGeneratingReport: boolean;
}

export const MLSourceApportionmentCard: React.FC<MLSourceApportionmentCardProps> = ({
  analysis,
  onGenerateReport,
  isGeneratingReport,
}) => {
  if (!analysis) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        Run ML Diagnostic to identify primary cause of pollution.
      </div>
    );
  }

  const {
    primaryCause,
    primaryPercentage,
    sources = [],
    polarOrigin,
    atmosphericStability,
    mlModelDiagnostics,
    violations = [],
    aiForensicNarrative,
    aiEnforcementRecommendations = [],
  } = analysis;

  const sourcesList = sources || [];
  const chemicalRatiosList = mlModelDiagnostics?.chemicalRatios || [];
  const violationsList = violations || [];
  const recommendationsList = aiEnforcementRecommendations || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Machine Learning Source Apportionment & Causation Engine
              </h2>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60">
                PMF + GBDT Ensemble
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Positive Matrix Factorization with chemical signature ratio vectors & Gemini environmental forensics
            </p>
          </div>
        </div>

        {/* Generate Report Button */}
        <button
          onClick={onGenerateReport}
          disabled={isGeneratingReport}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-900/30 transition cursor-pointer disabled:opacity-50"
        >
          <FileCheck className="w-4 h-4" />
          <span>{isGeneratingReport ? 'Drafting Report...' : 'Generate Formal CPCB Notice'}</span>
        </button>
      </div>

      {/* Grid: Left Source Breakdown, Right Polar Trajectory & Forensic AI Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Attribution Bars & Diagnostics */}
        <div className="lg:col-span-7 space-y-4">
          {/* Primary Cause Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-800/90 to-purple-950/30 border border-purple-500/30">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="uppercase tracking-wider font-bold text-purple-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-purple-400" />
                Primary Cause of Pollution Identified
              </span>
              <span className="font-mono text-xs text-slate-300">
                Confidence: <strong className="text-emerald-400">{(mlModelDiagnostics.sourceConfidence * 100).toFixed(0)}%</strong>
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-purple-400">
                {primaryPercentage}%
              </span>
              <span className="text-sm sm:text-base font-bold text-white">
                {primaryCause}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 line-clamp-2">
              Multi-variant trace detection confirms elevated precursor gases matching this specific emitter profile.
            </p>
          </div>

          {/* Sources Breakdown Progress Bars */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Full Source Apportionment Breakdown
              </span>
              <span className="text-[11px]">Normalized Factor Loadings</span>
            </div>

            {sourcesList.map((s, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="font-medium text-slate-200">{s.source}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-100">{s.percentage}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${s.percentage}%`, backgroundColor: s.color }}
                  />
                </div>

                {/* Chemical signatures tags */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  {(s.chemicalSignatures || []).map((sig, sigIdx) => (
                    <span
                      key={sigIdx}
                      className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 font-mono"
                    >
                      {sig}
                    </span>
                  ))}
                  <span className="text-slate-500 ml-auto hidden sm:inline truncate max-w-[200px]" title={s.mitigation}>
                    Action: {s.mitigation}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Model Chemical Ratios Table */}
          <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              Empirical Chemical Diagnostic Ratios (Source Fingerprints)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {chemicalRatiosList.map((cr, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400 truncate">{cr.ratio}</div>
                  <div className="font-mono font-bold text-sm text-cyan-400 my-0.5">
                    {cr.value} <span className="text-[10px] text-slate-500">(Ref: {cr.baseline})</span>
                  </div>
                  <div className="text-[10px] text-slate-300 leading-tight line-clamp-2">
                    {cr.interpretation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Polar Trajectory & Forensic AI Diagnosis */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Polar Origin Back-Trajectory Card */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400" />
                Upwind Plume Origin Vector
              </span>
              <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
                Back-Trajectory Model
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Compass Graphic */}
              <div className="relative w-20 h-20 rounded-full border-2 border-slate-700 flex items-center justify-center bg-slate-900 shrink-0">
                <span className="absolute top-1 text-[9px] font-bold text-slate-500">N</span>
                <span className="absolute bottom-1 text-[9px] font-bold text-slate-500">S</span>
                <span className="absolute left-1 text-[9px] font-bold text-slate-500">W</span>
                <span className="absolute right-1 text-[9px] font-bold text-slate-500">E</span>
                {/* Wind Arrow pointing to origin */}
                <div
                  className="w-1.5 h-12 bg-gradient-to-t from-transparent via-cyan-400 to-rose-500 rounded-full origin-center transition-transform duration-700"
                  style={{ transform: `rotate(${polarOrigin?.angleDeg ?? 0}deg)` }}
                />
                <div className="absolute w-3 h-3 rounded-full bg-white shadow-md shadow-cyan-400" />
              </div>

              {/* Trajectory Details */}
              <div className="space-y-1 text-xs">
                <div className="text-slate-400">Suspected Emitter Cluster:</div>
                <div className="font-bold text-white text-sm">
                  {polarOrigin?.probableZone || 'Upwind Regional Air Basin'}
                </div>
                <div className="text-[11px] text-slate-400">
                  Surface Vector: <span className="font-mono text-cyan-300">{polarOrigin?.angleDeg ?? '--'}° ({polarOrigin?.direction ?? '--'})</span> at {polarOrigin?.windSpeed ?? '--'} m/s
                </div>
                <div className="text-[11px] text-slate-400">
                  Atmospheric Trapping: <span className="font-semibold text-amber-400">{atmosphericStability}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Forensic Diagnosis (Gemini 3.8 Flash) */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Forensic Environmental Diagnosis (AI Officer Analysis)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-900/60 p-3 rounded-lg border border-indigo-900/50">
                "{aiForensicNarrative || 'Atmospheric chemical mass balance attribution calculated.'}"
              </p>
            </div>

            {/* Regulatory Violations List */}
            {violationsList.length > 0 && (
              <div className="mt-3 pt-3 border-t border-indigo-900/40">
                <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Statutory Violations Detected ({violationsList.length})
                </div>
                <div className="space-y-1">
                  {violationsList.map((v, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px] text-slate-300 bg-rose-950/20 px-2 py-1 rounded border border-rose-900/40">
                      <span>{v.standard}:</span>
                      <span className="font-mono font-bold text-rose-300">
                        {v.measured} {v.unit} (Limit: {v.limit})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommended Countermeasures */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
              Immediate Enforcement Action Mandates
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {recommendationsList.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
