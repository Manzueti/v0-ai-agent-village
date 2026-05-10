"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Employee } from "@/lib/types";

interface Props {
  agent: Employee;
  position: [number, number, number];
}

// More vibrant color mapping for glass refraction
const roleColors: Record<string, string> = {
  Strategy: "#ff2a2a",
  "Prompt Engineering": "#2a88ff",
  Content: "#ffcc00",
  Deployment: "#cc44ff",
  Data: "#00ffff",
  Security: "#00ff88",
};

export default function EcosystemNode({ agent, position }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  
  const rawColor = roleColors[agent.role] || roleColors[agent.department] || "#00ffff";
  // Add fallback for departments since the data structure changed
  const colorMap: Record<string, string> = {
    'Revenue Hub': '#00ffff',
    'Finance Vault': '#ffaa00',
    'Creative Studio': '#cc44ff',
    'Tech Nexus': '#0088ff',
    'Command Deck': '#ffffff'
  };
  const color = colorMap[agent.department] || rawColor;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.4;
      meshRef.current.rotation.z = t * 0.3;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.2;
      shellRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * 1.2;
      orbitRef.current.rotation.z = Math.sin(t * 0.8) * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group position={position}>
        {/* AAA Glass / Crystal Core */}
        <mesh ref={meshRef} castShadow>
          <octahedronGeometry args={[0.8, 1]} />
          <MeshTransmissionMaterial 
            color={color}
            resolution={512}
            thickness={1.5}
            roughness={0.1}
            anisotropy={1.5}
            chromaticAberration={0.05}
            transmission={0.9}
            distortion={0.2}
            distortionScale={0.5}
            temporalDistortion={0.1}
            ior={1.5}
            backside
          />
        </mesh>

        {/* Inner Glowing Orb */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>

        {/* Outer Wireframe Shell */}
        <mesh ref={shellRef}>
          <icosahedronGeometry args={[1.3, 1]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Orbiting Particles */}
        <group ref={orbitRef}>
          <mesh position={[1.5, 0, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh position={[-1.5, 0, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>

        <Sparkles count={30} scale={3} size={2} speed={0.4} opacity={0.5} color={color} />

        {/* Pulsing Status Ring */}
        {agent.status === 'running' && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
            <ringGeometry args={[1.5, 1.6, 64]} />
            <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
          </mesh>
        )}

        {/* Agent Badge (Floating HTML) */}
        <Html distanceFactor={15} position={[0, 2.5, 0]} center zIndexRange={[100, 0]}>
          <div className="flex flex-col items-center pointer-events-none select-none w-48">
            {/* Thought Bubble */}
            <AnimatePresence>
              {agent.status === 'running' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="bg-black/40 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl mb-3 text-[9px] text-white font-bold uppercase tracking-[0.2em] text-center shadow-[0_0_20px_rgba(255,255,255,0.15)] relative"
                  style={{ textShadow: `0 0 10px ${color}` }}
                >
                  Calculating Vector...
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black/40 border-r border-b border-white/20 rotate-45 backdrop-blur-xl" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-[#03010a]/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center w-full">
              <div className="flex items-center gap-2 w-full justify-center border-b border-white/5 pb-1.5 mb-1.5">
                 <span className="text-[16px] drop-shadow-md">{agent.avatar}</span>
                 <span className="text-[11px] font-black text-white uppercase tracking-widest whitespace-nowrap" style={{ color }}>
                  {agent.name}
                </span>
              </div>

              {/* Health/Energy Bars */}
              <div className="w-full px-2 space-y-1.5">
                {/* Energy Bar */}
                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[6px] text-white/50 font-black uppercase tracking-widest">ENERGY</span>
                    <span className="text-[6px] text-white font-bold">{Math.floor(Math.random() * 20 + 80)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[84%] shadow-[0_0_10px_currentColor]" style={{ backgroundColor: color }} />
                  </div>
                </div>

                {/* Task Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[6px] text-white/50 font-black uppercase tracking-widest">PROCESS</span>
                    <span className="text-[6px] text-white font-bold">{agent.status === 'running' ? 'Active' : 'Idle'}</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full shadow-[0_0_10px_currentColor]" 
                      style={{ backgroundColor: color }}
                      animate={agent.status === 'running' ? { width: ['0%', '100%'] } : { width: '0%' }}
                      transition={agent.status === 'running' ? { duration: 15, repeat: Infinity, ease: "linear" } : {}}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Level Badge */}
            <div className="mt-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <span className="text-[7px] text-white/60 font-bold uppercase tracking-widest">LVL</span>
              <span className="text-[9px] font-black text-white">{agent.level}</span>
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
}
