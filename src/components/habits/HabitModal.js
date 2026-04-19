'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { STAT_TYPES, HABIT_ICONS, DIFFICULTY_LEVELS, DEFAULT_DIFFICULTY } from '@/lib/constants';
import styles from './HabitModal.module.scss';

export default function HabitModal({ habit, onSave, onDelete, onClose }) {
  const [name, setName] = useState(habit?.name || '');
  const [icon, setIcon] = useState(habit?.icon || '🎯');
  const [stat, setStat] = useState(habit?.stat || 'strength');
  const [difficulty, setDifficulty] = useState(habit?.difficulty || DEFAULT_DIFFICULTY);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), icon, stat, difficulty });
  };

  return (
    <>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <h2 className={styles.title}>
          {habit ? 'Редактировать' : 'Новая привычка'}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Название</label>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Тренировка"
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Иконка</label>
            <div className={styles.iconGrid}>
              {HABIT_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  className={`${styles.iconBtn} ${icon === ic ? styles.iconActive : ''}`}
                  onClick={() => setIcon(ic)}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Характеристика</label>
            <div className={styles.statGrid}>
              {Object.entries(STAT_TYPES).map(([key, s]) => (
                <button
                  key={key}
                  type="button"
                  className={`${styles.statBtn} ${stat === key ? styles.statActive : ''}`}
                  style={{
                    '--stat-color': s.color,
                    borderColor: stat === key ? s.color : 'transparent',
                  }}
                  onClick={() => setStat(key)}
                >
                  <span>{s.icon}</span>
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Сложность</label>
            <div className={styles.difficultyGrid}>
              {Object.values(DIFFICULTY_LEVELS).map((d) => (
                <button
                  key={d.key}
                  type="button"
                  className={`${styles.difficultyBtn} ${difficulty === d.key ? styles.difficultyActive : ''}`}
                  style={{
                    '--diff-color': d.color,
                    borderColor: difficulty === d.key ? d.color : 'transparent',
                  }}
                  onClick={() => setDifficulty(d.key)}
                >
                  <span className={styles.difficultyIcon}>{d.icon}</span>
                  <span className={styles.difficultyName}>{d.name}</span>
                  <span className={styles.difficultyMult}>×{d.multiplier}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            {onDelete && (
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={onDelete}
              >
                Удалить
              </button>
            )}
            <div className={styles.rightActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Отмена
              </button>
              <button type="submit" className={styles.saveBtn}>
                Сохранить
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </>
  );
}
