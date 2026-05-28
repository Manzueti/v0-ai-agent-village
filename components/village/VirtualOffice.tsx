"use client";

import { useRef, useMemo, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, PerspectiveCamera, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { employees } from "@/lib/data";
import { Employee } from "@/lib/types";
import ErrorBoundary from "../ErrorBoundary";

// ─── Constants ──────────────────────────────────────────────────────────────

type Activity = "coding" | "reviewing" | "standup" | "deploying" | "idle";

const DEPT_COLORS: Record<string, string> = {
  "Revenue Hub":    "#00e5ff",
  "Finance Vault":  "#ffb300",
  "Creative Studio":"#ce93d8",
  "Tech Nexus":     "#448aff",
  "Command Deck":   "#69ff47",
};

// Department base positions and row layout
const DEPT_BASES: Record<string, [number, number, number]> = {
  "Revenue Hub":    [-36, 0, -28],
  "Finance Vault":  [ 2,  0, -28],
  "Creative Studio":[-36, 0,  10],
  "Tech Nexus":     [ 2,  0,  10],
  "Command Deck":   [-12, 0,  -6],
};

const PER_ROW = 4;
const DESK_SPACING_X = 4.2;
const DESK_SPACING_Z = 5.5;

function getDeskPositions(dept: string, count: number): [number, number, number][] {
  const base = DEPT_BASES[dept] ?? [0, 0, 0];
  const out: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const col = i % PER_ROW;
    const row = Math.floor(i / PER_ROW);
    out.push([base[0] + col * DESK_SPACING_X, 0, base[2] + row * DESK_SPACING_Z]);
  }
  return out;
}

// ─── Office Room ─────────────────────────────────────────────────────────────

function OfficeRoom() {
  const floorMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#12122a", roughness: 0.85, metalness: 0.05 }), []);
  const wallMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0e0e20", roughness: 1.0 }), []);
  const ceilMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0b0b1a", roughness: 1.0 }), []);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow material={floorMat}>
        <planeGeometry args={[120, 90]} />
      </mesh>

      {/* Floor grid overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[120, 90]} />
        <meshBasicMaterial color="#1a2a6c" wireframe transparent opacity={0.12} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 11, 0]} material={ceilMat}>
        <planeGeometry args={[120, 90]} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 5.5, -45]} material={wallMat}>
        <planeGeometry args={[120, 11]} />
      </mesh>
      <mesh position={[0, 5.5, 45]} rotation={[0, Math.PI, 0]} material={wallMat}>
        <planeGeometry args={[120, 11]} />
      </mesh>
      <mesh position={[-60, 5.5, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMat}>
        <planeGeometry args={[90, 11]} />
      </mesh>
      <mesh position={[60, 5.5, 0]} rotation={[0, -Math.PI / 2, 0]} material={wallMat}>
        <planeGeometry args={[90, 11]} />
      </mesh>

      {/* Wall accent strips */}
      <mesh position={[0, 10.5, -44.9]}>
        <planeGeometry args={[120, 0.08]} />
        <meshBasicMaterial color="#1a3a6c" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.5, -44.9]}>
        <planeGeometry args={[120, 0.06]} />
        <meshBasicMaterial color="#1a2050" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ─── Ceiling Lights ──────────────────────────────────────────────────────────

function CeilingLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[2.5, 0.08, 0.6]} />
        <meshBasicMaterial color="#cce8ff" />
      </mesh>
      <pointLight intensity={18} distance={22} color="#bbd5ff" decay={2} castShadow shadow-mapSize={256} />
    </group>
  );
}

// ─── Monitor Screen ───────────────────────────────────────────────────────────

const CODE_CONTENT: Record<Activity, { lines: string[]; title: string }> = {
  coding: {
    title: "editor.ts",
    lines: [
      "async fn run_agent() {",
      "  let ctx = Context::new();",
      "+ let res = model.infer(ctx)",
      "+ .await?;",
      "- old_sync_call(ctx);",
      "  emit(res.tokens);",
      "}",
    ],
  },
  reviewing: {
    title: "PR #482 · diff",
    lines: [
      "Files changed: 4",
      "+ auth/session.ts",
      "+ types/agent.d.ts",
      "~ api/handler.ts",
      "- legacy/sync.js",
      "◎ 3 comments pending",
    ],
  },
  standup: {
    title: "Standup · today",
    lines: [
      "✓ Shipped PR #479",
      "✓ Fixed rate limiter",
      "→ Reviewing PR #482",
      "→ Deploy staging",
      "⚡ Blocker: none",
    ],
  },
  deploying: {
    title: "deploy · v2.4.1",
    lines: [
      "▶ Pipeline running",
      "✓ lint  passed",
      "✓ build passed",
      "⟳ tests  87%",
      "░░░░░████ 72%",
    ],
  },
  idle: {
    title: "idle",
    lines: ["—", "awaiting task", "—"],
  },
};

