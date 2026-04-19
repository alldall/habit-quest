'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
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
  const [rewardEvent, setRewardEvent] = useState(null);
  const prevStatsRef = useRef(null);

  const isLoaded = habitsLoaded && completionsLoaded;

  const stats = useMemo(() => calculateStats(habits, completions), [habits, completions]);
  const overallLevel = useMemo(() => getOverallLevel(stats), [stats]);
  const todayProgress = useMemo(() => getTodayProgress(habits, completions), [habits, completions]);

  const toggleHabit = useCallback((habitId) => {
    const today = getDateKey();
    const todayList = completions[today] || [];
    const wasCompleted = todayList.includes(habitId);

    if (!wasCompleted) {
      // Calculate reward info before toggling
      const habit = habits.find((h) => h.id === habitId);
      const streak = calculateStreak(completions, habitId);
      const xp = getXpForCompletion(streak, habit?.difficulty);

      // Snapshot current levels
      const prevStats = calculateStats(habits, completions);
      const prevOverall = getOverallLevel(prevStats);

      setCompletions((prev) => {
        const list = prev[today] || [];
        return { ...prev, [today]: [...list, habitId] };
      });

      // Check for level-up after state update (use timeout to read new state)
      setTimeout(() => {
        const newCompletions = { ...completions, [today]: [...todayList, habitId] };
        const newStats = calculateStats(habits, newCompletions);
        const newOverall = getOverallLevel(newStats);

        const leveledUp = newOverall > prevOverall;
        const statLevelUps = [];
        Object.keys(newStats).forEach((key) => {
          if (newStats[key].level > prevStats[key].level) {
            statLevelUps.push(key);
          }
        });

        setRewardEvent({
          habitId,
          xp,
          streak: streak + 1,
          stat: habit?.stat,
          leveledUp,
          newLevel: newOverall,
          statLevelUps,
          timestamp: Date.now(),
        });
      }, 50);
    } else {
      setCompletions((prev) => {
        const list = prev[today] || [];
        return { ...prev, [today]: list.filter((id) => id !== habitId) };
      });
    }
  }, [completions, habits, setCompletions]);

  const clearRewardEvent = useCallback(() => {
    setRewardEvent(null);
  }, []);

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
    rewardEvent,
    clearRewardEvent,
    toggleHabit,
    addHabit,
    updateHabit,
    deleteHabit,
    isHabitCompletedToday,
    getHabitStreak,
  };
}
