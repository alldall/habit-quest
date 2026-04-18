'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Sidebar.module.scss';

const navItems = [
  { href: '/', label: 'Остров', icon: '🏝️' },
  { href: '/habits', label: 'Привычки', icon: '⚡' },
  { href: '/character', label: 'Персонаж', icon: '🧙' },
  { href: '/analytics', label: 'Аналитика', icon: '📊' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        className={styles.burger}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <span className={`${styles.burgerLine} ${mobileOpen ? styles.open : ''}`} />
      </button>

      {mobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>
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
                onClick={() => setMobileOpen(false)}
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
