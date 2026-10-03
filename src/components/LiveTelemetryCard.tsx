import React from 'react';
import { TelemetryRecord, Station } from '../types';
import { getAQIColor } from '../utils/aqiUtils';
import {
  Wind,
  Thermometer,
  Droplets,
  Layers,
  MapPin,
  Clock,
  Compass,
  AlertOctagon,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

interface LiveTelemetryCardProps {
  station: Station;
  telemetry: TelemetryRecord | null;
  onOpenInject: () => void;
  onRunMLAnalysis: () => void;
  isAnalyzing: boolean;
}

export const LiveTelemetryCard: React.FC<LiveTelemetryCardProps> = ({
  station,
  telemetry,
  onOpenInject,
  onRunMLAnalysis,
  isAnalyzing,
}) => {
  if (!telemetry) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        Awaiting sensor heartbeat...
      </div>
    );
  }

  const aqiStyle = getAQIColor(telemetry.aqi);

  // Pollutant standards for progress bars
  const pollutants = [
    {
      code: 'PM2.5',
      name: 'Fine Particulates (≤2.5µm)',
      val: telemetry.pm25,
      unit: 'µg/m³',
      limit: 60,
      critical: 120,
      desc: 'Deep alveolar lung penetration from combustion',
    },
    {
      code: 'PM10',
      name: 'Coarse Particulates (≤10µm)',
      val: telemetry.pm10,
      unit: 'µg/m³',
      limit: 100,
      critical: 250,
      desc: 'Mechanical road dust, quarrying & resuspension',
    },
    {
      code: 'NO2',
      name: 'Nitrogen Dioxide',
      val: telemetry.no2,
      unit: 'µg/m³',
      limit: 80,
      critical: 180,
      desc: 'Heavy diesel exhaust & high-temp engine combustion',
    },
    {
      code: 'SO2',
      name: 'Sulfur Dioxide',
      val: telemetry.so2,
      unit: 'µg/m³',
      limit: 80,
      critical: 150,
      desc: 'Coal furnaces, smelters & heavy fuel oil boilers',
    },
    {
      code: 'CO',
      name: 'Carbon Monoxide',
      val: telemetry.co,
      unit: 'mg/m³',
      limit: 4.0,
      critical: 8.0,
      desc: 'Incomplete combustion in freight jams & smoldering',
    },
    {
      code: 'O3',
      name: 'Ground-Level Ozone',
      val: telemetry.o3,
      unit: 'µg/m³',
      limit: 100,
      critical: 180,
      desc: 'Photochemical smog synthesized in intense sunlight',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Top Station Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded">
              {station.code}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {station.name}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {station.zone} ({station.lat.toFixed(4)}°N, {station.lng.toFixed(4)}°E)
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Updated {new Date(telemetry.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenInject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition cursor-pointer hover:border-slate-600"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Sensor Spike</span>
          </button>
          <button
            onClick={onRunMLAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/40 transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAnalyzing ? 'Analyzing ML...' : 'Diagnose Cause'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left AQI Gauge, Right Meteorological & Pollutant Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Primary AQI Card */}
        <div className={`lg:col-span-4 rounded-xl p-5 border flex flex-col justify-between ${aqiStyle.bg} ${aqiStyle.border}`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                City Air Quality Index
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${aqiStyle.badgeBg}`}>
                {telemetry.emergencyLevel}
              </span>
            </div>

            {/* Huge AQI Number */}
            <div className="my-4 flex items-baseline gap-3">
              <span className={`text-6xl font-black font-mono tracking-tight ${aqiStyle.text}`}>
                {telemetry.aqi}
              </span>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-semibold uppercase">Status</span>
                <span className={`text-sm font-bold ${aqiStyle.text}`}>
                  {telemetry.category}
                </span>
              </div>
            </div>

            {/* Dominant Pollutant */}
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Dominant Driver:</span>
                <span className="font-bold text-amber-400 font-mono">
                  {telemetry.dominantPollutant}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Boundary Layer Inversion:</span>
                <span className="font-mono text-slate-200">
                  {telemetry.pblHeight}m {telemetry.pblHeight < 500 ? '(Trapped)' : '(Open)'}
                </span>
              </div>
            </div>
          </div>

          {/* Meteorological Ambient Conditions */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-rose-400" />
              <div>
                <div className="text-[10px] text-slate-500">Ambient Temp</div>
                <div className="font-mono font-bold text-slate-200">{telemetry.temperature}°C</div>
              </div>
            </div>

            <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-[10px] text-slate-500">Rel Humidity</div>
                <div className="font-mono font-bold text-slate-200">{telemetry.humidity}%</div>
              </div>
            </div>

            <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60 flex items-center gap-2">
              <Wind className="w-4 h-4 text-teal-400" />
              <div>
                <div className="text-[10px] text-slate-500">Surface Wind</div>
                <div className="font-mono font-bold text-slate-200">{telemetry.windSpeed} m/s</div>
              </div>
            </div>

            <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-[10px] text-slate-500">Wind Direction</div>
                <div className="font-mono font-bold text-cyan-300">
                  {telemetry.windDirectionCompass} ({telemetry.windDirection}°)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pollutant Concentration Cards with EPA / CPCB NAAQS Standard Bars */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Live Sensor Multi-Gas & Aerosol Array (NAAQS Threshold Benchmarking)
            </h3>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Dashed tick = 24-hr Regulatory Standard Limit
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {pollutants.map((p) => {
              const ratio = p.val / p.limit;
              const isExceeded = p.val > p.limit;
              const isCritical = p.val > p.critical;

              let barColor = 'bg-emerald-500';
              let badgeColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
              if (isCritical) {
                barColor = 'bg-rose-500';
                badgeColor = 'text-rose-400 bg-rose-950/60 border-rose-700/60';
              } else if (isExceeded) {
                barColor = 'bg-amber-500';
                badgeColor = 'text-amber-400 bg-amber-950/60 border-amber-700/60';
              }

              // Percentage for progress bar (cap at 100% of container, where limit is at 50% width)
              const barWidthPercent = Math.min(100, Math.round((p.val / (p.limit * 2)) * 100));

              return (
                <div
                  key={p.code}
                  className={`p-3 rounded-xl border bg-slate-800/50 transition-all ${
                    isCritical ? 'border-rose-500/40' : isExceeded ? 'border-amber-500/40' : 'border-slate-700/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <div>
                      <span className="font-mono font-bold text-sm text-slate-100">{p.code}</span>
                      <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{p.name}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${badgeColor}`}>
                      {p.val} {p.unit}
                    </span>
                  </div>

                  {/* Limit Bar */}
                  <div className="relative w-full h-2 bg-slate-700/60 rounded-full overflow-hidden my-2">
                    <div
                      className={`h-full ${barColor} transition-all duration-500 rounded-full`}
                      style={{ width: `${barWidthPercent}%` }}
                    />
                    {/* Standard limit marker line at 50% */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10"
                      style={{ left: '50%' }}
                      title={`Standard Limit: ${p.limit} ${p.unit}`}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Std: {p.limit} {p.unit}</span>
                    <span className={isExceeded ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                      {ratio > 1 ? `+${Math.round((ratio - 1) * 100)}% Exceedance` : `${Math.round(ratio * 100)}% Safe`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trace VOC & Ammonia Indicators */}
          <div className="mt-3 p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/40 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Trace Hydrocarbons & VOCs:</span>
              <span className={`font-mono font-bold ${telemetry.voc > 180 ? 'text-rose-400' : 'text-slate-200'}`}>
                {telemetry.voc} ppb
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Ammonia (NH3):</span>
              <span className="font-mono font-bold text-slate-200">{telemetry.nh3} µg/m³</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Atmospheric Pressure:</span>
              <span className="font-mono font-bold text-slate-200">{telemetry.pressure} hPa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
