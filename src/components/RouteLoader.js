'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import styles from './RouteLoader.module.scss';

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPath = useRef(pathname);
  const timeouts = useRef([]);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    setLoading(true);
    setProgress(10);

    timeouts.current.push(setTimeout(() => setProgress(45), 80));
    timeouts.current.push(setTimeout(() => setProgress(75), 180));
    timeouts.current.push(setTimeout(() => setProgress(95), 320));
    timeouts.current.push(
      setTimeout(() => {
        setProgress(100);
        timeouts.current.push(
          setTimeout(() => {
            setLoading(false);
            setProgress(0);
          }, 220)
        );
      }, 420)
    );

    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, [pathname]);

  return (
    <div className={`${styles.bar} ${loading ? styles.visible : ''}`}>
      <div className={styles.fill} style={{ width: `${progress}%` }} />
    </div>
  );
}
