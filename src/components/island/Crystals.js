'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

function Crystal({ position, scale = 1, color = '#7c3aed' }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0] * 3) * 0.05;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

export default function Crystals({ count }) {
  const crystals = useMemo(() => {
    const items = [];
    const colors = ['#7c3aed', '#3b82f6', '#06b6d4', '#8b5cf6'];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + 1;
      const radius = 0.8 + Math.sin(i * 3) * 0.8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 0.5 + Math.random() * 1;

      items.push({
        position: [x, 0.6 + Math.random() * 0.3, z],
        scale,
        color: colors[i % colors.length],
      });
    }
    return items;
  }, [count]);

  return (
    <group>
      {crystals.map((crystal, i) => (
        <Crystal key={i} {...crystal} />
      ))}
    </group>
  );
}
