import { create } from 'zustand';

import { SessionSetup, GameSession, GamePhase } from '@/types/game';

type GameStore = {
  currentSession: GameSession | null;
  invalidSetup: boolean;
  initialize: (setup: SessionSetup) => void;
  setPhase: (phase: GamePhase) => void;
  setAskStartedAt: (value: number | null) => void;
  markWrongAnswer: (selectedOption: string) => void;
  markCorrectAnswer: (selectedOption: string) => void;
  advanceAfterCorrect: () => void;
  consumeLifeAfterWrong: () => void;
  prepareNextEndlessBlock: (setup: SessionSetup) => void;
  setBestScore: (score: number) => void;
  resetState: () => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  currentSession: null,
  invalidSetup: false,
  initialize: (setup) => {
    if (!setup.sequence.length || !setup.answerOptions.length) {
      set({ currentSession: null, invalidSetup: true });
      return;
    }

    set({
      invalidSetup: false,
      currentSession: {
        ...setup,
        phase: 'preview',
        score: 0,
        bestScore: 0,
        livesLeft: setup.roundConfig.lives,
        currentQuestionIndex: 0,
        currentRevealIndex: null,
        resolvedIndexes: [],
        highlightedOption: null,
        lastAnswerCorrect: null,
        streak: 0,
        blocksCleared: 0,
        askStartedAt: null,
      },
    });
  },
  setPhase: (phase) =>
    set((state) =>
      state.currentSession
        ? {
            currentSession: {
              ...state.currentSession,
              phase,
              askStartedAt: phase === 'ask' ? Date.now() : null,
            },
          }
        : state,
    ),
  setAskStartedAt: (value) =>
    set((state) =>
      state.currentSession
        ? {
            currentSession: {
              ...state.currentSession,
              askStartedAt: value,
            },
          }
        : state,
    ),
  markWrongAnswer: (selectedOption) =>
    set((state) => {
      if (!state.currentSession) {
        return state;
      }

      return {
        currentSession: {
          ...state.currentSession,
          phase: 'answer-wrong',
          highlightedOption: selectedOption,
          lastAnswerCorrect: false,
          streak: 0,
          askStartedAt: null,
        },
      };
    }),
  markCorrectAnswer: (selectedOption) =>
    set((state) => {
      if (!state.currentSession) {
        return state;
      }

      return {
        currentSession: {
          ...state.currentSession,
          phase: 'answer-correct',
          highlightedOption: selectedOption,
          lastAnswerCorrect: true,
          score:
            state.currentSession.score + 10 + Math.max(0, state.currentSession.streak * 2),
          streak: state.currentSession.streak + 1,
          askStartedAt: null,
        },
      };
    }),
  advanceAfterCorrect: () =>
    set((state) => {
      const session = state.currentSession;
      if (!session) {
        return state;
      }

      const resolvedIndexes = uniqueNumberArray([
        ...session.resolvedIndexes,
        session.currentQuestionIndex,
      ]);
      const nextQuestionIndex = session.currentQuestionIndex + 1;
      const nextRevealIndex =
        session.currentQuestionIndex + session.roundConfig.previewWindow < session.sequence.length
          ? session.currentQuestionIndex + session.roundConfig.previewWindow
          : null;
      const completed = nextQuestionIndex >= session.sequence.length;

      return {
        currentSession: {
          ...session,
          phase: completed ? 'level-complete' : 'cover',
          currentQuestionIndex: completed ? session.currentQuestionIndex : nextQuestionIndex,
          currentRevealIndex: nextRevealIndex,
          resolvedIndexes,
          highlightedOption: null,
          score: completed ? session.score + 50 : session.score,
          blocksCleared: completed ? session.blocksCleared + 1 : session.blocksCleared,
        },
      };
    }),
  consumeLifeAfterWrong: () =>
    set((state) => {
      const session = state.currentSession;
      if (!session) {
        return state;
      }

      const livesLeft = session.livesLeft - 1;

      return {
        currentSession: {
          ...session,
          phase: livesLeft <= 0 ? 'game-over' : 'ask',
          livesLeft,
          highlightedOption: null,
        },
      };
    }),
  prepareNextEndlessBlock: (setup) =>
    set((state) => {
      if (!state.currentSession) {
        return state;
      }

      return {
        currentSession: {
          ...setup,
          phase: 'preview',
          score: state.currentSession.score,
          bestScore: Math.max(state.currentSession.bestScore, state.currentSession.score),
          livesLeft: state.currentSession.livesLeft,
          currentQuestionIndex: 0,
          currentRevealIndex: null,
          resolvedIndexes: [],
          highlightedOption: null,
          lastAnswerCorrect: null,
          streak: state.currentSession.streak,
          blocksCleared: state.currentSession.blocksCleared,
          askStartedAt: null,
        },
      };
    }),
  setBestScore: (score) =>
    set((state) =>
      state.currentSession
        ? {
            currentSession: {
              ...state.currentSession,
              bestScore: Math.max(state.currentSession.bestScore, score),
            },
          }
        : state,
    ),
  resetState: () => set({ currentSession: null, invalidSetup: false }),
}));

function uniqueNumberArray(values: number[]) {
  return [...new Set(values)].sort((a, b) => a - b);
}

