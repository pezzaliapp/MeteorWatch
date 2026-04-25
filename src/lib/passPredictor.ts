import * as satellite from 'satellite.js';
import type { TleSet, GeoCoord } from '@/types';

export interface SatPass {
  aos: number;
  los: number;
  maxElDeg: number;
  maxElTime: number;
  startAzDeg: number;
  endAzDeg: number;
  durationSec: number;
  visible?: boolean;
}

interface LookAngles {
  azimuth: number;
  elevation: number;
}

const RAD2DEG = 180 / Math.PI;
const DEG2RAD = Math.PI / 180;

function lookAngles(rec: satellite.SatRec, observer: GeoCoord, date: Date): LookAngles | null {
  const pv = satellite.propagate(rec, date);
  const pos = pv.position as satellite.EciVec3<number> | boolean | undefined;
  if (!pos || typeof pos === 'boolean') return null;
  const gmst = satellite.gstime(date);
  const obs = {
    longitude: observer.lon * DEG2RAD,
    latitude: observer.lat * DEG2RAD,
    height: observer.alt ?? 0,
  };
  const ecf = satellite.eciToEcf(pos, gmst);
  const look = satellite.ecfToLookAngles(obs, ecf);
  return {
    azimuth: look.azimuth * RAD2DEG,
    elevation: look.elevation * RAD2DEG,
  };
}

function isInDarkness(observer: GeoCoord, date: Date): boolean {
  const sunPos = sunPosition(date);
  const lst = greenwichSiderealTime(date) + observer.lon;
  const ha = ((lst - sunPos.ra) * Math.PI) / 180;
  const decRad = (sunPos.dec * Math.PI) / 180;
  const latRad = (observer.lat * Math.PI) / 180;
  const sinAlt =
    Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(ha);
  return sinAlt < Math.sin((-6 * Math.PI) / 180); // civil dusk
}

function sunPosition(date: Date): { ra: number; dec: number } {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const n = jd - 2451545.0;
  const L = ((280.46 + 0.9856474 * n) % 360 + 360) % 360;
  const g = (((357.528 + 0.9856003 * n) % 360 + 360) % 360) * (Math.PI / 180);
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * (Math.PI / 180);
  const eps = 23.439 * (Math.PI / 180);
  const ra = (Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda)) * 180) / Math.PI;
  const dec = (Math.asin(Math.sin(eps) * Math.sin(lambda)) * 180) / Math.PI;
  return { ra: (ra + 360) % 360, dec };
}

function greenwichSiderealTime(date: Date): number {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const t = (jd - 2451545.0) / 36525;
  const gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * t * t -
    (t * t * t) / 38710000;
  return ((gmst % 360) + 360) % 360;
}

export function predictPasses(
  tle: TleSet,
  observer: GeoCoord,
  options: { from?: Date; durationHours?: number; minElDeg?: number; stepSec?: number } = {},
): SatPass[] {
  const from = options.from ?? new Date();
  const duration = options.durationHours ?? 48;
  const minEl = options.minElDeg ?? 10;
  const step = options.stepSec ?? 15;
  const rec = satellite.twoline2satrec(tle.line1, tle.line2);
  const passes: SatPass[] = [];

  let inPass = false;
  let aos = 0;
  let maxEl = 0;
  let maxElTime = 0;
  let startAz = 0;

  const endMs = from.getTime() + duration * 3600_000;
  for (let t = from.getTime(); t <= endMs; t += step * 1000) {
    const date = new Date(t);
    const angles = lookAngles(rec, observer, date);
    if (!angles) continue;
    if (angles.elevation >= minEl) {
      if (!inPass) {
        inPass = true;
        aos = t;
        startAz = angles.azimuth;
        maxEl = angles.elevation;
        maxElTime = t;
      } else if (angles.elevation > maxEl) {
        maxEl = angles.elevation;
        maxElTime = t;
      }
    } else if (inPass) {
      const visible = isInDarkness(observer, new Date(maxElTime));
      passes.push({
        aos,
        los: t,
        maxElDeg: maxEl,
        maxElTime,
        startAzDeg: startAz,
        endAzDeg: angles.azimuth,
        durationSec: Math.round((t - aos) / 1000),
        visible,
      });
      inPass = false;
      maxEl = 0;
      if (passes.length >= 6) break;
    }
  }
  return passes;
}
