import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/storage';

type SettingsState = {
  musicEnabled: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  preferDarkTheme: boolean;
  musicVolume: number;
  soundVolume: number;
  setMusicEnabled: (value: boolean) => void;
  setSoundEnabled: (value: boolean) => void;
  setHapticsEnabled: (value: boolean) => void;
  setPreferDarkTheme: (value: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      musicEnabled: true,
      soundEnabled: true,
      hapticsEnabled: true,
      preferDarkTheme: false,
      musicVolume: 0.45,
      soundVolume: 0.8,
      setMusicEnabled: (musicEnabled) => set({ musicEnabled }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setPreferDarkTheme: (preferDarkTheme) => set({ preferDarkTheme }),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        musicEnabled: state.musicEnabled,
        soundEnabled: state.soundEnabled,
        hapticsEnabled: state.hapticsEnabled,
        preferDarkTheme: state.preferDarkTheme,
        musicVolume: state.musicVolume,
        soundVolume: state.soundVolume,
      }),
    },
  ),
);

