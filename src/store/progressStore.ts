import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { APP_CONFIG } from '@/config/appConfig';
import { STORAGE_KEYS } from '@/constants/storage';
import { CategoryId, ProgressState, StatsState } from '@/types/game';

const initialProgress: ProgressState = {
  unlockedLevel: 1,
  completedLevels: [],
  endlessBestScore: 0,
  recentSequenceHashes: [],
};

const initialStats: StatsState = {
  totalAnswers: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  bestStreak: 0,
  totalRuns: 0,
  categoryPlays: {},
};

type ProgressStore = {
  progress: ProgressState;
  stats: StatsState;
  completeLevel: (levelId: number) => void;
  registerEndlessScore: (score: number) => void;
  registerAnswer: (correct: boolean, streak: number) => void;
  registerRun: (categoryId: CategoryId) => void;
  rememberSequence: (hash: string) => void;
  resetProgress: () => void;
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      progress: initialProgress,
      stats: initialStats,
      completeLevel: (levelId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            unlockedLevel: Math.max(state.progress.unlockedLevel, levelId + 1),
            completedLevels: [...new Set([...state.progress.completedLevels, levelId])].sort(
              (a, b) => a - b,
            ),
          },
        })),
      registerEndlessScore: (score) =>
        set((state) => ({
          progress: {
            ...state.progress,
            endlessBestScore: Math.max(state.progress.endlessBestScore, score),
          },
        })),
      registerAnswer: (correct, streak) =>
        set((state) => ({
          stats: {
            ...state.stats,
            totalAnswers: state.stats.totalAnswers + 1,
            correctAnswers: state.stats.correctAnswers + (correct ? 1 : 0),
            wrongAnswers: state.stats.wrongAnswers + (correct ? 0 : 1),
            bestStreak: Math.max(state.stats.bestStreak, streak),
          },
        })),
      registerRun: (categoryId) =>
        set((state) => ({
          stats: {
            ...state.stats,
            totalRuns: state.stats.totalRuns + 1,
            categoryPlays: {
              ...state.stats.categoryPlays,
              [categoryId]: (state.stats.categoryPlays[categoryId] ?? 0) + 1,
            },
          },
        })),
      rememberSequence: (hash) =>
        set((state) => ({
          progress: {
            ...state.progress,
            recentSequenceHashes: [hash, ...state.progress.recentSequenceHashes]
              .filter((item, index, source) => source.indexOf(item) === index)
              .slice(0, APP_CONFIG.recentSequenceCacheSize),
          },
        })),
      resetProgress: () =>
        set({
          progress: initialProgress,
          stats: initialStats,
        }),
    }),
    {
      name: STORAGE_KEYS.progress,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

