import { PropsWithChildren } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useAppTheme } from '@/theme/AppThemeProvider';

type ScreenProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  withBackButton?: boolean;
  withBottomInset?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

export function Screen({
  children,
  title,
  subtitle,
  withBackButton = false,
  withBottomInset = true,
  contentContainerStyle,
}: ScreenProps) {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={withBottomInset ? ['top', 'left', 'right', 'bottom'] : ['top', 'left', 'right']}
    >
      <View style={styles.backgroundDecor}>
        <View
          style={[
            styles.blobLarge,
            { backgroundColor: theme.colors.surfaceMuted, opacity: theme.isDark ? 0.25 : 0.7 },
          ]}
        />
        <View
          style={[
            styles.blobSmall,
            { backgroundColor: theme.colors.accent, opacity: theme.isDark ? 0.14 : 0.18 },
          ]}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        {(title || subtitle || withBackButton) && (
          <View style={styles.header}>
            {withBackButton && (
              <Pressable
                onPress={() => router.back()}
                style={[
                  styles.backButton,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={[styles.backButtonText, { color: theme.colors.textPrimary }]}>←</Text>
              </Pressable>
            )}
            <View style={styles.headerText}>
              {title && (
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
              )}
              {subtitle && (
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
        )}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: '700',
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
  },
  blobLarge: {
    position: 'absolute',
    top: -40,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  blobSmall: {
    position: 'absolute',
    bottom: 120,
    left: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
  },
});
