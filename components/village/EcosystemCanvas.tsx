"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars, PerspectiveCamera as DreiPerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import EcosystemNode from "./EcosystemNode";
import { StationSector } from "./EcosystemSectors";
import { employees } from "@/lib/data";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

export default function EcosystemCanvas() {
  const sectors = [
    { id: 'core', type: 'cyan', title: 'CORE LAB 01', pos: [-22, 0, -22] },
    { id: 'fab', type: 'orange', title: 'FABRICATION BAY 02', pos: [22, 0, -22] },
    { id: 'med', type: 'blue', title: 'MEDICAL BAY 03', pos: [-22, 0, 22] },
    { id: 'res', type: 'purple', title: 'RESEARCH HUB 04', pos: [22, 0, 22] },
  ] as const;

  // Map employees to sectors
  const employeesWithSectors = useMemo(() => {
    return employees.map((agent, i) => {
      let sectorId = 'core';
      if (['Deployment', 'Social & Content', 'Content'].includes(agent.role)) sectorId = 'fab';
      else if (['Client Success', 'Security'].includes(agent.role)) sectorId = 'med';
      else if (['Strategy', 'Market Intelligence', 'Revenue Optimization'].includes(agent.role)) sectorId = 'res';
      
      const sector = sectors.find(s => s.id === sectorId)!;
      // Random position within the sector [ROOM_SIZE=40]
      const offsetX = (Math.random() - 0.5) * 25;
      const offsetZ = (Math.random() - 0.5) * 25;
      
      return {
        ...agent,
        pos: [sector.pos[0] + offsetX, 1.5, sector.pos[2] + offsetZ] as [number, number, number]
      };
    });
  }, []);

  return (
    <div className="w-full h-[800px] bg-[#03010a] rounded-xl border border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      <Canvas shadows dpr={[1, 2]}>
        <color attach="background" args={["#03010a"]} />
        <PerspectiveCamera makeDefault position={[0, 60, 60]} fov={45} />
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          maxDistance={150} 
          minDistance={10}
          maxPolarAngle={Math.PI / 2.1}
          makeDefault
        />

        <fogExp2 attach="fog" args={["#03010a", 0.005]} />

        <ambientLight intensity={0.4} />
        <pointLight position={[50, 50, 50]} intensity={2} color="#ffffff" castShadow />
        <pointLight position={[-50, 20, -50]} intensity={1} color="#00ffff" />

        <Suspense fallback={null}>
          {/* Main Corridors */}
          <mesh position={[0, -0.1, 0]} receiveShadow>
            <boxGeometry args={[100, 0.2, 4]} />
            <meshStandardMaterial color="#11111a" />
          </mesh>
          <mesh position={[0, -0.1, 0]} receiveShadow>
            <boxGeometry args={[4, 0.2, 100]} />
            <meshStandardMaterial color="#11111a" />
          </mesh>

          {/* Station Sectors */}
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

          <Stars radius={150} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

          <EffectComposer disableNormalPass>
            <Bloom 
              intensity={1.5} 
              luminanceThreshold={0.4} 
              luminanceSmoothing={0.1} 
            />
            <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
            <Noise opacity={0.03} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* 4-Panel HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-20">
        <div className="flex justify-between items-start">
          {/* Top Left Panel */}
          <div className="bg-black/60 backdrop-blur-md border border-cyan-500/40 p-4 rounded-lg w-64 shadow-[0_0_20px_rgba(0,255,255,0.1)] pointer-events-auto">
            <h3 className="text-cyan-400 font-black text-xs tracking-widest uppercase mb-1">CORE LAB 01</h3>
            <p className="text-white/40 text-[8px] uppercase tracking-tighter mb-3">Neural Interface Research</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/60">Power</span>
                <span className="text-green-400 mono">97%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[97%]" />
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/60">AI Sync</span>
                <span className="text-cyan-400 mono">ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Top Right Panel */}
          <div className="bg-black/60 backdrop-blur-md border border-orange-500/40 p-4 rounded-lg w-64 shadow-[0_0_20px_rgba(255,170,0,0.1)] pointer-events-auto">
            <h3 className="text-orange-400 font-black text-xs tracking-widest uppercase mb-1">FAB BAY 02</h3>
            <p className="text-white/40 text-[8px] uppercase tracking-tighter mb-3">Advanced Deployment Matrix</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/60">Traffic</span>
                <span className="text-orange-400 mono">812/1000</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[81%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mb-20">
          {/* Bottom Left Panel */}
          <div className="bg-black/60 backdrop-blur-md border border-blue-500/40 p-4 rounded-lg w-64 shadow-[0_0_20px_rgba(0,150,255,0.1)] pointer-events-auto">
            <h3 className="text-blue-400 font-black text-xs tracking-widest uppercase mb-1">MED BAY 03</h3>
            <p className="text-white/40 text-[8px] uppercase tracking-tighter mb-3">System Diagnostics & Health</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="text-red-500 text-lg">♥</div>
              <div className="mono text-white text-xl">72 <span className="text-[10px] text-white/40">BPM</span></div>
            </div>
          </div>

          {/* Bottom Right Panel */}
          <div className="bg-black/60 backdrop-blur-md border border-purple-500/40 p-4 rounded-lg w-64 shadow-[0_0_20px_rgba(200,100,255,0.1)] pointer-events-auto">
            <h3 className="text-purple-400 font-black text-xs tracking-widest uppercase mb-1">RESEARCH HUB 04</h3>
            <p className="text-white/40 text-[8px] uppercase tracking-tighter mb-3">Quantum Neural Models</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/60">Genesis</span>
                <span className="text-purple-400 mono">68%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[68%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Info Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none select-none text-center">
        <div className="bg-black/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10">
          <h2 className="text-cyan-400 font-black text-sm tracking-[0.6em] uppercase">Station Sector 4 - Management</h2>
        </div>
      </div>
    </div>
  );
}
