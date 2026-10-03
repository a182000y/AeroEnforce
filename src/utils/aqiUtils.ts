export function getAQIColor(aqi: number): {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  glow: string;
  hex: string;
  label: string;
} {
  if (aqi <= 50) {
    return {
      bg: 'bg-emerald-500/10 dark:bg-emerald-950/30',
      text: 'text-emerald-500 dark:text-emerald-400',
      border: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      glow: 'shadow-emerald-500/20',
      hex: '#10b981',
      label: 'Good',
    };
  }
  if (aqi <= 100) {
    return {
      bg: 'bg-amber-500/10 dark:bg-amber-950/30',
      text: 'text-amber-500 dark:text-amber-400',
      border: 'border-amber-500/30',
      badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      glow: 'shadow-amber-500/20',
      hex: '#f59e0b',
      label: 'Moderate',
    };
  }
  if (aqi <= 150) {
    return {
      bg: 'bg-orange-500/10 dark:bg-orange-950/30',
      text: 'text-orange-500 dark:text-orange-400',
      border: 'border-orange-500/30',
      badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      glow: 'shadow-orange-500/20',
      hex: '#f97316',
      label: 'Unhealthy for Sensitive',
    };
  }
  if (aqi <= 200) {
    return {
      bg: 'bg-rose-500/10 dark:bg-rose-950/30',
      text: 'text-rose-500 dark:text-rose-400',
      border: 'border-rose-500/30',
      badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      glow: 'shadow-rose-500/20',
      hex: '#ef4444',
      label: 'Unhealthy',
    };
  }
  if (aqi <= 300) {
    return {
      bg: 'bg-purple-500/10 dark:bg-purple-950/30',
      text: 'text-purple-400 dark:text-purple-300',
      border: 'border-purple-500/30',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      glow: 'shadow-purple-500/20',
      hex: '#a855f7',
      label: 'Very Unhealthy',
    };
  }
  return {
    bg: 'bg-rose-950/40',
    text: 'text-rose-300',
    border: 'border-rose-700/60',
    badgeBg: 'bg-rose-900/60 text-rose-200 border-rose-600',
    glow: 'shadow-rose-600/30',
    hex: '#881337',
    label: 'Hazardous (Emergency)',
  };
}

export function formatTimestamp(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return isoString;
  }
}

export function formatDateShort(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString;
  }
}
