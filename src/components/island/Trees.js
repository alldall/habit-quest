'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

function Tree({ position, scale = 1 }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.03;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 0.8, 6]} />
        <meshStandardMaterial color="#8B6914" roughness={0.9} />
      </mesh>

      {/* Foliage layers */}
      <mesh position={[0, 1.1, 0]}>
        <coneGeometry args={[0.5, 0.7, 6]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.38, 0.6, 6]} />
        <meshStandardMaterial color="#3a7a33" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.85, 0]}>
        <coneGeometry args={[0.25, 0.5, 6]} />
        <meshStandardMaterial color="#4a9a43" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function Trees({ count }) {
  const trees = useMemo(() => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (i * 0.5);
      const radius = 1.2 + Math.sin(i * 2.5) * 1.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 0.7 + Math.random() * 0.6;
      positions.push({ position: [x, 0.3, z], scale });
    }
    return positions;
  }, [count]);

  return (
    <group>
      {trees.map((tree, i) => (
        <Tree key={i} position={tree.position} scale={tree.scale} />
      ))}
    </group>
  );
}
