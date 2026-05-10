"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";

// --- Procedural Textures ---
function useSectorTextures() {
  return useMemo(() => {
    const createTex = (type: string) => {
      const c = document.createElement('canvas'); c.width = 512; c.height = 512;
      const ctx = c.getContext('2d')!;
      
      ctx.fillStyle = '#0a0f18'; ctx.fillRect(0,0,512,512);
      ctx.strokeStyle = '#112233'; ctx.lineWidth = 2;
      
      if(type === 'cyan') {
        for(let i=0; i<=512; i+=32) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,512); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(512,i); ctx.stroke(); }
      } else if(type === 'orange') {
        const r = 20; const dy = r * 1.5; const dx = r * Math.sqrt(3);
        for(let y=0; y<512+r; y+=dy) {
          for(let x=0; x<512+r; x+=dx) {
            let cx = x + (Math.floor(y/dy)%2)*dx/2;
            ctx.beginPath();
            for(let i=0; i<6; i++) {
              const angle = Math.PI/3 * i + Math.PI/6;
              const px = cx + r * Math.cos(angle); const py = y + r * Math.sin(angle);
              if(i===0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.closePath(); ctx.stroke();
          }
        }
      } else if(type === 'blue') {
        for(let i=0; i<=512; i+=64) { ctx.strokeRect(i, 0, 64, 512); ctx.strokeRect(0, i, 512, 64); }
      } else if(type === 'purple') {
        for(let i=0; i<=512; i+=16) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,512); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(512,i); ctx.stroke(); }
      } else if(type === 'white') {
        ctx.fillStyle = '#1a1a2a'; ctx.fillRect(0,0,512,512);
        ctx.strokeStyle = '#f0f0f0'; ctx.lineWidth = 1;
        for(let i=0; i<=512; i+=128) { ctx.beginPath(); ctx.arc(i, i, 50, 0, Math.PI*2); ctx.stroke(); }
      }

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 2);
      return tex;
    };

    return {
      cyan: createTex('cyan'),
      orange: createTex('orange'),
      blue: createTex('blue'),
      purple: createTex('purple'),
      white: createTex('white')
    };
  }, []);
}

interface SectorProps {
  position: [number, number, number];
  type: 'cyan' | 'orange' | 'blue' | 'purple' | 'white';
  title: string;
}

export function StationSector({ position, type, title }: SectorProps) {
  const textures = useSectorTextures();
  const ROOM_SIZE = 40;
  const WALL_HEIGHT = 8;

  const colorMap: Record<string, string> = {
    cyan: "#00ffff",
    orange: "#ffaa00",
    blue: "#0088ff",
    purple: "#cc44ff",
    white: "#ffffff"
  };

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} position={position}>
      <group>
        {/* Pod Base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[ROOM_SIZE / 2, 32]} />
          <meshStandardMaterial map={textures[type]} roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Pod Shield / Glass */}
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[ROOM_SIZE / 2, ROOM_SIZE / 2, 1, 32, 1, true]} />
          <meshStandardMaterial color={colorMap[type]} transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>

        {/* Floating Ring around Pod */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
          <ringGeometry args={[ROOM_SIZE / 2 + 1, ROOM_SIZE / 2 + 1.5, 64]} />
          <meshBasicMaterial color={colorMap[type]} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>

        {/* Pod Core Light */}
        <pointLight position={[0, 5, 0]} color={colorMap[type]} intensity={1.5} distance={50} />

        {/* Decorative Elements */}
        {type === 'white' && (
          <group position={[0, 5, 0]}>
            <mesh>
              <torusGeometry args={[8, 0.2, 16, 100]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[10, 0.1, 16, 100]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        )}
      </group>
    </Float>
  );
}
