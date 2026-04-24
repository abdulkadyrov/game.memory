import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Memory Lane',
  slug: 'game-memory',
  scheme: 'memorylane',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  jsEngine: 'hermes',
  experiments: {
    typedRoutes: true,
  },
  plugins: ['expo-router'],
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.example.memorylane',
  },
  android: {
    package: 'com.example.memorylane',
    adaptiveIcon: {
      backgroundColor: '#F4EFE6',
    },
  },
  extra: {
    eas: {
      projectId: 'memory-lane-local-project',
    },
  },
};

export default config;

