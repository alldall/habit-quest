'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAT_TYPES } from '@/lib/constants';
import styles from './RewardPopup.module.scss';

const PARTICLES_COUNT = 12;

function Particles({ color }) {
  return (
    <div className={styles.particles}>
      {Array.from({ length: PARTICLES_COUNT }).map((_, i) => {
        const angle = (i / PARTICLES_COUNT) * 360;
        const distance = 40 + Math.random() * 60;
        const size = 4 + Math.random() * 6;
        const tx = Math.cos((angle * Math.PI) / 180) * distance;
        const ty = Math.sin((angle * Math.PI) / 180) * distance;

        return (
          <span
            key={i}
            className={styles.particle}
            style={{
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              '--size': `${size}px`,
              '--delay': `${i * 0.02}s`,
              backgroundColor: color,
            }}
          />
        );
      })}
    </div>
  );
}

export default function RewardPopup({ event, onDone }) {
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    if (!event) return;
    setCurrentEvent(event);
    const timer = setTimeout(() => {
      setCurrentEvent(null);
      onDone();
    }, event.leveledUp ? 3000 : 1800);
    return () => clearTimeout(timer);
  }, [event, onDone]);

  const stat = currentEvent ? STAT_TYPES[currentEvent.stat] : null;
  const color = stat?.color || '#7c3aed';

  return (
    <AnimatePresence mode="wait">
      {currentEvent && (
        <motion.div
          key={currentEvent.timestamp}
          className={styles.root}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={styles.xpPopup}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -60, scale: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ color }}
          >
            +{currentEvent.xp} XP
            {currentEvent.streak >= 7 && <span className={styles.multiplier}>x1.5</span>}
          </motion.div>

          <motion.div
            className={styles.burstWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Particles color={color} />
          </motion.div>

          {currentEvent.leveledUp && (
            <motion.div
              className={styles.levelUpOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={styles.levelUpCard}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className={styles.levelUpIcon}>🎉</div>
                <div className={styles.levelUpTitle}>Уровень повышен!</div>
                <div className={styles.levelUpNumber}>{currentEvent.newLevel}</div>
                <div className={styles.levelUpSub}>Продолжай в том же духе!</div>
                <Particles color="#f59e0b" />
              </motion.div>
            </motion.div>
          )}

          {currentEvent.statLevelUps?.length > 0 && !currentEvent.leveledUp && (
            <motion.div
              className={styles.statLevelUp}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              {currentEvent.statLevelUps.map((key) => (
                <div key={key} className={styles.statToast} style={{ borderColor: STAT_TYPES[key].color }}>
                  {STAT_TYPES[key].icon} {STAT_TYPES[key].name} повышен!
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
