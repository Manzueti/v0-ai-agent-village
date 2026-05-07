"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { Employee } from "@/lib/types";

interface Props {
  agent: Employee;
  position: [number, number, number];
}

const roleColors: Record<string, string> = {
  Strategy: "#ef4444",
  "Prompt Engineering": "#3b82f6",
  Content: "#eab308",
  Deployment: "#a855f7",
  Data: "#06b6d4",
  Security: "#10b981",
};

export default function EcosystemNode({ agent, position }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const color = roleColors[agent.role] || "#94a3b8";

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.z = t * 0.2;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        {/* Central Core */}
        <mesh ref={meshRef}>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={agent.status === 'running' ? 2 : 0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Outer Wireframe Shell */}
        <mesh ref={shellRef}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>

        {/* Status Ring */}
        {agent.status === 'running' && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
            <ringGeometry args={[1.2, 1.3, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Floating UI Label */}
        <Html distanceFactor={10} position={[0, 1.5, 0]} center>
          <div className="flex flex-col items-center pointer-events-none select-none">
            <div className="bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1 rounded-md shadow-[0_0_10px_rgba(0,255,255,0.2)]">
              <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">
                {agent.name}
              </span>
            </div>
            <div className={`mt-1 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
              agent.status === 'running' ? 'text-cyan-400' : 'text-slate-400'
            }`}>
              {agent.status}
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
}
