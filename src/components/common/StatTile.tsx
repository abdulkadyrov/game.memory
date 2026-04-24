import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/AppThemeProvider';

type Props = {
  label: string;
  value: string;
};

export function StatTile({ label, value }: Props) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.value, { color: theme.colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    minWidth: '47%',
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
  },
});
