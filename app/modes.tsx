import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { t } from '@/localization';

const MODES = [
  {
    id: 'levels',
    title: t('modes.levelsTitle'),
    description: t('modes.levelsDescription'),
  },
  {
    id: 'endless',
    title: t('modes.endlessTitle'),
    description: t('modes.endlessDescription'),
  },
] as const;

export default function ModesScreen() {
  const theme = useAppTheme();

  return (
    <Screen
      title={t('modes.title')}
      subtitle={t('modes.subtitle')}
      withBackButton
      contentContainerStyle={styles.content}
    >
      {MODES.map((mode) => (
        <AppCard key={mode.id} style={styles.card}>
          <View style={styles.textBlock}>
            <Text style={[styles.modeTitle, { color: theme.colors.textPrimary }]}>
              {mode.title}
            </Text>
            <Text style={[styles.modeDescription, { color: theme.colors.textSecondary }]}>
              {mode.description}
            </Text>
          </View>
          <AppButton
            label={t('common.choose')}
            onPress={() => router.push({ pathname: '/categories', params: { mode: mode.id } })}
          />
        </AppCard>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  card: {
    gap: 18,
  },
  textBlock: {
    gap: 8,
  },
  modeTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  modeDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
});
