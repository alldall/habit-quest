'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Island({ healthLevel }) {
  const ref = useRef();

  const grassGreen = Math.min(0.3 + healthLevel * 0.05, 0.8);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {/* Main island body */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[3.5, 2.5, 1.5, 8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>

      {/* Grass top */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[3.5, 3.5, 0.15, 8]} />
        <meshStandardMaterial
          color={`rgb(${Math.floor(80 - healthLevel * 3)}, ${Math.floor(grassGreen * 255)}, ${Math.floor(60 - healthLevel * 2)})`}
          roughness={0.8}
        />
      </mesh>

      {/* Water ring */}
      <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.5, 6, 32]} />
        <meshStandardMaterial
          color="#1e3a5f"
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Small hill */}
      <mesh position={[1, 0.6, -0.5]}>
        <sphereGeometry args={[0.8, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={`rgb(${Math.floor(70 - healthLevel * 3)}, ${Math.floor(grassGreen * 240)}, ${Math.floor(50 - healthLevel * 2)})`}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}
