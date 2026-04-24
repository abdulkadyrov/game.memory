import { LevelDefinition } from '@/types/game';

export const LEVEL_DEFINITIONS: LevelDefinition[] = Array.from({ length: 18 }, (_, index) => {
  const level = index + 1;
  const sequenceLength = 3 + Math.floor(level / 2);
  const previewWindow = Math.min(3 + Math.floor(level / 5), sequenceLength);
  const optionCount = level < 4 ? 4 : level < 10 ? 6 : 8;
  const previewDurationMs = Math.max(2800 - level * 90, 1300);
  const newItemRevealMs = Math.max(1300 - level * 25, 700);
  const answerTimeLimitMs =
    level >= 7 ? Math.max(8000 - level * 200, 4200) : undefined;

  return {
    id: level,
    title: `Уровень ${level}`,
    description:
      level < 6
        ? 'Спокойный темп, крупные отличия и короткие последовательности.'
        : level < 12
          ? 'Больше элементов, больше вариантов ответа и меньше времени.'
          : 'Длинные последовательности и похожие символы для серьёзной тренировки.',
    sequenceLength,
    previewWindow,
    optionCount,
    previewDurationMs,
    newItemRevealMs,
    answerTimeLimitMs,
    similarityTier: level < 5 ? 1 : level < 11 ? 2 : 3,
  };
});

export function getLevelDefinition(id: number) {
  return LEVEL_DEFINITIONS.find((level) => level.id === id) ?? LEVEL_DEFINITIONS[0];
}

