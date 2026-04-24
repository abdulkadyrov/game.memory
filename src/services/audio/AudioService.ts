import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

import { audioManifest } from '@/services/audio/audioManifest';
import { useSettingsStore } from '@/store/settingsStore';

class AudioService {
  private configured = false;

  private musicVolume = 0.45;

  private backgroundSound: Audio.Sound | null = null;

  async configure() {
    if (this.configured) {
      return;
    }

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: true,
    });

    this.configured = true;

    if (useSettingsStore.getState().musicEnabled) {
      await this.ensureBackgroundMusic();
    }
  }

  async setMusicEnabled(enabled: boolean) {
    if (!enabled) {
      await this.stopBackgroundMusic();
      return;
    }

    await this.ensureBackgroundMusic();
  }

  async setMusicVolume(volume: number) {
    this.musicVolume = volume;

    if (this.backgroundSound) {
      await this.backgroundSound.setVolumeAsync(volume);
    }
  }

  async playTap() {
    await this.playOneShot(audioManifest.tap);
  }

  async playCorrect() {
    await this.playOneShot(audioManifest.correct);
  }

  async playWrong() {
    await this.playOneShot(audioManifest.wrong);
  }

  private async playOneShot(assetModule?: number) {
    if (!assetModule || !useSettingsStore.getState().soundEnabled) {
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(assetModule, {
        shouldPlay: true,
        volume: useSettingsStore.getState().soundVolume,
      });

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          void sound.unloadAsync();
        }
      });
    } catch {
      // Missing or invalid local asset should not break gameplay.
    }
  }

  private async ensureBackgroundMusic() {
    if (!audioManifest.background) {
      return;
    }

    if (!this.backgroundSound) {
      const { sound } = await Audio.Sound.createAsync(audioManifest.background, {
        shouldPlay: true,
        isLooping: true,
        volume: this.musicVolume,
      });
      this.backgroundSound = sound;
      return;
    }

    await this.backgroundSound.playAsync();
  }

  private async stopBackgroundMusic() {
    if (!this.backgroundSound) {
      return;
    }

    await this.backgroundSound.stopAsync();
  }
}

export const audioService = new AudioService();

