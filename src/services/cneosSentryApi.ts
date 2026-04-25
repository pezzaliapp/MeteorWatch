import { cachedFetch } from '@/lib/apiCache';

const BASE = 'https://ssd-api.jpl.nasa.gov/sentry.api';
const TTL_MS = 1000 * 60 * 60 * 12;

export interface SentryObject {
  designation: string;
  fullname: string;
  ipMax: number;
  palermo: number;
  torino: number;
  diameterKm?: number;
  velocityKms?: number;
  yearRangeStart?: number;
  yearRangeEnd?: number;
  nObs?: number;
  url: string;
}

interface RawSentry {
  des: string;
  fullname: string;
  ip: string;
  ps_max?: string;
  ts_max?: string;
  diameter?: string;
  v_inf?: string;
  range?: string;
  n_imp?: string;
}

interface RawResponse {
  data: RawSentry[];
}

function parseRange(range?: string): [number?, number?] {
  if (!range) return [undefined, undefined];
  const m = range.match(/(\d{4})\D+(\d{4})/);
  if (!m) return [undefined, undefined];
  return [parseInt(m[1], 10), parseInt(m[2], 10)];
}

export async function fetchSentryTop(limit = 20): Promise<SentryObject[]> {
  const url = `${BASE}?limit=${limit}`;
  return cachedFetch<SentryObject[]>({
    key: `sentry:limit:${limit}`,
    ttlMs: TTL_MS,
    fetcher: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Sentry ${res.status}`);
      const raw = (await res.json()) as RawResponse;
      return raw.data
        .map<SentryObject>((s) => {
          const [start, end] = parseRange(s.range);
          return {
            designation: s.des,
            fullname: s.fullname,
            ipMax: parseFloat(s.ip),
            palermo: parseFloat(s.ps_max ?? 'NaN'),
            torino: parseFloat(s.ts_max ?? '0'),
            diameterKm: s.diameter ? parseFloat(s.diameter) : undefined,
            velocityKms: s.v_inf ? parseFloat(s.v_inf) : undefined,
            yearRangeStart: start,
            yearRangeEnd: end,
            nObs: s.n_imp ? parseInt(s.n_imp, 10) : undefined,
            url: `https://cneos.jpl.nasa.gov/sentry/details.html#?des=${encodeURIComponent(s.des)}`,
          };
        })
        .sort((a, b) => (b.palermo || -99) - (a.palermo || -99));
    },
    fallback: [],
  });
}
