export type CategoryId =
  | 'animals'
  | 'plants'
  | 'hearts'
  | 'hands'
  | 'food'
  | 'weather'
  | 'objects'
  | 'mixed';

export type GameMode = 'levels' | 'endless';

export type GamePhase =
  | 'idle'
  | 'preview'
  | 'cover'
  | 'ask'
  | 'answer-correct'
  | 'answer-wrong'
  | 'game-over'
  | 'level-complete';

export type SimilarityTier = 1 | 2 | 3;

export type EmojiDefinition = {
  id: string;
  value: string;
  tags: string[];
  similarityTier: SimilarityTier;
};

export type CategoryDefinition = {
  id: CategoryId;
  icon: string;
  title: string;
  description: string;
  emoji: EmojiDefinition[];
};

export type LevelDefinition = {
  id: number;
  title: string;
  description: string;
  sequenceLength: number;
  previewWindow: number;
  optionCount: number;
  previewDurationMs: number;
  newItemRevealMs: number;
  answerTimeLimitMs?: number;
  similarityTier: SimilarityTier;
};

export type RoundConfig = {
  sequenceLength: number;
  previewWindow: number;
  optionCount: number;
  previewDurationMs: number;
  newItemRevealMs: number;
  answerTimeLimitMs?: number;
  similarityTier: SimilarityTier;
  lives: number;
};

export type SessionSetup = {
  seed: number;
  mode: GameMode;
  categoryId: CategoryId;
  levelId?: number;
  roundConfig: RoundConfig;
  sequence: string[];
  sequenceHash: string;
  answerOptions: string[][];
};

export type GameSession = SessionSetup & {
  phase: GamePhase;
  score: number;
  bestScore: number;
  livesLeft: number;
  currentQuestionIndex: number;
  currentRevealIndex: number | null;
  resolvedIndexes: number[];
  highlightedOption: string | null;
  lastAnswerCorrect: boolean | null;
  streak: number;
  blocksCleared: number;
  askStartedAt: number | null;
};

export type ResultPayload = {
  mode: GameMode;
  outcome: 'game-over' | 'level-complete';
  score: number;
  bestScore: number;
  levelId?: number;
  blocksCleared: number;
  categoryId: CategoryId;
};

export type ProgressState = {
  unlockedLevel: number;
  completedLevels: number[];
  endlessBestScore: number;
  recentSequenceHashes: string[];
};

export type StatsState = {
  totalAnswers: number;
  correctAnswers: number;
  wrongAnswers: number;
  bestStreak: number;
  totalRuns: number;
  categoryPlays: Partial<Record<CategoryId, number>>;
};

