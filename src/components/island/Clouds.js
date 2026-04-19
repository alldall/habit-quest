'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

function CloudPuff({ position, scale }) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.12}
        roughness={1}
        flatShading
      />
    </mesh>
  );
}

function Cloud({ position, scale = 1 }) {
  const ref = useRef();
  const speed = useMemo(() => 0.08 + Math.random() * 0.05, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * speed) * 2;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <CloudPuff position={[-6.2, -1.8, -0.5]} scale={[1.5, 0.6, 1]} />
      <CloudPuff position={[-9.8, -0.7, 0.2]} scale={[1.2, 0.5, 0.8]} />
      <CloudPuff position={[-0.7, -0.72, -0.1]} scale={[1.0, 0.45, 0.9]} />
    </group>
  );
}

const CLOUD_POSITIONS = [
  { pos: [6, 7, -4], scale: 1.2 },
  { pos: [-8, 8, 3], scale: 0.9 },
  { pos: [3, 9, 7], scale: 0.7 },
  { pos: [-5, 7.5, -6], scale: 1.0 },
];

export default function Clouds({ spiritLevel }) {
  // More clouds at higher spirit levels
  const count = Math.min(1 + Math.floor(spiritLevel / 2), CLOUD_POSITIONS.length);

  return (
    <group>
      {CLOUD_POSITIONS.slice(0, count).map((cloud, i) => (
        <Cloud key={i} position={cloud.pos} scale={cloud.scale} />
      ))}
    </group>
  );
}
