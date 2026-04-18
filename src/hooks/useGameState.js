'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_HABITS } from '@/lib/constants';
import {
  getDateKey,
  calculateStats,
  getOverallLevel,
  calculateStreak,
  getXpForCompletion,
  getTodayProgress,
} from '@/lib/gameEngine';

export function useGameState() {
  const [habits, setHabits, habitsLoaded] = useLocalStorage('hq-habits', DEFAULT_HABITS);
  const [completions, setCompletions, completionsLoaded] = useLocalStorage('hq-completions', {});

  const isLoaded = habitsLoaded && completionsLoaded;

  const toggleHabit = useCallback((habitId) => {
    const today = getDateKey();
    setCompletions((prev) => {
      const todayList = prev[today] || [];
      const isCompleted = todayList.includes(habitId);

      return {
        ...prev,
        [today]: isCompleted
          ? todayList.filter((id) => id !== habitId)
          : [...todayList, habitId],
      };
    });
  }, [setCompletions]);

  const addHabit = useCallback((habit) => {
    const newHabit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);
    return newHabit;
  }, [setHabits]);

  const updateHabit = useCallback((id, updates) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
    );
  }, [setHabits]);

  const deleteHabit = useCallback((id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, [setHabits]);

  const isHabitCompletedToday = useCallback((habitId) => {
    const today = getDateKey();
    return (completions[today] || []).includes(habitId);
  }, [completions]);

  const stats = useMemo(() => calculateStats(habits, completions), [habits, completions]);
  const overallLevel = useMemo(() => getOverallLevel(stats), [stats]);
  const todayProgress = useMemo(() => getTodayProgress(habits, completions), [habits, completions]);

  const getHabitStreak = useCallback((habitId) => {
    return calculateStreak(completions, habitId);
  }, [completions]);

  return {
    habits,
    completions,
    stats,
    overallLevel,
    todayProgress,
    isLoaded,
    toggleHabit,
    addHabit,
    updateHabit,
    deleteHabit,
    isHabitCompletedToday,
    getHabitStreak,
  };
}
