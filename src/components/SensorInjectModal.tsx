import React, { useState } from 'react';
import { Station, TelemetryRecord } from '../types';
import { X, SlidersHorizontal, Sparkles, AlertOctagon, Check } from 'lucide-react';

interface SensorInjectModalProps {
  station: Station;
  currentTelemetry: TelemetryRecord | null;
  onClose: () => void;
  onInject: (data: Partial<TelemetryRecord>) => void;
}

export const SensorInjectModal: React.FC<SensorInjectModalProps> = ({
  station,
  currentTelemetry,
  onClose,
  onInject,
}) => {
  const [pm25, setPm25] = useState(currentTelemetry?.pm25 ?? 110);
  const [pm10, setPm10] = useState(currentTelemetry?.pm10 ?? 210);
  const [no2, setNo2] = useState(currentTelemetry?.no2 ?? 65);
  const [so2, setSo2] = useState(currentTelemetry?.so2 ?? 35);
  const [co, setCo] = useState(currentTelemetry?.co ?? 2.4);
  const [o3, setO3] = useState(currentTelemetry?.o3 ?? 45);
  const [voc, setVoc] = useState(currentTelemetry?.voc ?? 140);
  const [temperature, setTemperature] = useState(currentTelemetry?.temperature ?? 26);
  const [humidity, setHumidity] = useState(currentTelemetry?.humidity ?? 62);
  const [windSpeed, setWindSpeed] = useState(currentTelemetry?.windSpeed ?? 2.1);
  const [windDirection, setWindDirection] = useState(currentTelemetry?.windDirection ?? 315);
  const [pblHeight, setPblHeight] = useState(currentTelemetry?.pblHeight ?? 450);

  const presets = [
    {
      title: 'Biomass & Stubble Inversion Smog',
      badge: 'AQI 360+ (Hazardous)',
      values: { pm25: 260, pm10: 290, no2: 50, so2: 25, co: 4.6, o3: 30, voc: 220, pblHeight: 320, windSpeed: 1.2, windDirection: 320 },
    },
    {
      title: 'Heavy Diesel Freight Rush Jam',
      badge: 'NO2 & PM Peak',
      values: { pm25: 155, pm10: 240, no2: 135, so2: 30, co: 4.2, o3: 35, voc: 160, pblHeight: 650, windSpeed: 2.0, windDirection: 280 },
    },
    {
      title: 'Industrial Smelter & Boiler Flare',
      badge: 'High SO2 Alert',
      values: { pm25: 140, pm10: 190, no2: 45, so2: 140, co: 2.2, o3: 25, voc: 270, pblHeight: 480, windSpeed: 1.5, windDirection: 15 },
    },
    {
      title: 'Construction & Road Dust Resuspension',
      badge: 'High Coarse PM10',
      values: { pm25: 75, pm10: 380, no2: 35, so2: 20, co: 1.2, o3: 40, voc: 80, pblHeight: 1100, windSpeed: 4.2, windDirection: 250 },
    },
    {
      title: 'Afternoon Photochemical Ozone Smog',
      badge: 'O3 Toxicity',
      values: { pm25: 65, pm10: 110, no2: 40, so2: 15, co: 1.4, o3: 165, voc: 180, temperature: 36, pblHeight: 1600, windSpeed: 1.0, windDirection: 180 },
    },
    {
      title: 'Post-Rainfall Clean Baseline',
      badge: 'AQI 35 (Good)',
      values: { pm25: 16, pm10: 32, no2: 18, so2: 10, co: 0.6, o3: 25, voc: 40, pblHeight: 1200, windSpeed: 3.5, windDirection: 220 },
    },
  ];

  const applyPreset = (vals: Partial<TelemetryRecord>) => {
    if (vals.pm25 !== undefined) setPm25(vals.pm25);
    if (vals.pm10 !== undefined) setPm10(vals.pm10);
    if (vals.no2 !== undefined) setNo2(vals.no2);
    if (vals.so2 !== undefined) setSo2(vals.so2);
    if (vals.co !== undefined) setCo(vals.co);
    if (vals.o3 !== undefined) setO3(vals.o3);
    if (vals.voc !== undefined) setVoc(vals.voc);
    if (vals.temperature !== undefined) setTemperature(vals.temperature);
    if (vals.humidity !== undefined) setHumidity(vals.humidity);
    if (vals.windSpeed !== undefined) setWindSpeed(vals.windSpeed);
    if (vals.windDirection !== undefined) setWindDirection(vals.windDirection);
    if (vals.pblHeight !== undefined) setPblHeight(vals.pblHeight);
  };

  const handleSave = () => {
    onInject({
      stationId: station.id,
      pm25: Number(pm25),
      pm10: Number(pm10),
      no2: Number(no2),
      so2: Number(so2),
      co: Number(co),
      o3: Number(o3),
      voc: Number(voc),
      temperature: Number(temperature),
      humidity: Number(humidity),
      windSpeed: Number(windSpeed),
      windDirection: Number(windDirection),
      pblHeight: Number(pblHeight),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 my-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                Simulate / Inject Sensor Reading Telemetry
              </h2>
              <p className="text-xs text-slate-400">
                Target Node: {station.name} ({station.code})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Scenario Presets */}
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Instant Environmental Stress Scenarios
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {presets.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyPreset(preset.values)}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/60 text-left transition cursor-pointer group"
              >
                <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                  {preset.title}
                </div>
                <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                  {preset.badge}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Parameter Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* PM2.5 */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 font-semibold">PM2.5 Fine Particulates:</span>
              <span className="font-mono font-bold text-rose-400">{pm25} µg/m³</span>
            </div>
            <input
              type="range"
              min="5"
              max="450"
              value={pm25}
              onChange={(e) => setPm25(Number(e.target.value))}
              className="w-full accent-rose-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* PM10 */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 font-semibold">PM10 Coarse Dust:</span>
              <span className="font-mono font-bold text-amber-400">{pm10} µg/m³</span>
            </div>
            <input
              type="range"
              min="15"
              max="600"
              value={pm10}
              onChange={(e) => setPm10(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* NO2 */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 font-semibold">NO2 (Vehicular Diesel):</span>
              <span className="font-mono font-bold text-purple-400">{no2} µg/m³</span>
            </div>
            <input
              type="range"
              min="5"
              max="250"
              value={no2}
              onChange={(e) => setNo2(Number(e.target.value))}
              className="w-full accent-purple-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* SO2 */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 font-semibold">SO2 (Industrial Boilers):</span>
              <span className="font-mono font-bold text-blue-400">{so2} µg/m³</span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              value={so2}
              onChange={(e) => setSo2(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* CO */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 font-semibold">CO (Carbon Monoxide):</span>
              <span className="font-mono font-bold text-orange-400">{co} mg/m³</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="8.0"
              step="0.1"
              value={co}
              onChange={(e) => setCo(Number(e.target.value))}
              className="w-full accent-orange-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Ozone */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 font-semibold">Ground Ozone (O3):</span>
              <span className="font-mono font-bold text-emerald-400">{o3} µg/m³</span>
            </div>
            <input
              type="range"
              min="5"
              max="220"
              value={o3}
              onChange={(e) => setO3(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Wind Speed & Direction */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 font-semibold">Wind Direction / Speed:</span>
              <span className="font-mono font-bold text-cyan-400">{windDirection}° ({windSpeed} m/s)</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={windDirection}
              onChange={(e) => setWindDirection(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Inversion Boundary Layer */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 font-semibold">Boundary Layer Inversion:</span>
              <span className="font-mono font-bold text-slate-200">{pblHeight} m</span>
            </div>
            <input
              type="range"
              min="200"
              max="2000"
              step="50"
              value={pblHeight}
              onChange={(e) => setPblHeight(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-950/40 transition cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Inject Sensor Telemetry</span>
          </button>
        </div>
      </div>
    </div>
  );
};
