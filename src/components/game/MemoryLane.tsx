import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { useGameStore } from '@/store/gameStore';
import { useAppTheme } from '@/theme/AppThemeProvider';

function LaneItem({
  value,
  isVisible,
  isResolved,
  isActiveQuestion,
  isNewReveal,
}: {
  value: string;
  isVisible: boolean;
  isResolved: boolean;
  isActiveQuestion: boolean;
  isNewReveal: boolean;
}) {
  const theme = useAppTheme();
  const lift = useSharedValue(0);
  const shake = useSharedValue(0);

  useEffect(() => {
    lift.value = withTiming(isVisible ? 1 : 0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [isVisible, lift]);

  useEffect(() => {
    if (isActiveQuestion && !isVisible) {
      shake.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 120 }),
          withTiming(3, { duration: 120 }),
          withTiming(0, { duration: 120 }),
        ),
        1,
        false,
      );
    }
  }, [isActiveQuestion, isVisible, shake]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -4 * lift.value }, { translateX: shake.value }],
    opacity: withTiming(isVisible ? 1 : 0.95, { duration: 200 }),
  }));

  return (
    <Animated.View style={[animatedStyle, styles.itemWrap]}>
      <View
        style={[
          styles.item,
          {
            backgroundColor: isResolved
              ? theme.colors.successSoft
              : isVisible
                ? theme.colors.card
                : theme.colors.surfaceMuted,
            borderColor: isResolved
              ? theme.colors.success
              : isActiveQuestion
                ? theme.colors.accentStrong
                : theme.colors.border,
          },
        ]}
      >
        {isVisible || isResolved ? (
          <Text style={styles.emoji}>{value}</Text>
        ) : (
          <View
            style={[
              styles.cover,
              {
                backgroundColor: isNewReveal
                  ? theme.colors.accent
                  : theme.colors.surface,
              },
            ]}
          >
            <Text style={[styles.coverText, { color: theme.colors.textTertiary }]}>?</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

export function MemoryLane() {
  const session = useGameStore((state) => state.currentSession);

  if (!session) {
    return null;
  }

  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        {session.sequence.map((item, index) => {
          const initialPreviewVisible = index < session.roundConfig.previewWindow;
          const isPreview = session.phase === 'preview' && initialPreviewVisible;
          const isResolved = session.resolvedIndexes.includes(index);
          const isNewReveal = session.currentRevealIndex === index && session.phase !== 'ask';
          const isVisible = isResolved || isPreview || isNewReveal;
          const isActiveQuestion = index === session.currentQuestionIndex && session.phase === 'ask';

          return (
            <LaneItem
              key={`${item}-${index}`}
              value={item}
              isVisible={isVisible}
              isResolved={isResolved}
              isActiveQuestion={isActiveQuestion}
              isNewReveal={isNewReveal}
            />
          );
        })}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 14,
    paddingVertical: 18,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  itemWrap: {
    width: 62,
  },
  item: {
    width: 62,
    height: 72,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  emoji: {
    fontSize: 30,
  },
  cover: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverText: {
    fontSize: 22,
    fontWeight: '800',
  },
});
