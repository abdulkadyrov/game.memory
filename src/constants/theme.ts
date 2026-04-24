export const lightPalette = {
  background: '#F7F1E8',
  surface: '#FFF9F2',
  surfaceMuted: '#F1E7D8',
  card: '#FFFFFF',
  border: '#E3D7C7',
  textPrimary: '#2A221B',
  textSecondary: '#61564C',
  textTertiary: '#8C7F72',
  accent: '#F2A65A',
  accentStrong: '#C96A2E',
  success: '#2D8F61',
  successSoft: '#E6F5EC',
  danger: '#CC5A4E',
  dangerSoft: '#FDEAE7',
  warning: '#E4A72C',
  overlay: 'rgba(42, 34, 27, 0.14)',
};

export const darkPalette = {
  background: '#171412',
  surface: '#211C18',
  surfaceMuted: '#2A241F',
  card: '#26211D',
  border: '#3A322C',
  textPrimary: '#FFF7EE',
  textSecondary: '#D2C6BA',
  textTertiary: '#AA9C8E',
  accent: '#E5B172',
  accentStrong: '#FFC989',
  success: '#74D39E',
  successSoft: '#1E3528',
  danger: '#F08A7D',
  dangerSoft: '#412522',
  warning: '#F2C35E',
  overlay: 'rgba(0, 0, 0, 0.28)',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  round: 999,
};

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
};

export const typography = {
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800' as const,
  },
  heading: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600' as const,
  },
};

export function semanticTheme(
  palette: typeof lightPalette,
  isDark: boolean,
) {
  return {
    isDark,
    colors: palette,
    spacing,
    radius,
    shadows,
    typography,
  };
}

