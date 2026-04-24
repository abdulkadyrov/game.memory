import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { t } from '@/localization';
import { useProgressStore } from '@/store/progressStore';
import { useSettingsStore } from '@/store/settingsStore';
import { formatPercent } from '@/utils/format';

export default function HomeScreen() {
  const theme = useAppTheme();
  const progress = useProgressStore((state) => state.progress);
  const stats = useProgressStore((state) => state.stats);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const tips = t('home.tips') as string[];

  const accuracy =
    stats.totalAnswers > 0 ? stats.correctAnswers / stats.totalAnswers : 0;

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={[styles.kicker, { color: theme.colors.accentStrong }]}>
          {t('home.tagline')}
        </Text>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {t('home.title')}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {t('home.subtitle')}
        </Text>
      </View>

      <AppCard style={styles.summaryCard}>
        <Text style={[styles.summaryTitle, { color: theme.colors.textPrimary }]}>
          {t('home.quickStats')}
        </Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>
              {progress.unlockedLevel}
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              {t('progress.unlockedLevels')}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>
              {progress.endlessBestScore}
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              {t('progress.bestScore')}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>
              {formatPercent(accuracy)}
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              {t('progress.accuracy')}
            </Text>
          </View>
        </View>
      </AppCard>

      <View style={styles.actions}>
        <AppButton
          label={t('home.play')}
          onPress={() => router.push('/modes')}
          size="lg"
        />
        <AppButton
          label={t('home.modes')}
          onPress={() => router.push('/modes')}
          variant="secondary"
        />
        <AppButton
          label={t('home.categories')}
          onPress={() => router.push('/categories')}
          variant="secondary"
        />
        <AppButton
          label={t('home.progress')}
          onPress={() => router.push('/progress')}
          variant="ghost"
        />
        <AppButton
          label={`${t('home.settings')} · ${soundEnabled ? t('common.on') : t('common.off')}`}
          onPress={() => router.push('/settings')}
          variant="ghost"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tipScroller}
      >
        {tips.map((tip) => (
          <AppCard key={tip} style={styles.tipCard}>
            <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
              {tip}
            </Text>
          </AppCard>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
  hero: {
    gap: 10,
    paddingTop: 8,
  },
  kicker: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  summaryCard: {
    gap: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    gap: 6,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  summaryLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    gap: 12,
  },
  tipScroller: {
    gap: 12,
    paddingRight: 8,
  },
  tipCard: {
    width: 220,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
