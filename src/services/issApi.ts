import { cachedFetch } from '@/lib/apiCache';

const ENDPOINT = 'https://api.wheretheiss.at/v1/satellites/25544';

export interface ISSPosition {
  lat: number;
  lon: number;
  altKm: number;
  velocityKmh: number;
  visibility: 'daylight' | 'eclipsed' | 'visible';
  footprintKm: number;
  timestamp: number;
}

interface RawWTI {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: 'daylight' | 'eclipsed' | 'visible';
  footprint: number;
  timestamp: number;
}

export async function fetchISSPosition(): Promise<ISSPosition> {
  const res = await fetch(ENDPOINT, { cache: 'no-store' });
  if (!res.ok) throw new Error(`ISS API ${res.status}`);
  const json = (await res.json()) as RawWTI;
  return {
    lat: json.latitude,
    lon: json.longitude,
    altKm: json.altitude,
    velocityKmh: json.velocity,
    visibility: json.visibility,
    footprintKm: json.footprint,
    timestamp: json.timestamp * 1000,
  };
}

export async function fetchISSPositionCached(): Promise<ISSPosition> {
  return cachedFetch<ISSPosition>({
    key: 'iss:pos:last',
    ttlMs: 10 * 1000,
    fetcher: fetchISSPosition,
  });
}
