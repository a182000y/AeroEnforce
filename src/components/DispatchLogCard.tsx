import React from 'react';
import { DispatchRecord } from '../types';
import { getAQIColor } from '../utils/aqiUtils';
import { Send, FileText, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';

interface DispatchLogCardProps {
  dispatches: DispatchRecord[];
  onViewReport: (record: DispatchRecord) => void;
}

export const DispatchLogCard: React.FC<DispatchLogCardProps> = ({
  dispatches,
  onViewReport,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl mb-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Dispatched Enforcement Notice Registry
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                {dispatches.length} Notices Logged
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Audit trail of formal regulatory compliance orders delivered to city pollution control authorities
            </p>
          </div>
        </div>
      </div>

      {/* Table or Empty State */}
      {!dispatches || dispatches.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-xs rounded-xl bg-slate-950/40 border border-slate-800">
          No enforcement notices dispatched yet. The autonomous loop will transmit notices when AQI exceeds the threshold, or you can manually trigger "Generate Formal CPCB Notice".
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Order Ref / ACK</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Monitoring Station</th>
                <th className="py-2.5 px-3">AQI / Dominant Cause</th>
                <th className="py-2.5 px-3">Recipient Authority</th>
                <th className="py-2.5 px-3">Transmission Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {(dispatches || []).map((d) => {
                const aqiStyle = getAQIColor(d.aqi);
                return (
                  <tr key={d.dispatchId} className="hover:bg-slate-800/40 transition-colors">
                    {/* Order Ref & ACK */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-cyan-400">{d.reportId}</div>
                      <div className="text-[10px] text-slate-500">{d.ackNumber}</div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      {new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>

                    {/* Station */}
                    <td className="py-2.5 px-3 text-slate-200 font-sans">
                      {d.stationName}
                    </td>

                    {/* AQI & Cause */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 font-sans">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${aqiStyle.badgeBg}`}>
                          AQI {d.aqi}
                        </span>
                        <span className="text-[11px] text-slate-300 truncate max-w-[160px]" title={d.dominantCause}>
                          {d.dominantCause}
                        </span>
                      </div>
                    </td>

                    {/* Recipient Authority */}
                    <td className="py-2.5 px-3 text-slate-400 font-sans">
                      <div className="truncate max-w-[180px] text-slate-200" title={d.recipientBody}>
                        {d.recipientBody}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                        {d.recipientEmail}
                      </div>
                    </td>

                    {/* Transmission Status */}
                    <td className="py-2.5 px-3 font-sans">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Delivered (ACK 200)
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-right font-sans">
                      <button
                        onClick={() => onViewReport(d)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer hover:border-slate-600"
                      >
                        <FileText className="w-3 h-3 text-cyan-400" />
                        <span>Inspect Notice</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
