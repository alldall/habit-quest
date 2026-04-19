'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

function Bush({ position, scale = 1, colorA, colorB }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial color={colorA} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.35, 0.18, 0.1]} castShadow>
        <sphereGeometry args={[0.34, 7, 5]} />
        <meshStandardMaterial color={colorB} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[-0.25, 0.22, 0.28]} castShadow>
        <sphereGeometry args={[0.32, 7, 5]} />
        <meshStandardMaterial color={colorA} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[-0.12, 0.38, -0.32]} castShadow>
        <sphereGeometry args={[0.38, 7, 5]} />
        <meshStandardMaterial color={colorB} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.22, 0.45, -0.15]} castShadow>
        <sphereGeometry args={[0.24, 6, 5]} />
        <meshStandardMaterial color={colorA} roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

export default function Island({ healthLevel }) {
  const grassColor = useMemo(() => {
    const g = Math.min(0.4 + healthLevel * 0.05, 0.85);
    return new THREE.Color(0.18, g, 0.22);
  }, [healthLevel]);

  const bushDark = useMemo(() => new THREE.Color('#1f6b2b'), []);
  const bushLight = useMemo(() => new THREE.Color('#3aa040'), []);
  const bushBerry = useMemo(() => new THREE.Color('#2d8a3a'), []);

  return (
    <group>
      {/* Main island body — tapered cylinder, wider */}
      <mesh position={[0, -0.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[8.5, 4.6, 3.0, 10]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.9} flatShading />
      </mesh>

      {/* Dirt layers for depth */}
      <mesh position={[0, -1.95, 0]}>
        <cylinderGeometry args={[6.0, 3.2, 1.6, 8]} />
        <meshStandardMaterial color="#5a3815" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0, -3.0, 0]}>
        <cylinderGeometry args={[3.2, 1.2, 1.3, 7]} />
        <meshStandardMaterial color="#3d2410" roughness={0.95} flatShading />
      </mesh>

      {/* Hanging rocks underneath */}
      <mesh position={[1.8, -3.1, 1.1]} rotation={[0.2, 0.5, 0.1]}>
        <dodecahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial color="#6b4a28" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-1.1, -2.9, -1.3]} rotation={[0.3, 1.2, 0]}>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#5d4020" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[2.4, -3.5, -0.9]} rotation={[0.5, 0.8, 0.2]}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#523818" roughness={0.9} flatShading />
      </mesh>

      {/* Grass top — thicker and wider */}
      <mesh position={[0, 0.62, 0]} receiveShadow>
        <cylinderGeometry args={[8.5, 8.5, 0.3, 14]} />
        <meshStandardMaterial color={grassColor} roughness={0.8} flatShading />
      </mesh>

      {/* Beach/sand rim at grass edge */}
      <mesh position={[0, 0.78, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.0, 8.55, 56]} />
        <meshStandardMaterial color="#e6d49a" roughness={0.95} flatShading />
      </mesh>

      {/* Bushes replacing hills — softer look */}
      <Bush position={[3.0, 0.77, -1.6]} scale={1.7} colorA={bushDark} colorB={bushLight} />
      <Bush position={[-2.8, 0.77, 2.4]} scale={1.3} colorA={bushLight} colorB={bushDark} />
      <Bush position={[-4.2, 0.77, -3.2]} scale={1.1} colorA={bushBerry} colorB={bushDark} />
      <Bush position={[5.2, 0.77, 2.6]} scale={0.95} colorA={bushLight} colorB={bushBerry} />
      <Bush position={[-0.6, 0.77, -4.8]} scale={1.25} colorA={bushDark} colorB={bushBerry} />
      <Bush position={[-5.6, 0.77, 0.6]} scale={0.85} colorA={bushLight} colorB={bushDark} />
      <Bush position={[5.8, 0.77, -3.0]} scale={0.9} colorA={bushDark} colorB={bushLight} />
      <Bush position={[0.2, 0.77, 5.4]} scale={1.0} colorA={bushBerry} colorB={bushLight} />

      {/* Small rocks on surface */}
      <mesh position={[5.8, 0.82, 2.8]} rotation={[0.1, 0.8, 0.2]}>
        <dodecahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial color="#7a7770" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-6.0, 0.8, -1.0]} rotation={[0.3, 1.5, 0.1]}>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#8a8680" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.4, 0.82, 6.0]} rotation={[0.2, 0.4, 0.15]}>
        <dodecahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial color="#787570" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[3.6, 0.8, 4.2]} rotation={[0.15, 1.0, 0.1]}>
        <dodecahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial color="#6a6760" roughness={0.9} flatShading />
      </mesh>

      {/* Water — close to island, lapping the shore */}
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.8, 16, 64]} />
        <meshStandardMaterial
          color="#2b7fbf"
          emissive="#1a5a9e"
          emissiveIntensity={0.35}
          transparent
          opacity={0.75}
          roughness={0.15}
          metalness={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Foam highlight right at island edge */}
      <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.8, 9.0, 64]} />
        <meshStandardMaterial
          color="#c9eeff"
          emissive="#7dd3fc"
          emissiveIntensity={0.85}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
