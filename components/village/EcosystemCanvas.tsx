"use client";

import { OrbitControls, PerspectiveCamera, Stars, Sparkles, Float } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import EcosystemNode from "./EcosystemNode";
import { StationSector } from "./EcosystemSectors";
import { employees } from "@/lib/data";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import ErrorBoundary from "../ErrorBoundary";

export default function EcosystemCanvas() {
  const sectors = [
    { id: 'Revenue Hub', type: 'cyan', title: 'REVENUE HUB', pos: [-35, 0, -35] },
    { id: 'Finance Vault', type: 'orange', title: 'FINANCE VAULT', pos: [35, 0, -35] },
    { id: 'Creative Studio', type: 'purple', title: 'CREATIVE STUDIO', pos: [-35, 0, 35] },
    { id: 'Tech Nexus', type: 'blue', title: 'TECH NEXUS', pos: [35, 0, 35] },
    { id: 'Command Deck', type: 'white', title: 'COMMAND DECK', pos: [0, 10, 0] },
  ] as const;

  // Map employees to sectors
  const employeesWithSectors = useMemo(() => {
    return employees.map((agent) => {
      const sector = sectors.find(s => s.id === agent.department) || sectors[0];
      
      // Random position within the sector [ROOM_SIZE=40]
      const offsetX = (Math.random() - 0.5) * 30;
      const offsetZ = (Math.random() - 0.5) * 30;
      const offsetY = agent.department === 'Command Deck' ? 0 : (Math.random() - 0.5) * 5;
      
      return {
        ...agent,
        pos: [sector.pos[0] + offsetX, sector.pos[1] + 1.5 + offsetY, sector.pos[2] + offsetZ] as [number, number, number]
      };
    });
  }, []);

  return (
    <div className="w-full h-[800px] bg-[#03010a] rounded-xl border border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      <ErrorBoundary fallback={
        <div className="flex items-center justify-center h-full bg-[#03010a] text-cyan-400 font-mono text-sm tracking-widest uppercase">
          Neural Visualization Offline - WebGL Error
        </div>
      }>
        <Canvas shadows dpr={[1, 2]}>
          <color attach="background" args={["#03010a"]} />
          <PerspectiveCamera makeDefault position={[0, 80, 100]} fov={45} />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            maxDistance={250} 
            minDistance={20}
            maxPolarAngle={Math.PI / 2.1}
            makeDefault
          />

          <fogExp2 attach="fog" args={["#03010a", 0.003]} />

          <ambientLight intensity={0.2} />
          <pointLight position={[0, 50, 0]} intensity={3} color="#ffffff" castShadow />
          <pointLight position={[-50, 20, -50]} intensity={2} color="#00ffff" />
          <pointLight position={[50, 20, 50]} intensity={2} color="#ff00ff" />

          <Suspense fallback={null}>
            {/* Global Particles */}
            <Sparkles count={1000} scale={150} size={2} speed={0.5} opacity={0.3} color="#ffffff" />
            <Sparkles count={500} scale={100} size={4} speed={1} opacity={0.2} color="#00ffff" />

            {/* Station Sectors (Floating Pods) */}
            {sectors.map((s) => (
              <StationSector 
                key={s.id} 
                position={s.pos as any} 
                type={s.type} 
                title={s.title} 
              />
            ))}

            {/* AI Agents (Ecosystem Nodes) */}
            <group>
              {employeesWithSectors.map((agent) => (
                <EcosystemNode 
                  key={agent.id} 
                  agent={agent} 
                  position={agent.pos} 
                />
              ))}
            </group>

            <Stars radius={200} depth={100} count={5000} factor={4} saturation={0} fade speed={1} />

            <EffectComposer disableNormalPass>
              <Bloom 
                intensity={2.0} 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
              />
              <ChromaticAberration offset={new THREE.Vector2(0.0015, 0.0015)} />
              <Noise opacity={0.05} />
              <Vignette eskil={false} offset={0.1} darkness={1.2} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* 4-Panel HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-20">
        <div className="flex justify-between items-start">
          {/* Top Left Panel */}
          <div className="bg-black/60 backdrop-blur-md border border-cyan-500/40 p-4 rounded-lg w-64 shadow-[0_0_20px_rgba(0,255,255,0.1)] pointer-events-auto">
            <h3 className="text-cyan-400 font-black text-xs tracking-widest uppercase mb-1">REVENUE HUB</h3>
            <p className="text-white/40 text-[8px] uppercase tracking-tighter mb-3">Sales & Market Expansion</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/60">Active Leads</span>
                <span className="text-cyan-400 mono">1,284</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-[72%]" />
              </div>
            </div>
          </div>

          {/* Top Right Panel */}
          <div className="bg-black/60 backdrop-blur-md border border-orange-500/40 p-4 rounded-lg w-64 shadow-[0_0_20px_rgba(255,170,0,0.1)] pointer-events-auto">
            <h3 className="text-orange-400 font-black text-xs tracking-widest uppercase mb-1">FINANCE VAULT</h3>
            <p className="text-white/40 text-[8px] uppercase tracking-tighter mb-3">Capital & Risk Management</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/60">Portfolio</span>
                <span className="text-green-400 mono">+12.4%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[85%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mb-20">
          {/* Bottom Left Panel */}
          <div className="bg-black/60 backdrop-blur-md border border-purple-500/40 p-4 rounded-lg w-64 shadow-[0_0_20px_rgba(200,100,255,0.1)] pointer-events-auto">
            <h3 className="text-purple-400 font-black text-xs tracking-widest uppercase mb-1">CREATIVE STUDIO</h3>
            <p className="text-white/40 text-[8px] uppercase tracking-tighter mb-3">Content & Brand Design</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/60">Assets</span>
                <span className="text-purple-400 mono">412 New</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[60%]" />
              </div>
            </div>
          </div>

          {/* Bottom Right Panel */}
          <div className="bg-black/60 backdrop-blur-md border border-blue-500/40 p-4 rounded-lg w-64 shadow-[0_0_20px_rgba(0,150,255,0.1)] pointer-events-auto">
            <h3 className="text-blue-400 font-black text-xs tracking-widest uppercase mb-1">TECH NEXUS</h3>
            <p className="text-white/40 text-[8px] uppercase tracking-tighter mb-3">IT & Cyber Defense</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/60">Security</span>
                <span className="text-green-400 mono">OPTIMAL</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[99%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Info Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none select-none text-center">
        <div className="bg-black/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
          <h2 className="text-cyan-400 font-black text-sm tracking-[0.6em] uppercase">CYBEREMPIRE - DEEP SPACE COMMAND</h2>
        </div>
      </div>
    </div>
  );
}
