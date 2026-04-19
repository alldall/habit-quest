'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Sidebar.module.scss';

const navItems = [
  { href: '/', label: 'Остров', icon: '🏝️' },
  { href: '/habits', label: 'Привычки', icon: '⚡' },
  { href: '/character', label: 'Персонаж', icon: '🧙' },
  { href: '/analytics', label: 'Аналитика', icon: '📊' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    setOpen(!mq.matches);
    const onChange = (e) => setOpen(!e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    if (mq.matches) setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.dataset.sidebar = open ? 'open' : 'closed';
    return () => {
      delete document.body.dataset.sidebar;
    };
  }, [open]);

  const toggle = () => setOpen((v) => !v);

  return (
    <>
      <button
        type="button"
        className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
        onClick={toggle}
        aria-label={open ? 'Скрыть меню' : 'Показать меню'}
        aria-expanded={open}
      >
        <span className={styles.burgerBox}>
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </span>
      </button>

      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`${styles.sidebar} ${open ? styles.sidebarOpen : styles.sidebarClosed}`}
      >
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🎮</span>
          <span className={styles.logoText}>HabitQuest</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <div className={styles.version}>v1.0.0</div>
        </div>
      </aside>
    </>
  );
}
