import React from 'react';
import { FormalReport } from '../types';
import {
  X,
  Printer,
  Send,
  ShieldAlert,
  Building2,
  FileCheck2,
  AlertTriangle,
  QrCode,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  Scale,
} from 'lucide-react';
import { getAQIColor } from '../utils/aqiUtils';

interface FormalReportModalProps {
  report: FormalReport | null;
  onClose: () => void;
  onDispatch: (report: FormalReport) => void;
  isDispatching: boolean;
}

export const FormalReportModal: React.FC<FormalReportModalProps> = ({
  report,
  onClose,
  onDispatch,
  isDispatching,
}) => {
  if (!report) return null;

  const aqiStyle = getAQIColor(report.telemetrySnapshot.aqi);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100">
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold">{report.reportId}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Official Environmental Statutory Order</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container formatted like an authentic legal government notice */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-slate-900 printable-document">
          {/* Official Document Letterhead */}
          <div className="text-center pb-6 border-b-2 border-slate-700 space-y-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-cyan-400">
              {report.targetAuthority.jurisdiction}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
              {report.targetAuthority.name}
            </h1>
            <p className="text-xs text-slate-400">
              Directorate of Ambient Air Quality Enforcement & Hazardous Emissions Control
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-1">
              Statutory Jurisdiction: {report.targetAuthority.legalFramework}
            </div>
          </div>

          {/* Reference Meta Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block">ORDER REFERENCE NO.</span>
              <span className="font-bold text-white text-sm">{report.reportId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">ISSUED TIMESTAMP</span>
              <span className="text-slate-200">{new Date(report.generatedAt).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">ACTION PRIORITY</span>
              <span className={`font-bold ${aqiStyle.text}`}>{report.telemetrySnapshot.emergencyLevel}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">TARGET RECIPIENT</span>
              <span className="text-cyan-300 truncate block">{report.targetAuthority.officialEmail}</span>
            </div>
          </div>

          {/* Legal Notice Header */}
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-300 uppercase tracking-wide">
              <Scale className="w-4 h-4 text-rose-400" />
              FORMAL COMPLIANCE MANDATE & ENVIRONMENTAL CEASE ORDER
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Pursuant to statutory powers vested under the Air (Prevention and Control of Pollution) Act and the Clean Air Regulatory Mandate, this formal citation is issued upon automated detection of severe atmospheric contamination exceeding legally permissible limits.
            </p>
          </div>

          {/* Monitoring Station & Verified Sensor Evidence */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              1. Verified Sensor Telemetry Evidence (Inspection Record)
            </h3>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">
                  Station: {report.stationName} ({report.stationCode})
                </span>
                <span className="text-slate-400">Zone: {report.zone}</span>
              </div>

              {/* Snapshot Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500">Peak AQI</div>
                  <div className={`font-mono font-bold text-lg ${aqiStyle.text}`}>
                    {report.telemetrySnapshot.aqi}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500">PM2.5 (Fine)</div>
                  <div className="font-mono font-bold text-slate-200">
                    {report.telemetrySnapshot.pm25} µg/m³
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500">PM10 (Coarse)</div>
                  <div className="font-mono font-bold text-slate-200">
                    {report.telemetrySnapshot.pm10} µg/m³
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500">NO2 (Vehicular)</div>
                  <div className="font-mono font-bold text-slate-200">
                    {report.telemetrySnapshot.no2} µg/m³
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500">SO2 (Industrial)</div>
                  <div className="font-mono font-bold text-slate-200">
                    {report.telemetrySnapshot.so2} µg/m³
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500">Surface Wind</div>
                  <div className="font-mono font-bold text-cyan-300">
                    {report.telemetrySnapshot.wind}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Machine Learning Source Apportionment Culpability */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-purple-400" />
              2. Forensic Machine Learning Causation Findings
            </h3>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <div>
                  <span className="text-slate-400">Primary Source Factor: </span>
                  <strong className="text-purple-400">{report.mlApportionment.primaryCause}</strong>
                  <span className="font-mono font-bold text-white ml-1">
                    ({report.mlApportionment.primaryPercentage}% contribution)
                  </span>
                </div>
                <div className="text-slate-400">
                  Algorithm: <span className="font-mono text-slate-300">{report.mlApportionment.algorithm}</span>
                </div>
              </div>

              {/* Forensic Narrative */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 italic leading-relaxed">
                "{report.forensicDiagnosis}"
              </div>

              {/* Origin Sector & Inversion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">Upwind Emitter Corridor</span>
                    <span className="font-bold text-slate-200">{report.mlApportionment.originSector}</span>
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">Atmospheric Dispersal State</span>
                    <span className="font-bold text-slate-200">{report.mlApportionment.atmosphericTrapping}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Statutory Directives */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              3. Immediate Legally Binding Directives (Enforcement Order)
            </h3>
            <div className="space-y-2">
              {(report.formalDirectives || []).map((dir, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/80 text-xs">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-100 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-900 text-cyan-300 flex items-center justify-center text-[10px] font-mono shrink-0">
                        {i + 1}
                      </span>
                      {dir.directive}
                    </span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 shrink-0">
                      Deadline: {dir.deadlineHours} Hours
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 pl-7">
                    Target Entity: <strong className="text-slate-300">{dir.targetEntity}</strong>
                  </div>
                  <div className="text-[10px] text-amber-400/90 pl-7 mt-1 font-mono">
                    Penal Sanction: {dir.penaltyClause}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Digital Verification & Cryptographic Seal */}
          <div className="pt-4 border-t-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                <QrCode className="w-10 h-10 text-cyan-400" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-200">Digital Cryptographic Seal</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Hash: {report.digitalSignature.hash.slice(0, 24)}...
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  Token: {report.digitalSignature.securityToken} &bull; Verified
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold text-slate-300">{report.digitalSignature.signedBy}</div>
              <div className="text-[11px] text-slate-500">Autonomous Sentinel Enforcement Directorate</div>
              <div className="text-[10px] text-slate-500">Central Pollution Control Grid</div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Transmitting will trigger official EDI receipt and log the enforcement action in the CPCB registry.
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => onDispatch(report)}
              disabled={isDispatching}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-900/40 transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isDispatching ? 'Transmitting to CPCB...' : 'Transmit Notice to Pollution Control Board'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
