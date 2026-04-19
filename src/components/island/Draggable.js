'use client';

import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ISLAND_RADIUS = 8.0;

export default function Draggable({ children, position, enabled, onMove }) {
  const { camera, gl } = useThree();
  const groupRef = useRef();
  const dragging = useRef(false);
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const latestPos = useRef(position);
  const [hovered, setHovered] = useState(false);
  const [isDown, setIsDown] = useState(false);

  useEffect(() => {
    latestPos.current = position;
  }, [position]);

  useEffect(() => {
    plane.current.constant = -position[1];
  }, [position]);

  useEffect(() => {
    if (!enabled) {
      dragging.current = false;
      setIsDown(false);
      return;
    }

    const handleMove = (e) => {
      if (!dragging.current) return;
      const rect = gl.domElement.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(pointer.current, camera);
      const hit = new THREE.Vector3();
      if (raycaster.current.ray.intersectPlane(plane.current, hit)) {
        const d = Math.sqrt(hit.x * hit.x + hit.z * hit.z);
        if (d > ISLAND_RADIUS) {
          hit.x = (hit.x / d) * ISLAND_RADIUS;
          hit.z = (hit.z / d) * ISLAND_RADIUS;
        }
        const newPos = [hit.x, latestPos.current[1], hit.z];
        onMove(newPos);
      }
    };

    const handleUp = () => {
      if (dragging.current) {
        dragging.current = false;
        setIsDown(false);
        gl.domElement.style.cursor = hovered ? 'grab' : 'auto';
      }
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [enabled, camera, gl, onMove, hovered]);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetLift = isDown ? 0.6 : enabled && hovered ? 0.25 : 0;
    groupRef.current.position.y = position[1] + targetLift;
    const s = isDown ? 1.08 : enabled && hovered ? 1.04 : 1;
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={(e) => {
        if (!enabled) return;
        e.stopPropagation();
        dragging.current = true;
        setIsDown(true);
        gl.domElement.style.cursor = 'grabbing';
      }}
      onPointerOver={(e) => {
        if (!enabled) return;
        e.stopPropagation();
        setHovered(true);
        if (!dragging.current) gl.domElement.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        setHovered(false);
        if (!dragging.current) gl.domElement.style.cursor = 'auto';
      }}
    >
      {enabled && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.62, 24]} />
          <meshBasicMaterial
            color={isDown ? '#fbbf24' : hovered ? '#a78bfa' : '#7c3aed'}
            transparent
            opacity={isDown ? 0.9 : hovered ? 0.7 : 0.4}
          />
        </mesh>
      )}
      {children}
    </group>
  );
}
