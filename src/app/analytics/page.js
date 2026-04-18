'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { useGame } from '@/components/GameProvider';
import { STAT_TYPES } from '@/lib/constants';
import { getDateKey, getCompletionRate, calculateStreak, calculateBestStreak } from '@/lib/gameEngine';
import HeatMap from '@/components/analytics/HeatMap';
import styles from './page.module.scss';

const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export default function AnalyticsPage() {
  const { habits, completions, isLoaded } = useGame();

  const weeklyData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = getDateKey(date);
      const count = completions[key]?.length || 0;

      data.push({
        day: WEEKDAYS[date.getDay()],
        date: `${date.getDate()}.${date.getMonth() + 1}`,
        completed: count,
        total: habits.length,
      });
    }

    return data;
  }, [completions, habits]);

  const monthlyData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = getDateKey(date);
      const count = completions[key]?.length || 0;
      const rate = habits.length > 0 ? Math.round((count / habits.length) * 100) : 0;

      data.push({
        date: `${date.getDate()}`,
        rate,
      });
    }

    return data;
  }, [completions, habits]);

  const habitStats = useMemo(() => {
    return habits.map((habit) => {
      const stat = STAT_TYPES[habit.stat];
      return {
        ...habit,
        stat,
        completionRate: getCompletionRate(completions, habit.id, 30),
        currentStreak: calculateStreak(completions, habit.id),
        bestStreak: calculateBestStreak(completions, habit.id),
      };
    });
  }, [habits, completions]);

  if (!isLoaded) return null;

  const customTooltipStyle = {
    backgroundColor: '#1a1a2e',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#f1f5f9',
    fontSize: '13px',
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Аналитика</h1>

      <div className={styles.grid}>
        {/* Heat map */}
        <motion.div
          className={styles.card}
          style={{ gridColumn: '1 / -1' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className={styles.cardTitle}>Активность за год</h2>
          <HeatMap completions={completions} totalHabits={habits.length} />
        </motion.div>

        {/* Weekly bar chart */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className={styles.cardTitle}>Неделя</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar
                dataKey="completed"
                fill="#7c3aed"
                radius={[4, 4, 0, 0]}
                name="Выполнено"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly line chart */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className={styles.cardTitle}>Completion Rate (30 дней)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} interval={4} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={customTooltipStyle} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Выполнение"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Per-habit stats */}
        <motion.div
          className={styles.card}
          style={{ gridColumn: '1 / -1' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={styles.cardTitle}>По привычкам</h2>
          <div className={styles.habitTable}>
            <div className={styles.tableHeader}>
              <span>Привычка</span>
              <span>Стат</span>
              <span>Rate (30д)</span>
              <span>Streak</span>
              <span>Лучший</span>
            </div>
            {habitStats.map((h) => (
              <div key={h.id} className={styles.tableRow}>
                <span className={styles.habitName}>
                  {h.icon} {h.name}
                </span>
                <span style={{ color: h.stat.color }}>{h.stat.name}</span>
                <span>
                  <div className={styles.miniBar}>
                    <div
                      className={styles.miniFill}
                      style={{
                        width: `${h.completionRate}%`,
                        background: h.completionRate >= 70 ? '#10b981' : h.completionRate >= 40 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                  <span className={styles.rateText}>{h.completionRate}%</span>
                </span>
                <span className={styles.streakText}>
                  {h.currentStreak > 0 ? `🔥 ${h.currentStreak}` : '—'}
                </span>
                <span className={styles.bestText}>{h.bestStreak}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
