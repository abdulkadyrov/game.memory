import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { useAppTheme } from '@/theme/AppThemeProvider';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
}: Props) {
  const theme = useAppTheme();

  const backgroundColor =
    variant === 'primary'
      ? theme.colors.accent
      : variant === 'secondary'
        ? theme.colors.surface
        : 'transparent';

  const borderColor =
    variant === 'ghost' ? theme.colors.border : variant === 'secondary' ? theme.colors.border : 'transparent';

  const textColor =
    variant === 'primary' ? theme.colors.textPrimary : theme.colors.textPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.large : styles.medium,
        {
          backgroundColor,
          borderColor,
          opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  medium: {
    minHeight: 54,
  },
  large: {
    minHeight: 60,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
});
