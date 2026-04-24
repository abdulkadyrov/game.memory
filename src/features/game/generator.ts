import { getCategoryPool } from '@/config/categories';
import { shuffle, unique } from '@/utils/array';
import { createSeed, mulberry32 } from '@/utils/random';
import { CategoryId, RoundConfig } from '@/types/game';

type SequenceInput = {
  categoryId: CategoryId;
  roundConfig: RoundConfig;
  recentHashes: string[];
  seed?: number;
};

function hashSequence(sequence: string[]) {
  return sequence.join('');
}

function buildPool(categoryId: CategoryId, similarityTier: RoundConfig['similarityTier']) {
  return getCategoryPool(categoryId)
    .filter((entry) => entry.similarityTier <= similarityTier)
    .map((entry) => entry.value);
}

function buildUniqueSequence(
  pool: string[],
  length: number,
  rng: () => number,
) {
  const targetPool = unique(pool);
  const working = shuffle(targetPool, rng);

  while (working.length < length) {
    working.push(targetPool[Math.floor(rng() * targetPool.length)]);
  }

  return working.slice(0, length);
}

export function createRoundSequence(input: SequenceInput) {
  const seed = input.seed ?? createSeed();
  const rng = mulberry32(seed);
  const pool = buildPool(input.categoryId, input.roundConfig.similarityTier);

  let attempts = 0;
  let sequence = buildUniqueSequence(pool, input.roundConfig.sequenceLength, rng);
  let hash = hashSequence(sequence);

  while (input.recentHashes.includes(hash) && attempts < 8) {
    sequence = buildUniqueSequence(shuffle(pool, rng), input.roundConfig.sequenceLength, rng);
    hash = hashSequence(sequence);
    attempts += 1;
  }

  const answerOptions = sequence.map((correctAnswer) => {
    const distractors = shuffle(pool.filter((item) => item !== correctAnswer), rng).slice(
      0,
      Math.max(0, input.roundConfig.optionCount - 1),
    );

    return shuffle(unique([correctAnswer, ...distractors]), rng);
  });

  return {
    seed,
    sequence,
    sequenceHash: hash,
    answerOptions,
  };
}

