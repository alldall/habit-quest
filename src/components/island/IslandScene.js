'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useState, useEffect, useCallback } from 'react';
import Island from './Island';
import Trees from './Trees';
import Crystals from './Crystals';
import Flowers from './Flowers';
import Stars from './Stars';
import Clouds from './Clouds';
import Animals from './Animals';
import styles from './IslandScene.module.scss';

const POSITIONS_KEY = 'hq-island-positions';

function loadPositions() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(POSITIONS_KEY) || '{}');
  } catch {
    return {};
  }
}

export default function IslandScene({ stats }) {
  const strengthLevel = stats.strength.level;
  const intellectLevel = stats.intellect.level;
  const healthLevel = stats.health.level;
  const spiritLevel = stats.spirit.level;

  const [editMode, setEditMode] = useState(false);
  const [positions, setPositions] = useState({});

  useEffect(() => {
    setPositions(loadPositions());
  }, []);

  const updatePosition = useCallback((key, pos) => {
    setPositions((prev) => {
      const next = { ...prev, [key]: pos };
      try {
        localStorage.setItem(POSITIONS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const resetPositions = useCallback(() => {
    setPositions({});
    try {
      localStorage.removeItem(POSITIONS_KEY);
    } catch {}
  }, []);

  const skyClass =
    spiritLevel > 6
      ? styles.skyNight
      : spiritLevel > 3
        ? styles.skyDusk
        : styles.skyDay;

  return (
    <div className={`${styles.wrapper} ${skyClass}`}>
      <div className={styles.editControls}>
        {editMode && (
          <button
            type="button"
            className={styles.resetBtn}
            onClick={resetPositions}
            title="Сбросить расстановку"
          >
            ↺
          </button>
        )}
        <button
          type="button"
          className={`${styles.editBtn} ${editMode ? styles.editBtnActive : ''}`}
          onClick={() => setEditMode((v) => !v)}
        >
          {editMode ? '✓ Готово' : '✏️ Обустроить'}
        </button>
      </div>

      {editMode && (
        <div className={styles.editHint}>
          Перетаскивай объекты, чтобы обустроить остров
        </div>
      )}

      <Canvas
        camera={{ position: [18, 12, 18], fov: 42 }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55 + intellectLevel * 0.04} color="#fff4e0" />

          <directionalLight
            position={[10, 14, 8]}
            intensity={1.2 + intellectLevel * 0.08}
            color="#ffe0b0"
            castShadow
          />

          <directionalLight
            position={[-6, 5, -8]}
            intensity={0.4}
            color="#ff7ab0"
          />

          <pointLight
            position={[0, 3, 0]}
            intensity={0.5 + intellectLevel * 0.15}
            color="#ffb0e6"
            distance={10}
          />

          <pointLight
            position={[-5, 4, 5]}
            intensity={0.6}
            color="#60a5fa"
            distance={12}
          />

          <Island healthLevel={healthLevel} />
          <Trees
            strengthLevel={strengthLevel}
            editMode={editMode}
            positions={positions}
            onMove={updatePosition}
          />
          <Crystals
            intellectLevel={intellectLevel}
            editMode={editMode}
            positions={positions}
            onMove={updatePosition}
          />
          <Flowers
            healthLevel={healthLevel}
            editMode={editMode}
            positions={positions}
            onMove={updatePosition}
          />

          {!editMode && <Animals />}

          {spiritLevel > 1 && <Stars spiritLevel={spiritLevel} />}
          <Clouds spiritLevel={spiritLevel} />

          <OrbitControls
            enablePan={false}
            enabled={!editMode}
            minDistance={11}
            maxDistance={32}
            maxPolarAngle={Math.PI / 2.05}
          />
          <Environment preset={spiritLevel > 6 ? 'night' : 'sunset'} />
        </Suspense>
      </Canvas>
    </div>
  );
}
