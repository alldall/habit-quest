'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/components/GameProvider';
import { STAT_TYPES, DIFFICULTY_LEVELS, DEFAULT_DIFFICULTY } from '@/lib/constants';
import { calculateStreak, getXpForCompletion } from '@/lib/gameEngine';
import HabitModal from '@/components/habits/HabitModal';
import RewardPopup from '@/components/habits/RewardPopup';
import styles from './page.module.scss';

export default function HabitsPage() {
  const {
    habits,
    completions,
    isLoaded,
    toggleHabit,
    addHabit,
    updateHabit,
    deleteHabit,
    isHabitCompletedToday,
    getHabitStreak,
    rewardEvent,
    clearRewardEvent,
  } = useGame();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  if (!isLoaded) return null;

  const handleSave = (habitData) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    } else {
      addHabit(habitData);
    }
    setModalOpen(false);
    setEditingHabit(null);
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteHabit(id);
    setModalOpen(false);
    setEditingHabit(null);
  };

  const completedCount = habits.filter((h) => isHabitCompletedToday(h.id)).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Привычки</h1>
          <p className={styles.subtitle}>
            Выполнено сегодня: {completedCount}/{habits.length}
          </p>
        </div>
        <button
          className={styles.addButton}
          onClick={() => {
            setEditingHabit(null);
            setModalOpen(true);
          }}
        >
          + Добавить
        </button>
      </div>

      <div className={styles.list}>
        <AnimatePresence>
          {habits.map((habit) => {
            const completed = isHabitCompletedToday(habit.id);
            const streak = getHabitStreak(habit.id);
            const stat = STAT_TYPES[habit.stat];
            const diff = DIFFICULTY_LEVELS[habit.difficulty || DEFAULT_DIFFICULTY];
            const xpGain = getXpForCompletion(streak, habit.difficulty);

            return (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`${styles.habitCard} ${completed ? styles.completed : ''}`}
                style={{ '--stat-color': stat.color }}
              >
                <button
                  className={styles.checkbox}
                  onClick={() => toggleHabit(habit.id)}
                  aria-label={completed ? 'Отменить' : 'Выполнить'}
                >
                  <motion.div
                    className={styles.checkInner}
                    animate={{
                      scale: completed ? 1 : 0,
                      backgroundColor: completed ? stat.color : 'transparent',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {completed && '✓'}
                  </motion.div>
                </button>

                <div className={styles.habitInfo} onClick={() => handleEdit(habit)}>
                  <div className={styles.habitTop}>
                    <span className={styles.habitIcon}>{habit.icon}</span>
                    <span className={styles.habitName}>{habit.name}</span>
                  </div>
                  <div className={styles.habitMeta}>
                    <span
                      className={styles.statBadge}
                      style={{ color: stat.color, borderColor: stat.color }}
                    >
                      {stat.icon} {stat.name}
                    </span>
                    <span
                      className={styles.diffBadge}
                      style={{ color: diff.color, borderColor: diff.color }}
                      title={`×${diff.multiplier} XP`}
                    >
                      {diff.icon} {diff.name}
                    </span>
                    {streak > 0 && (
                      <span className={styles.streak}>
                        🔥 {streak} {streak >= 7 ? '(x1.5)' : ''}
                      </span>
                    )}
                    <span className={styles.xp}>+{xpGain} XP</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {habits.length === 0 && (
        <div className={styles.empty}>
          <p>Пока нет привычек</p>
          <p>Нажми &quot;+ Добавить&quot; чтобы создать первую</p>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <HabitModal
            habit={editingHabit}
            onSave={handleSave}
            onDelete={editingHabit ? () => handleDelete(editingHabit.id) : null}
            onClose={() => {
              setModalOpen(false);
              setEditingHabit(null);
            }}
          />
        )}
      </AnimatePresence>

      <RewardPopup event={rewardEvent} onDone={clearRewardEvent} />
    </div>
  );
}
