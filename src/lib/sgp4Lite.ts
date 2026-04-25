import * as satellite from 'satellite.js';
import type { TleSet } from '@/types';

export interface PropagatedPosition {
  lat: number;
  lon: number;
  altKm: number;
  velocityKms: number;
  timestamp: number;
}

export function propagate(tle: TleSet, date = new Date()): PropagatedPosition | null {
  const rec = satellite.twoline2satrec(tle.line1, tle.line2);
  const pv = satellite.propagate(rec, date);
  const pos = pv.position as satellite.EciVec3<number> | boolean | undefined;
  const vel = pv.velocity as satellite.EciVec3<number> | boolean | undefined;
  if (!pos || typeof pos === 'boolean' || !vel || typeof vel === 'boolean') return null;
  const gmst = satellite.gstime(date);
  const geo = satellite.eciToGeodetic(pos, gmst);
  const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
  return {
    lat: satellite.degreesLat(geo.latitude),
    lon: satellite.degreesLong(geo.longitude),
    altKm: geo.height,
    velocityKms: speed,
    timestamp: date.getTime(),
  };
}

export function groundTrack(tle: TleSet, fromMs: number, toMs: number, stepSec = 30): PropagatedPosition[] {
  const out: PropagatedPosition[] = [];
  for (let t = fromMs; t <= toMs; t += stepSec * 1000) {
    const p = propagate(tle, new Date(t));
    if (p) out.push(p);
  }
  return out;
}

export function getMeanMotion(tle: TleSet): number {
  // revs/day from line2 cols 53-63
  return parseFloat(tle.line2.substring(52, 63));
}

export function getBStar(tle: TleSet): number {
  // BSTAR from line1, cols 54-61, exponent format
  const raw = tle.line1.substring(53, 61).trim();
  if (!raw) return 0;
  const sign = raw[0] === '-' ? -1 : 1;
  const cleaned = raw.replace(/^[-+]/, '');
  const mantissa = cleaned.slice(0, -2);
  const exp = parseInt(cleaned.slice(-2), 10);
  if (Number.isNaN(exp) || !mantissa) return 0;
  return sign * parseFloat(`0.${mantissa}`) * Math.pow(10, exp);
}

export function getEpoch(tle: TleSet): Date {
  const yy = parseInt(tle.line1.substring(18, 20), 10);
  const dayOfYear = parseFloat(tle.line1.substring(20, 32));
  const fullYear = yy < 57 ? 2000 + yy : 1900 + yy;
  const start = Date.UTC(fullYear, 0, 1);
  return new Date(start + (dayOfYear - 1) * 86400000);
}

/**
 * Stima vita orbitale residua a partire da TLE.
 * Heuristic: usa BSTAR e mean motion. Quando BSTAR è alto e altitudine bassa,
 * l'oggetto sta decadendo. Tipica accuratezza ±20%.
 */
export function estimateRemainingLifetimeDays(tle: TleSet): number {
  const bstar = Math.abs(getBStar(tle));
  const meanMotion = getMeanMotion(tle);
  // semi-major axis from mean motion
  const mu = 398600.4418;
  const n = (meanMotion * 2 * Math.PI) / 86400; // rad/s
  const a = Math.cbrt(mu / (n * n));
  const altKm = a - 6378;
  if (altKm > 600) return Number.POSITIVE_INFINITY;
  if (bstar < 1e-6) return Math.max(1, altKm * 4); // very low drag
  // very rough
  const days = Math.max(0.1, altKm / (bstar * 1e8));
  return Math.min(days, 365);
}
