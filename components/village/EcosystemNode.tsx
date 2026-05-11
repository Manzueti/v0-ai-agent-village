"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, Sparkles, Box, Sphere, Cylinder } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Employee } from "@/lib/types";

interface Props {
  agent: Employee;
  position: [number, number, number];
}

const RoboticWorker = ({ color, isWorking }: { color: string, isWorking: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const lArmRef = useRef<THREE.Group>(null);
  const rArmRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 2) * 0.1;
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t) * 0.2;
    }
    if (isWorking && lArmRef.current && rArmRef.current) {
      lArmRef.current.rotation.x = Math.sin(t * 10) * 0.4 - 0.5;
      rArmRef.current.rotation.x = Math.cos(t * 10) * 0.4 - 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Torso */}
      <Box args={[0.6, 0.8, 0.4]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#2a2c35" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Head */}
      <group position={[0, 1, 0]} ref={headRef}>
        <Box args={[0.4, 0.4, 0.4]}>
          <meshStandardMaterial color="#1a1c25" metalness={1} roughness={0.1} />
        </Box>
        {/* Visor */}
        <mesh position={[0, 0, 0.21]}>
          <boxGeometry args={[0.3, 0.1, 0.05]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* Left Arm */}
      <group position={[-0.4, 0.7, 0]} ref={lArmRef}>
        <Cylinder args={[0.05, 0.05, 0.6]} position={[0, -0.2, 0]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#2a2c35" />
        </Cylinder>
      </group>

      {/* Right Arm */}
      <group position={[0.4, 0.7, 0]} ref={rArmRef}>
        <Cylinder args={[0.05, 0.05, 0.6]} position={[0, -0.2, 0]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#2a2c35" />
        </Cylinder>
      </group>

      {/* Legs (Fixed) */}
      <Cylinder args={[0.08, 0.08, 0.4]} position={[-0.15, 0, 0]}>
        <meshStandardMaterial color="#1a1c25" />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.4]} position={[0.15, 0, 0]}>
        <meshStandardMaterial color="#1a1c25" />
      </Cylinder>
      
      {/* Small Glowing Core */}
      <Sphere args={[0.1]} position={[0, 0.4, 0.21]}>
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </Sphere>
    </group>
  );
};

export default function EcosystemNode({ agent, position }: Props) {
  const colorMap: Record<string, string> = {
    'Revenue Hub': '#00ffff',
    'Finance Vault': '#ffaa00',
    'Creative Studio': '#cc44ff',
    'Tech Nexus': '#0088ff',
    'Command Deck': '#ffffff'
  };
  const color = colorMap[agent.department] || "#00ffff";

  return (
    <group position={position}>
      <RoboticWorker color={color} isWorking={agent.status === 'running'} />

      <Sparkles count={15} scale={2} size={1} speed={0.2} opacity={0.3} color={color} />

      {/* Agent Badge (Floating HTML) */}
      <Html distanceFactor={15} position={[0, 2, 0]} center zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center pointer-events-none select-none w-40">
          <AnimatePresence>
            {agent.status === 'running' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[7px] text-white font-bold uppercase tracking-widest mb-2 whitespace-nowrap"
              >
                PROCCESSING_NEURAL_DATA
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-[#03010a]/95 backdrop-blur-xl border border-white/10 p-2 rounded-lg shadow-2xl flex flex-col items-center w-full">
            <div className="flex items-center gap-2 w-full mb-1">
               <span className="text-[12px]">{agent.avatar}</span>
               <div className="flex flex-col overflow-hidden">
                 <span className="text-[9px] font-black text-white uppercase tracking-tighter truncate">
                  {agent.name}
                 </span>
                 <span className="text-[6px] text-muted-foreground uppercase tracking-widest leading-none">
                  {agent.role}
                 </span>
               </div>
            </div>

            <div className="w-full space-y-1 mt-1">
              <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full shadow-[0_0_5px_currentColor]" 
                  style={{ backgroundColor: color }}
                  animate={agent.status === 'running' ? { width: ['0%', '100%'] } : { width: '40%' }}
                  transition={agent.status === 'running' ? { duration: 5, repeat: Infinity, ease: "linear" } : {}}
                />
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
