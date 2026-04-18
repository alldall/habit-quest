'use client';

import dynamic from 'next/dynamic';
import { useGame } from '@/components/GameProvider';
import StatsOverlay from '@/components/island/StatsOverlay';
import styles from './page.module.scss';

const IslandScene = dynamic(
  () => import('@/components/island/IslandScene'),
  { ssr: false }
);

export default function IslandPage() {
  const { stats, overallLevel, todayProgress, isLoaded } = useGame();

  if (!isLoaded) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Загрузка острова...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.sceneWrapper}>
        <IslandScene stats={stats} />
        <StatsOverlay
          stats={stats}
          overallLevel={overallLevel}
          todayProgress={todayProgress}
        />
      </div>
      <div className={styles.hint}>
        Выполняй привычки — наблюдай, как остров оживает ✨
      </div>
    </div>
  );
}
