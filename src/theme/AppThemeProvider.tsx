import { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { darkPalette, lightPalette, semanticTheme } from '@/constants/theme';
import { useSettingsStore } from '@/store/settingsStore';

type AppTheme = ReturnType<typeof semanticTheme>;

const AppThemeContext = createContext<AppTheme>(semanticTheme(lightPalette, false));

export function AppThemeProvider({ children }: PropsWithChildren) {
  const deviceScheme = useColorScheme();
  const preferDarkTheme = useSettingsStore((state) => state.preferDarkTheme);

  const isDark = preferDarkTheme || deviceScheme === 'dark';
  const palette = isDark ? darkPalette : lightPalette;
  const theme = useMemo(() => semanticTheme(palette, isDark), [isDark, palette]);

  return <AppThemeContext.Provider value={theme}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(AppThemeContext);
}

