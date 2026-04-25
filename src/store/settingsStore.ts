import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'it' | 'en';

interface SettingsState {
  language: Language;
  disclaimerAcknowledged: boolean;
  notificationsEnabled: boolean;
  neoAlertThresholdLD: number;
  setLanguage: (lang: Language) => void;
  acknowledgeDisclaimer: () => void;
  setNotificationsEnabled: (v: boolean) => void;
  setNeoAlertThresholdLD: (v: number) => void;
}

function detectLanguage(): Language {
  if (typeof navigator === 'undefined') return 'it';
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'it';
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: detectLanguage(),
      disclaimerAcknowledged: false,
      notificationsEnabled: false,
      neoAlertThresholdLD: 10,
      setLanguage: (language) => set({ language }),
      acknowledgeDisclaimer: () => set({ disclaimerAcknowledged: true }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setNeoAlertThresholdLD: (neoAlertThresholdLD) => set({ neoAlertThresholdLD }),
    }),
    {
      name: 'meteorwatch:settings',
      version: 1,
    },
  ),
);
