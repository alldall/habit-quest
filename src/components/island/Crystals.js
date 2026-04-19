'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import Draggable from './Draggable';

function Crystal({ scale = 1, color = '#7c3aed', phase = 0 }) {
  const ref = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.008;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + phase) * 0.12;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + phase) * 0.25;
    }
  });

  return (
    <group ref={ref} scale={scale}>
      <mesh>
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          roughness={0.05}
          metalness={0.9}
          transparent
          opacity={0.9}
        />
      </mesh>
      <pointLight ref={glowRef} color={color} intensity={0.7} distance={4} />
    </group>
  );
}

const CRYSTAL_SLOTS = [
  { pos: [3.8, 1.5, -1.8], color: '#8b5cf6', scale: 1.0 },
  { pos: [-4.6, 1.3, -2.6], color: '#3b82f6', scale: 0.85 },
  { pos: [5.8, 1.3, 0.2], color: '#06b6d4', scale: 0.75 },
  { pos: [-3.2, 1.3, 4.6], color: '#7c3aed', scale: 0.9 },
  { pos: [0.8, 1.4, -5.2], color: '#a78bfa', scale: 0.9 },
  { pos: [-5.4, 1.3, 1.4], color: '#3b82f6', scale: 0.8 },
  { pos: [2.8, 1.4, 3.6], color: '#f472b6', scale: 0.7 },
  { pos: [-1.5, 1.5, -2.8], color: '#06b6d4', scale: 1.0 },
];

export default function Crystals({ intellectLevel, editMode, positions, onMove }) {
  const count = Math.min(intellectLevel, CRYSTAL_SLOTS.length);

  const crystals = useMemo(() => CRYSTAL_SLOTS.slice(0, count), [count]);

  return (
    <group>
      {crystals.map((slot, i) => {
        const key = `crystal-${i}`;
        const pos = positions?.[key] || slot.pos;
        return (
          <Draggable
            key={i}
            position={pos}
            enabled={editMode}
            onMove={(p) => onMove?.(key, p)}
          >
            <Crystal scale={slot.scale} color={slot.color} phase={i * 0.9} />
          </Draggable>
        );
      })}
    </group>
  );
}
