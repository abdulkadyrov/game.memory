import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { CATEGORY_DEFINITIONS } from '@/config/categories';
import { t } from '@/localization';
import { useGameStore } from '@/store/gameStore';
import { useAppTheme } from '@/theme/AppThemeProvider';

export function GameTopBar() {
  const theme = useAppTheme();
  const session = useGameStore((state) => state.currentSession);

  if (!session) {
    return null;
  }

  const category = CATEGORY_DEFINITIONS.find((item) => item.id === session.categoryId);

  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            {t('game.lives')}
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>
            {'❤️'.repeat(session.livesLeft)}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            {t('game.score')}
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>
            {session.score}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            {session.mode === 'levels' ? t('game.level') : t('game.block')}
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>
            {session.mode === 'levels'
              ? session.levelId
              : t('game.endlessBlockLabel', { block: session.blocksCleared + 1 })}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            {t('game.streak')}
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>
            {session.streak}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            {category?.title ?? ''}
          </Text>
          <Text style={styles.categoryValue}>{category?.icon ?? '✨'}</Text>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  metric: {
    flex: 1,
    gap: 6,
  },
  metricLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  categoryValue: {
    fontSize: 24,
  },
});
