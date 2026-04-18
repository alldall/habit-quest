import { XP_PER_COMPLETION, XP_PER_LEVEL, STREAK_MULTIPLIER, STREAK_MULTIPLIER_THRESHOLD, MAX_LEVEL } from './constants';

export function getDateKey(date = new Date()) {
  return date.toISOString().split('T')[0];
}

export function calculateLevel(xp) {
  return Math.min(Math.floor(xp / XP_PER_LEVEL) + 1, MAX_LEVEL);
}

export function calculateXpProgress(xp) {
  const currentLevelXp = xp % XP_PER_LEVEL;
  return (currentLevelXp / XP_PER_LEVEL) * 100;
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

export function getXpForCompletion(streak) {
  const multiplier = streak >= STREAK_MULTIPLIER_THRESHOLD ? STREAK_MULTIPLIER : 1;
  return Math.floor(XP_PER_COMPLETION * multiplier);
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
        stats[habit.stat].xp += XP_PER_COMPLETION;
      }
    });
  });

  Object.keys(stats).forEach((key) => {
    stats[key].level = calculateLevel(stats[key].xp);
  });

  return stats;
}

export function getOverallLevel(stats) {
  const totalLevels = Object.values(stats).reduce((sum, s) => sum + s.level, 0);
  return Math.floor(totalLevels / 4);
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
