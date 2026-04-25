import { create } from 'zustand';
import type { NeoObject } from '@/services/nasaNeoApi';
import type { FireballEvent } from '@/services/cneosFireballApi';
import type { ISSPosition } from '@/services/issApi';

interface EventsState {
  neos: NeoObject[];
  fireballs: FireballEvent[];
  issPosition: ISSPosition | null;
  lastUpdated: Record<string, number>;
  setNeos: (n: NeoObject[]) => void;
  setFireballs: (f: FireballEvent[]) => void;
  setISSPosition: (p: ISSPosition) => void;
  markUpdated: (key: string) => void;
}

export const useEventsStore = create<EventsState>((set) => ({
  neos: [],
  fireballs: [],
  issPosition: null,
  lastUpdated: {},
  setNeos: (neos) => set({ neos }),
  setFireballs: (fireballs) => set({ fireballs }),
  setISSPosition: (issPosition) => set({ issPosition }),
  markUpdated: (key) =>
    set((state) => ({ lastUpdated: { ...state.lastUpdated, [key]: Date.now() } })),
}));
