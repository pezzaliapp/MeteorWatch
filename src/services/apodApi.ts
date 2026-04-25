import { cachedFetch } from '@/lib/apiCache';

const API_KEY = import.meta.env.VITE_NASA_API_KEY ?? 'DEMO_KEY';
const BASE = 'https://api.nasa.gov/planetary/apod';
const TTL_MS = 1000 * 60 * 60 * 6;

export interface ApodItem {
  date: string;
  title: string;
  explanation: string;
  mediaType: 'image' | 'video' | 'other';
  url: string;
  hdurl?: string;
  copyright?: string;
}

interface RawApod {
  date: string;
  title: string;
  explanation: string;
  media_type: string;
  url: string;
  hdurl?: string;
  copyright?: string;
}

function map(raw: RawApod): ApodItem {
  return {
    date: raw.date,
    title: raw.title,
    explanation: raw.explanation,
    mediaType:
      raw.media_type === 'image' ? 'image' : raw.media_type === 'video' ? 'video' : 'other',
    url: raw.url,
    hdurl: raw.hdurl,
    copyright: raw.copyright?.trim(),
  };
}

export async function fetchApodToday(): Promise<ApodItem> {
  const url = `${BASE}?api_key=${API_KEY}&thumbs=true`;
  return cachedFetch<ApodItem>({
    key: 'apod:today',
    ttlMs: TTL_MS,
    fetcher: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`APOD ${res.status}`);
      return map((await res.json()) as RawApod);
    },
  });
}

export async function fetchApodLastDays(days = 7): Promise<ApodItem[]> {
  const end = new Date();
  const start = new Date(end.getTime() - (days - 1) * 86400000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const url = `${BASE}?api_key=${API_KEY}&start_date=${fmt(start)}&end_date=${fmt(end)}&thumbs=true`;
  return cachedFetch<ApodItem[]>({
    key: `apod:last:${days}`,
    ttlMs: TTL_MS,
    fetcher: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`APOD ${res.status}`);
      const arr = (await res.json()) as RawApod[];
      return arr.map(map).reverse();
    },
    fallback: [],
  });
}
