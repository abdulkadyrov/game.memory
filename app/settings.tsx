import { Alert, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppCard } from '@/components/common/AppCard';
import { ToggleRow } from '@/components/common/ToggleRow';
import { AppButton } from '@/components/common/AppButton';
import { t } from '@/localization';
import { useSettingsStore } from '@/store/settingsStore';
import { useProgressStore } from '@/store/progressStore';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function SettingsScreen() {
  const theme = useAppTheme();
  const settings = useSettingsStore();
  const resetProgress = useProgressStore((state) => state.resetProgress);

  return (
    <Screen
      title={t('settings.title')}
      subtitle={t('settings.subtitle')}
      withBackButton
      contentContainerStyle={styles.content}
    >
      <AppCard style={styles.card}>
        <ToggleRow
          label={t('settings.music')}
          description={t('settings.musicDescription')}
          value={settings.musicEnabled}
          onValueChange={settings.setMusicEnabled}
        />
        <ToggleRow
          label={t('settings.sound')}
          description={t('settings.soundDescription')}
          value={settings.soundEnabled}
          onValueChange={settings.setSoundEnabled}
        />
        <ToggleRow
          label={t('settings.haptics')}
          description={t('settings.hapticsDescription')}
          value={settings.hapticsEnabled}
          onValueChange={settings.setHapticsEnabled}
        />
        <ToggleRow
          label={t('settings.darkTheme')}
          description={t('settings.darkThemeDescription')}
          value={settings.preferDarkTheme}
          onValueChange={settings.setPreferDarkTheme}
        />
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          {t('settings.audioRoadmap')}
        </Text>
        <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
          {t('settings.audioRoadmapText')}
        </Text>
      </AppCard>

      <View style={styles.dangerZone}>
        <AppButton
          label={t('settings.resetProgress')}
          variant="ghost"
          onPress={() =>
            Alert.alert(t('settings.resetProgress'), t('settings.resetConfirm'), [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('common.reset'),
                style: 'destructive',
                onPress: () => {
                  resetProgress();
                },
              },
            ])
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  card: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 21,
  },
  dangerZone: {
    paddingTop: 4,
  },
});
