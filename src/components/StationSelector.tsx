import React from 'react';
import { Station, TelemetryRecord } from '../types';
import { getAQIColor } from '../utils/aqiUtils';
import { Factory, Truck, Flame, Sprout, Building, Trees, Radio, Compass } from 'lucide-react';

interface StationSelectorProps {
  stations: Station[];
  telemetries: Map<string, TelemetryRecord>;
  activeStationId: string;
  onSelectStation: (stationId: string) => void;
}

export const StationSelector: React.FC<StationSelectorProps> = ({
  stations,
  telemetries,
  activeStationId,
  onSelectStation,
}) => {
  const getStationIcon = (type: Station['type']) => {
    switch (type) {
      case 'industrial':
        return <Factory className="w-4 h-4 text-orange-400" />;
      case 'transit_hub':
        return <Truck className="w-4 h-4 text-rose-400" />;
      case 'power_sector':
        return <Flame className="w-4 h-4 text-cyan-400" />;
      case 'agricultural_border':
        return <Sprout className="w-4 h-4 text-purple-400" />;
      case 'commercial_hub':
        return <Building className="w-4 h-4 text-blue-400" />;
      case 'residential':
        return <Trees className="w-4 h-4 text-emerald-400" />;
      default:
        return <Radio className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            City Air Telemetry Sensor Network Grid
          </h2>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {stations.length} Active Nodes
          </span>
        </div>
        <div className="text-xs text-slate-400 hidden sm:block">
          Select node to inspect live sensor telemetry, run ML attribution & generate formal notice
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {(stations || []).map((st) => {
          const tel = telemetries.get(st.id);
          const aqi = tel?.aqi ?? 50;
          const aqiStyle = getAQIColor(aqi);
          const isSelected = st.id === activeStationId;

          return (
            <button
              key={st.id}
              onClick={() => onSelectStation(st.id)}
              className={`flex flex-col justify-between p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-500/10 ring-2 ring-cyan-500/30'
                  : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-bl-md" />
              )}

              {/* Station Header */}
              <div className="flex items-start justify-between gap-1.5 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="p-1 rounded bg-slate-800 border border-slate-700 shrink-0">
                    {getStationIcon(st.type)}
                  </div>
                  <span className="font-mono text-[11px] font-bold text-slate-300 truncate">
                    {st.code}
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${aqiStyle.badgeBg}`}>
                  AQI {aqi}
                </span>
              </div>

              {/* Name & Zone */}
              <div className="mb-2.5">
                <h3 className="text-xs font-semibold text-slate-100 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {st.name}
                </h3>
                <p className="text-[11px] text-slate-400 truncate">{st.zone}</p>
              </div>

              {/* Live Parameters Strip */}
              <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="text-slate-500">PM2.5:</span>
                  <span className="font-mono text-slate-200">{tel ? Math.round(tel.pm25) : '--'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Compass className="w-3 h-3 text-slate-500" />
                  <span className="font-mono text-cyan-300">
                    {tel?.windDirectionCompass || '--'} {tel?.windSpeed}m/s
                  </span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