function MonitorScreen({ activity, color }: { activity: Activity; color: string }) {
  const { lines, title } = CODE_CONTENT[activity];

  return (
    <group>
      {/* Monitor bezel */}
      <mesh>
        <boxGeometry args={[1.5, 1.0, 0.06]} />
        <meshStandardMaterial color="#111118" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Screen face */}
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[1.38, 0.88]} />
        <meshBasicMaterial color="#04091a" />
      </mesh>

      {/* Screen content — HTML overlay */}
      <Html position={[0, 0, 0.065]} transform scale={0.075} center>
        <div
          style={{
            width: 180,
            fontFamily: '"Courier New", monospace',
            fontSize: 11,
            padding: "6px 8px",
            background: "transparent",
            userSelect: "none",
            lineHeight: 1.65,
          }}
        >
          <div style={{ color, marginBottom: 4, fontSize: 9, letterSpacing: "0.1em", opacity: 0.9 }}>
            ◈ {title}
          </div>
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                color: line.startsWith("+")
                  ? "#4ec994"
                  : line.startsWith("-")
                  ? "#f47174"
                  : line.startsWith("✓")
                  ? "#4ec994"
                  : line.startsWith("⚡")
                  ? "#ffb74d"
                  : line.startsWith("⟳") || line.startsWith("░")
                  ? "#ffcc02"
                  : "#7ea8c4",
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </Html>

      {/* Stand neck */}
      <mesh position={[0, -0.62, 0]}>
        <boxGeometry args={[0.1, 0.24, 0.08]} />
        <meshStandardMaterial color="#1a1a28" metalness={0.9} />
      </mesh>
      {/* Stand base */}
      <mesh position={[0, -0.75, 0.06]}>
        <boxGeometry args={[0.45, 0.04, 0.22]} />
        <meshStandardMaterial color="#1a1a28" metalness={0.9} />
      </mesh>
    </group>
  );
}

// ─── Agent Figure (seated) ────────────────────────────────────────────────────

function AgentFigure({ color, activity }: { color: string; activity: Activity }) {
  const root  = useRef<THREE.Group>(null);
  const head  = useRef<THREE.Mesh>(null);
  const lArm  = useRef<THREE.Group>(null);
  const rArm  = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (root.current) root.current.position.y = Math.sin(t * 0.9) * 0.015;
    if (head.current) {
      if (activity === "coding" || activity === "reviewing") {
        head.current.rotation.x = Math.sin(t * 0.35) * 0.12 - 0.08;
        head.current.rotation.y = Math.sin(t * 0.28) * 0.08;
      } else if (activity === "standup") {
        head.current.rotation.x = 0;
        head.current.rotation.y = Math.sin(t * 1.2) * 0.25;
      } else {
        head.current.rotation.x = Math.sin(t * 0.15) * 0.06;
      }
    }
    if (activity === "coding") {
      if (lArm.current) lArm.current.rotation.x = Math.sin(t * 8) * 0.18 - 0.55;
      if (rArm.current) rArm.current.rotation.x = Math.cos(t * 8) * 0.18 - 0.55;
    }
  });

  return (
    <group ref={root}>
      {/* Torso */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.38, 0.52, 0.22]} />
        <meshStandardMaterial color="#1c1e38" metalness={0.2} roughness={0.75} />
      </mesh>
      {/* Shirt glow stripe */}
      <mesh position={[0, 0.55, 0.115]}>
        <planeGeometry args={[0.2, 0.3]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
      {/* Head */}
      <group position={[0, 0.97, 0]} ref={head}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#252545" metalness={0.15} roughness={0.65} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.08, 0.03, 0.152]}>
          <boxGeometry args={[0.07, 0.028, 0.01]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={[0.08, 0.03, 0.152]}>
          <boxGeometry args={[0.07, 0.028, 0.01]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
      {/* Left arm */}
      <group position={[-0.24, 0.72, 0.04]} ref={lArm}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.1, 0.36, 0.12]} />
          <meshStandardMaterial color="#1c1e38" />
        </mesh>
      </group>
      {/* Right arm */}
      <group position={[0.24, 0.72, 0.04]} ref={rArm}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.1, 0.36, 0.12]} />
          <meshStandardMaterial color="#1c1e38" />
        </mesh>
      </group>
      {/* Legs (seated position — bent at hips) */}
      <mesh position={[-0.1, 0.25, 0.18]} rotation={[0.9, 0, 0]} castShadow>
        <boxGeometry args={[0.13, 0.34, 0.13]} />
        <meshStandardMaterial color="#141424" />
      </mesh>
      <mesh position={[0.1, 0.25, 0.18]} rotation={[0.9, 0, 0]} castShadow>
        <boxGeometry args={[0.13, 0.34, 0.13]} />
        <meshStandardMaterial color="#141424" />
      </mesh>
    </group>
  );
}

