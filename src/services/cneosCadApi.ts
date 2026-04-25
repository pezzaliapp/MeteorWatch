import { cachedFetch } from '@/lib/apiCache';

const BASE = 'https://ssd-api.jpl.nasa.gov/cad.api';
const TTL_MS = 1000 * 60 * 60 * 12;

export interface CADApproach {
  designation: string;
  date: string;
  epochMs: number;
  distanceAu: number;
  velocityKms: number;
  body: string;
  hMag?: number;
}

interface RawResponse {
  fields: string[];
  data: string[][];
}

interface FetchOpts {
  designation?: string;
  dateMin?: string;
  dateMax?: string;
  body?: string;
  distMaxAu?: number;
  limit?: number;
}

export async function fetchCAD(opts: FetchOpts = {}): Promise<CADApproach[]> {
  const params = new URLSearchParams();
  if (opts.designation) params.set('des', opts.designation);
  if (opts.dateMin) params.set('date-min', opts.dateMin);
  if (opts.dateMax) params.set('date-max', opts.dateMax);
  if (opts.body) params.set('body', opts.body);
  if (opts.distMaxAu) params.set('dist-max', String(opts.distMaxAu));
  params.set('limit', String(opts.limit ?? 50));
  const url = `${BASE}?${params.toString()}`;
  return cachedFetch<CADApproach[]>({
    key: `cad:${url}`,
    ttlMs: TTL_MS,
    fetcher: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`CAD ${res.status}`);
      const raw = (await res.json()) as RawResponse;
      const idx = (n: string) => raw.fields.indexOf(n);
      const iDes = idx('des');
      const iDate = idx('cd');
      const iDist = idx('dist');
      const iVel = idx('v_rel');
      const iBody = idx('body');
      const iH = idx('h');
      return raw.data.map<CADApproach>((row) => ({
        designation: row[iDes],
        date: row[iDate],
        epochMs: new Date(row[iDate]).getTime(),
        distanceAu: parseFloat(row[iDist]),
        velocityKms: parseFloat(row[iVel]),
        body: row[iBody],
        hMag: row[iH] ? parseFloat(row[iH]) : undefined,
      }));
    },
    fallback: [],
  });
}
