import { StyleSheet, Text, View } from 'react-native';

import { t } from '@/localization';
import { useGameStore } from '@/store/gameStore';
import { useAppTheme } from '@/theme/AppThemeProvider';

export function PhaseBanner() {
  const theme = useAppTheme();
  const phase = useGameStore((state) => state.currentSession?.phase);

  const label =
    phase === 'preview'
      ? t('game.previewBadge')
      : phase === 'cover'
        ? t('game.coveredBadge')
        : phase === 'ask'
          ? t('game.answerBadge')
          : phase === 'answer-correct' || phase === 'level-complete'
            ? t('game.solvedBadge')
            : t('game.answerBadge');

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.colors.surfaceMuted,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color: theme.colors.accentStrong }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
