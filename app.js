(function () {
  const APP_CONFIG = {
    defaultLives: 3,
    recentSequenceCacheSize: 16,
    answerFeedbackMs: 700,
    wrongAnswerFeedbackMs: 820,
    coverDelayMs: 380,
    postBlockDelayMs: 900,
    timerTickMs: 100,
  };

  const STORAGE_KEYS = {
    progress: "memory-lane-html-progress",
    settings: "memory-lane-html-settings",
  };

  const INITIAL_PROGRESS = {
    unlockedLevel: 1,
    completedLevels: [],
    endlessBestScore: 0,
    recentSequenceHashes: [],
  };

  const INITIAL_STATS = {
    totalAnswers: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    bestStreak: 0,
    totalRuns: 0,
    categoryPlays: {},
  };

  const INITIAL_SETTINGS = {
    musicEnabled: true,
    soundEnabled: true,
    hapticsEnabled: true,
    preferDarkTheme: true,
  };

  const CATEGORY_DEFINITIONS = [
    {
      id: "animals",
      icon: "🐾",
      title: "Животные",
      description: "Простые и легко различимые звери для мягкого старта.",
      emoji: [
        { id: "dog", value: "🐶", similarityTier: 1 },
        { id: "cat", value: "🐱", similarityTier: 1 },
        { id: "fox", value: "🦊", similarityTier: 1 },
        { id: "koala", value: "🐨", similarityTier: 1 },
        { id: "panda", value: "🐼", similarityTier: 1 },
        { id: "lion", value: "🦁", similarityTier: 1 },
        { id: "tiger", value: "🐯", similarityTier: 2 },
        { id: "bear", value: "🐻", similarityTier: 2 },
        { id: "rabbit", value: "🐰", similarityTier: 1 },
        { id: "mouse", value: "🐭", similarityTier: 2 },
        { id: "hamster", value: "🐹", similarityTier: 3 },
        { id: "monkey", value: "🐵", similarityTier: 2 },
      ],
    },
    {
      id: "plants",
      icon: "🌿",
      title: "Растения",
      description: "Деревья, цветы и листья с постепенным ростом похожести.",
      emoji: [
        { id: "tree", value: "🌳", similarityTier: 1 },
        { id: "palm", value: "🌴", similarityTier: 1 },
        { id: "cactus", value: "🌵", similarityTier: 1 },
        { id: "flower", value: "🌸", similarityTier: 1 },
        { id: "tulip", value: "🌷", similarityTier: 2 },
        { id: "rose", value: "🌹", similarityTier: 2 },
        { id: "sunflower", value: "🌻", similarityTier: 1 },
        { id: "leaf", value: "🍃", similarityTier: 2 },
        { id: "clover", value: "🍀", similarityTier: 2 },
        { id: "seedling", value: "🌱", similarityTier: 2 },
        { id: "mushroom", value: "🍄", similarityTier: 3 },
        { id: "maple", value: "🍁", similarityTier: 3 },
      ],
    },
    {
      id: "hearts",
      icon: "💛",
      title: "Сердечки и эмоции",
      description: "Эмоциональные символы и лица с цветовой путаницей на высоких уровнях.",
      emoji: [
        { id: "yellow-heart", value: "💛", similarityTier: 1 },
        { id: "green-heart", value: "💚", similarityTier: 1 },
        { id: "blue-heart", value: "💙", similarityTier: 1 },
        { id: "purple-heart", value: "💜", similarityTier: 2 },
        { id: "orange-heart", value: "🧡", similarityTier: 2 },
        { id: "sparkle-heart", value: "💖", similarityTier: 2 },
        { id: "growing-heart", value: "💗", similarityTier: 3 },
        { id: "revolving-heart", value: "💞", similarityTier: 3 },
        { id: "heart-eyes", value: "😍", similarityTier: 2 },
        { id: "smile", value: "😊", similarityTier: 1 },
        { id: "party", value: "🥳", similarityTier: 1 },
        { id: "wink", value: "😉", similarityTier: 2 },
      ],
    },
    {
      id: "hands",
      icon: "🤲",
      title: "Руки и жесты",
      description: "Чёткие формы жестов, которые хорошо подходят для тренировки внимания.",
      emoji: [
        { id: "thumbs-up", value: "👍", similarityTier: 1 },
        { id: "peace", value: "✌️", similarityTier: 1 },
        { id: "wave", value: "👋", similarityTier: 1 },
        { id: "clap", value: "👏", similarityTier: 1 },
        { id: "ok-hand", value: "👌", similarityTier: 2 },
        { id: "raised-hand", value: "✋", similarityTier: 2 },
        { id: "muscle", value: "💪", similarityTier: 1 },
        { id: "rock", value: "🤘", similarityTier: 2 },
        { id: "point-up", value: "☝️", similarityTier: 2 },
        { id: "point-right", value: "👉", similarityTier: 2 },
        { id: "point-left", value: "👈", similarityTier: 3 },
        { id: "crossed-fingers", value: "🤞", similarityTier: 3 },
      ],
    },
    {
      id: "food",
      icon: "🍎",
      title: "Еда",
      description: "Фрукты, овощи и знакомые блюда с разной визуальной плотностью.",
      emoji: [
        { id: "apple", value: "🍎", similarityTier: 1 },
        { id: "banana", value: "🍌", similarityTier: 1 },
        { id: "orange", value: "🍊", similarityTier: 1 },
        { id: "grapes", value: "🍇", similarityTier: 1 },
        { id: "watermelon", value: "🍉", similarityTier: 2 },
        { id: "strawberry", value: "🍓", similarityTier: 2 },
        { id: "carrot", value: "🥕", similarityTier: 1 },
        { id: "corn", value: "🌽", similarityTier: 1 },
        { id: "pizza", value: "🍕", similarityTier: 1 },
        { id: "burger", value: "🍔", similarityTier: 2 },
        { id: "cake", value: "🍰", similarityTier: 2 },
        { id: "cookie", value: "🍪", similarityTier: 3 },
      ],
    },
    {
      id: "weather",
      icon: "⛅",
      title: "Погода",
      description: "Солнце, тучи, ветер и ночь для спокойного визуального ритма.",
      emoji: [
        { id: "sun", value: "☀️", similarityTier: 1 },
        { id: "cloud", value: "☁️", similarityTier: 1 },
        { id: "rain", value: "🌧️", similarityTier: 1 },
        { id: "snow", value: "❄️", similarityTier: 1 },
        { id: "lightning", value: "⚡", similarityTier: 1 },
        { id: "rainbow", value: "🌈", similarityTier: 1 },
        { id: "moon", value: "🌙", similarityTier: 2 },
        { id: "star", value: "⭐", similarityTier: 2 },
        { id: "tornado", value: "🌪️", similarityTier: 2 },
        { id: "fog", value: "🌫️", similarityTier: 3 },
        { id: "droplet", value: "💧", similarityTier: 2 },
        { id: "snowman", value: "⛄", similarityTier: 3 },
      ],
    },
    {
      id: "objects",
      icon: "🎒",
      title: "Предметы",
      description: "Повседневные объекты и техника для более нейтральной темы.",
      emoji: [
        { id: "book", value: "📘", similarityTier: 1 },
        { id: "gift", value: "🎁", similarityTier: 1 },
        { id: "balloon", value: "🎈", similarityTier: 1 },
        { id: "clock", value: "⏰", similarityTier: 1 },
        { id: "camera", value: "📷", similarityTier: 1 },
        { id: "phone", value: "📱", similarityTier: 2 },
        { id: "headphones", value: "🎧", similarityTier: 2 },
        { id: "lamp", value: "💡", similarityTier: 1 },
        { id: "key", value: "🔑", similarityTier: 2 },
        { id: "umbrella", value: "☂️", similarityTier: 2 },
        { id: "pencil", value: "✏️", similarityTier: 2 },
        { id: "scissors", value: "✂️", similarityTier: 3 },
      ],
    },
    {
      id: "mixed",
      icon: "✨",
      title: "Смешанная",
      description: "Разные категории в одном забеге для максимальной вариативности.",
      emoji: [],
    },
  ];

  const LEVEL_DEFINITIONS = Array.from({ length: 18 }, function (_, index) {
    const level = index + 1;
    const sequenceLength = 3 + Math.floor(level / 2);
    const previewWindow = Math.min(3 + Math.floor(level / 5), sequenceLength);
    const optionCount = level < 4 ? 4 : level < 10 ? 6 : 8;
    const previewDurationMs = Math.max(2800 - level * 90, 1300);
    const newItemRevealMs = Math.max(1300 - level * 25, 700);
    const answerTimeLimitMs = level >= 7 ? Math.max(8000 - level * 200, 4200) : undefined;

    return {
      id: level,
      title: "Уровень " + level,
      description:
        level < 6
          ? "Спокойный темп, крупные отличия и короткие последовательности."
          : level < 12
            ? "Больше элементов, больше вариантов ответа и меньше времени."
            : "Длинные последовательности и похожие символы для серьёзной тренировки.",
      sequenceLength: sequenceLength,
      previewWindow: previewWindow,
      optionCount: optionCount,
      previewDurationMs: previewDurationMs,
      newItemRevealMs: newItemRevealMs,
      answerTimeLimitMs: answerTimeLimitMs,
      similarityTier: level < 5 ? 1 : level < 11 ? 2 : 3,
    };
  });

  const state = {
    route: "home",
    previousRoute: "home",
    selectedMode: "levels",
    selectedCategory: "mixed",
    selectedLevel: 1,
    progress: loadFromStorage(STORAGE_KEYS.progress, {
      progress: clone(INITIAL_PROGRESS),
      stats: clone(INITIAL_STATS),
    }),
    settings: loadFromStorage(STORAGE_KEYS.settings, clone(INITIAL_SETTINGS)),
    game: null,
    result: null,
  };

  const timers = {
    phase: null,
    clock: null,
  };

  const app = document.getElementById("app");
  document.body.dataset.theme = state.settings.preferDarkTheme ? "dark" : "light";

  app.addEventListener("click", onClick);
  render();

  function onClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }

    const action = target.dataset.action;
    if (!action) {
      return;
    }

    switch (action) {
      case "navigate":
        navigate(target.dataset.route || "home");
        break;
      case "back":
        navigate(resolveBackRoute());
        break;
      case "set-mode":
        state.selectedMode = target.dataset.mode || "levels";
        navigate("categories");
        break;
      case "set-category":
        state.selectedCategory = target.dataset.category || "mixed";
        if (state.selectedMode === "levels") {
          navigate("levels");
        } else {
          startGame("endless", state.selectedCategory);
        }
        break;
      case "choose-level":
        if (target.dataset.locked === "true") {
          return;
        }
        state.selectedLevel = Number(target.dataset.level || 1);
        startGame("levels", state.selectedCategory, state.selectedLevel);
        break;
      case "quick-start":
        state.selectedMode = "levels";
        state.selectedCategory = "mixed";
        state.selectedLevel = Math.min(state.progress.progress.unlockedLevel, 1);
        navigate("modes");
        break;
      case "start-option":
        if (!state.game || state.game.phase !== "ask") {
          return;
        }
        submitAnswer(target.dataset.value || "");
        break;
      case "confirm-phase":
        handleConfirmPhase();
        break;
      case "restart-game":
        if (state.result) {
          startGame(state.result.mode, state.result.categoryId, state.result.levelId);
        } else if (state.game) {
          startGame(state.game.mode, state.game.categoryId, state.game.levelId);
        }
        break;
      case "continue-level":
        startNextLevel();
        break;
      case "toggle-setting":
        toggleSetting(target.dataset.setting);
        break;
      case "reset-progress":
        resetProgress();
        break;
      default:
        break;
    }
  }

  function navigate(route) {
    state.previousRoute = state.route;
    state.route = route;
    render();
  }

  function resolveBackRoute() {
    if (state.route === "categories") {
      return "modes";
    }
    if (state.route === "levels") {
      return "categories";
    }
    if (state.route === "result") {
      return "home";
    }
    if (state.route === "game") {
      return "home";
    }
    return "home";
  }

  function toggleSetting(setting) {
    if (!setting || !Object.prototype.hasOwnProperty.call(state.settings, setting)) {
      return;
    }

    state.settings[setting] = !state.settings[setting];
    saveToStorage(STORAGE_KEYS.settings, state.settings);
    document.body.dataset.theme = state.settings.preferDarkTheme ? "dark" : "light";
    render();
  }

  function resetProgress() {
    const approved = window.confirm("Удалить локальный прогресс уровней, рекорды и статистику?");
    if (!approved) {
      return;
    }

    state.progress = {
      progress: clone(INITIAL_PROGRESS),
      stats: clone(INITIAL_STATS),
    };
    saveToStorage(STORAGE_KEYS.progress, state.progress);
    render();
  }

  function startNextLevel() {
    if (!state.result || state.result.mode !== "levels") {
      return;
    }

    const nextLevel = Math.min(
      LEVEL_DEFINITIONS.length,
      Math.max(1, (state.result.levelId || 1) + 1),
    );

    if (nextLevel > state.progress.progress.unlockedLevel) {
      navigate("levels");
      return;
    }

    state.selectedMode = "levels";
    state.selectedCategory = state.result.categoryId;
    state.selectedLevel = nextLevel;
    startGame("levels", state.result.categoryId, nextLevel);
  }

  function startGame(mode, categoryId, levelId) {
    stopTimers();
    state.selectedMode = mode;
    state.selectedCategory = categoryId;
    state.selectedLevel = levelId || 1;
    state.result = null;

    const setup = buildGameSetup({
      mode: mode,
      categoryId: categoryId,
      levelId: levelId,
      recentHashes: state.progress.progress.recentSequenceHashes,
      endlessBlockIndex: 0,
    });

    if (!setup.sequence.length || !setup.answerOptions.length) {
      window.alert("Не удалось запустить игру. Попробуйте выбрать режим и категорию заново.");
      navigate("home");
      return;
    }

    state.game = {
      seed: setup.seed,
      mode: mode,
      categoryId: categoryId,
      levelId: mode === "levels" ? levelId || 1 : undefined,
      roundConfig: setup.roundConfig,
      sequence: setup.sequence,
      sequenceHash: setup.sequenceHash,
      answerOptions: setup.answerOptions,
      phase: "preview",
      score: 0,
      bestScore: 0,
      livesLeft: setup.roundConfig.lives,
      currentQuestionIndex: 0,
      currentRevealIndex: null,
      pendingRevealValue: null,
      resolvedIndexes: [],
      highlightedOption: null,
      lastAnswerCorrect: null,
      streak: 0,
      blocksCleared: 0,
      askStartedAt: null,
      remainingMs: 0,
    };

    registerRun(categoryId);
    rememberSequence(setup.sequenceHash);
    navigate("game");
    enterPhase("preview-ready");
  }

  function buildGameSetup(input) {
    const roundConfig = buildRoundConfig(input.mode, input.levelId, input.endlessBlockIndex || 0);
    const generated = createRoundSequence({
      categoryId: input.categoryId,
      roundConfig: roundConfig,
      recentHashes: input.recentHashes,
    });

    return {
      seed: generated.seed,
      sequence: generated.sequence,
      sequenceHash: generated.sequenceHash,
      answerOptions: generated.answerOptions,
      roundConfig: roundConfig,
    };
  }

  function buildRoundConfig(mode, levelId, endlessBlockIndex) {
    if (mode === "levels") {
      const level = getLevelDefinition(levelId || 1);
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

  function createRoundSequence(input) {
    const seed = Date.now() + Math.floor(Math.random() * 100000);
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

    const answerOptions = sequence.map(function (correctAnswer) {
      const distractors = shuffle(
        pool.filter(function (item) {
          return item !== correctAnswer;
        }),
        rng,
      ).slice(0, Math.max(0, input.roundConfig.optionCount - 1));

      return shuffle(unique([correctAnswer].concat(distractors)), rng);
    });

    return {
      seed: seed,
      sequence: sequence,
      sequenceHash: hash,
      answerOptions: answerOptions,
    };
  }

  function buildPool(categoryId, similarityTier) {
    return getCategoryPool(categoryId)
      .filter(function (entry) {
        return entry.similarityTier <= similarityTier;
      })
      .map(function (entry) {
        return entry.value;
      });
  }

  function buildUniqueSequence(pool, length, rng) {
    const targetPool = unique(pool);
    const working = shuffle(targetPool, rng);

    while (working.length < length) {
      working.push(targetPool[Math.floor(rng() * targetPool.length)]);
    }

    return working.slice(0, length);
  }

  function enterPhase(phase) {
    if (!state.game) {
      return;
    }

    stopPhaseTimers();
    state.game.phase = phase;
    state.game.askStartedAt = phase === "ask" ? Date.now() : null;
    state.game.remainingMs = state.game.roundConfig.answerTimeLimitMs || 0;

    if (phase === "preview" || phase === "preview-ready") {
      state.game.currentRevealIndex = null;
      state.game.pendingRevealValue = null;
    } else if (phase === "ask") {
      state.game.currentRevealIndex = null;
      state.game.pendingRevealValue = null;
      startQuestionClock();
    } else if (phase === "reveal" || phase === "reveal-ready") {
      // Wait for the player to confirm they memorized the newly revealed emoji.
    } else if (phase === "answer-correct") {
      timers.phase = window.setTimeout(function () {
        advanceAfterCorrect();
      }, APP_CONFIG.answerFeedbackMs);
    } else if (phase === "answer-wrong") {
      timers.phase = window.setTimeout(function () {
        consumeLifeAfterWrong();
      }, APP_CONFIG.wrongAnswerFeedbackMs);
    } else if (phase === "level-complete") {
      if (state.game.mode === "levels") {
        completeLevel(state.game.levelId || 1);
        timers.phase = window.setTimeout(function () {
          state.result = {
            mode: state.game.mode,
            outcome: "level-complete",
            score: state.game.score,
            bestScore: Math.max(state.progress.progress.endlessBestScore, state.game.bestScore),
            levelId: state.game.levelId,
            blocksCleared: state.game.blocksCleared,
            categoryId: state.game.categoryId,
          };
          navigate("result");
        }, APP_CONFIG.postBlockDelayMs);
      } else {
        timers.phase = window.setTimeout(function () {
          prepareNextEndlessBlock();
        }, APP_CONFIG.postBlockDelayMs);
      }
    } else if (phase === "game-over") {
      registerEndlessScore(state.game.score);
      timers.phase = window.setTimeout(function () {
        state.result = {
          mode: state.game.mode,
          outcome: "game-over",
          score: state.game.score,
          bestScore: Math.max(state.progress.progress.endlessBestScore, state.game.score),
          levelId: state.game.levelId,
          blocksCleared: state.game.blocksCleared,
          categoryId: state.game.categoryId,
        };
        navigate("result");
      }, 500);
    }

    render();
  }

  function handleConfirmPhase() {
    if (!state.game) {
      return;
    }

    if (state.game.phase === "preview-ready") {
      enterPhase("ask");
      return;
    }

    if (state.game.phase === "reveal-ready") {
      enterPhase("ask");
    }
  }

  function startQuestionClock() {
    stopClock();
    if (!state.game || !state.game.roundConfig.answerTimeLimitMs) {
      render();
      return;
    }

    const startedAt = state.game.askStartedAt || Date.now();
    timers.clock = window.setInterval(function () {
      if (!state.game || state.game.phase !== "ask") {
        stopClock();
        return;
      }

      const left = Math.max(
        0,
        state.game.roundConfig.answerTimeLimitMs - (Date.now() - startedAt),
      );
      state.game.remainingMs = left;

      if (left <= 0) {
        stopClock();
        submitAnswer("__timeout__");
        return;
      }

      render();
    }, APP_CONFIG.timerTickMs);
  }

  function submitAnswer(selectedOption) {
    if (!state.game || state.game.phase !== "ask") {
      return;
    }

    const correctAnswer = state.game.sequence[state.game.currentQuestionIndex];
    const isCorrect = selectedOption === correctAnswer;

    if (isCorrect) {
      state.game.highlightedOption = selectedOption;
      state.game.lastAnswerCorrect = true;
      state.game.score += 10 + Math.max(0, state.game.streak * 2);
      state.game.streak += 1;
      registerAnswer(true, state.game.streak);
      enterPhase("answer-correct");
      return;
    }

    state.game.highlightedOption = selectedOption;
    state.game.lastAnswerCorrect = false;
    state.game.streak = 0;
    registerAnswer(false, 0);
    enterPhase("answer-wrong");
  }

  function advanceAfterCorrect() {
    if (!state.game) {
      return;
    }

    state.game.resolvedIndexes = unique(
      state.game.resolvedIndexes.concat(state.game.currentQuestionIndex),
    ).sort(function (a, b) {
      return a - b;
    });

    const nextQuestionIndex = state.game.currentQuestionIndex + 1;
    const nextRevealIndex =
      state.game.currentQuestionIndex + state.game.roundConfig.previewWindow <
      state.game.sequence.length
        ? state.game.currentQuestionIndex + state.game.roundConfig.previewWindow
        : null;
    const completed = nextQuestionIndex >= state.game.sequence.length;

    state.game.currentQuestionIndex = completed
      ? state.game.currentQuestionIndex
      : nextQuestionIndex;
    state.game.highlightedOption = null;

    if (completed) {
      state.game.score += 50;
      state.game.blocksCleared += 1;
      enterPhase("level-complete");
      return;
    }

    if (nextRevealIndex !== null) {
      state.game.currentRevealIndex = nextRevealIndex;
      state.game.pendingRevealValue = state.game.sequence[nextRevealIndex];
      enterPhase("reveal-ready");
      return;
    }

    state.game.currentRevealIndex = null;
    state.game.pendingRevealValue = null;
    enterPhase("ask");
  }

  function consumeLifeAfterWrong() {
    if (!state.game) {
      return;
    }

    state.game.livesLeft -= 1;
    state.game.highlightedOption = null;

    if (state.game.livesLeft <= 0) {
      enterPhase("game-over");
      return;
    }

    enterPhase("ask");
  }

  function prepareNextEndlessBlock() {
    if (!state.game) {
      return;
    }

    const nextSetup = buildGameSetup({
      mode: "endless",
      categoryId: state.game.categoryId,
      recentHashes: state.progress.progress.recentSequenceHashes,
      endlessBlockIndex: state.game.blocksCleared,
    });

    state.game.seed = nextSetup.seed;
    state.game.roundConfig = nextSetup.roundConfig;
    state.game.sequence = nextSetup.sequence;
    state.game.sequenceHash = nextSetup.sequenceHash;
    state.game.answerOptions = nextSetup.answerOptions;
    state.game.phase = "preview";
    state.game.bestScore = Math.max(state.game.bestScore, state.game.score);
    state.game.currentQuestionIndex = 0;
    state.game.currentRevealIndex = null;
    state.game.pendingRevealValue = null;
    state.game.resolvedIndexes = [];
    state.game.highlightedOption = null;
    state.game.lastAnswerCorrect = null;
    state.game.askStartedAt = null;
    state.game.remainingMs = 0;

    rememberSequence(nextSetup.sequenceHash);
    enterPhase("preview-ready");
  }

  function registerRun(categoryId) {
    const stats = state.progress.stats;
    stats.totalRuns += 1;
    stats.categoryPlays[categoryId] = (stats.categoryPlays[categoryId] || 0) + 1;
    persistProgress();
  }

  function registerAnswer(correct, streak) {
    const stats = state.progress.stats;
    stats.totalAnswers += 1;
    stats.correctAnswers += correct ? 1 : 0;
    stats.wrongAnswers += correct ? 0 : 1;
    stats.bestStreak = Math.max(stats.bestStreak, streak);
    persistProgress();
  }

  function registerEndlessScore(score) {
    state.progress.progress.endlessBestScore = Math.max(
      state.progress.progress.endlessBestScore,
      score,
    );
    persistProgress();
  }

  function completeLevel(levelId) {
    const progress = state.progress.progress;
    progress.unlockedLevel = Math.min(
      LEVEL_DEFINITIONS.length,
      Math.max(progress.unlockedLevel, levelId + 1),
    );
    progress.completedLevels = unique(progress.completedLevels.concat(levelId)).sort(function (a, b) {
      return a - b;
    });
    persistProgress();
  }

  function rememberSequence(hash) {
    const progress = state.progress.progress;
    progress.recentSequenceHashes = unique([hash].concat(progress.recentSequenceHashes)).slice(
      0,
      APP_CONFIG.recentSequenceCacheSize,
    );
    persistProgress();
  }

  function persistProgress() {
    saveToStorage(STORAGE_KEYS.progress, state.progress);
  }

  function stopPhaseTimers() {
    if (timers.phase) {
      window.clearTimeout(timers.phase);
      timers.phase = null;
    }
    stopClock();
  }

  function stopClock() {
    if (timers.clock) {
      window.clearInterval(timers.clock);
      timers.clock = null;
    }
  }

  function stopTimers() {
    stopPhaseTimers();
  }

  function render() {
    app.innerHTML =
      '<div class="shell">' +
      renderTopbar() +
      '<div class="layout">' +
      renderSidebar() +
      '<main class="main">' +
      renderRoute() +
      "</main>" +
      "</div>" +
      "</div>";
  }

  function renderTopbar() {
    return (
      '<div class="topbar">' +
      '<div class="brand">' +
      '<div class="brand__glyph">🧠</div>' +
      '<div class="brand__text">' +
      '<div class="brand__kicker">Standalone HTML Edition</div>' +
      '<div class="brand__title"><span class="gold">MEMORY</span> <span class="violet">LANE</span></div>' +
      "</div>" +
      "</div>" +
      '<div class="topbar__actions">' +
      button("Домой", "ghost", { action: "navigate", route: "home" }) +
      button("Прогресс", "ghost", { action: "navigate", route: "progress" }) +
      button("Настройки", "ghost", { action: "navigate", route: "settings" }) +
      "</div>" +
      "</div>"
    );
  }

  function renderSidebar() {
    const accuracy = state.progress.stats.totalAnswers
      ? Math.round((state.progress.stats.correctAnswers / state.progress.stats.totalAnswers) * 100)
      : 0;

    return (
      '<aside class="sidebar">' +
      '<div>' +
      '<div class="card__eyebrow">Навигация</div>' +
      '<div class="nav">' +
      navButton("Главная", "home") +
      navButton("Режимы", "modes") +
      navButton("Категории", "categories") +
      navButton("Уровни", "levels") +
      navButton("Прогресс", "progress") +
      navButton("Настройки", "settings") +
      "</div>" +
      "</div>" +
      '<div class="cards-3" style="grid-template-columns:1fr;">' +
      tile("Открыт уровень", String(state.progress.progress.unlockedLevel)) +
      tile("Рекорд endless", String(state.progress.progress.endlessBestScore)) +
      tile("Точность", accuracy + "%") +
      "</div>" +
      '<div class="sidebar__note">Эта версия работает прямо из <strong>index.html</strong>: можно открыть локально, переслать папку или положить на любой статический хостинг.</div>' +
      button("Выбрать режим", "primary", { action: "navigate", route: "modes" }) +
      "</aside>"
    );
  }

  function renderRoute() {
    if (state.route === "modes") {
      return renderModesPage();
    }
    if (state.route === "categories") {
      return renderCategoriesPage();
    }
    if (state.route === "levels") {
      return renderLevelsPage();
    }
    if (state.route === "progress") {
      return renderProgressPage();
    }
    if (state.route === "settings") {
      return renderSettingsPage();
    }
    if (state.route === "game") {
      return renderGamePage();
    }
    if (state.route === "result") {
      return renderResultPage();
    }
    return renderHomePage();
  }

  function renderHomePage() {
    const accuracy = state.progress.stats.totalAnswers
      ? Math.round((state.progress.stats.correctAnswers / state.progress.stats.totalAnswers) * 100)
      : 0;

    return (
      '<section class="panel hero">' +
      '<div class="hero__grid">' +
      '<div>' +
      '<div class="card__eyebrow">Тренировка памяти без перегруза</div>' +
      '<h1 class="hero__title"><span class="gold">MEMORY</span><br /><span class="violet">LANE</span></h1>' +
      '<p class="hero__subtitle">Запоминай ряд, отвечай по порядку и постепенно продвигайся вперёд по скрытой последовательности. Версия ниже полностью работает в обычном браузере без Expo и без сервера.</p>' +
      '<div class="hero__chips">' +
      chip("Режим", state.selectedMode === "levels" ? "Уровни" : "Endless") +
      chip("Категория", getCategoryDefinition(state.selectedCategory).title) +
      chip("Точность", accuracy + "%") +
      "</div>" +
      '<div class="page-actions">' +
      button("Играть", "primary", { action: "navigate", route: "modes" }) +
      button("Категории", "secondary", { action: "navigate", route: "categories" }) +
      button("Настройки", "ghost", { action: "navigate", route: "settings" }) +
      "</div>" +
      "</div>" +
      '<div class="hero__palette">' +
      '<div class="card"><div class="card__eyebrow">Палитра</div><div class="palette">' +
      '<div class="swatch swatch--gold"></div>' +
      '<div class="swatch swatch--lime"></div>' +
      '<div class="swatch swatch--coral"></div>' +
      '<div class="swatch swatch--pink"></div>' +
      '<div class="swatch swatch--violet"></div>' +
      '<div class="swatch swatch--cyan"></div>' +
      '</div><p class="tiny">Цвета собраны по мотивам приложенной референс-картинки: тёмный фон, золото, лайм, коралл, фиолет и ледяной голубой.</p></div>' +
      tile("Открытый уровень", String(state.progress.progress.unlockedLevel)) +
      tile("Лучший endless", String(state.progress.progress.endlessBestScore)) +
      tile("Лучшая серия", String(state.progress.stats.bestStreak)) +
      "</div>" +
      "</div>" +
      "</section>" +
      '<section class="section">' +
      '<div class="section__header"><div><h2 class="section__title">Быстрый обзор</h2><p class="section__subtitle">Локальная статистика хранится в браузере, так что игра не требует отдельного backend.</p></div></div>' +
      '<div class="cards-3">' +
      tile("Пройдено уровней", String(state.progress.progress.completedLevels.length)) +
      tile("Всего попыток", String(state.progress.stats.totalRuns)) +
      tile("Ответов", String(state.progress.stats.totalAnswers)) +
      "</div>" +
      "</section>" +
      '<section class="section">' +
      '<div class="section__header"><div><h2 class="section__title">Как это работает</h2><p class="section__subtitle">Механика сохранена из приложения: сначала открыт фрагмент ряда, потом элементы закрываются и игра спрашивает позиции по порядку.</p></div></div>' +
      '<div class="tip-list">' +
      '<div class="tip"><strong>1.</strong> Игра показывает несколько первых элементов последовательности.</div>' +
      '<div class="tip"><strong>2.</strong> После скрытия начинается вопрос по текущей закрытой позиции.</div>' +
      '<div class="tip"><strong>3.</strong> Правильный ответ закрепляет шаг и добавляет новый элемент справа.</div>' +
      "</div>" +
      '<div class="footer-note">Если захотите, эту папку уже можно открыть как сайт: просто запускается файл <strong>index.html</strong>.</div>' +
      "</section>"
    );
  }

  function renderModesPage() {
    return renderSection(
      "Режимы игры",
      "Выберите формат тренировки памяти под настроение.",
      '<div class="mode-grid">' +
        renderModeCard(
          "levels",
          "Детский режим / уровни",
          "Постепенное усложнение, мягкая кривая обучения, локальный прогресс и прохождение по уровням.",
          "Плавный старт",
        ) +
        renderModeCard(
          "endless",
          "Бесконечный режим",
          "Непрерывные блоки, рост сложности, лучший счёт и длинные серии без заранее заданного финала.",
          "На рекорд",
        ) +
        "</div>",
    );
  }

  function renderCategoriesPage() {
    return renderSection(
      "Категории",
      "Каждая тема использует отдельный набор эмодзи и свой визуальный ритм.",
      '<div class="category-grid">' +
        CATEGORY_DEFINITIONS.map(renderCategoryCard).join("") +
        "</div>",
      button("Назад", "ghost", { action: "back" }),
    );
  }

  function renderLevelsPage() {
    const content =
      '<div class="chips">' +
      chip("Режим", "Уровни") +
      chip("Категория", getCategoryDefinition(state.selectedCategory).title) +
      chip("Открыто", String(state.progress.progress.unlockedLevel)) +
      "</div>" +
      '<div class="level-grid">' +
      LEVEL_DEFINITIONS.map(renderLevelCard).join("") +
      "</div>";

    return renderSection(
      "Выбор уровня",
      "Отдельная страница уровней для standalone-версии: так удобнее открывать и проходить игру в браузере.",
      content,
      button("Назад", "ghost", { action: "back" }),
    );
  }

  function renderProgressPage() {
    const accuracy = state.progress.stats.totalAnswers
      ? Math.round((state.progress.stats.correctAnswers / state.progress.stats.totalAnswers) * 100)
      : 0;
    const favoriteCategoryId =
      Object.entries(state.progress.stats.categoryPlays).sort(function (a, b) {
        return b[1] - a[1];
      })[0]?.[0] || "mixed";
    const favoriteCategory = getCategoryDefinition(favoriteCategoryId);

    let recentWins = state.progress.progress.completedLevels.slice(-8).join(", ");
    if (!recentWins) {
      recentWins = "Пока нет завершённых уровней.";
    }

    const progressWidth = Math.round(
      (state.progress.progress.completedLevels.length / LEVEL_DEFINITIONS.length) * 100,
    );

    return renderSection(
      "Прогресс",
      "Локальная статистика, рекорды и текущая траектория обучения.",
      '<div class="progress-grid">' +
        tile("Лучший счёт", String(state.progress.progress.endlessBestScore)) +
        tile("Точность", accuracy + "%") +
        tile("Лучшая серия", String(state.progress.stats.bestStreak)) +
        tile("Пройдено уровней", String(state.progress.progress.completedLevels.length)) +
        "</div>" +
        '<div class="cards-3" style="margin-top:14px; grid-template-columns: 1fr 1fr;">' +
        '<div class="card"><div class="card__eyebrow">Любимая категория</div><div class="favorite">' +
        favoriteCategory.icon +
        '</div><h3 class="card__title">' +
        favoriteCategory.title +
        '</h3><p class="card__text">' +
        favoriteCategory.description +
        "</p></div>" +
        '<div class="card"><div class="card__eyebrow">Лента уровней</div><div class="meter"><span style="width:' +
        progressWidth +
        '%"></span></div><p class="card__text">Открыт уровень ' +
        state.progress.progress.unlockedLevel +
        " из " +
        LEVEL_DEFINITIONS.length +
        '.</p><p class="card__text">Последние победы: ' +
        recentWins +
        "</p></div>" +
        "</div>",
    );
  }

  function renderSettingsPage() {
    return renderSection(
      "Настройки",
      "Звук, тактильная отдача и базовые системные параметры браузерной версии.",
      '<div class="section"><div class="settings-grid">' +
        settingRow(
          "Фоновая музыка",
          "Тумблер оставлен на будущее; сейчас хранится как настройка без встроенного аудиоплеера.",
          "musicEnabled",
          state.settings.musicEnabled,
        ) +
        settingRow(
          "Звуковые эффекты",
          "Здесь тоже сохранён флаг для будущего подключения аудио или WebAudio.",
          "soundEnabled",
          state.settings.soundEnabled,
        ) +
        settingRow(
          "Тактильный отклик",
          "При необходимости можно будет подключить vibration API в мобильных браузерах.",
          "hapticsEnabled",
          state.settings.hapticsEnabled,
        ) +
        settingRow(
          "Предпочесть тёмную тему",
          "Переключает основную палитру интерфейса между тёмным и светлым вариантом.",
          "preferDarkTheme",
          state.settings.preferDarkTheme,
        ) +
        '</div></div><div class="page-actions">' +
        button("Сбросить прогресс", "danger", { action: "reset-progress" }) +
        "</div>",
    );
  }

  function renderGamePage() {
    if (!state.game) {
      return renderSection(
        "Игра не запущена",
        "Сначала выберите режим, категорию и уровень.",
        button("К режимам", "primary", { action: "navigate", route: "modes" }),
      );
    }

    const prompt = getPrompt();
    const showTimer = state.game.phase === "ask" && Boolean(state.game.roundConfig.answerTimeLimitMs);
    const remainingSeconds = Math.ceil((state.game.remainingMs || 0) / 1000);
    const options = unique(
      getCategoryPool(state.game.categoryId).map(function (entry) {
        return entry.value;
      }),
    );
    const correctAnswer = state.game.sequence[state.game.currentQuestionIndex];
    const needsConfirmButton =
      state.game.phase === "preview-ready" || state.game.phase === "reveal-ready";
    const spotlightVisible =
      state.game.phase === "reveal" || state.game.phase === "reveal-ready";

    return (
      renderSection(
        "Игровая сессия",
        prompt.body,
        '<div class="question-badges">' +
          chip("Фаза", prompt.badge) +
          chip("Жизни", repeatHeart(state.game.livesLeft)) +
          chip("Счёт", String(state.game.score)) +
          chip("Серия", String(state.game.streak)) +
          chip(
            state.game.mode === "levels" ? "Уровень" : "Блок",
            state.game.mode === "levels"
              ? String(state.game.levelId || 1)
              : String(state.game.blocksCleared + 1),
          ) +
          (showTimer ? chip("Осталось", remainingSeconds + "с") : "") +
          "</div>" +
          '<div class="lane">' +
          '<div class="status-bar"><div><div class="card__eyebrow">Подсказка</div><h3 class="card__title">' +
          prompt.title +
          '</h3></div><div class="tiny">' +
          getCategoryDefinition(state.game.categoryId).title +
          "</div></div>" +
          '<div class="lane__track">' +
          state.game.sequence
            .map(function (item, index) {
              return renderLaneCell(item, index);
            })
            .join("") +
          "</div>" +
          (spotlightVisible
            ? '<div class="spotlight"><div class="card__eyebrow">Новый смайлик</div><div class="spotlight__emoji">' +
              state.game.pendingRevealValue +
              '</div><p class="card__text">Запомните этот символ, затем нажмите «Готов».</p></div>'
            : "") +
          (needsConfirmButton
            ? '<div class="page-actions">' +
              button("Готов", "primary", { action: "confirm-phase" }) +
              "</div>"
            : "") +
          '<div class="emoji-panel__wrap"><div class="card__eyebrow">Панель смайликов категории</div><div class="emoji-panel">' +
          options
            .map(function (option) {
              const classes = ["option"];
              if (state.game.highlightedOption === option) {
                classes.push(option === correctAnswer ? "is-correct" : "is-wrong");
              }

              return (
                '<button class="' +
                classes.join(" ") +
                '" data-action="start-option" data-value="' +
                escapeAttribute(option) +
                '" ' +
                (state.game.phase === "ask" ? "" : "disabled") +
                ">" +
                option +
                "</button>"
              );
            })
            .join("") +
          "</div></div>" +
          '<div class="page-actions">' +
          button("Домой", "ghost", { action: "navigate", route: "home" }) +
          button("Начать заново", "secondary", { action: "restart-game" }) +
          "</div>" +
          "</div>",
      )
    );
  }

  function renderResultPage() {
    if (!state.result) {
      return renderSection(
        "Нет результата",
        "Сыграйте один раунд, и здесь появится итоги.",
        button("К режимам", "primary", { action: "navigate", route: "modes" }),
      );
    }

    const hasNextLevel =
      state.result.mode === "levels" &&
      (state.result.levelId || 1) < LEVEL_DEFINITIONS.length &&
      (state.result.levelId || 1) + 1 <= state.progress.progress.unlockedLevel;

    return renderSection(
      state.result.outcome === "level-complete" ? "Уровень пройден" : "Забег завершён",
      state.result.mode === "levels"
        ? "Результат уровня " + state.result.levelId
        : "Очищено блоков: " + state.result.blocksCleared,
      '<div class="result-board">' +
        '<div class="card__eyebrow">Итог</div>' +
        '<div class="result-score">' +
        state.result.score +
        '</div>' +
        '<div class="cards-3">' +
        tile("Лучший счёт", String(state.result.bestScore)) +
        tile("Режим", state.result.mode === "levels" ? "Уровни" : "Endless") +
        tile("Категория", getCategoryDefinition(state.result.categoryId).title) +
        "</div>" +
        '<div class="result-actions">' +
        (hasNextLevel
          ? button("Следующий уровень", "primary", { action: "continue-level" })
          : "") +
        button("Сыграть снова", "primary", { action: "restart-game" }) +
        button("Домой", "secondary", { action: "navigate", route: "home" }) +
        button("Прогресс", "ghost", { action: "navigate", route: "progress" }) +
        "</div>" +
        "</div>",
    );
  }

  function renderSection(title, subtitle, content, actionMarkup) {
    return (
      '<section class="section">' +
      '<div class="section__header"><div><h2 class="section__title">' +
      title +
      '</h2><p class="section__subtitle">' +
      subtitle +
      "</p></div>" +
      (actionMarkup || "") +
      "</div>" +
      content +
      "</section>"
    );
  }

  function renderModeCard(mode, title, description, eyebrow) {
    return (
      '<div class="mode-card">' +
      '<div class="card__eyebrow">' +
      eyebrow +
      '</div><h3 class="card__title">' +
      title +
      '</h3><p class="card__text">' +
      description +
      '</p><div class="page-actions">' +
      button("Выбрать", "primary", { action: "set-mode", mode: mode }) +
      "</div></div>"
    );
  }

  function renderCategoryCard(category) {
    return (
      '<div class="category-card">' +
      '<div class="category-card__head"><div class="category-card__icon">' +
      category.icon +
      '</div><div><div class="card__eyebrow">' +
      (state.selectedMode === "levels" ? "Уровни" : "Endless") +
      '</div><h3 class="card__title">' +
      category.title +
      '</h3></div></div><p class="card__text">' +
      category.description +
      '</p><div class="card__preview">' +
      getCategoryPool(category.id)
        .slice(0, 8)
        .map(function (item) {
          return item.value;
        })
        .join(" ") +
      '</div><div class="page-actions">' +
      button(state.selectedMode === "levels" ? "К уровням" : "Начать", "primary", {
        action: "set-category",
        category: category.id,
      }) +
      "</div></div>"
    );
  }

  function renderLevelCard(level) {
    const unlocked = level.id <= state.progress.progress.unlockedLevel;
    const completed = state.progress.progress.completedLevels.includes(level.id);

    return (
      '<div class="level-card ' +
      (unlocked ? "" : "level-card--locked") +
      '">' +
      '<div class="card__eyebrow">' +
      (completed ? "Пройден" : unlocked ? "Открыт" : "Закрыт") +
      '</div><h3 class="card__title">' +
      level.title +
      '</h3><p class="card__text">' +
      level.description +
      '</p><div class="level-card__meta"><span>Ряд: ' +
      level.sequenceLength +
      "</span><span>Окно: " +
      level.previewWindow +
      "</span><span>Варианты: " +
      level.optionCount +
      "</span></div><div class=\"page-actions\">" +
      button(unlocked ? "Начать" : "Нужно пройти раньше", unlocked ? "primary" : "ghost", {
        action: "choose-level",
        level: String(level.id),
        locked: unlocked ? "false" : "true",
      }) +
      "</div></div>"
    );
  }

  function renderLaneCell(item, index) {
    const initialPreviewVisible = index < state.game.roundConfig.previewWindow;
    const isPreview =
      (state.game.phase === "preview" || state.game.phase === "preview-ready") &&
      initialPreviewVisible;
    const isResolved = state.game.resolvedIndexes.includes(index);
    const isVisible = isResolved || isPreview;
    const isActiveQuestion = index === state.game.currentQuestionIndex && state.game.phase === "ask";

    const classes = ["lane-cell"];
    if (isResolved) {
      classes.push("is-resolved");
    }
    if (isActiveQuestion) {
      classes.push("is-active");
    }

    return (
      '<div class="' +
      classes.join(" ") +
      '">' +
      (isVisible
        ? '<div class="lane-cell__emoji">' + item + "</div>"
        : '<div class="lane-cell__cover">?</div>') +
      "</div>"
    );
  }

  function getPrompt() {
    if (!state.game) {
      return { title: "", body: "", badge: "" };
    }

    if (state.game.phase === "preview") {
      return {
        title: "Запомни ряд",
        body: "Сейчас открыт стартовый фрагмент последовательности.",
        badge: "Показ",
      };
    }
    if (state.game.phase === "preview-ready") {
      return {
        title: "Готовы начать ход?",
        body: "Нажмите «Готов», и стартовые смайлики закроются. После этого нужно будет угадать первый скрытый смайлик.",
        badge: "Готов",
      };
    }
    if (state.game.phase === "ask") {
      return {
        title: "Что было под позицией " + (state.game.currentQuestionIndex + 1) + "?",
        body: "Выбери правильный эмодзи для текущей скрытой позиции.",
        badge: "Ответ",
      };
    }
    if (state.game.phase === "answer-correct") {
      return {
        title: "Верно",
        body: "Шаг подтверждён.",
        badge: "Готово",
      };
    }
    if (state.game.phase === "reveal" || state.game.phase === "reveal-ready") {
      return {
        title: "Запомни новый смайлик",
        body: "Новый символ показан в центре. Когда запомните его, нажмите «Готов».",
        badge: "Новый",
      };
    }
    if (state.game.phase === "answer-wrong") {
      return {
        title: "Попробуй ещё",
        body: "Снимается одна жизнь, но если они ещё остались, вопрос повторится.",
        badge: "Ошибка",
      };
    }
    if (state.game.phase === "level-complete") {
      return {
        title: "Блок завершён",
        body: "Последовательность пройдена полностью.",
        badge: "Победа",
      };
    }

    return {
      title: "Забег завершён",
      body: "Попробуйте ещё раз и побейте свой прошлый рекорд.",
      badge: "Финиш",
    };
  }

  function getCategoryDefinition(categoryId) {
    return (
      CATEGORY_DEFINITIONS.find(function (item) {
        return item.id === categoryId;
      }) || CATEGORY_DEFINITIONS[0]
    );
  }

  function getCategoryPool(categoryId) {
    if (categoryId === "mixed") {
      return CATEGORY_DEFINITIONS.filter(function (category) {
        return category.id !== "mixed";
      }).flatMap(function (category) {
        return category.emoji;
      });
    }

    return getCategoryDefinition(categoryId).emoji;
  }

  function getLevelDefinition(id) {
    return (
      LEVEL_DEFINITIONS.find(function (level) {
        return level.id === id;
      }) || LEVEL_DEFINITIONS[0]
    );
  }

  function loadFromStorage(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? Object.assign(clone(fallback), JSON.parse(raw)) : clone(fallback);
    } catch (error) {
      return clone(fallback);
    }
  }

  function saveToStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Ignore storage errors to keep the standalone file usable in restrictive contexts.
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function hashSequence(sequence) {
    return sequence.join("");
  }

  function unique(values) {
    return Array.from(new Set(values));
  }

  function shuffle(values, rng) {
    const next = values.slice();
    for (let index = next.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(rng() * (index + 1));
      const temp = next[index];
      next[index] = next[swapIndex];
      next[swapIndex] = temp;
    }
    return next;
  }

  function mulberry32(seed) {
    let value = seed >>> 0;
    return function () {
      value += 0x6d2b79f5;
      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function escapeAttribute(value) {
    return String(value).replace(/"/g, "&quot;");
  }

  function repeatHeart(count) {
    if (count <= 0) {
      return "0";
    }
    return "❤".repeat(count);
  }

  function button(label, variant, dataset) {
    const attrs = Object.keys(dataset || {})
      .map(function (key) {
        return "data-" + camelToKebab(key) + '="' + escapeAttribute(dataset[key]) + '"';
      })
      .join(" ");
    return '<button class="btn btn--' + variant + '" ' + attrs + ">" + label + "</button>";
  }

  function navButton(label, route) {
    return (
      '<button data-action="navigate" data-route="' +
      route +
      '" class="' +
      (state.route === route ? "is-active" : "") +
      '">' +
      label +
      "</button>"
    );
  }

  function tile(label, value) {
    return (
      '<div class="tile"><div class="tile__label">' +
      label +
      '</div><div class="tile__value">' +
      value +
      "</div></div>"
    );
  }

  function chip(label, value) {
    return '<div class="chip"><span>' + label + ':</span> <strong>' + value + "</strong></div>";
  }

  function settingRow(title, description, key, enabled) {
    return (
      '<div class="setting-row"><div><h3 class="card__title" style="font-size:20px;">' +
      title +
      '</h3><p class="card__text">' +
      description +
      '</p></div><div class="toggle"><button class="toggle__button ' +
      (enabled ? "is-on" : "") +
      '" data-action="toggle-setting" data-setting="' +
      key +
      '"></button><span>' +
      (enabled ? "вкл" : "выкл") +
      "</span></div></div>"
    );
  }

  function camelToKebab(value) {
    return value.replace(/[A-Z]/g, function (match) {
      return "-" + match.toLowerCase();
    });
  }
})();
