import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/**
 * Hero ambient background — floating data nodes connected by lines.
 * Lightweight: instanced geometry, no heavy textures.
 * The 3D character / portrait is rendered separately in CSS (App hero)
 * so it never appears inside a square frame.
 */

function NodeField() {
  const group = useRef();
  const nodes = useMemo(() => {
    const arr = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 7,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 2 - 1,
        ],
        scale: 0.06 + Math.random() * 0.08,
        speed: 0.3 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const n = nodes[i];
      if (!n) return;
      child.position.y = n.position[1] + Math.sin(t * n.speed + n.phase) * 0.35;
      child.position.x = n.position[0] + Math.cos(t * n.speed * 0.7 + n.phase) * 0.25;
      child.rotation.y = t * 0.3;
    });
  });

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <Float key={i} speed={1} rotationIntensity={0.4} floatIntensity={0.5}>
          <mesh position={n.position}>
            <icosahedronGeometry args={[n.scale, 0]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#19dfff" : i % 3 === 1 ? "#8f55ff" : "#3da9fc"}
              emissive={i % 3 === 0 ? "#0b8fb0" : "#5a2fb0"}
              emissiveIntensity={0.6}
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Connections() {
  const ref = useRef();
  const positions = useMemo(() => {
    const pts = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
      pts.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 3 - 1
      );
    }
    return new Float32Array(pts);
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#5fd3ff"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[4, 3, 5]} intensity={18} color="#14dfff" distance={12} />
      <pointLight position={[-4, -1, 4]} intensity={12} color="#8f55ff" distance={10} />
      <Suspense fallback={null}>
        <Connections />
        <NodeField />
        <Sparkles count={60} scale={[9, 7, 4]} size={1.6} speed={0.25} color="#42dfff" />
      </Suspense>
    </>
  );
}

export default function Scene() {
  return (
    <div className="three-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
