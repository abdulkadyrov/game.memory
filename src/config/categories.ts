import { CategoryDefinition, EmojiDefinition } from '@/types/game';

const animals: EmojiDefinition[] = [
  { id: 'dog', value: '🐶', tags: ['animal', 'pet'], similarityTier: 1 },
  { id: 'cat', value: '🐱', tags: ['animal', 'pet'], similarityTier: 1 },
  { id: 'fox', value: '🦊', tags: ['animal', 'forest'], similarityTier: 1 },
  { id: 'koala', value: '🐨', tags: ['animal', 'forest'], similarityTier: 1 },
  { id: 'panda', value: '🐼', tags: ['animal', 'forest'], similarityTier: 1 },
  { id: 'lion', value: '🦁', tags: ['animal', 'wild'], similarityTier: 1 },
  { id: 'tiger', value: '🐯', tags: ['animal', 'wild'], similarityTier: 2 },
  { id: 'bear', value: '🐻', tags: ['animal', 'forest'], similarityTier: 2 },
  { id: 'rabbit', value: '🐰', tags: ['animal', 'pet'], similarityTier: 1 },
  { id: 'mouse', value: '🐭', tags: ['animal', 'small'], similarityTier: 2 },
  { id: 'hamster', value: '🐹', tags: ['animal', 'small'], similarityTier: 3 },
  { id: 'monkey', value: '🐵', tags: ['animal', 'jungle'], similarityTier: 2 },
];

const plants: EmojiDefinition[] = [
  { id: 'tree', value: '🌳', tags: ['plant', 'green'], similarityTier: 1 },
  { id: 'palm', value: '🌴', tags: ['plant', 'tree'], similarityTier: 1 },
  { id: 'cactus', value: '🌵', tags: ['plant', 'desert'], similarityTier: 1 },
  { id: 'flower', value: '🌸', tags: ['plant', 'flower'], similarityTier: 1 },
  { id: 'tulip', value: '🌷', tags: ['plant', 'flower'], similarityTier: 2 },
  { id: 'rose', value: '🌹', tags: ['plant', 'flower'], similarityTier: 2 },
  { id: 'sunflower', value: '🌻', tags: ['plant', 'flower'], similarityTier: 1 },
  { id: 'leaf', value: '🍃', tags: ['plant', 'leaf'], similarityTier: 2 },
  { id: 'clover', value: '🍀', tags: ['plant', 'leaf'], similarityTier: 2 },
  { id: 'seedling', value: '🌱', tags: ['plant', 'green'], similarityTier: 2 },
  { id: 'mushroom', value: '🍄', tags: ['plant', 'forest'], similarityTier: 3 },
  { id: 'maple', value: '🍁', tags: ['plant', 'leaf'], similarityTier: 3 },
];

const hearts: EmojiDefinition[] = [
  { id: 'yellow-heart', value: '💛', tags: ['heart', 'emotion'], similarityTier: 1 },
  { id: 'green-heart', value: '💚', tags: ['heart', 'emotion'], similarityTier: 1 },
  { id: 'blue-heart', value: '💙', tags: ['heart', 'emotion'], similarityTier: 1 },
  { id: 'purple-heart', value: '💜', tags: ['heart', 'emotion'], similarityTier: 2 },
  { id: 'orange-heart', value: '🧡', tags: ['heart', 'emotion'], similarityTier: 2 },
  { id: 'sparkle-heart', value: '💖', tags: ['heart', 'emotion'], similarityTier: 2 },
  { id: 'growing-heart', value: '💗', tags: ['heart', 'emotion'], similarityTier: 3 },
  { id: 'revolving-heart', value: '💞', tags: ['heart', 'emotion'], similarityTier: 3 },
  { id: 'heart-eyes', value: '😍', tags: ['emotion', 'face'], similarityTier: 2 },
  { id: 'smile', value: '😊', tags: ['emotion', 'face'], similarityTier: 1 },
  { id: 'party', value: '🥳', tags: ['emotion', 'face'], similarityTier: 1 },
  { id: 'wink', value: '😉', tags: ['emotion', 'face'], similarityTier: 2 },
];

const hands: EmojiDefinition[] = [
  { id: 'thumbs-up', value: '👍', tags: ['hand', 'gesture'], similarityTier: 1 },
  { id: 'peace', value: '✌️', tags: ['hand', 'gesture'], similarityTier: 1 },
  { id: 'wave', value: '👋', tags: ['hand', 'gesture'], similarityTier: 1 },
  { id: 'clap', value: '👏', tags: ['hand', 'gesture'], similarityTier: 1 },
  { id: 'ok-hand', value: '👌', tags: ['hand', 'gesture'], similarityTier: 2 },
  { id: 'raised-hand', value: '✋', tags: ['hand', 'gesture'], similarityTier: 2 },
  { id: 'muscle', value: '💪', tags: ['hand', 'gesture'], similarityTier: 1 },
  { id: 'rock', value: '🤘', tags: ['hand', 'gesture'], similarityTier: 2 },
  { id: 'point-up', value: '☝️', tags: ['hand', 'gesture'], similarityTier: 2 },
  { id: 'point-right', value: '👉', tags: ['hand', 'gesture'], similarityTier: 2 },
  { id: 'point-left', value: '👈', tags: ['hand', 'gesture'], similarityTier: 3 },
  { id: 'crossed-fingers', value: '🤞', tags: ['hand', 'gesture'], similarityTier: 3 },
];

