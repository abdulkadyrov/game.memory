import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { CATEGORY_DEFINITIONS, getCategoryPool } from '@/config/categories';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { t } from '@/localization';
import { GameMode } from '@/types/game';

export default function CategoriesScreen() {
  const params = useLocalSearchParams<{ mode?: GameMode }>();
  const theme = useAppTheme();
  const mode = params.mode ?? 'levels';

  return (
    <Screen
      title={t('categories.title')}
      subtitle={t('categories.subtitle')}
      withBackButton
      contentContainerStyle={styles.content}
    >
      <AppCard style={styles.modeBanner}>
        <Text style={[styles.modeBannerTitle, { color: theme.colors.textPrimary }]}>
          {mode === 'levels' ? t('modes.levelsTitle') : t('modes.endlessTitle')}
        </Text>
        <Text style={[styles.modeBannerText, { color: theme.colors.textSecondary }]}>
          {t('categories.modeHint')}
        </Text>
      </AppCard>

      <FlatList
        data={CATEGORY_DEFINITIONS}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <AppCard style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryEmoji}>{item.icon}</Text>
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryTitle, { color: theme.colors.textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.categoryDescription, { color: theme.colors.textSecondary }]}>
                  {item.description}
                </Text>
              </View>
            </View>
            <Text style={[styles.preview, { color: theme.colors.textTertiary }]}>
              {getCategoryPool(item.id)
                .slice(0, 8)
                .map((entry) => entry.value)
                .join('  ')}
            </Text>
            <AppButton
              label={t('common.start')}
              onPress={() =>
                router.push({
                  pathname: '/game',
                  params: { mode, categoryId: item.id },
                })
              }
            />
          </AppCard>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  modeBanner: {
    gap: 8,
  },
  modeBannerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modeBannerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    gap: 14,
  },
  categoryCard: {
    gap: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 34,
  },
  categoryInfo: {
    flex: 1,
    gap: 4,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  preview: {
    fontSize: 20,
    lineHeight: 26,
  },
});
