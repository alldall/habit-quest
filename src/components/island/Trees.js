'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import Draggable from './Draggable';

function Tree({ scale = 1, variant = 0, phase = 0 }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2 + phase) * 0.03;
    }
  });

  const foliageColors = [
    ['#1a5c1a', '#228B22', '#2ea82e'],
    ['#1a6b3a', '#20835a', '#2ea870'],
    ['#2d5a27', '#3a7a33', '#4a9a43'],
    ['#0f6b4a', '#14a36b', '#1dd488'],
  ];
  const colors = foliageColors[variant % foliageColors.length];

  return (
    <group ref={ref} scale={scale}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.08, 0.14, 1.3, 5]} />
        <meshStandardMaterial color="#6B4226" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.75, 0.85, 5]} />
        <meshStandardMaterial color={colors[0]} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0, 2.0, 0]}>
        <coneGeometry args={[0.58, 0.75, 5]} />
        <meshStandardMaterial color={colors[1]} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0, 2.45, 0]}>
        <coneGeometry args={[0.4, 0.6, 5]} />
        <meshStandardMaterial color={colors[2]} roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

const TREE_SLOTS = [
  { pos: [4.8, 0.62, 1.0], scale: 1.15 },
  { pos: [-3.6, 0.62, 3.4], scale: 0.95 },
  { pos: [2.0, 0.62, -4.8], scale: 1.05 },
  { pos: [-5.2, 0.62, -1.6], scale: 0.85 },
  { pos: [0.6, 0.62, 5.4], scale: 1.0 },
  { pos: [-2.8, 0.62, -4.2], scale: 1.1 },
  { pos: [5.4, 0.62, -2.8], scale: 0.9 },
  { pos: [-1.0, 0.62, -5.8], scale: 0.8 },
  { pos: [3.6, 0.62, -1.2], scale: 1.25 },
  { pos: [-4.8, 0.62, 3.8], scale: 1.05 },
  { pos: [5.6, 0.62, 3.0], scale: 0.75 },
  { pos: [-2.0, 0.62, 2.2], scale: 1.1 },
];

export default function Trees({ strengthLevel, editMode, positions, onMove }) {
  const count = Math.min(strengthLevel, TREE_SLOTS.length);

  const trees = useMemo(() => TREE_SLOTS.slice(0, count), [count]);

  return (
    <group>
      {trees.map((slot, i) => {
        const key = `tree-${i}`;
        const pos = positions?.[key] || slot.pos;
        return (
          <Draggable
            key={i}
            position={pos}
            enabled={editMode}
            onMove={(p) => onMove?.(key, p)}
          >
            <Tree scale={slot.scale} variant={i} phase={i * 1.7} />
          </Draggable>
        );
      })}
    </group>
  );
}
