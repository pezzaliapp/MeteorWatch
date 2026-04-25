import { cachedFetch } from '@/lib/apiCache';
import type { TleSet } from '@/types';

const TTL_MS = 1000 * 60 * 60 * 6;

const ISS_FALLBACK: TleSet = {
  name: 'ISS (ZARYA)',
  line1: '1 25544U 98067A   26115.50000000  .00012345  00000-0  22678-3 0  9990',
  line2: '2 25544  51.6420 200.0000 0001234  10.0000 350.0000 15.50000000400000',
};

export async function fetchISSTle(): Promise<TleSet> {
  const url = 'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=tle';
  return cachedFetch<TleSet>({
    key: 'tle:iss',
    ttlMs: TTL_MS,
    fetcher: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`CelesTrak ${res.status}`);
      const text = await res.text();
      return parseTle(text) ?? ISS_FALLBACK;
    },
    fallback: ISS_FALLBACK,
  });
}

export async function fetchReentryGroup(): Promise<TleSet[]> {
  const url = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=last-30-days&FORMAT=tle';
  return cachedFetch<TleSet[]>({
    key: 'tle:reentry30',
    ttlMs: TTL_MS,
    fetcher: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`CelesTrak ${res.status}`);
      const text = await res.text();
      return parseTleList(text);
    },
    fallback: async () => {
      try {
        const res = await fetch('/MeteorWatch/fallback-data/reentry-tle.json');
        if (!res.ok) return [];
        return (await res.json()) as TleSet[];
      } catch {
        return [];
      }
    },
  });
}

export function parseTle(text: string): TleSet | null {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 3) return null;
  return { name: lines[0], line1: lines[1], line2: lines[2] };
}

export function parseTleList(text: string): TleSet[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const sets: TleSet[] = [];
  for (let i = 0; i + 2 < lines.length; i += 3) {
    const [name, l1, l2] = [lines[i], lines[i + 1], lines[i + 2]];
    if (l1.startsWith('1 ') && l2.startsWith('2 ')) {
      sets.push({ name, line1: l1, line2: l2 });
    }
  }
  return sets;
}
