import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppCard } from '@/components/common/AppCard';
import { StatTile } from '@/components/common/StatTile';
import { LEVEL_DEFINITIONS } from '@/config/levels';
import { CATEGORY_DEFINITIONS } from '@/config/categories';
import { t } from '@/localization';
import { useProgressStore } from '@/store/progressStore';
import { formatPercent } from '@/utils/format';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function ProgressScreen() {
  const theme = useAppTheme();
  const progress = useProgressStore((state) => state.progress);
  const stats = useProgressStore((state) => state.stats);

  const accuracy =
    stats.totalAnswers > 0 ? stats.correctAnswers / stats.totalAnswers : 0;
  const favoriteCategoryId =
    Object.entries(stats.categoryPlays).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'mixed';
  const favoriteCategory =
    CATEGORY_DEFINITIONS.find((item) => item.id === favoriteCategoryId) ?? CATEGORY_DEFINITIONS[0];

  return (
    <Screen
      title={t('progress.title')}
      subtitle={t('progress.subtitle')}
      withBackButton
      contentContainerStyle={styles.content}
    >
      <View style={styles.statsGrid}>
        <StatTile label={t('progress.bestScore')} value={String(progress.endlessBestScore)} />
        <StatTile label={t('progress.accuracy')} value={formatPercent(accuracy)} />
        <StatTile label={t('progress.longestStreak')} value={String(stats.bestStreak)} />
        <StatTile label={t('progress.completedLevels')} value={String(progress.completedLevels.length)} />
      </View>

      <AppCard style={styles.favoriteCard}>
        <Text style={[styles.favoriteLabel, { color: theme.colors.textSecondary }]}>
          {t('progress.favoriteCategory')}
        </Text>
        <Text style={styles.favoriteEmoji}>{favoriteCategory.icon}</Text>
        <Text style={[styles.favoriteTitle, { color: theme.colors.textPrimary }]}>
          {favoriteCategory.title}
        </Text>
      </AppCard>

      <AppCard style={styles.levelCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          {t('progress.levelTrack')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.levelRow}>
            {LEVEL_DEFINITIONS.map((level) => {
              const completed = progress.completedLevels.includes(level.id);
              const unlocked = level.id <= progress.unlockedLevel;

              return (
                <View
                  key={level.id}
                  style={[
                    styles.levelPill,
                    {
                      backgroundColor: completed
                        ? theme.colors.successSoft
                        : unlocked
                          ? theme.colors.surfaceMuted
                          : theme.colors.surface,
                      borderColor: completed
                        ? theme.colors.success
                        : theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.levelPillText,
                      {
                        color: completed
                          ? theme.colors.success
                          : theme.colors.textPrimary,
                      },
                    ]}
                  >
                    {level.id}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </AppCard>

      <AppCard style={styles.levelCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          {t('progress.recentWins')}
        </Text>
        <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
          {progress.completedLevels.length > 0
            ? progress.completedLevels.slice(-8).join(', ')
            : t('progress.noLevelsYet')}
        </Text>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  favoriteCard: {
    alignItems: 'center',
    gap: 8,
  },
  favoriteLabel: {
    fontSize: 14,
  },
  favoriteEmoji: {
    fontSize: 42,
  },
  favoriteTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  levelCard: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  levelRow: {
    flexDirection: 'row',
    gap: 10,
  },
  levelPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelPillText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
