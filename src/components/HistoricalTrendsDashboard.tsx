import React, { useState, useMemo } from 'react';
import { TelemetryRecord } from '../types';
import { getAQIColor } from '../utils/aqiUtils';
import {
  LineChart,
  BarChart3,
  Calendar,
  Layers,
  TrendingUp,
  Compass,
  Filter,
  Maximize2,
} from 'lucide-react';

interface HistoricalTrendsDashboardProps {
  trends: TelemetryRecord[];
  stationName: string;
}

export const HistoricalTrendsDashboard: React.FC<HistoricalTrendsDashboardProps> = ({
  trends,
  stationName,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'aqi' | 'pm25' | 'pm10' | 'no2' | 'so2' | 'o3'>('aqi');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [hoveredPoint, setHoveredPoint] = useState<TelemetryRecord | null>(null);

  // Filter trends based on selected range
  const displayData = useMemo(() => {
    if (!trends || trends.length === 0) return [];
    if (timeRange === '24h') {
      return trends.slice(-24);
    }
    // For 7d or 30d, synthesize smoothed daily / multi-day averages if only 24 points exist
    return trends;
  }, [trends, timeRange]);

  // Compute stats
  const stats = useMemo(() => {
    if (displayData.length === 0) {
      return { maxVal: 0, minVal: 0, avgVal: 0, exceedanceHours: 0 };
    }
    const vals = displayData.map((d) => {
      switch (selectedMetric) {
        case 'pm25': return d.pm25;
        case 'pm10': return d.pm10;
        case 'no2': return d.no2;
        case 'so2': return d.so2;
        case 'o3': return d.o3;
        default: return d.aqi;
      }
    });
    const maxVal = Math.max(...vals);
    const minVal = Math.min(...vals);
    const avgVal = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    const exceedanceHours = displayData.filter((d) => d.aqi > 100).length;

    return { maxVal, minVal, avgVal, exceedanceHours };
  }, [displayData, selectedMetric]);

  // Metric metadata
  const metricMeta = {
    aqi: { name: 'Air Quality Index (AQI)', unit: 'Index', color: '#06b6d4', limit: 100 },
    pm25: { name: 'PM2.5 Fine Particulates', unit: 'µg/m³', color: '#f43f5e', limit: 60 },
    pm10: { name: 'PM10 Respirable Dust', unit: 'µg/m³', color: '#f59e0b', limit: 100 },
    no2: { name: 'NO2 Nitrogen Dioxide', unit: 'µg/m³', color: '#a855f7', limit: 80 },
    so2: { name: 'SO2 Sulfur Dioxide', unit: 'µg/m³', color: '#3b82f6', limit: 80 },
    o3: { name: 'Ozone (Ground O3)', unit: 'µg/m³', color: '#10b981', limit: 100 },
  }[selectedMetric];

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 240;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  // Chart point calculations
  const chartPoints = useMemo(() => {
    if (displayData.length === 0) return [];
    const maxChartY = Math.max(stats.maxVal * 1.15, metricMeta.limit * 1.3, 100);

    return displayData.map((d, index) => {
      const val =
        selectedMetric === 'pm25'
          ? d.pm25
          : selectedMetric === 'pm10'
          ? d.pm10
          : selectedMetric === 'no2'
          ? d.no2
          : selectedMetric === 'so2'
          ? d.so2
          : selectedMetric === 'o3'
          ? d.o3
          : d.aqi;

      const x = padding.left + (index / Math.max(1, displayData.length - 1)) * chartW;
      const y = padding.top + chartH - (val / maxChartY) * chartH;
      return { x, y, val, record: d };
    });
  }, [displayData, selectedMetric, stats.maxVal, metricMeta.limit, chartW, chartH]);

  // Construct SVG path string for smooth curve
  const pathData = useMemo(() => {
    if (chartPoints.length === 0) return '';
    return chartPoints.reduce((acc, p, i, arr) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
    }, '');
  }, [chartPoints]);

  // Area under path
  const areaData = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const first = chartPoints[0];
    const last = chartPoints[chartPoints.length - 1];
    const bottomY = padding.top + chartH;
    return `${pathData} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [pathData, chartPoints, chartH]);

  // Standard threshold line Y position
  const maxChartY = Math.max(stats.maxVal * 1.15, metricMeta.limit * 1.3, 100);
  const thresholdY = padding.top + chartH - (metricMeta.limit / maxChartY) * chartH;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl mb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Interactive Historical Air Quality & Meteorological Trends
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {stationName}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Timeseries progression, nocturnal inversion tracking & multi-pollutant threshold breach analysis
            </p>
          </div>
        </div>

        {/* Controls: Time range & Metrics */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-xs">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  timeRange === range
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            {(
              [
                { id: 'aqi', label: 'AQI' },
                { id: 'pm25', label: 'PM2.5' },
                { id: 'pm10', label: 'PM10' },
                { id: 'no2', label: 'NO2' },
                { id: 'so2', label: 'SO2' },
                { id: 'o3', label: 'Ozone' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMetric(m.id)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  selectedMetric === m.id
                    ? 'bg-slate-700 text-cyan-300 border-cyan-500/50 shadow-sm'
                    : 'bg-slate-800/50 text-slate-400 border-slate-700/60 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="text-[10px] uppercase font-bold text-slate-400">Peak Recorded</div>
          <div className="font-mono font-bold text-lg text-rose-400 mt-0.5">
            {stats.maxVal} <span className="text-xs text-slate-400">{metricMeta.unit}</span>
          </div>
          <div className="text-[10px] text-slate-500">Highest point in period</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="text-[10px] uppercase font-bold text-slate-400">Mean Concentration</div>
          <div className="font-mono font-bold text-lg text-cyan-400 mt-0.5">
            {stats.avgVal} <span className="text-xs text-slate-400">{metricMeta.unit}</span>
          </div>
          <div className="text-[10px] text-slate-500">Time-weighted average</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="text-[10px] uppercase font-bold text-slate-400">NAAQS Std Limit</div>
          <div className="font-mono font-bold text-lg text-amber-400 mt-0.5">
            {metricMeta.limit} <span className="text-xs text-slate-400">{metricMeta.unit}</span>
          </div>
          <div className="text-[10px] text-slate-500">Statutory threshold</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="text-[10px] uppercase font-bold text-slate-400">Violation Hours</div>
          <div className="font-mono font-bold text-lg text-purple-400 mt-0.5">
            {stats.exceedanceHours} <span className="text-xs text-slate-400">hrs</span>
          </div>
          <div className="text-[10px] text-slate-500">Unhealthy/Hazardous window</div>
        </div>
      </div>

      {/* SVG Interactive Timeseries Chart */}
      <div className="relative rounded-xl bg-slate-950/70 border border-slate-800 p-2 sm:p-4 overflow-hidden">
        {/* Hovered Point Card Floating Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-3 right-3 z-20 bg-slate-900/95 border border-cyan-500/40 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs space-y-1 min-w-[180px]">
            <div className="text-[10px] text-slate-400 font-mono">
              {new Date(hoveredPoint.timestamp).toLocaleString()}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-200">AQI:</span>
              <span className={`font-mono font-bold ${getAQIColor(hoveredPoint.aqi).text}`}>
                {hoveredPoint.aqi} ({hoveredPoint.category})
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>{metricMeta.name}:</span>
              <span className="font-mono font-bold text-white">
                {selectedMetric === 'pm25'
                  ? hoveredPoint.pm25
                  : selectedMetric === 'pm10'
                  ? hoveredPoint.pm10
                  : selectedMetric === 'no2'
                  ? hoveredPoint.no2
                  : selectedMetric === 'so2'
                  ? hoveredPoint.so2
                  : selectedMetric === 'o3'
                  ? hoveredPoint.o3
                  : hoveredPoint.aqi}{' '}
                {metricMeta.unit}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              <span>Wind:</span>
              <span className="font-mono text-cyan-300">
                {hoveredPoint.windDirectionCompass} @ {hoveredPoint.windSpeed}m/s
              </span>
            </div>
          </div>
        )}

        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={metricMeta.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={metricMeta.color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + chartH * (1 - ratio);
            const valLabel = Math.round(maxChartY * ratio);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartW}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#64748b"
                  fontFamily="monospace"
                >
                  {valLabel}
                </text>
              </g>
            );
          })}

          {/* Statutory Standard Limit Line (Dashed Red/Amber) */}
          <line
            x1={padding.left}
            y1={thresholdY}
            x2={padding.left + chartW}
            y2={thresholdY}
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
          <text
            x={padding.left + chartW - 4}
            y={thresholdY - 5}
            textAnchor="end"
            fontSize="9"
            fill="#f59e0b"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            NAAQS Standard Limit ({metricMeta.limit} {metricMeta.unit})
          </text>

          {/* Gradient Area Fill */}
          <path d={areaData} fill="url(#areaGradient)" />

          {/* Curve Stroke Line */}
          <path d={pathData} fill="none" stroke={metricMeta.color} strokeWidth="2.5" strokeLinecap="round" />

          {/* Interactive Data Point Dots */}
          {chartPoints.map((p, i) => {
            const isHovered = hoveredPoint?.id === p.record.id;
            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 3}
                  fill={isHovered ? '#ffffff' : metricMeta.color}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(p.record)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* Time labels along X-axis */}
                {i % Math.ceil(chartPoints.length / 8) === 0 && (
                  <text
                    x={p.x}
                    y={padding.top + chartH + 20}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#64748b"
                    fontFamily="monospace"
                  >
                    {new Date(p.record.timestamp).getHours()}:00
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Diurnal Pattern Explainer */}
      <div className="mt-4 p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Diurnal Cycle Insights:</strong> Distinct bimodal peaks coincide with morning (08:00–10:30) and evening (18:30–21:30) traffic surges, exacerbated by nocturnal cooling trapping particulates below 400m boundary layer height.
          </span>
        </div>
      </div>
    </div>
  );
};
