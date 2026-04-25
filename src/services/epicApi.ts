import { cachedFetch } from '@/lib/apiCache';

/**
 * NASA EPIC — Earth Polychromatic Imaging Camera on DSCOVR.
 * Public, no API key required for the natural-color browse listing.
 * https://epic.gsfc.nasa.gov/about/api
 */
const TTL_MS = 1000 * 60 * 60 * 2;

export interface EpicImage {
  identifier: string;
  caption: string;
  imageName: string;
  date: string; // YYYY-MM-DD HH:MM:SS
  centroidLat: number;
  centroidLon: number;
  pngUrl: string;
  thumbUrl: string;
}

interface RawEpic {
  identifier: string;
  caption: string;
  image: string;
  date: string;
  centroid_coordinates: { lat: number; lon: number };
}

function buildUrl(date: string, image: string, type: 'png' | 'thumbs'): string {
  const [y, m, d] = date.split(' ')[0].split('-');
  return `https://epic.gsfc.nasa.gov/archive/natural/${y}/${m}/${d}/${type}/${image}.${
    type === 'png' ? 'png' : 'jpg'
  }`;
}

function map(raw: RawEpic): EpicImage {
  return {
    identifier: raw.identifier,
    caption: raw.caption,
    imageName: raw.image,
    date: raw.date,
    centroidLat: raw.centroid_coordinates.lat,
    centroidLon: raw.centroid_coordinates.lon,
    pngUrl: buildUrl(raw.date, raw.image, 'png'),
    thumbUrl: buildUrl(raw.date, raw.image, 'thumbs'),
  };
}

export async function fetchEpicLatest(): Promise<EpicImage[]> {
  return cachedFetch<EpicImage[]>({
    key: 'epic:natural:latest',
    ttlMs: TTL_MS,
    fetcher: async () => {
      const res = await fetch('https://epic.gsfc.nasa.gov/api/natural');
      if (!res.ok) throw new Error(`EPIC ${res.status}`);
      const raw = (await res.json()) as RawEpic[];
      return raw.map(map).reverse();
    },
    fallback: [],
  });
}
