'use client';

import { motion } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer,
} from 'recharts';
import { useGame } from '@/components/GameProvider';
import { STAT_TYPES, MAX_LEVEL } from '@/lib/constants';
import { calculateXpProgress, calculateBestStreak, getOverallXp } from '@/lib/gameEngine';
import styles from './page.module.scss';

export default function CharacterPage() {
  const { habits, completions, stats, overallLevel, isLoaded } = useGame();

  if (!isLoaded) return null;

  const radarData = Object.entries(STAT_TYPES).map(([key, stat]) => ({
    stat: stat.name,
    value: stats[key].level,
    fullMark: MAX_LEVEL,
  }));

  const totalXp = getOverallXp(stats);
  const overallProgress = calculateXpProgress(totalXp);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Персонаж</h1>

      <div className={styles.grid}>
        {/* Level card */}
        <motion.div
          className={styles.levelCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.levelCircle}>
            <svg viewBox="0 0 100 100" className={styles.levelRing}>
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke="rgba(124,58,237,0.15)"
                strokeWidth="6"
              />
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke="url(#levelGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - overallProgress.percentage / 100)}`}
                transform="rotate(-90 50 50)"
              />
              <defs>
                <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className={styles.levelInner}>
              <span className={styles.levelNum}>{overallLevel}</span>
              <span className={styles.levelText}>уровень</span>
            </div>
          </div>
          <div className={styles.totalXp}>{totalXp} XP всего</div>
          <div className={styles.xpToNext}>
            {overallProgress.current} / {overallProgress.needed} XP до уровня {overallLevel + 1}
          </div>
        </motion.div>

        {/* Radar chart */}
        <motion.div
          className={styles.radarCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className={styles.cardTitle}>Характеристики</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="rgba(124,58,237,0.15)" />
              <PolarAngleAxis
                dataKey="stat"
                tick={{ fill: '#94a3b8', fontSize: 13 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, Math.max(5, ...radarData.map(d => d.value) )]}
                tick={false}
                axisLine={false}
              />
              <Radar
                dataKey="value"
                stroke="#7c3aed"
                fill="#7c3aed"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Stat details */}
        {Object.entries(STAT_TYPES).map(([key, stat], i) => {
          const playerStat = stats[key];
          const progress = calculateXpProgress(playerStat.xp);
          const habitsForStat = habits.filter((h) => h.stat === key);

          return (
            <motion.div
              key={key}
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              style={{ '--stat-color': stat.color }}
            >
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>{stat.icon}</span>
                <div>
                  <div className={styles.statName}>{stat.name}</div>
                  <div className={styles.statDesc}>{stat.description}</div>
                </div>
                <div className={styles.statLevel}>{playerStat.level}</div>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className={styles.progressText}>
                {progress.current} / {progress.needed} XP до уровня {playerStat.level + 1}
              </div>

              <div className={styles.statEffect}>
                🌍 {stat.worldEffect}
              </div>

              {habitsForStat.length > 0 && (
                <div className={styles.habitList}>
                  {habitsForStat.map((h) => {
                    const best = calculateBestStreak(completions, h.id);
                    return (
                      <div key={h.id} className={styles.habitItem}>
                        <span>{h.icon} {h.name}</span>
                        {best > 0 && (
                          <span className={styles.bestStreak}>
                            лучший streak: {best}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
