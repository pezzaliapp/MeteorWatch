export type RiskLevel = 'low' | 'mid' | 'high';

export interface GeoCoord {
  lat: number;
  lon: number;
  alt?: number;
}

export interface TleSet {
  name: string;
  line1: string;
  line2: string;
}
