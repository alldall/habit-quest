'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Bunny({ centerX, centerZ, radius, speed, phase = 0, color = '#f5f5f5' }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    const x = centerX + Math.cos(t) * radius;
    const z = centerZ + Math.sin(t) * radius;
    const hop = Math.abs(Math.sin(t * 3.5)) * 0.18;
    ref.current.position.set(x, 0.77 + hop, z);
    ref.current.rotation.y = -t - Math.PI / 2;
    ref.current.rotation.z = Math.sin(t * 3.5) * 0.08;
  });

  return (
    <group ref={ref}>
      {/* body */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <sphereGeometry args={[0.22, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* head */}
      <mesh position={[0, 0.38, 0.15]} castShadow>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* ears */}
      <mesh position={[-0.06, 0.55, 0.12]} rotation={[0, 0, -0.1]} castShadow>
        <capsuleGeometry args={[0.035, 0.16, 4, 6]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0.06, 0.55, 0.12]} rotation={[0, 0, 0.1]} castShadow>
        <capsuleGeometry args={[0.035, 0.16, 4, 6]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.05, 0.4, 0.27]}>
        <sphereGeometry args={[0.022, 6, 5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.05, 0.4, 0.27]}>
        <sphereGeometry args={[0.022, 6, 5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* tail */}
      <mesh position={[0, 0.22, -0.22]}>
        <sphereGeometry args={[0.07, 6, 5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Bird({ centerX, centerZ, radius, speed, height, phase = 0, color = '#f59e0b' }) {
  const ref = useRef();
  const wingL = useRef();
  const wingR = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    const x = centerX + Math.cos(t) * radius;
    const z = centerZ + Math.sin(t) * radius;
    const y = height + Math.sin(t * 1.5) * 0.3;
    ref.current.position.set(x, y, z);
    ref.current.rotation.y = -t - Math.PI / 2;
    const flap = Math.sin(state.clock.elapsedTime * 9) * 0.6;
    if (wingL.current) wingL.current.rotation.z = 0.3 + flap;
    if (wingR.current) wingR.current.rotation.z = -0.3 - flap;
  });

  return (
    <group ref={ref}>
      <mesh castShadow>
        <sphereGeometry args={[0.18, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.02, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.05, 0.12, 6]} />
        <meshStandardMaterial color="#ef6c2a" />
      </mesh>
      <mesh ref={wingL} position={[-0.14, 0.04, 0]}>
        <boxGeometry args={[0.28, 0.04, 0.16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh ref={wingR} position={[0.14, 0.04, 0]}>
        <boxGeometry args={[0.28, 0.04, 0.16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[-0.06, 0.08, 0.14]}>
        <sphereGeometry args={[0.02, 5, 4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.06, 0.08, 0.14]}>
        <sphereGeometry args={[0.02, 5, 4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

function Butterfly({ centerX, centerZ, radius, speed, phase = 0, color = '#ec4899' }) {
  const ref = useRef();
  const wingL = useRef();
  const wingR = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    const x = centerX + Math.cos(t) * radius + Math.sin(t * 2.3) * 0.6;
    const z = centerZ + Math.sin(t * 1.1) * radius + Math.cos(t * 2.1) * 0.6;
    const y = 1.6 + Math.sin(t * 2.0) * 0.4;
    ref.current.position.set(x, y, z);
    ref.current.rotation.y = -t;
    const flap = Math.sin(state.clock.elapsedTime * 18) * 0.7;
    if (wingL.current) wingL.current.rotation.y = 0.3 + flap;
    if (wingR.current) wingR.current.rotation.y = -0.3 - flap;
  });

  return (
    <group ref={ref}>
      <mesh>
        <capsuleGeometry args={[0.025, 0.18, 4, 5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <group ref={wingL} position={[-0.04, 0, 0]}>
        <mesh position={[-0.1, 0, 0]}>
          <planeGeometry args={[0.22, 0.2]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} side={2} />
        </mesh>
      </group>
      <group ref={wingR} position={[0.04, 0, 0]}>
        <mesh position={[0.1, 0, 0]}>
          <planeGeometry args={[0.22, 0.2]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} side={2} />
        </mesh>
      </group>
    </group>
  );
}

export default function Animals() {
  return (
    <group>
      <Bunny centerX={1.5} centerZ={1.8} radius={2.0} speed={0.4} phase={0} color="#f5f5f5" />
      <Bunny centerX={-2.5} centerZ={-2.0} radius={1.6} speed={0.5} phase={1.5} color="#d4a57a" />
      <Bird centerX={0} centerZ={0} radius={6.5} speed={0.35} height={5.0} phase={0} color="#f59e0b" />
      <Butterfly centerX={2.5} centerZ={-1.5} radius={1.2} speed={0.7} phase={0} color="#ec4899" />
      <Butterfly centerX={-1.8} centerZ={3.0} radius={1.0} speed={0.9} phase={2} color="#a78bfa" />
    </group>
  );
}
