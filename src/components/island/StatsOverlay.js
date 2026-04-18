'use client';

import { STAT_TYPES } from '@/lib/constants';
import { calculateXpProgress } from '@/lib/gameEngine';
import styles from './StatsOverlay.module.scss';

export default function StatsOverlay({ stats, overallLevel, todayProgress }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.levelBadge}>
        <span className={styles.levelNumber}>{overallLevel}</span>
        <span className={styles.levelLabel}>уровень</span>
      </div>

      <div className={styles.todayCard}>
        <div className={styles.todayLabel}>Сегодня</div>
        <div className={styles.todayProgress}>
          <div
            className={styles.todayBar}
            style={{ width: `${todayProgress.percentage}%` }}
          />
        </div>
        <div className={styles.todayText}>
          {todayProgress.completed}/{todayProgress.total}
        </div>
      </div>

      <div className={styles.statsGrid}>
        {Object.entries(STAT_TYPES).map(([key, stat]) => {
          const playerStat = stats[key];
          const progress = calculateXpProgress(playerStat.xp);

          return (
            <div key={key} className={styles.statItem}>
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>{stat.icon}</span>
                <span className={styles.statName}>{stat.name}</span>
                <span className={styles.statLevel} style={{ color: stat.color }}>
                  {playerStat.level}
                </span>
              </div>
              <div className={styles.statBar}>
                <div
                  className={styles.statFill}
                  style={{ width: `${progress}%`, background: stat.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
