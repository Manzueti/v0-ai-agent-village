"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars, Grid } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import EcosystemNode from "./EcosystemNode";
import { employees } from "@/lib/data";
import { Suspense } from "react";

export default function EcosystemCanvas() {
  return (
    <div className="w-full h-[700px] bg-black rounded-xl border border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <Canvas shadows dpr={[1, 2]}>
        <color attach="background" args={["#030303"]} />
        <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={50} />
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          maxDistance={40} 
          minDistance={5}
          autoRotate
          autoRotateSpeed={0.5}
        />

        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00ffff" />

        <Suspense fallback={null}>
          <group>
            {employees.map((agent, i) => {
              const row = Math.floor(i / 4);
              const col = i % 4;
              const x = (col - 1.5) * 6;
              const z = (row - 1.5) * 6;
              return (
                <EcosystemNode 
                  key={agent.id} 
                  agent={agent} 
                  position={[x, 0, z]} 
                />
              );
            })}
          </group>

          <Grid
            infiniteGrid
            fadeDistance={50}
            fadeStrength={5}
            cellSize={1}
            sectionSize={5}
            sectionColor="#00ffff"
            sectionThickness={1.5}
            cellColor="#111111"
            cellThickness={1}
            position={[0, -2, 0]}
          />

          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          <EffectComposer>
            <Bloom 
              intensity={1.2} 
              luminanceThreshold={0.9} 
              luminanceSmoothing={0.025} 
            />
            <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
            <Noise opacity={0.02} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* HUD Overlay */}
      <div className="absolute top-6 left-6 pointer-events-none select-none">
        <div className="border-l-2 border-cyan-500 pl-4 py-1 bg-black/40 backdrop-blur-sm pr-6 rounded-r-lg">
          <h2 className="text-cyan-400 font-black text-lg tracking-[0.4em] uppercase">Ecosystem Matrix</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Live Simulation: {employees.length} Neural Nodes Active</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 pointer-events-none select-none">
        <div className="text-right">
          <p className="text-cyan-500/40 text-[8px] font-black uppercase tracking-[0.3em]">Sector: Habitat_01</p>
          <p className="text-cyan-500/40 text-[8px] font-black uppercase tracking-[0.3em]">Visualizer: R3F_CORE_V4</p>
        </div>
      </div>
    </div>
  );
}

// Ensure THREE is available for the post-processing components
import * as THREE from "three";