// ─── Desk Unit ────────────────────────────────────────────────────────────────

interface DeskProps {
  position: [number, number, number];
  agent: Employee;
  activity: Activity;
  isSelected: boolean;
  onSelect: () => void;
}

function DeskUnit({ position, agent, activity, isSelected, onSelect }: DeskProps) {
  const color = DEPT_COLORS[agent.department] ?? "#00e5ff";

  return (
    <group position={position}>
      {/* Desk surface */}
      <mesh position={[0, 0.76, 0]} castShadow receiveShadow onClick={onSelect}>
        <boxGeometry args={[2.0, 0.07, 1.0]} />
        <meshStandardMaterial color={isSelected ? "#1e2248" : "#16182e"} roughness={0.45} metalness={0.35} />
      </mesh>

      {/* Desk legs */}
      {([ [-0.88, -0.38], [0.88, -0.38], [-0.88, 0.42], [0.88, 0.42] ] as [number, number][]).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.37, z]}>
          <boxGeometry args={[0.06, 0.75, 0.06]} />
          <meshStandardMaterial color="#0c0c1c" metalness={0.85} roughness={0.15} />
        </mesh>
      ))}

      {/* Selected glow strip along front edge */}
      {isSelected && (
        <mesh position={[0, 0.8, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 0.04]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>
      )}

      {/* Keyboard */}
      <mesh position={[0, 0.81, 0.12]}>
        <boxGeometry args={[0.72, 0.025, 0.28]} />
        <meshStandardMaterial color="#0d0d1e" roughness={0.7} />
      </mesh>

      {/* Monitor — back of desk */}
      <group position={[0, 1.6, -0.26]}>
        <MonitorScreen activity={activity} color={color} />
      </group>

      {/* Agent figure — seated at desk */}
      <group position={[0, 0, 0.72]} rotation={[0, Math.PI, 0]}>
        <AgentFigure color={color} activity={activity} />
      </group>

      {/* Chair seat */}
      <mesh position={[0, 0.46, 0.92]} castShadow>
        <boxGeometry args={[0.52, 0.06, 0.46]} />
        <meshStandardMaterial color="#0e0e20" roughness={0.85} />
      </mesh>
      {/* Chair back */}
      <mesh position={[0, 0.76, 1.14]}>
        <boxGeometry args={[0.48, 0.5, 0.06]} />
        <meshStandardMaterial color="#0e0e20" roughness={0.85} />
      </mesh>
      {/* Chair leg post */}
      <mesh position={[0, 0.22, 0.92]}>
        <boxGeometry args={[0.05, 0.44, 0.05]} />
        <meshStandardMaterial color="#08081a" metalness={0.8} />
      </mesh>

      {/* Name badge HTML */}
      <Html
        position={[0, 2.9, 0]}
        center
        distanceFactor={20}
        zIndexRange={[100, 0]}
        occlude={false}
      >
        <div
          onClick={onSelect}
          style={{
            background: isSelected ? "rgba(8,12,40,0.95)" : "rgba(5,8,28,0.82)",
            border: `1px solid ${isSelected ? color : color + "33"}`,
            borderRadius: 6,
            padding: "5px 10px",
            fontFamily: "monospace",
            fontSize: 9,
            color: "#c8d8f0",
            whiteSpace: "nowrap",
            cursor: "pointer",
            boxShadow: isSelected ? `0 0 16px ${color}66` : "none",
            transition: "all 0.2s",
            lineHeight: 1.6,
          }}
        >
          <span style={{ marginRight: 4 }}>{agent.avatar}</span>
          <strong style={{ color: "#fff" }}>{agent.name}</strong>
          <span style={{ color: "#8899bb", marginLeft: 4 }}>· {agent.role}</span>
          <br />
          <span style={{ color, fontSize: 8, letterSpacing: "0.12em" }}>
            {activity === "idle" ? "◌ idle" : `▶ ${activity}`}
          </span>
        </div>
      </Html>
    </group>
  );
}

