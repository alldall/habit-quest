import {
  XP_PER_COMPLETION,
  STREAK_MULTIPLIER,
  STREAK_MULTIPLIER_THRESHOLD,
  MAX_LEVEL,
  DIFFICULTY_LEVELS,
  DEFAULT_DIFFICULTY,
} from './constants';

function difficultyMultiplier(difficulty) {
  return DIFFICULTY_LEVELS[difficulty || DEFAULT_DIFFICULTY]?.multiplier ?? 1;
}

export function getDateKey(date = new Date()) {
  return date.toISOString().split('T')[0];
}

// Progressive XP: early levels are fast, later levels require more
export function getXpForLevel(level) {
  return 30 + level * 20;
}

export function getTotalXpForLevel(level) {
  if (level <= 1) return 0;
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXpForLevel(i);
  }
  return total;
}

export function calculateLevel(xp) {
  let level = 1;
  let accumulated = 0;
  while (level < MAX_LEVEL) {
    accumulated += getXpForLevel(level);
    if (xp < accumulated) break;
    level++;
  }
  return level;
}

export function calculateXpProgress(xp) {
  const level = calculateLevel(xp);
  const xpAtCurrentLevel = getTotalXpForLevel(level);
  const xpNeeded = getXpForLevel(level);
  const current = xp - xpAtCurrentLevel;
  return {
    current,
    needed: xpNeeded,
    percentage: Math.min((current / xpNeeded) * 100, 100),
  };
}

export function calculateStreak(completions, habitId) {
  const today = new Date();
  let streak = 0;

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = getDateKey(date);

    if (completions[key]?.includes(habitId)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

export function calculateBestStreak(completions, habitId) {
  const dates = Object.keys(completions).sort();
  if (dates.length === 0) return 0;

  let bestStreak = 0;
  let currentStreak = 0;

  const startDate = new Date(dates[0]);
  const endDate = new Date(dates[dates.length - 1]);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = getDateKey(d);
    if (completions[key]?.includes(habitId)) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return bestStreak;
}

export function getXpForCompletion(streak, difficulty) {
  const streakMult = streak >= STREAK_MULTIPLIER_THRESHOLD ? STREAK_MULTIPLIER : 1;
  const diffMult = difficultyMultiplier(difficulty);
  return Math.floor(XP_PER_COMPLETION * streakMult * diffMult);
}

export function calculateStats(habits, completions) {
  const stats = {
    strength: { xp: 0, level: 1 },
    intellect: { xp: 0, level: 1 },
    health: { xp: 0, level: 1 },
    spirit: { xp: 0, level: 1 },
  };

  Object.entries(completions).forEach(([, habitIds]) => {
    habitIds.forEach((habitId) => {
      const habit = habits.find((h) => h.id === habitId);
      if (habit && stats[habit.stat]) {
        stats[habit.stat].xp += Math.floor(
          XP_PER_COMPLETION * difficultyMultiplier(habit.difficulty)
        );
      }
    });
  });

  Object.keys(stats).forEach((key) => {
    stats[key].level = calculateLevel(stats[key].xp);
  });

  return stats;
}

export function getOverallLevel(stats) {
  const totalXp = Object.values(stats).reduce((sum, s) => sum + s.xp, 0);
  return calculateLevel(totalXp);
}

export function getOverallXp(stats) {
  return Object.values(stats).reduce((sum, s) => sum + s.xp, 0);
}

export function getCompletionRate(completions, habitId, days = 30) {
  let completed = 0;
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = getDateKey(date);
    if (completions[key]?.includes(habitId)) {
      completed++;
    }
  }

  return Math.round((completed / days) * 100);
}

export function getTodayProgress(habits, completions) {
  const today = getDateKey();
  const todayCompletions = completions[today] || [];
  return {
    completed: todayCompletions.length,
    total: habits.length,
    percentage: habits.length > 0 ? Math.round((todayCompletions.length / habits.length) * 100) : 0,
  };
}
