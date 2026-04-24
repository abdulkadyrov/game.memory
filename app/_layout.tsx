import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';

import { useSettingsStore } from '@/store/settingsStore';
import { useProgressStore } from '@/store/progressStore';
import { audioService } from '@/services/audio/AudioService';
import { AppThemeProvider, useAppTheme } from '@/theme/AppThemeProvider';

function RootNavigator() {
  const theme = useAppTheme();
  const musicEnabled = useSettingsStore((state) => state.musicEnabled);
  const musicVolume = useSettingsStore((state) => state.musicVolume);

  useEffect(() => {
    void audioService.configure();
  }, []);

  useEffect(() => {
    void audioService.setMusicEnabled(musicEnabled);
  }, [musicEnabled]);

  useEffect(() => {
    void audioService.setMusicVolume(musicVolume);
  }, [musicVolume]);

  useProgressStore();

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <RootNavigator />
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}