// ─── Department Zone Marker ───────────────────────────────────────────────────

function ZoneMarker({ position, label, color }: { position: [number, number, number]; label: string; color: string }) {
  return (
    <group position={position}>
      {/* Floor tint */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[18, 14]} />
        <meshBasicMaterial color={color} transparent opacity={0.025} />
      </mesh>
      {/* Border lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <planeGeometry args={[18, 14]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.08} />
      </mesh>

      <Html position={[0, 0.3, -8]} center distanceFactor={28}>
        <div style={{
          fontFamily: "monospace",
          fontSize: 8,
          color,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          opacity: 0.55,
          userSelect: "none",
          whiteSpace: "nowrap",
        }}>
          ▸ {label}
        </div>
      </Html>
    </group>
  );
}

// ─── Conference Table ─────────────────────────────────────────────────────────

function ConferenceRoom({ standupAgents }: { standupAgents: Employee[] }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.08 + Math.sin(clock.getElapsedTime() * 1.5) * 0.03;
    }
  });

  return (
    <group position={[35, 0, -16]}>
      {/* Room divider walls (glass-like) */}
      <mesh position={[-6, 3.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[16, 7]} />
        <meshBasicMaterial color="#1a3a6c" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 3.5, -8]}>
        <planeGeometry args={[12, 7]} />
        <meshBasicMaterial color="#1a3a6c" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* Table surface */}
      <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
        <boxGeometry args={[7, 0.1, 3.5]} />
        <meshStandardMaterial color="#1a1f3c" roughness={0.3} metalness={0.55} />
      </mesh>
      {/* Table legs */}
      {([ [-3.2,-1.4],[ 3.2,-1.4],[-3.2,1.4],[ 3.2,1.4] ] as [number,number][]).map(([x,z],i)=>(
        <mesh key={i} position={[x, 0.38, z]}>
          <boxGeometry args={[0.1, 0.75, 0.1]} />
          <meshStandardMaterial color="#0a0a1a" metalness={0.9} />
        </mesh>
      ))}

      {/* Holographic centerpiece */}
      <mesh ref={ref} position={[0, 1.0, 0]}>
        <boxGeometry args={[2.0, 0.6, 0.02]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.84, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 1.0]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.06} />
      </mesh>

      {/* Whiteboard on wall */}
      <group position={[0, 4.5, -7.8]}>
        <mesh>
          <boxGeometry args={[5, 2.5, 0.06]} />
          <meshStandardMaterial color="#0f1428" roughness={0.2} metalness={0.4} />
        </mesh>
        <Html position={[0, 0, 0.05]} transform scale={0.1} center>
          <div style={{
            width: 480, height: 230,
            fontFamily: "monospace", fontSize: 11,
            color: "#7ea8c4", padding: "10px 14px",
            lineHeight: 1.7, userSelect: "none",
          }}>
            <div style={{ color: "#00e5ff", marginBottom: 8, letterSpacing: "0.15em" }}>◈ SPRINT 14 · STANDUP</div>
            <div style={{ color: "#4ec994" }}>✓  Shipped auth refactor (PR #479)</div>
            <div style={{ color: "#4ec994" }}>✓  Fixed rate-limiter regression</div>
            <div style={{ color: "#ffcc02" }}>→  Reviewing agent task router (PR #482)</div>
            <div style={{ color: "#ffcc02" }}>→  Deploy staging env v2.4.1</div>
            <div style={{ color: "#f47174" }}>⚡ Blocked: model API quota (Gemini)</div>
          </div>
        </Html>
      </group>

      {/* Attendees around table */}
      {standupAgents.slice(0, 8).map((agent, i) => {
        const total = Math.min(standupAgents.length, 8);
        const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
        const rx = Math.cos(angle) * 3.0;
        const rz = Math.sin(angle) * 2.0;
        const color = DEPT_COLORS[agent.department] ?? "#00e5ff";
        return (
          <group key={agent.id} position={[rx, 0, rz]} rotation={[0, -angle - Math.PI / 2, 0]}>
            <AgentFigure color={color} activity="standup" />
            <Html position={[0, 1.8, 0]} center distanceFactor={22}>
              <div style={{
                background: "rgba(4,8,26,0.85)",
                border: `1px solid ${color}44`,
                borderRadius: 4,
                padding: "2px 7px",
                fontFamily: "monospace",
                fontSize: 8,
                color: "#c8d8f0",
                whiteSpace: "nowrap",
              }}>
                {agent.avatar} {agent.name.split(" ")[0]}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Room label */}
      <Html position={[0, 5.5, 0]} center distanceFactor={22}>
        <div style={{
          background: "rgba(0,229,255,0.07)",
          border: "1px solid rgba(0,229,255,0.25)",
          borderRadius: 4,
          padding: "3px 12px",
          fontFamily: "monospace",
          fontSize: 8,
          color: "#00e5ff",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}>
          ◈ Standup Room
        </div>
      </Html>

      {/* Accent light */}
      <pointLight position={[0, 8, 0]} intensity={12} distance={18} color="#99ccff" decay={2} />
    </group>
  );
}

// ─── Office Scene (inside Canvas) ─────────────────────────────────────────────

interface SceneProps {
  agentActivities: Record<string, Activity>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function OfficeSceneInner({ agentActivities, selectedId, onSelect }: SceneProps) {
  const byDept = useMemo(() => {
    const map: Record<string, Employee[]> = {};
    for (const e of employees) {
      (map[e.department] ??= []).push(e);
    }
    return map;
  }, []);

  const standupAgents = useMemo(() => employees.filter(e => e.status === "running").slice(0, 8), []);

  const ceilingLights: [number, number, number][] = [
    [-30, 10.9, -25], [-15, 10.9, -25], [0, 10.9, -25], [15, 10.9, -25], [30, 10.9, -25],
    [-30, 10.9, -5],  [-15, 10.9, -5],  [0, 10.9, -5],  [15, 10.9, -5],  [30, 10.9, -5],
    [-30, 10.9,  15], [-15, 10.9,  15], [0, 10.9,  15], [15, 10.9,  15], [30, 10.9,  15],
    [45,  10.9, -25], [45,  10.9,  -5], [45, 10.9,  15],
  ];

  return (
    <>
      <OfficeRoom />

      {ceilingLights.map((p, i) => (
        <CeilingLight key={i} position={p} />
      ))}

      {/* Ambient warm fill */}
      <ambientLight intensity={0.18} color="#b8c8f0" />

      {/* Department zones */}
      {Object.entries(DEPT_BASES).map(([dept, base]) => (
        <ZoneMarker
          key={dept}
          position={[base[0] + 6, 0, base[2] + 5]}
          label={dept}
          color={DEPT_COLORS[dept] ?? "#ffffff"}
        />
      ))}

      {/* Desk clusters per department */}
      {Object.entries(byDept).map(([dept, agents]) => {
        const positions = getDeskPositions(dept, agents.length);
        return agents.map((agent, i) => (
          <DeskUnit
            key={agent.id}
            position={positions[i]}
            agent={agent}
            activity={agentActivities[agent.id] ?? "idle"}
            isSelected={selectedId === agent.id}
            onSelect={() => onSelect(agent.id)}
          />
        ));
      })}

      {/* Conference / standup room */}
      <ConferenceRoom standupAgents={standupAgents} />

      {/* Floating ambient particles */}
      <Sparkles count={120} scale={[100, 8, 80]} size={0.8} speed={0.1} opacity={0.08} color="#6688cc" />
    </>
  );
}

// ─── HUD Overlay ──────────────────────────────────────────────────────────────

function AgentPanel({ agentId, activities }: { agentId: string; activities: Record<string, Activity> }) {
  const agent = employees.find(e => e.id === agentId);
  if (!agent) return null;
  const color = DEPT_COLORS[agent.department] ?? "#00e5ff";
  const activity = activities[agent.id] ?? "idle";

  return (
    <div
      className="absolute bottom-5 left-5 rounded-xl p-4 w-60 pointer-events-none"
      style={{
        background: "rgba(6,10,30,0.88)",
        border: `1px solid ${color}55`,
        boxShadow: `0 0 20px ${color}22`,
        fontFamily: "monospace",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{agent.avatar}</span>
        <div>
          <div className="text-white text-xs font-bold">{agent.name}</div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color }}>{agent.role}</div>
        </div>
      </div>
      <div className="space-y-1.5 text-[10px]">
        {[
          ["Dept",    agent.department,                   "#8899cc"],
          ["Model",   agent.aiModel,                      "#8899cc"],
          ["Activity",activity.toUpperCase(),             color    ],
          ["Tasks",   String(agent.tasksCompleted),       "#c8d8f0"],
          ["Success", `${agent.successRate}%`,            "#4ec994"],
          ["Level",   `${agent.level}  (${agent.xp} XP)`,"#8899cc"],
        ].map(([k, v, c]) => (
          <div key={k} className="flex justify-between">
            <span className="text-white/40">{k}</span>
            <span style={{ color: c }}>{v}</span>
          </div>
        ))}
      </div>
      {/* XP bar */}
      <div className="mt-3">
        <div className="h-0.5 w-full rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${(agent.xp / agent.nextLevelXp) * 100}%`, background: color }}
          />
        </div>
        <div className="text-[8px] text-white/25 mt-1">
          {agent.xp} / {agent.nextLevelXp} XP
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function VirtualOffice() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const agentActivities = useMemo<Record<string, Activity>>(() => {
    const acts: Activity[] = ["coding", "reviewing", "deploying", "idle"];
    return Object.fromEntries(
      employees.map((e, i) => [
        e.id,
        e.status !== "running" ? "idle" : acts[i % 3] as Activity,
      ])
    );
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(prev => (prev === id ? null : id));
  }, []);

  const working   = employees.filter(e => e.status === "running").length;
  const idle      = employees.filter(e => e.status !== "running").length;
  const reviewing = Object.values(agentActivities).filter(a => a === "reviewing").length;
  const deploying = Object.values(agentActivities).filter(a => a === "deploying").length;

  return (
    <div className="w-full h-[820px] bg-[#06080f] rounded-xl border border-white/10 overflow-hidden relative shadow-[0_0_60px_rgba(0,0,0,0.9)]">
      <ErrorBoundary
        fallback={
          <div className="flex items-center justify-center h-full text-cyan-400 font-mono text-sm uppercase tracking-widest">
            Virtual Office Offline — WebGL Error
          </div>
        }
      >
        <Canvas shadows dpr={[1, 1.5]}>
          <color attach="background" args={["#06080f"]} />
          <PerspectiveCamera makeDefault position={[0, 32, 58]} fov={52} />
          <OrbitControls
            enablePan
            enableZoom
            maxDistance={140}
            minDistance={6}
            maxPolarAngle={Math.PI / 2.08}
            makeDefault
          />

          <Suspense fallback={null}>
            <OfficeSceneInner
              agentActivities={agentActivities}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
            <EffectComposer enableNormalPass={false}>
              <Bloom intensity={0.5} luminanceThreshold={0.6} luminanceSmoothing={0.85} />
              <Vignette eskil={false} offset={0.2} darkness={0.9} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* ── Status bar ── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-20">
        <div
          className="flex items-center gap-4 px-6 py-2 rounded-full text-[10px] font-mono"
          style={{ background: "rgba(4,8,26,0.75)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
        >
          <span className="text-green-400">● {working} working</span>
          <span className="text-white/30">|</span>
          <span className="text-blue-400">⟳ {reviewing} reviewing</span>
          <span className="text-white/30">|</span>
          <span className="text-yellow-400">▶ {deploying} deploying</span>
          <span className="text-white/30">|</span>
          <span className="text-white/40">◌ {idle} idle</span>
          <span className="text-white/30">|</span>
          <span className="text-cyan-400">◈ standup active</span>
        </div>
      </div>

      {/* ── Selected agent panel ── */}
      {selectedId && (
        <AgentPanel agentId={selectedId} activities={agentActivities} />
      )}

      {/* ── Controls hint ── */}
      <div
        className="absolute bottom-4 right-4 text-right pointer-events-none"
        style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.18)" }}
      >
        drag to orbit · scroll to zoom
        <br />
        click agent to inspect
      </div>

      {/* ── Deselect click area ── */}
      {selectedId && (
        <button
          className="absolute top-14 right-4 z-20 text-[9px] font-mono text-white/30 hover:text-white/60 border border-white/10 px-2 py-1 rounded"
          onClick={() => setSelectedId(null)}
        >
          ✕ deselect
        </button>
      )}
    </div>
  );
}
