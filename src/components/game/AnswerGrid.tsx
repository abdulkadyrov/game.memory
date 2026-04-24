import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { useGameStore } from '@/store/gameStore';
import { useAppTheme } from '@/theme/AppThemeProvider';

function OptionButton({
  value,
  disabled,
  onPress,
  isHighlighted,
  isCorrect,
}: {
  value: string;
  disabled: boolean;
  onPress: () => void;
  isHighlighted: boolean;
  isCorrect: boolean;
}) {
  const theme = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        disabled={disabled}
        onPress={() => {
          scale.value = withSequence(withTiming(0.96, { duration: 90 }), withTiming(1, { duration: 120 }));
          onPress();
        }}
        style={({ pressed }) => [
          styles.option,
          {
            backgroundColor: isHighlighted
              ? isCorrect
                ? theme.colors.successSoft
                : theme.colors.dangerSoft
              : theme.colors.card,
            borderColor: isHighlighted
              ? isCorrect
                ? theme.colors.success
                : theme.colors.danger
              : theme.colors.border,
            opacity: disabled ? 0.65 : pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={styles.optionText}>{value}</Text>
      </Pressable>
    </Animated.View>
  );
}

type AnswerGridProps = {
  onSelectOption: (value: string) => Promise<void>;
};

export function AnswerGrid({ onSelectOption }: AnswerGridProps) {
  const session = useGameStore((state) => state.currentSession);

  const options = useMemo(() => {
    if (!session) {
      return [];
    }

    return session.answerOptions[session.currentQuestionIndex] ?? [];
  }, [session]);

  if (!session) {
    return null;
  }

  const correctAnswer = session.sequence[session.currentQuestionIndex];
  const disabled = session.phase !== 'ask';

  return (
    <AppCard style={styles.card}>
      <View style={styles.grid}>
        {options.map((option) => (
          <OptionButton
            key={`${option}-${session.currentQuestionIndex}`}
            value={option}
            disabled={disabled}
            onPress={() => void onSelectOption(option)}
            isHighlighted={session.highlightedOption === option}
            isCorrect={option === correctAnswer}
          />
        ))}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  option: {
    width: 72,
    minHeight: 68,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 30,
  },
});
