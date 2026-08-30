"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Text, Cylinder, Box, Torus, Ring } from "@react-three/drei";

const REVENUE_BAR_HEIGHTS = [1.4, 2.8, 1.9, 3.6, 2.3] as const;

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

// --- Procedural Hexagonal Texture ---
function useSectorTextures() {
  return useMemo(() => {
    const createHexTex = (color: string) => {
      const c = document.createElement('canvas'); c.width = 512; c.height = 512;
      const ctx = c.getContext('2d')!;
      
      // Background
      ctx.fillStyle = '#050810';
      ctx.fillRect(0, 0, 512, 512);
      
      // Hex Grid
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      
      // Draw a clean hex grid.
      ctx.globalAlpha = 0.2;
      const size = 40;
      for (let y = 0; y < 600; y += size * 1.5) {
        for (let x = 0; x < 600; x += size * Math.sqrt(3)) {
          const cx = x + ((Math.floor(y / (size * 1.5)) % 2) * size * Math.sqrt(3) / 2);
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            ctx.lineTo(cx + size * Math.cos(angle), y + size * Math.sin(angle));
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      // Add some "circuit" lines
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 2;
      for(let i=0; i<10; i++) {
        ctx.beginPath();
        const startX = seededUnit(i + color.length) * 512;
        const startY = seededUnit(i + color.length + 20) * 512;
        ctx.moveTo(startX, startY);
        ctx.lineTo(
          startX + (seededUnit(i + color.length + 40) - 0.5) * 100,
          startY + (seededUnit(i + color.length + 60) - 0.5) * 100,
        );
        ctx.stroke();
      }

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 1);
      return tex;
    };

    return {
      cyan: createHexTex('#00ffff'),
      orange: createHexTex('#ffaa00'),
      blue: createHexTex('#0088ff'),
      purple: createHexTex('#cc44ff'),
      white: createHexTex('#ffffff')
    };
  }, []);
}

interface SectorProps {
  position: [number, number, number];
  type: 'cyan' | 'orange' | 'blue' | 'purple' | 'white';
  title: string;
}

const HolographicCenterpiece = ({ type, color }: { type: string, color: string }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={[0, 4, 0]}>
      {/* Base Glow */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 4, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Icon Placeholder (Geometric) */}
      {type === 'cyan' && ( // Revenue Hub -> Trading Matrix
        <group>
          {REVENUE_BAR_HEIGHTS.map((height, i) => (
            <Box key={i} args={[0.5, height, 0.5]} position={[(i - 2) * 1.2, 0, 0]}>
              <meshBasicMaterial color={color} transparent opacity={0.6} />
            </Box>
          ))}
        </group>
      )}
      
      {type === 'orange' && ( // Finance Vault -> Shield/Core
        <Cylinder args={[2, 2, 0.5, 6]}>
          <meshBasicMaterial color={color} wireframe transparent opacity={0.8} />
        </Cylinder>
      )}
      
      {type === 'purple' && ( // Creative Studio -> DNA/Helix
        <group>
          {[...Array(10)].map((_, i) => (
            <mesh key={i} position={[Math.sin(i * 0.5) * 1.5, (i - 5) * 0.5, Math.cos(i * 0.5) * 1.5]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshBasicMaterial color={color} />
            </mesh>
          ))}
        </group>
      )}
      
      {type === 'blue' && ( // Tech Nexus -> Brain/Neural Net
        <group>
          <mesh>
            <sphereGeometry args={[2, 16, 16]} />
            <meshBasicMaterial color={color} wireframe transparent opacity={0.4} />
          </mesh>
          <Float speed={5} rotationIntensity={2}>
             <mesh>
                <icosahedronGeometry args={[1, 1]} />
                <meshBasicMaterial color={color} transparent opacity={0.8} />
             </mesh>
          </Float>
        </group>
      )}
      
      {type === 'white' && ( // Command Deck -> Sovereign Star
        <Torus args={[2, 0.1, 16, 100]}>
          <meshBasicMaterial color={color} transparent opacity={1} />
        </Torus>
      )}

      {/* Holographic Rays */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[4, 4, 8, 32, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.05} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

export function StationSector({ position, type, title }: SectorProps) {
  const textures = useSectorTextures();
  const ROOM_SIZE = 40;

  const colorMap: Record<string, string> = {
    cyan: "#00ffff",
    orange: "#ffaa00",
    blue: "#0088ff",
    purple: "#cc44ff",
    white: "#ffffff"
  };

  const color = colorMap[type];

  return (
    <group position={position}>
      {/* Pod Interior Container */}
      <group>
        {/* Hexagonal Base (Metallic Frame) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <cylinderGeometry args={[ROOM_SIZE / 2 + 1, ROOM_SIZE / 2 + 1, 1, 6]} />
          <meshStandardMaterial color="#1a1c25" metalness={1} roughness={0.2} />
        </mesh>

        {/* Floor Pattern (Hex Grid) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.51, 0]} receiveShadow>
          <cylinderGeometry args={[ROOM_SIZE / 2, ROOM_SIZE / 2, 0.1, 6]} />
          <meshPhysicalMaterial 
            map={textures[type]} 
            emissive={color}
            emissiveIntensity={0.2}
            roughness={0.1} 
            metalness={0.8} 
          />
        </mesh>

        {/* Neon Floor Edge */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.55, 0]}>
          <ringGeometry args={[ROOM_SIZE / 2 - 0.5, ROOM_SIZE / 2, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>

        {/* Corner Pillars */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (Math.PI / 3) * i;
          const px = Math.cos(angle) * (ROOM_SIZE / 2);
          const pz = Math.sin(angle) * (ROOM_SIZE / 2);
          return (
            <group key={i} position={[px, 4, pz]}>
              <mesh>
                <boxGeometry args={[1, 8, 1]} />
                <meshStandardMaterial color="#0a0c14" metalness={1} roughness={0.1} />
              </mesh>
              {/* Accent Light on Pillar */}
              <mesh position={[0, 0, 0.51]}>
                <boxGeometry args={[0.2, 7, 0.1]} />
                <meshBasicMaterial color={color} />
              </mesh>
            </group>
          );
        })}

        {/* Holographic Centerpiece */}
        <HolographicCenterpiece type={type} color={color} />

        {/* Floating Metrics / HUD */}
        <group position={[0, 10, -ROOM_SIZE/2]}>
          <Text
            fontSize={1.5}
            color={color}
            font="/fonts/JetBrainsMono-Bold.ttf"
            anchorX="center"
            anchorY="middle"
            maxWidth={20}
          >
            {title}
          </Text>
          <mesh position={[0, -1.5, 0]}>
            <boxGeometry args={[15, 0.1, 0.1]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>
        </group>

        {/* Ambient Pod Light */}
        <pointLight position={[0, 6, 0]} color={color} intensity={2} distance={30} />
      </group>
    </group>
  );
}
