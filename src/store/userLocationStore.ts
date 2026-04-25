import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserLocation {
  lat: number;
  lon: number;
  alt: number;
  source: 'browser' | 'fallback' | 'manual';
  label?: string;
}

interface State {
  location: UserLocation | null;
  setLocation: (loc: UserLocation) => void;
  clearLocation: () => void;
}

export const useUserLocationStore = create<State>()(
  persist(
    (set) => ({
      location: null,
      setLocation: (location) => set({ location }),
      clearLocation: () => set({ location: null }),
    }),
    { name: 'meteorwatch:userLocation', version: 1 },
  ),
);

export const FALLBACK_LOCATION: UserLocation = {
  lat: 41.9028,
  lon: 12.4964,
  alt: 0.05,
  source: 'fallback',
  label: 'Roma, IT',
};
