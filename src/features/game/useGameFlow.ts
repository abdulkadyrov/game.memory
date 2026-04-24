import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';

import { APP_CONFIG } from '@/config/appConfig';
import { buildGameSetup } from '@/features/game/session';
import { t } from '@/localization';
import { audioService } from '@/services/audio/AudioService';
import { hapticsService } from '@/services/haptics';
import { useGameStore } from '@/store/gameStore';
import { useProgressStore } from '@/store/progressStore';
import { ResultPayload } from '@/types/game';

function clearTimer(timerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>) {
  if (timerRef.current) {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }
}

export function useGameFlow() {
  const session = useGameStore((state) => state.currentSession);
  const invalidSetup = useGameStore((state) => state.invalidSetup);
  const setPhase = useGameStore((state) => state.setPhase);
  const markWrongAnswer = useGameStore((state) => state.markWrongAnswer);
  const markCorrectAnswer = useGameStore((state) => state.markCorrectAnswer);
  const advanceAfterCorrect = useGameStore((state) => state.advanceAfterCorrect);
  const consumeLifeAfterWrong = useGameStore((state) => state.consumeLifeAfterWrong);
  const prepareNextEndlessBlock = useGameStore((state) => state.prepareNextEndlessBlock);
  const registerAnswer = useProgressStore((state) => state.registerAnswer);
  const registerEndlessScore = useProgressStore((state) => state.registerEndlessScore);
  const completeLevel = useProgressStore((state) => state.completeLevel);
  const rememberSequence = useProgressStore((state) => state.rememberSequence);
  const registerRun = useProgressStore((state) => state.registerRun);

  const phaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutTriggeredRef = useRef(false);
  const rememberedSeedRef = useRef<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const [resultPayload, setResultPayload] = useState<ResultPayload | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }

    if (rememberedSeedRef.current !== session.seed) {
      rememberSequence(session.sequenceHash);
      rememberedSeedRef.current = session.seed;
    }

    if (session.blocksCleared === 0 && session.currentQuestionIndex === 0 && session.phase === 'preview') {
      registerRun(session.categoryId);
    }
  }, [
    registerRun,
    rememberSequence,
    session?.blocksCleared,
    session?.categoryId,
    session?.currentQuestionIndex,
    session?.phase,
    session?.seed,
    session?.sequenceHash,
  ]);

  useEffect(() => {
    if (session?.phase === 'ask') {
      timeoutTriggeredRef.current = false;
    }
  }, [session?.phase, session?.currentQuestionIndex]);

  useEffect(() => {
    clearTimer(phaseTimer);

    if (!session) {
      return;
    }

    if (session.phase === 'preview') {
      phaseTimer.current = setTimeout(() => {
        setPhase('cover');
      }, session.roundConfig.previewDurationMs);
    }

    if (session.phase === 'cover') {
      phaseTimer.current = setTimeout(() => {
        setPhase('ask');
      }, session.currentRevealIndex !== null ? session.roundConfig.newItemRevealMs : APP_CONFIG.coverDelayMs);
    }

    if (session.phase === 'answer-correct') {
      phaseTimer.current = setTimeout(() => {
        advanceAfterCorrect();
      }, APP_CONFIG.answerFeedbackMs);
    }

    if (session.phase === 'answer-wrong') {
      phaseTimer.current = setTimeout(() => {
        consumeLifeAfterWrong();
      }, APP_CONFIG.wrongAnswerFeedbackMs);
    }

    if (session.phase === 'level-complete') {
      if (session.mode === 'levels') {
        completeLevel(session.levelId ?? 1);
        phaseTimer.current = setTimeout(() => {
          setResultPayload({
            mode: session.mode,
            outcome: 'level-complete',
            score: session.score,
            bestScore: Math.max(
              useProgressStore.getState().progress.endlessBestScore,
              session.bestScore,
            ),
            levelId: session.levelId,
            blocksCleared: session.blocksCleared,
            categoryId: session.categoryId,
          });
        }, APP_CONFIG.postBlockDelayMs);
      } else {
        phaseTimer.current = setTimeout(() => {
          const nextSetup = buildGameSetup({
            mode: 'endless',
            categoryId: session.categoryId,
            recentHashes: useProgressStore.getState().progress.recentSequenceHashes,
            endlessBlockIndex: session.blocksCleared,
          });
          prepareNextEndlessBlock(nextSetup);
        }, APP_CONFIG.postBlockDelayMs);
      }
    }

    if (session.phase === 'game-over') {
      registerEndlessScore(session.score);
      phaseTimer.current = setTimeout(() => {
        setResultPayload({
          mode: session.mode,
          outcome: 'game-over',
          score: session.score,
          bestScore: Math.max(
            useProgressStore.getState().progress.endlessBestScore,
            session.score,
          ),
          levelId: session.levelId,
          blocksCleared: session.blocksCleared,
          categoryId: session.categoryId,
        });
      }, 500);
    }

    return () => {
      clearTimer(phaseTimer);
    };
  }, [
    advanceAfterCorrect,
    completeLevel,
    consumeLifeAfterWrong,
    prepareNextEndlessBlock,
    registerEndlessScore,
    session,
    setPhase,
  ]);

  useEffect(() => {
    if (!session || session.phase !== 'ask' || !session.roundConfig.answerTimeLimitMs) {
      setRemainingMs(0);
      return;
    }

    const startedAt = session.askStartedAt ?? Date.now();
    const update = () => {
      const left = Math.max(
        0,
        session.roundConfig.answerTimeLimitMs! - (Date.now() - startedAt),
      );
      setRemainingMs(left);
      if (left <= 0 && !timeoutTriggeredRef.current) {
        timeoutTriggeredRef.current = true;
        void submitAnswer('__timeout__');
      }
    };

    update();
    const interval = setInterval(update, APP_CONFIG.timerTickMs);

    return () => clearInterval(interval);
  }, [session?.askStartedAt, session?.phase, session?.roundConfig.answerTimeLimitMs]);

  async function submitAnswer(selectedOption: string) {
    if (!session || session.phase !== 'ask') {
      return;
    }

    const correctAnswer = session.sequence[session.currentQuestionIndex];
    const isCorrect = selectedOption === correctAnswer;

    await audioService.playTap();
    await hapticsService.light();

    if (isCorrect) {
      markCorrectAnswer(selectedOption);
      registerAnswer(true, session.streak + 1);
      await audioService.playCorrect();
      await hapticsService.success();
      return;
    }

    markWrongAnswer(selectedOption);
    registerAnswer(false, 0);
    await audioService.playWrong();
    await hapticsService.error();
  }

  const prompt = useMemo(() => {
    if (!session) {
      return {
        promptTitle: '',
        promptBody: '',
      };
    }

    switch (session.phase) {
      case 'preview':
        return { promptTitle: t('game.previewTitle'), promptBody: t('game.previewText') };
      case 'cover':
        return { promptTitle: t('game.coverTitle'), promptBody: t('game.coverText') };
      case 'ask':
        return {
          promptTitle: t('game.question', { index: session.currentQuestionIndex + 1 }),
          promptBody: t('game.askText'),
        };
      case 'answer-correct':
        return { promptTitle: t('game.correctTitle'), promptBody: t('game.correctText') };
      case 'answer-wrong':
        return { promptTitle: t('game.wrongTitle'), promptBody: t('game.wrongText') };
      case 'level-complete':
        return { promptTitle: t('game.completeTitle'), promptBody: t('game.completeText') };
      case 'game-over':
        return { promptTitle: t('result.gameOver'), promptBody: t('game.wrongText') };
      default:
        return { promptTitle: t('game.previewTitle'), promptBody: t('game.previewText') };
    }
  }, [session]);

  return {
    invalidSetup,
    submitAnswer,
    resultPayload,
    setResultPayload,
    promptTitle: prompt.promptTitle,
    promptBody: prompt.promptBody,
    remainingSeconds: Math.ceil(remainingMs / 1000),
    showTimer: Boolean(session?.phase === 'ask' && session?.roundConfig.answerTimeLimitMs),
  };
}
