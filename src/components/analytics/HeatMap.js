'use client';

import { useMemo } from 'react';
import { getDateKey } from '@/lib/gameEngine';
import styles from './HeatMap.module.scss';

const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
const DAYS = ['Пн', '', 'Ср', '', 'Пт', '', 'Вс'];

export default function HeatMap({ completions, totalHabits }) {
  const cells = useMemo(() => {
    const today = new Date();
    const result = [];

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = getDateKey(date);
      const count = completions[key]?.length || 0;
      const ratio = totalHabits > 0 ? count / totalHabits : 0;

      let level = 0;
      if (ratio > 0) level = 1;
      if (ratio >= 0.25) level = 2;
      if (ratio >= 0.5) level = 3;
      if (ratio >= 0.75) level = 4;

      result.push({
        date: key,
        count,
        level,
        dayOfWeek: date.getDay(),
        month: date.getMonth(),
        displayDate: `${date.getDate()} ${MONTHS[date.getMonth()]}`,
      });
    }

    return result;
  }, [completions, totalHabits]);

  const weeks = useMemo(() => {
    const w = [];
    let currentWeek = [];

    cells.forEach((cell, i) => {
      if (i === 0) {
        // Fill start of first week
        const startDay = cell.dayOfWeek === 0 ? 6 : cell.dayOfWeek - 1;
        for (let j = 0; j < startDay; j++) {
          currentWeek.push(null);
        }
      }
      currentWeek.push(cell);
      if (currentWeek.length === 7) {
        w.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      w.push(currentWeek);
    }

    return w;
  }, [cells]);

  // Month labels
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const firstCell = week.find((c) => c !== null);
      if (firstCell && firstCell.month !== lastMonth) {
        labels.push({ index: i, label: MONTHS[firstCell.month] });
        lastMonth = firstCell.month;
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.monthRow}>
        {monthLabels.map((m) => (
          <span
            key={m.index}
            className={styles.monthLabel}
            style={{ gridColumn: m.index + 2 }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div className={styles.grid}>
        <div className={styles.dayLabels}>
          {DAYS.map((d, i) => (
            <span key={i} className={styles.dayLabel}>{d}</span>
          ))}
        </div>

        <div className={styles.cells}>
          {weeks.map((week, wi) => (
            <div key={wi} className={styles.column}>
              {week.map((cell, ci) => (
                <div
                  key={ci}
                  className={`${styles.cell} ${cell ? styles[`level${cell.level}`] : styles.empty}`}
                  title={cell ? `${cell.displayDate}: ${cell.count} привычек` : ''}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.legend}>
        <span>Меньше</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} className={`${styles.cell} ${styles[`level${l}`]}`} />
        ))}
        <span>Больше</span>
      </div>
    </div>
  );
}
