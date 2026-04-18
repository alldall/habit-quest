'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import Island from './Island';
import Trees from './Trees';
import Crystals from './Crystals';
import Flowers from './Flowers';
import Stars from './Stars';

export default function IslandScene({ stats }) {
  const strengthLevel = stats.strength.level;
  const intellectLevel = stats.intellect.level;
  const healthLevel = stats.health.level;
  const spiritLevel = stats.spirit.level;

  const skyColor = spiritLevel > 5 ? '#1a0a2e' : spiritLevel > 3 ? '#1a1a3e' : '#2a2a4e';

  return (
    <Canvas
      camera={{ position: [8, 6, 8], fov: 45 }}
      style={{ background: skyColor }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3 + intellectLevel * 0.05} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={0.8 + intellectLevel * 0.1}
          castShadow
        />
        <pointLight
          position={[0, 3, 0]}
          intensity={intellectLevel * 0.1}
          color="#7c3aed"
        />

        <Island healthLevel={healthLevel} />
        <Trees count={Math.min(strengthLevel, 12)} />
        <Crystals count={Math.min(intellectLevel, 8)} />
        <Flowers count={Math.min(healthLevel * 2, 20)} healthLevel={healthLevel} />
        {spiritLevel > 2 && <Stars count={spiritLevel * 10} />}

        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <Environment preset={spiritLevel > 5 ? 'night' : 'sunset'} />
      </Suspense>
    </Canvas>
  );
}
