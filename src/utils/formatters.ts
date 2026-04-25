import { format, formatDistanceToNowStrict } from 'date-fns';
import { it as itLocale, enUS } from 'date-fns/locale';
import type { Language } from '@/store/settingsStore';

export const KM_PER_LD = 384400; // Lunar Distance
export const KM_PER_AU = 149597870.7;

export function formatNumber(value: number, fractionDigits = 0, language: Language = 'it'): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatKm(km: number, language: Language = 'it'): string {
  if (!Number.isFinite(km)) return '—';
  if (Math.abs(km) >= 1_000_000) {
    return `${formatNumber(km / 1_000_000, 2, language)} M km`;
  }
  if (Math.abs(km) >= 1000) {
    return `${formatNumber(km / 1000, 1, language)} mila km`;
  }
  return `${formatNumber(km, 1, language)} km`;
}

export function formatLD(km: number, language: Language = 'it'): string {
  if (!Number.isFinite(km)) return '—';
  return `${formatNumber(km / KM_PER_LD, 2, language)} LD`;
}

export function formatAU(km: number, language: Language = 'it'): string {
  if (!Number.isFinite(km)) return '—';
  return `${formatNumber(km / KM_PER_AU, 4, language)} AU`;
}

export function formatVelocity(kms: number, language: Language = 'it'): string {
  if (!Number.isFinite(kms)) return '—';
  return `${formatNumber(kms, 2, language)} km/s`;
}

export function formatDiameter(km: number, language: Language = 'it'): string {
  if (!Number.isFinite(km)) return '—';
  if (km >= 1) return `${formatNumber(km, 2, language)} km`;
  return `${formatNumber(km * 1000, 0, language)} m`;
}

export function formatEnergy(kt: number, language: Language = 'it'): string {
  if (!Number.isFinite(kt)) return '—';
  if (kt >= 1000) return `${formatNumber(kt / 1000, 2, language)} Mt`;
  if (kt >= 0.01) return `${formatNumber(kt, 2, language)} kt`;
  return `${formatNumber(kt * 1000, 1, language)} t`;
}

export function formatDateLocal(date: Date | string | number, language: Language = 'it'): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '—';
  return format(d, 'PPP', { locale: language === 'it' ? itLocale : enUS });
}

export function formatDateTimeLocal(date: Date | string | number, language: Language = 'it'): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '—';
  return format(d, 'PPp', { locale: language === 'it' ? itLocale : enUS });
}

export function formatRelative(date: Date | string | number, language: Language = 'it'): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '—';
  return formatDistanceToNowStrict(d, {
    addSuffix: true,
    locale: language === 'it' ? itLocale : enUS,
  });
}

export function formatLatLon(lat: number, lon: number, language: Language = 'it'): string {
  return `${formatNumber(lat, 3, language)}°, ${formatNumber(lon, 3, language)}°`;
}

export function compassDirection(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round((((deg % 360) + 360) % 360) / 22.5) % 16;
  return dirs[idx];
}