const food: EmojiDefinition[] = [
  { id: 'apple', value: '🍎', tags: ['food', 'fruit'], similarityTier: 1 },
  { id: 'banana', value: '🍌', tags: ['food', 'fruit'], similarityTier: 1 },
  { id: 'orange', value: '🍊', tags: ['food', 'fruit'], similarityTier: 1 },
  { id: 'grapes', value: '🍇', tags: ['food', 'fruit'], similarityTier: 1 },
  { id: 'watermelon', value: '🍉', tags: ['food', 'fruit'], similarityTier: 2 },
  { id: 'strawberry', value: '🍓', tags: ['food', 'fruit'], similarityTier: 2 },
  { id: 'carrot', value: '🥕', tags: ['food', 'vegetable'], similarityTier: 1 },
  { id: 'corn', value: '🌽', tags: ['food', 'vegetable'], similarityTier: 1 },
  { id: 'pizza', value: '🍕', tags: ['food', 'meal'], similarityTier: 1 },
  { id: 'burger', value: '🍔', tags: ['food', 'meal'], similarityTier: 2 },
  { id: 'cake', value: '🍰', tags: ['food', 'dessert'], similarityTier: 2 },
  { id: 'cookie', value: '🍪', tags: ['food', 'dessert'], similarityTier: 3 },
];

const weather: EmojiDefinition[] = [
  { id: 'sun', value: '☀️', tags: ['weather', 'sky'], similarityTier: 1 },
  { id: 'cloud', value: '☁️', tags: ['weather', 'sky'], similarityTier: 1 },
  { id: 'rain', value: '🌧️', tags: ['weather', 'sky'], similarityTier: 1 },
  { id: 'snow', value: '❄️', tags: ['weather', 'sky'], similarityTier: 1 },
  { id: 'lightning', value: '⚡', tags: ['weather', 'sky'], similarityTier: 1 },
  { id: 'rainbow', value: '🌈', tags: ['weather', 'sky'], similarityTier: 1 },
  { id: 'moon', value: '🌙', tags: ['weather', 'night'], similarityTier: 2 },
  { id: 'star', value: '⭐', tags: ['weather', 'night'], similarityTier: 2 },
  { id: 'tornado', value: '🌪️', tags: ['weather', 'wind'], similarityTier: 2 },
  { id: 'fog', value: '🌫️', tags: ['weather', 'sky'], similarityTier: 3 },
  { id: 'droplet', value: '💧', tags: ['weather', 'water'], similarityTier: 2 },
  { id: 'snowman', value: '⛄', tags: ['weather', 'winter'], similarityTier: 3 },
];

const objects: EmojiDefinition[] = [
  { id: 'book', value: '📘', tags: ['object', 'study'], similarityTier: 1 },
  { id: 'gift', value: '🎁', tags: ['object', 'party'], similarityTier: 1 },
  { id: 'balloon', value: '🎈', tags: ['object', 'party'], similarityTier: 1 },
  { id: 'clock', value: '⏰', tags: ['object', 'time'], similarityTier: 1 },
  { id: 'camera', value: '📷', tags: ['object', 'tech'], similarityTier: 1 },
  { id: 'phone', value: '📱', tags: ['object', 'tech'], similarityTier: 2 },
  { id: 'headphones', value: '🎧', tags: ['object', 'tech'], similarityTier: 2 },
  { id: 'lamp', value: '💡', tags: ['object', 'home'], similarityTier: 1 },
  { id: 'key', value: '🔑', tags: ['object', 'home'], similarityTier: 2 },
  { id: 'umbrella', value: '☂️', tags: ['object', 'weather'], similarityTier: 2 },
  { id: 'pencil', value: '✏️', tags: ['object', 'study'], similarityTier: 2 },
  { id: 'scissors', value: '✂️', tags: ['object', 'study'], similarityTier: 3 },
];

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    id: 'animals',
    icon: '🐾',
    title: 'Животные',
    description: 'Простые и легко различимые звери для мягкого старта.',
    emoji: animals,
  },
  {
    id: 'plants',
    icon: '🌿',
    title: 'Растения',
    description: 'Деревья, цветы и листья с постепенным ростом похожести.',
    emoji: plants,
  },
  {
    id: 'hearts',
    icon: '💛',
    title: 'Сердечки и эмоции',
    description: 'Эмоциональные символы и лица с цветовой путаницей на высоких уровнях.',
    emoji: hearts,
  },
  {
    id: 'hands',
    icon: '🤲',
    title: 'Руки и жесты',
    description: 'Чёткие формы жестов, которые хорошо подходят для тренировки внимания.',
    emoji: hands,
  },
  {
    id: 'food',
    icon: '🍎',
    title: 'Еда',
    description: 'Фрукты, овощи и знакомые блюда с разной визуальной плотностью.',
    emoji: food,
  },
  {
    id: 'weather',
    icon: '⛅',
    title: 'Погода',
    description: 'Солнце, тучи, ветер и ночь для спокойного визуального ритма.',
    emoji: weather,
  },
  {
    id: 'objects',
    icon: '🎒',
    title: 'Предметы',
    description: 'Повседневные объекты и техника для более нейтральной темы.',
    emoji: objects,
  },
  {
    id: 'mixed',
    icon: '✨',
    title: 'Смешанная',
    description: 'Разные категории в одном забеге для максимальной вариативности.',
    emoji: [],
  },
];

export function getCategoryDefinition(categoryId: CategoryDefinition['id']) {
  return (
    CATEGORY_DEFINITIONS.find((item) => item.id === categoryId) ?? CATEGORY_DEFINITIONS[0]
  );
}

export function getCategoryPool(categoryId: CategoryDefinition['id']) {
  if (categoryId === 'mixed') {
    return CATEGORY_DEFINITIONS.filter((category) => category.id !== 'mixed')
      .flatMap((category) => category.emoji);
  }

  return getCategoryDefinition(categoryId).emoji;
}

