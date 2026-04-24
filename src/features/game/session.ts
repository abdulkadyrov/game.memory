import { APP_CONFIG } from '@/config/appConfig';
import { getLevelDefinition } from '@/config/levels';
import { createRoundSequence } from '@/features/game/generator';
import { CategoryId, GameMode, RoundConfig, SessionSetup } from '@/types/game';

type BuildGameSetupInput = {
  mode: GameMode;
  categoryId: CategoryId;
  levelId?: number;
  recentHashes: string[];
  endlessBlockIndex?: number;
};

function buildRoundConfig(
  mode: GameMode,
  levelId?: number,
  endlessBlockIndex = 0,
): RoundConfig {
  if (mode === 'levels') {
    const level = getLevelDefinition(levelId ?? 1);

    return {
      sequenceLength: level.sequenceLength,
      previewWindow: level.previewWindow,
      optionCount: level.optionCount,
      previewDurationMs: level.previewDurationMs,
      newItemRevealMs: level.newItemRevealMs,
      answerTimeLimitMs: level.answerTimeLimitMs,
      similarityTier: level.similarityTier,
      lives: APP_CONFIG.defaultLives,
    };
  }

  const block = endlessBlockIndex + 1;

  return {
    sequenceLength: Math.min(4 + Math.floor(block / 2), 10),
    previewWindow: Math.min(3 + Math.floor(block / 4), 5),
    optionCount: block < 3 ? 4 : block < 7 ? 6 : 8,
    previewDurationMs: Math.max(2400 - block * 70, 1100),
    newItemRevealMs: Math.max(1250 - block * 30, 650),
    answerTimeLimitMs: block >= 4 ? Math.max(7000 - block * 180, 3600) : undefined,
    similarityTier: block < 4 ? 1 : block < 8 ? 2 : 3,
    lives: APP_CONFIG.defaultLives,
  };
}

export function buildGameSetup(input: BuildGameSetupInput): SessionSetup {
  const roundConfig = buildRoundConfig(input.mode, input.levelId, input.endlessBlockIndex);
  const generated = createRoundSequence({
    categoryId: input.categoryId,
    roundConfig,
    recentHashes: input.recentHashes,
  });

  return {
    ...generated,
    mode: input.mode,
    categoryId: input.categoryId,
    levelId: input.mode === 'levels' ? input.levelId ?? 1 : undefined,
    roundConfig,
  };
}

