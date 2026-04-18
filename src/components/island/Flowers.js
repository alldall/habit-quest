'use client';

import { useMemo } from 'react';

function Flower({ position, color }) {
  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.3, 4]} />
        <meshStandardMaterial color="#4a9a43" />
      </mesh>

      {/* Petals */}
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

export default function Flowers({ count, healthLevel }) {
  const flowers = useMemo(() => {
    const items = [];
    const colors = ['#ec4899', '#f59e0b', '#ef4444', '#8b5cf6', '#f472b6', '#fbbf24'];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + 0.7;
      const radius = 1 + Math.sin(i * 1.7) * 1.8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      items.push({
        position: [x, 0.3, z],
        color: colors[i % colors.length],
      });
    }
    return items;
  }, [count]);

  return (
    <group>
      {flowers.map((flower, i) => (
        <Flower key={i} {...flower} />
      ))}
    </group>
  );
}
