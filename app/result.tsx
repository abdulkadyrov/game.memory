import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { t } from '@/localization';
import { CategoryId, GameMode } from '@/types/game';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function ResultScreen() {
  const params = useLocalSearchParams<{
    mode: GameMode;
    outcome: 'game-over' | 'level-complete';
    score: string;
    bestScore: string;
    levelId?: string;
    blocksCleared?: string;
    categoryId?: CategoryId;
  }>();
  const theme = useAppTheme();

  const score = Number(params.score ?? 0);
  const bestScore = Number(params.bestScore ?? 0);
  const levelId = Number(params.levelId ?? 0);
  const blocksCleared = Number(params.blocksCleared ?? 0);

  return (
    <Screen
      title={params.outcome === 'level-complete' ? t('result.levelComplete') : t('result.gameOver')}
      subtitle={
        params.mode === 'levels'
          ? t('result.levelSubtitle', { level: levelId })
          : t('result.endlessSubtitle', { blocks: blocksCleared })
      }
      contentContainerStyle={styles.content}
    >
      <AppCard style={styles.card}>
        <Text style={[styles.scoreTitle, { color: theme.colors.textSecondary }]}>
          {t('result.score')}
        </Text>
        <Text style={[styles.scoreValue, { color: theme.colors.textPrimary }]}>{score}</Text>

        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
              {t('result.bestScore')}
            </Text>
            <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>
              {bestScore}
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
              {t('result.mode')}
            </Text>
            <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>
              {params.mode === 'levels' ? t('modes.levelsTitle') : t('modes.endlessTitle')}
            </Text>
          </View>
        </View>
      </AppCard>

      <View style={styles.actions}>
        <AppButton
          label={t('result.playAgain')}
          onPress={() =>
            router.replace({
              pathname: '/game',
              params: {
                mode: params.mode,
                categoryId: params.categoryId ?? 'mixed',
                levelId: params.levelId,
              },
            })
          }
        />
        <AppButton label={t('common.home')} variant="secondary" onPress={() => router.replace('/')} />
        <AppButton label={t('home.progress')} variant="ghost" onPress={() => router.push('/progress')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    justifyContent: 'center',
    flexGrow: 1,
  },
  card: {
    gap: 18,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metric: {
    flex: 1,
    gap: 6,
  },
  metricLabel: {
    fontSize: 14,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  actions: {
    gap: 12,
  },
});
