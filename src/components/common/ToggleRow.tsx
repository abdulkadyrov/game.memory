import { StyleSheet, Switch, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/AppThemeProvider';

type Props = {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function ToggleRow({ label, description, value, onValueChange }: Props) {
  const theme = useAppTheme();

  return (
    <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.textBlock}>
        <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{label}</Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});
