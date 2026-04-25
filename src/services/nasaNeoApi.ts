import { cachedFetch } from '@/lib/apiCache';
import { addDaysISO, todayISO } from '@/utils/dates';

const API_KEY = import.meta.env.VITE_NASA_API_KEY ?? 'DEMO_KEY';
const BASE = 'https://api.nasa.gov/neo/rest/v1';
const TTL_MS = 1000 * 60 * 60 * 6; // 6h

export interface NeoCloseApproach {
  closeApproachDate: string;
  epochMs: number;
  velocityKms: number;
  missDistanceKm: number;
  orbitingBody: string;
}

export interface NeoObject {
  id: string;
  name: string;
  designation?: string;
  isPotentiallyHazardous: boolean;
  isSentry?: boolean;
  absoluteMagnitude: number;
  diameterKmMin: number;
  diameterKmMax: number;
  closeApproach: NeoCloseApproach;
  nasaJplUrl: string;
}

interface RawNeoFeed {
  near_earth_objects: Record<string, RawNeo[]>;
}

interface RawNeo {
  id: string;
  name: string;
  designation?: string;
  is_potentially_hazardous_asteroid: boolean;
  is_sentry_object?: boolean;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full?: string;
    epoch_date_close_approach: number;
    relative_velocity: { kilometers_per_second: string };
    miss_distance: { kilometers: string };
    orbiting_body: string;
  }>;
  nasa_jpl_url: string;
}

function mapNeo(raw: RawNeo): NeoObject | null {
  const ca = raw.close_approach_data[0];
  if (!ca) return null;
  return {
    id: raw.id,
    name: raw.name,
    designation: raw.designation,
    isPotentiallyHazardous: raw.is_potentially_hazardous_asteroid,
    isSentry: raw.is_sentry_object,
    absoluteMagnitude: raw.absolute_magnitude_h,
    diameterKmMin: raw.estimated_diameter.kilometers.estimated_diameter_min,
    diameterKmMax: raw.estimated_diameter.kilometers.estimated_diameter_max,
    closeApproach: {
      closeApproachDate: ca.close_approach_date_full ?? ca.close_approach_date,
      epochMs: ca.epoch_date_close_approach,
      velocityKms: parseFloat(ca.relative_velocity.kilometers_per_second),
      missDistanceKm: parseFloat(ca.miss_distance.kilometers),
      orbitingBody: ca.orbiting_body,
    },
    nasaJplUrl: raw.nasa_jpl_url,
  };
}

export async function fetchNeoFeed(daysAhead = 7): Promise<NeoObject[]> {
  const start = todayISO();
  const end = addDaysISO(Math.min(daysAhead, 7), new Date(start));
  const url = `${BASE}/feed?start_date=${start}&end_date=${end}&api_key=${API_KEY}`;
  return cachedFetch<NeoObject[]>({
    key: `neo:feed:${start}:${end}`,
    ttlMs: TTL_MS,
    fetcher: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`NeoWs ${res.status}`);
      const json = (await res.json()) as RawNeoFeed;
      return Object.values(json.near_earth_objects)
        .flat()
        .map(mapNeo)
        .filter((o): o is NeoObject => o !== null)
        .sort((a, b) => a.closeApproach.epochMs - b.closeApproach.epochMs);
    },
    fallback: async () => loadFallback(),
  });
}

export async function fetchNeoById(id: string): Promise<NeoObject | null> {
  const url = `${BASE}/neo/${id}?api_key=${API_KEY}`;
  return cachedFetch<NeoObject | null>({
    key: `neo:obj:${id}`,
    ttlMs: TTL_MS,
    fetcher: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`NeoWs ${res.status}`);
      const raw = (await res.json()) as RawNeo;
      return mapNeo(raw);
    },
  });
}

async function loadFallback(): Promise<NeoObject[]> {
  try {
    const res = await fetch('/MeteorWatch/fallback-data/neo-feed.json');
    if (!res.ok) return [];
    return (await res.json()) as NeoObject[];
  } catch {
    return [];
  }
}
