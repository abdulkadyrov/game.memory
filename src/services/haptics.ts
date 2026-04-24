import * as Haptics from 'expo-haptics';

import { useSettingsStore } from '@/store/settingsStore';

async function trigger(task: () => Promise<void>) {
  if (!useSettingsStore.getState().hapticsEnabled) {
    return;
  }

  try {
    await task();
  } catch {
    // Haptics can silently fail on unsupported environments.
  }
}

export const hapticsService = {
  light() {
    return trigger(() => Haptics.selectionAsync());
  },
  success() {
    return trigger(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  },
  error() {
    return trigger(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
  },
};

