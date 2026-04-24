import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AnswerGrid } from '@/components/game/AnswerGrid';
import { GameTopBar } from '@/components/game/GameTopBar';
import { MemoryLane } from '@/components/game/MemoryLane';
import { PhaseBanner } from '@/components/game/PhaseBanner';
import { buildGameSetup } from '@/features/game/session';
import { useGameFlow } from '@/features/game/useGameFlow';
import { t } from '@/localization';
import { useGameStore } from '@/store/gameStore';
import { useProgressStore } from '@/store/progressStore';
import { CategoryId, GameMode } from '@/types/game';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function GameScreen() {
  const params = useLocalSearchParams<{
    mode?: GameMode;
    categoryId?: CategoryId;
    levelId?: string;
  }>();
  const theme = useAppTheme();
  const initialize = useGameStore((state) => state.initialize);
  const resetState = useGameStore((state) => state.resetState);
  const currentSession = useGameStore((state) => state.currentSession);
  const flow = useGameFlow();
  const unlockedLevel = useProgressStore((state) => state.progress.unlockedLevel);

  const initialSetup = useMemo(() => {
    const mode = params.mode ?? 'levels';
    const categoryId = (params.categoryId ?? 'mixed') as CategoryId;
    const requestedLevelId = Number(params.levelId ?? 1);
    const safeLevelId = mode === 'levels' ? Math.min(Math.max(requestedLevelId, 1), unlockedLevel) : undefined;

    return buildGameSetup({
      mode,
      categoryId,
      levelId: safeLevelId,
      recentHashes: useProgressStore.getState().progress.recentSequenceHashes,
    });
  }, [params.categoryId, params.levelId, params.mode, unlockedLevel]);

  useEffect(() => {
    initialize(initialSetup);

    return () => {
      resetState();
    };
  }, [initialSetup, initialize, resetState]);

  useEffect(() => {
    if (!flow.invalidSetup) {
      return;
    }

    Alert.alert(t('game.invalidSetupTitle'), t('game.invalidSetupText'), [
      {
        text: t('common.ok'),
        onPress: () => router.replace('/'),
      },
    ]);
  }, [flow.invalidSetup]);

  useEffect(() => {
    if (!flow.resultPayload) {
      return;
    }

    router.replace({
      pathname: '/result',
      params: {
        mode: flow.resultPayload.mode,
        outcome: flow.resultPayload.outcome,
        score: String(flow.resultPayload.score),
        bestScore: String(flow.resultPayload.bestScore),
        levelId: flow.resultPayload.levelId ? String(flow.resultPayload.levelId) : undefined,
        blocksCleared: String(flow.resultPayload.blocksCleared),
        categoryId: flow.resultPayload.categoryId,
      },
    });
  }, [flow.resultPayload]);

  if (!currentSession) {
    return null;
  }

  return (
    <Screen withBottomInset={false} contentContainerStyle={styles.content}>
      <GameTopBar />

      <AppCard style={styles.promptCard}>
        <PhaseBanner />
        <Text style={[styles.promptTitle, { color: theme.colors.textPrimary }]}>
          {flow.promptTitle}
        </Text>
        <Text style={[styles.promptBody, { color: theme.colors.textSecondary }]}>
          {flow.promptBody}
        </Text>
      </AppCard>

      <MemoryLane />

      <View style={styles.centerInfo}>
        {flow.showTimer && (
          <Text style={[styles.timer, { color: theme.colors.accentStrong }]}>
            {t('game.timeLeft', { seconds: flow.remainingSeconds })}
          </Text>
        )}
      </View>

      <AnswerGrid onSelectOption={flow.submitAnswer} />

      <View style={styles.footer}>
        <AppButton label={t('common.home')} variant="ghost" onPress={() => router.replace('/')} />
        {currentSession.mode === 'levels' && (
          <AppButton
            label={t('game.restartLevel')}
            variant="secondary"
            onPress={() =>
              initialize(
                buildGameSetup({
                  mode: 'levels',
                  categoryId: currentSession.categoryId,
                  levelId: currentSession.levelId,
                  recentHashes: useProgressStore.getState().progress.recentSequenceHashes,
                }),
              )
            }
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 24,
  },
  promptCard: {
    gap: 10,
  },
  promptTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  promptBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  centerInfo: {
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
});
