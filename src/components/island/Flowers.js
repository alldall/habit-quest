'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import Draggable from './Draggable';

function Flower({ color, size = 1, phase = 0 }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + phase) * 0.08;
    }
  });

  return (
    <group ref={ref} scale={size}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.018, 0.026, 0.36, 4]} />
        <meshStandardMaterial color="#3a8a3a" flatShading />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.085, 6, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          flatShading
        />
      </mesh>
      {/* petals around head */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.09, 0.4, Math.sin(a) * 0.09]}
          >
            <sphereGeometry args={[0.05, 5, 5]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} flatShading />
          </mesh>
        );
      })}
      <mesh position={[0.06, 0.12, 0]} rotation={[0, 0, -0.5]}>
        <sphereGeometry args={[0.045, 4, 3]} />
        <meshStandardMaterial color="#4a9a43" flatShading />
      </mesh>
    </group>
  );
}

const FLOWER_COLORS = ['#ec4899', '#f59e0b', '#ef4444', '#a78bfa', '#f472b6', '#fbbf24', '#fb923c', '#34d399'];

const FLOWER_SLOTS = [
  [1.6, 0.77, 2.8],
  [-1.0, 0.77, 4.2],
  [3.4, 0.77, 3.2],
  [-2.8, 0.77, 1.6],
  [4.2, 0.77, -0.6],
  [-3.8, 0.77, -1.8],
  [0.6, 0.77, -3.4],
  [-2.0, 0.77, 2.8],
  [2.4, 0.77, -2.4],
  [-4.6, 0.77, 0.4],
  [1.0, 0.77, 1.5],
  [-1.5, 0.77, -0.9],
  [2.8, 0.77, -1.6],
  [-1.8, 0.77, 2.0],
  [5.2, 0.77, 1.8],
  [-3.4, 0.77, -3.6],
  [0.0, 0.77, 4.6],
  [3.8, 0.77, 1.5],
  [-4.0, 0.77, 2.6],
  [1.9, 0.77, 0.6],
];

export default function Flowers({ healthLevel, editMode, positions, onMove }) {
  const count = Math.min(healthLevel * 2, FLOWER_SLOTS.length);

  const flowers = useMemo(() => {
    return FLOWER_SLOTS.slice(0, count).map((pos, i) => ({
      defaultPos: pos,
      color: FLOWER_COLORS[i % FLOWER_COLORS.length],
      size: 0.9 + (i * 0.37 % 0.5),
    }));
  }, [count]);

  return (
    <group>
      {flowers.map((flower, i) => {
        const key = `flower-${i}`;
        const pos = positions?.[key] || flower.defaultPos;
        return (
          <Draggable
            key={i}
            position={pos}
            enabled={editMode}
            onMove={(p) => onMove?.(key, p)}
          >
            <Flower color={flower.color} size={flower.size} phase={i * 0.7} />
          </Draggable>
        );
      })}
    </group>
  );
}
