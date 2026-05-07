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
        {/* Advanced Central Core using MeshPhysicalMaterial */}
        <mesh ref={meshRef} castShadow>
          <octahedronGeometry args={[0.7, 0]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={agent.status === 'running' ? 2 : 0.5}
            metalness={1.0}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            iridescence={1}
            iridescenceIOR={1.5}
          />
        </mesh>

        {/* Outer Wireframe Shell */}
        <mesh ref={shellRef}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Pulsing Status Ring */}
        {agent.status === 'running' && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
            <ringGeometry args={[1.3, 1.4, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Agent Badge (Floating HTML) */}
        <Html distanceFactor={15} position={[0, 1.8, 0]} center>
          <div className="flex flex-col items-center pointer-events-none select-none">
            <div className="bg-[#03010a]/90 backdrop-blur-xl border border-white/10 px-4 py-1 rounded shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center gap-2">
               <span className="text-[14px]">{agent.avatar}</span>
               <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">
                {agent.name}
              </span>
            </div>
            <div className={`mt-1 text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${
              agent.status === 'running' ? 'text-green-400 border-green-500/30 bg-green-500/5' : 'text-slate-500 border-slate-500/30'
            }`}>
              {agent.status}
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
}
