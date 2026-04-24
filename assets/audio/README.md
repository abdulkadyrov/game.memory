Положите сюда свои аудиофайлы, например:

- `tap.mp3`
- `correct.mp3`
- `wrong.mp3`
- `background.mp3`

После этого обновите `src/services/audio/audioManifest.ts`:

```ts
export const audioManifest = {
  tap: require('../../../assets/audio/tap.mp3'),
  correct: require('../../../assets/audio/correct.mp3'),
  wrong: require('../../../assets/audio/wrong.mp3'),
  background: require('../../../assets/audio/background.mp3'),
};
```

Если аудио не подключено, приложение продолжит работать без падений: сервисы уже имеют безопасные заглушки.
