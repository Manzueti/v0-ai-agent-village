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
      
      if(type === 'cyan_grid') {
        ctx.fillStyle = '#0a0f18'; ctx.fillRect(0,0,512,512);
        ctx.strokeStyle = '#112233'; ctx.lineWidth = 2;
        for(let i=0; i<=512; i+=32) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,512); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(512,i); ctx.stroke(); }
        ctx.fillStyle = 'rgba(0, 255, 255, 0.05)'; ctx.fillRect(128, 128, 256, 256);
      } else if(type === 'orange_hex') {
        ctx.fillStyle = '#15100a'; ctx.fillRect(0,0,512,512);
        ctx.strokeStyle = '#2a1a05'; ctx.lineWidth = 2;
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
      } else if(type === 'blue_med') {
        ctx.fillStyle = '#050a15'; ctx.fillRect(0,0,512,512);
        ctx.strokeStyle = '#0a152a'; ctx.lineWidth = 4;
        for(let i=0; i<=512; i+=64) { ctx.strokeRect(i, 0, 64, 512); ctx.strokeRect(0, i, 512, 64); }
      } else if(type === 'purple_circuit') {
        ctx.fillStyle = '#0a0515'; ctx.fillRect(0,0,512,512);
        ctx.strokeStyle = '#1a0a2a'; ctx.lineWidth = 2;
        for(let i=0; i<=512; i+=16) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,512); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(512,i); ctx.stroke(); }
      }

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 2);
      return tex;
    };

    return {
      cyan: createTex('cyan_grid'),
      orange: createTex('orange_hex'),
      blue: createTex('blue_med'),
      purple: createTex('purple_circuit')
    };
  }, []);
}

// --- Props & Sub-components ---

const RoboArm = ({ position, rotation = [0, 0, 0], color = "#ffaa00" }: any) => {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <group position={position} rotation={rotation} ref={group}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1.5, 2, 2, 16]} />
        <meshStandardMaterial color="#222533" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} />
      </mesh>
      <group position={[0, 2.5, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <mesh position={[0, 2, 0.5]}>
          <boxGeometry args={[1.2, 5, 1.2]} />
          <meshStandardMaterial color={color} metalness={0.8} />
        </mesh>
        <mesh position={[0, 4.5, 1.5]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#222533" />
        </mesh>
      </group>
    </group>
  );
};

const DNAHelix = ({ position }: any) => {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) group.current.rotation.y += 0.02;
  });

  return (
    <group position={position} ref={group}>
      {[...Array(16)].map((_, i) => {
        const y = (i - 8) * 0.6;
        const a = i * 0.5;
        return (
          <group key={i} position={[0, y, 0]} rotation={[0, a, 0]}>
            <mesh position={[2.5, 0, 0]}>
              <sphereGeometry args={[0.3, 8, 8]} />
              <meshBasicMaterial color="#ff00aa" />
            </mesh>
            <mesh position={[-2.5, 0, 0]}>
              <sphereGeometry args={[0.3, 8, 8]} />
              <meshBasicMaterial color="#00ffff" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 5]} />
              <meshBasicMaterial color="#cc44ff" transparent opacity={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

interface SectorProps {
  position: [number, number, number];
  type: 'cyan' | 'orange' | 'blue' | 'purple';
  title: string;
}

export function StationSector({ position, type, title }: SectorProps) {
  const textures = useSectorTextures();
  const ROOM_SIZE = 40;
  const WALL_HEIGHT = 6;
  const WALL_THICK = 2;

  const colorMap: Record<string, string> = {
    cyan: "#00ffff",
    orange: "#ffaa00",
    blue: "#0088ff",
    purple: "#cc44ff"
  };

  return (
    <group position={position}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
        <meshStandardMaterial map={textures[type]} roughness={0.6} />
      </mesh>

      {/* Walls */}
      <group>
        {/* Simplified walls for performance */}
        <mesh position={[0, WALL_HEIGHT / 2, -ROOM_SIZE / 2 + WALL_THICK / 2]}>
          <boxGeometry args={[ROOM_SIZE, WALL_HEIGHT, WALL_THICK]} />
          <meshStandardMaterial color="#11111a" />
        </mesh>
        <mesh position={[0, WALL_HEIGHT / 2, ROOM_SIZE / 2 - WALL_THICK / 2]}>
          <boxGeometry args={[ROOM_SIZE, WALL_HEIGHT, WALL_THICK]} />
          <meshStandardMaterial color="#11111a" />
        </mesh>
        <mesh position={[-ROOM_SIZE / 2 + WALL_THICK / 2, WALL_HEIGHT / 2, 0]}>
          <boxGeometry args={[WALL_THICK, WALL_HEIGHT, ROOM_SIZE]} />
          <meshStandardMaterial color="#11111a" />
        </mesh>
        <mesh position={[ROOM_SIZE / 2 - WALL_THICK / 2, WALL_HEIGHT / 2, 0]}>
          <boxGeometry args={[WALL_THICK, WALL_HEIGHT, ROOM_SIZE]} />
          <meshStandardMaterial color="#11111a" />
        </mesh>
      </group>

      {/* Corner Glows */}
      {[-1, 1].map(x => [-1, 1].map(z => (
        <mesh key={`${x}-${z}`} position={[x * (ROOM_SIZE / 2 - 1.5), WALL_HEIGHT - 0.5, z * (ROOM_SIZE / 2 - 1.5)]}>
          <boxGeometry args={[3, 0.5, 3]} />
          <meshBasicMaterial color={colorMap[type]} />
        </mesh>
      )))}

      {/* Sector Specific Props */}
      {type === 'cyan' && (
        <group>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[3, 4, 1, 16]} />
            <meshStandardMaterial color="#222533" />
          </mesh>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 3, 16]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          <pointLight position={[0, 5, 0]} color="#00ffff" intensity={1} />
        </group>
      )}

      {type === 'orange' && (
        <group>
          <RoboArm position={[-8, 0, -8]} color="#ffaa00" />
          <RoboArm position={[8, 0, 8]} color="#ffaa00" rotation={[0, Math.PI, 0]} />
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[10, 3, 10]} />
            <meshStandardMaterial color="#222533" />
          </mesh>
          <mesh position={[0, 1.6, 0]}>
            <boxGeometry args={[9, 3.1, 9]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.3} />
          </mesh>
        </group>
      )}

      {type === 'blue' && (
        <group>
          {[[-10, -10], [10, -10], [-10, 10], [10, 10]].map((pos, i) => (
            <group key={i} position={[pos[0], 0, pos[1]]}>
              <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[4, 1, 6]} />
                <meshStandardMaterial color="#222533" />
              </mesh>
              <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[1, 1, 4, 16]} />
                <meshPhysicalMaterial color="#88ccff" transmission={0.9} thickness={1} roughness={0.1} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {type === 'purple' && (
        <group>
          <DNAHelix position={[0, 5, 0]} />
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[4, 5, 1, 16]} />
            <meshStandardMaterial color="#222533" />
          </mesh>
        </group>
      )}
    </group>
  );
}
