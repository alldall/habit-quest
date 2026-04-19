export const STAT_TYPES = {
  strength: {
    key: 'strength',
    name: 'Сила',
    icon: '⚔️',
    color: '#ef4444',
    description: 'Тренировки, спорт, физическая активность',
    worldEffect: 'Деревья растут на острове',
  },
  intellect: {
    key: 'intellect',
    name: 'Интеллект',
    icon: '📚',
    color: '#3b82f6',
    description: 'Чтение, учёба, развитие навыков',
    worldEffect: 'Кристаллы появляются, свет ярче',
  },
  health: {
    key: 'health',
    name: 'Здоровье',
    icon: '💚',
    color: '#10b981',
    description: 'Вода, сон, правильное питание',
    worldEffect: 'Трава зеленеет, цветы распускаются',
  },
  spirit: {
    key: 'spirit',
    name: 'Дух',
    icon: '✨',
    color: '#a78bfa',
    description: 'Медитация, дневник, рефлексия',
    worldEffect: 'Небо меняется, звёзды появляются',
  },
};

export const XP_PER_COMPLETION = 10;
export const STREAK_MULTIPLIER_THRESHOLD = 7;
export const STREAK_MULTIPLIER = 1.5;
export const MAX_LEVEL = 50;

export const DIFFICULTY_LEVELS = {
  easy: {
    key: 'easy',
    name: 'Лёгкая',
    icon: '🟢',
    multiplier: 0.6,
    color: '#10b981',
  },
  normal: {
    key: 'normal',
    name: 'Обычная',
    icon: '🟡',
    multiplier: 1.0,
    color: '#f59e0b',
  },
  hard: {
    key: 'hard',
    name: 'Сложная',
    icon: '🟠',
    multiplier: 1.8,
    color: '#fb923c',
  },
  epic: {
    key: 'epic',
    name: 'Эпичная',
    icon: '🔴',
    multiplier: 3.0,
    color: '#ef4444',
  },
};

export const DEFAULT_DIFFICULTY = 'normal';

export const DEFAULT_HABITS = [
  {
    id: '1',
    name: 'Тренировка',
    icon: '🏋️',
    stat: 'strength',
    difficulty: 'hard',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Чтение 30 минут',
    icon: '📖',
    stat: 'intellect',
    difficulty: 'normal',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Выпить 2л воды',
    icon: '💧',
    stat: 'health',
    difficulty: 'easy',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Медитация',
    icon: '🧘',
    stat: 'spirit',
    difficulty: 'normal',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
  },
];

export const HABIT_ICONS = [
  '🏋️', '🏃', '🚴', '🧘', '📖', '📝', '💧', '🥗',
  '😴', '🎯', '💻', '🎨', '🎵', '🧹', '📱', '🚫',
  '☀️', '🌙', '🧠', '💪', '🍎', '🥤', '📚', '✍️',
];
