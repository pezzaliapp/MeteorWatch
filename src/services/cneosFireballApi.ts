import { cachedFetch } from '@/lib/apiCache';

const BASE = 'https://ssd-api.jpl.nasa.gov/fireball.api';
const TTL_MS = 1000 * 60 * 60 * 24; // 24h

export interface FireballEvent {
  date: string;
  epochMs: number;
  energyKt: number;
  impactEnergyJ: number;
  altitudeKm?: number;
  velocityKms?: number;
  lat: number;
  lon: number;
}

interface RawResponse {
  fields: string[];
  data: string[][];
}

function parseLat(value: string | undefined): number {
  if (!value) return NaN;
  const m = value.match(/([\d.]+)([NS])/);
  if (!m) return parseFloat(value);
  const sign = m[2] === 'N' ? 1 : -1;
  return sign * parseFloat(m[1]);
}

function parseLon(value: string | undefined): number {
  if (!value) return NaN;
  const m = value.match(/([\d.]+)([EW])/);
  if (!m) return parseFloat(value);
  const sign = m[2] === 'E' ? 1 : -1;
  return sign * parseFloat(m[1]);
}

export async function fetchFireballs(limit = 200): Promise<FireballEvent[]> {
  const url = `${BASE}?limit=${limit}`;
  return cachedFetch<FireballEvent[]>({
    key: `fireball:limit:${limit}`,
    ttlMs: TTL_MS,
    fetcher: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fireball ${res.status}`);
      const raw = (await res.json()) as RawResponse;
      const idx = (name: string) => raw.fields.indexOf(name);
      const iDate = idx('date');
      const iEnergy = idx('energy');
      const iImpactE = idx('impact-e');
      const iLat = idx('lat');
      const iLatDir = idx('lat-dir');
      const iLon = idx('lon');
      const iLonDir = idx('lon-dir');
      const iAlt = idx('alt');
      const iVel = idx('vel');
      return raw.data
        .map<FireballEvent | null>((row) => {
          const date = row[iDate];
          if (!date) return null;
          const lat = parseLat(`${row[iLat] ?? ''}${row[iLatDir] ?? ''}`);
          const lon = parseLon(`${row[iLon] ?? ''}${row[iLonDir] ?? ''}`);
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
          const energy = parseFloat(row[iEnergy] ?? '0');
          const impactE = parseFloat(row[iImpactE] ?? '0');
          return {
            date,
            epochMs: new Date(date.replace(' ', 'T') + 'Z').getTime(),
            energyKt: impactE || energy * 0.4,
            impactEnergyJ: impactE * 4.184e12,
            altitudeKm: row[iAlt] ? parseFloat(row[iAlt]) : undefined,
            velocityKms: row[iVel] ? parseFloat(row[iVel]) : undefined,
            lat,
            lon,
          };
        })
        .filter((x): x is FireballEvent => x !== null)
        .sort((a, b) => b.epochMs - a.epochMs);
    },
    fallback: async () => loadFallback(),
  });
}

async function loadFallback(): Promise<FireballEvent[]> {
  try {
    const res = await fetch('/MeteorWatch/fallback-data/fireballs.json');
    if (!res.ok) return [];
    return (await res.json()) as FireballEvent[];
  } catch {
    return [];
  }
}
