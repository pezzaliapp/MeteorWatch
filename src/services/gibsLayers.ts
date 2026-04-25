/**
 * NASA GIBS WMTS tile templates (REST endpoint, no key required).
 * Documented at https://nasa-gibs.github.io/gibs-api-docs/
 */
export interface GibsLayer {
  id: string;
  name: { it: string; en: string };
  url: string;
  attribution: string;
  maxZoom: number;
  /** YYYY-MM-DD or 'TIME' placeholder. We rebuild per-day. */
  defaultDate?: string;
  matrixSet: string;
  format: 'jpg' | 'png';
}

const TIME = '{date}';

export const GIBS_LAYERS: GibsLayer[] = [
  {
    id: 'modis_terra_truecolor',
    name: { it: 'MODIS Terra (vero colore)', en: 'MODIS Terra (true color)' },
    url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${TIME}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
    attribution:
      '<a href="https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs">NASA GIBS</a>',
    maxZoom: 9,
    matrixSet: 'GoogleMapsCompatible_Level9',
    format: 'jpg',
  },
  {
    id: 'viirs_snpp_truecolor',
    name: { it: 'VIIRS Suomi NPP (vero colore)', en: 'VIIRS Suomi NPP (true color)' },
    url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${TIME}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
    attribution:
      '<a href="https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs">NASA GIBS</a>',
    maxZoom: 9,
    matrixSet: 'GoogleMapsCompatible_Level9',
    format: 'jpg',
  },
  {
    id: 'viirs_night_lights',
    name: { it: 'VIIRS Black Marble (luci notturne 2016)', en: 'VIIRS Black Marble (2016 night lights)' },
    url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png`,
    attribution: 'NASA GIBS · Black Marble',
    maxZoom: 8,
    matrixSet: 'GoogleMapsCompatible_Level8',
    format: 'png',
  },
];

export function gibsTileUrl(layer: GibsLayer, date = new Date()): string {
  if (!layer.url.includes('{date}')) return layer.url;
  // GIBS daily imagery is published with a 1-day delay typically — be safe and use yesterday UTC.
  const d = new Date(date.getTime() - 86400000);
  const isoDate = d.toISOString().slice(0, 10);
  return layer.url.replace('{date}', isoDate);
}
