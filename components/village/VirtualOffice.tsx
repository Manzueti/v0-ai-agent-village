"use client";
// VirtualOffice.tsx — Pixel-art top-down AI station grid

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { employees } from "@/lib/data";

// ─── Department config ────────────────────────────────────────────────────────

const DEPT_CFG = {
  "Revenue Hub":    { color: "#ff6a00", shadow: "#ff6a0055", label: "REVENUE HUB",     num: "01", sub: "Sales & Pipeline"         },
  "Finance Vault":  { color: "#ffcc00", shadow: "#ffcc0055", label: "FINANCE VAULT",   num: "02", sub: "Capital & Risk"            },
  "Creative Studio":{ color: "#cc44ff", shadow: "#cc44ff55", label: "CREATIVE STUDIO", num: "03", sub: "Content & Brand"           },
  "Tech Nexus":     { color: "#00cfff", shadow: "#00cfff55", label: "TECH NEXUS",      num: "04", sub: "Engineering & Defense"     },
  "Command Deck":   { color: "#00ff88", shadow: "#00ff8855", label: "COMMAND DECK",    num: "05", sub: "Strategic Operations"      },
} as const;

type Dept = keyof typeof DEPT_CFG;

// ─── Pixel agent SVG sprite ───────────────────────────────────────────────────

function PixelSprite({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.45} viewBox="0 0 20 29" style={{ overflow: "visible", display: "block" }}>
      {/* Shadow */}
      <ellipse cx="10" cy="28" rx="5.5" ry="1.5" fill="rgba(0,0,0,0.55)" />
      {/* Legs */}
      <rect x="5.5" y="18" width="3.5" height="8" rx="1.5" fill={color} opacity="0.82" />
      <rect x="11" y="18" width="3.5" height="8" rx="1.5" fill={color} opacity="0.82" />
      {/* Body */}
      <rect x="3.5" y="9" width="13" height="11" rx="2" fill={color} />
      {/* Arms */}
      <rect x="0" y="10" width="3.5" height="7" rx="1.5" fill={color} opacity="0.88" />
      <rect x="16.5" y="10" width="3.5" height="7" rx="1.5" fill={color} opacity="0.88" />
      {/* Neck */}
      <rect x="8" y="6.5" width="4" height="3.5" fill={color} />
      {/* Head */}
      <circle cx="10" cy="5.5" r="5.5" fill={color} />
      {/* Visor */}
      <ellipse cx="10" cy="6.5" rx="3.5" ry="2.5" fill="rgba(0,220,255,0.5)" />
      <ellipse cx="10" cy="6.5" rx="3.5" ry="2.5" fill="none" stroke="rgba(0,255,255,0.85)" strokeWidth="0.6" />
      {/* Highlight */}
      <ellipse cx="8.5" cy="4" rx="1.5" ry="1" fill="rgba(255,255,255,0.28)" />
      {/* Glow ring */}
      <circle cx="10" cy="5.5" r="5.5" fill="none" stroke={color} strokeWidth="0.6" opacity="0.45" />
    </svg>
  );
}

// ─── Walking agent (Framer Motion path) ──────────────────────────────────────

function WalkingAgent({
  color, roomW, roomH, seed,
}: { color: string; roomW: number; roomH: number; seed: number }) {
  const pts = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    let x = 20 + (seed * 73 % Math.max(roomW - 45, 1));
    let y = 15 + (seed * 47 % Math.max(roomH - 35, 1));
    for (let i = 0; i < 7; i++) {
      points.push({ x, y });
      x = 18 + Math.abs((x * 31 + seed * 17 + i * 53) % (roomW - 38));
      y = 12 + Math.abs((y * 29 + seed * 13 + i * 41) % (roomH - 32));
    }
    return points;
  }, [seed, roomW, roomH]);

  const dur = 9 + (seed % 6) * 1.8;

  return (
    <motion.div
      style={{ position: "absolute", top: 0, left: 0, zIndex: 4 }}
      animate={{ x: pts.map(p => p.x), y: pts.map(p => p.y) }}
      transition={{
        duration: dur,
        repeat: Infinity,
        ease: "linear",
        times: pts.map((_, i) => i / (pts.length - 1)),
        repeatType: "loop",
      }}
    >
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 0.9 + (seed % 4) * 0.15, repeat: Infinity, ease: "easeInOut" }}
      >
        <PixelSprite color={color} size={18} />
      </motion.div>
    </motion.div>
  );
}

// ─── SVG furniture: desks ─────────────────────────────────────────────────────

function Desks({ color, x = 0, y = 0, cols = 3 }: { color: string; x?: number; y?: number; cols?: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {Array.from({ length: cols }).map((_, i) => (
        <g key={i} transform={`translate(${i * 40}, 0)`}>
          <rect x="0" y="0" width="34" height="16" rx="2" fill={color + "28"} stroke={color + "77"} strokeWidth="0.8" />
          <rect x="8" y="2" width="16" height="9" rx="1" fill={color + "55"} />
          <rect x="9" y="3" width="14" height="7" fill={color + "18"} stroke={color + "66"} strokeWidth="0.4" />
          {/* tiny keyboard */}
          <rect x="5" y="13" width="10" height="3" rx="0.5" fill={color + "33"} />
          {/* chair */}
          <circle cx="17" cy="24" r="7" fill={color + "33"} stroke={color + "55"} strokeWidth="0.8" />
        </g>
      ))}
    </g>
  );
}

// ─── SVG furniture: server racks ─────────────────────────────────────────────

function Servers({ color, x = 0, y = 0 }: { color: string; x?: number; y?: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {[0, 28, 56].map((ox) => (
        <g key={ox} transform={`translate(${ox}, 0)`}>
          <rect x="0" y="0" width="22" height="55" rx="2" fill={color + "1a"} stroke={color + "66"} strokeWidth="0.8" />
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i} transform={`translate(2, ${i * 7 + 2})`}>
              <rect x="0" y="0" width="18" height="4.5" rx="0.8" fill={color + "33"} />
              <circle cx="16" cy="2.2" r="1.2" fill={color} opacity={0.6 + (i % 3) * 0.15} />
              <rect x="2" y="1.5" width="10" height="1.5" rx="0.5" fill={color + "44"} />
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

// ─── SVG furniture: circular platform / trading floor ─────────────────────────

function CirclePlatform({ color, cx = 0, cy = 0, r = 32 }: { color: string; cx?: number; cy?: number; r?: number }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle cx="0" cy="0" r={r} fill={color + "0e"} stroke={color + "44"} strokeWidth="2" />
      <circle cx="0" cy="0" r={r * 0.65} fill={color + "18"} stroke={color + "66"} strokeWidth="1.2" />
      <circle cx="0" cy="0" r={r * 0.3} fill={color + "55"} stroke={color} strokeWidth="1.5" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = r * 0.3 * Math.cos(rad), y1 = r * 0.3 * Math.sin(rad);
        const x2 = r * 0.65 * Math.cos(rad), y2 = r * 0.65 * Math.sin(rad);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color + "66"} strokeWidth="1" />;
      })}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return <circle key={deg} cx={r * Math.cos(rad)} cy={r * Math.sin(rad)} r="2.5" fill={color} opacity="0.9" />;
      })}
    </g>
  );
}

// ─── SVG furniture: conference table ─────────────────────────────────────────

function ConfTable({ color, cx = 0, cy = 0 }: { color: string; cx?: number; cy?: number }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <ellipse cx="0" cy="0" rx="40" ry="22" fill={color + "1e"} stroke={color} strokeWidth="1.5" />
      <ellipse cx="0" cy="0" rx="32" ry="16" fill={color + "0e"} stroke={color + "66"} strokeWidth="0.6" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const sx = deg % 180 === 0 ? 1.1 : 1;
        const ex = (42 * sx) * Math.cos(rad), ey = (26 * sx) * Math.sin(rad) * 0.62;
        return <circle key={deg} cx={ex} cy={ey} r="5.5" fill={color + "33"} stroke={color + "55"} strokeWidth="0.7" />;
      })}
      {/* center hologram */}
      <ellipse cx="0" cy="0" rx="8" ry="5" fill={color + "55"} />
      <ellipse cx="0" cy="0" rx="8" ry="5" fill="none" stroke={color} strokeWidth="1.2" opacity="0.9" />
    </g>
  );
}

// ─── SVG furniture: hex vault ─────────────────────────────────────────────────

function HexVault({ color, cx = 0, cy = 0 }: { color: string; cx?: number; cy?: number }) {
  const pts = (r: number) =>
    [0, 60, 120, 180, 240, 300]
      .map((d) => {
        const rad = (d * Math.PI) / 180;
        return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
      })
      .join(" ");
  return (
    <g>
      <polygon points={pts(36)} fill={color + "18"} stroke={color + "66"} strokeWidth="1.5" />
      <polygon points={pts(24)} fill={color + "28"} stroke={color + "88"} strokeWidth="1" />
      <circle cx={cx} cy={cy} r="10" fill={color + "66"} stroke={color} strokeWidth="1.8" />
      <circle cx={cx} cy={cy} r="4" fill={color} />
    </g>
  );
}

// ─── Room furniture switcher ──────────────────────────────────────────────────

function RoomFurniture({ dept, color, w, h }: { dept: Dept; color: string; w: number; h: number }) {
  const ch = h;
  return (
    <svg
      style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      width={w}
      height={ch}
    >
      {dept === "Revenue Hub" && (
        <>
          <Desks color={color} x={8} y={38} cols={3} />
          <CirclePlatform color={color} cx={w - 52} cy={ch / 2 + 14} r={30} />
          <Desks color={color} x={8} y={ch - 52} cols={2} />
        </>
      )}
      {dept === "Finance Vault" && (
        <>
          <HexVault color={color} cx={w / 2} cy={ch / 2 - 6} />
          <Desks color={color} x={8} y={ch - 55} cols={3} />
        </>
      )}
      {dept === "Creative Studio" && (
        <>
          <ConfTable color={color} cx={w / 2} cy={ch / 2 + 5} />
          <Desks color={color} x={8} y={ch - 55} cols={2} />
        </>
      )}
      {dept === "Tech Nexus" && (
        <>
          <Servers color={color} x={8} y={35} />
          <CirclePlatform color={color} cx={w / 2 + 30} cy={ch / 2 + 6} r={24} />
          <Desks color={color} x={8} y={ch - 55} cols={2} />
        </>
      )}
      {dept === "Command Deck" && (
        <>
          <ConfTable color={color} cx={w / 2 - 10} cy={ch / 2 + 2} />
          <Servers color={color} x={w - 90} y={28} />
          <Desks color={color} x={8} y={18} cols={2} />
        </>
      )}
    </svg>
  );
}

// ─── Corner stats ─────────────────────────────────────────────────────────────

function CornerStats({ dept, color, agents }: { dept: Dept; color: string; agents: typeof employees }) {
  const running = agents.filter((a) => a.status === "running");
  const eff = running.length
    ? Math.round(running.reduce((s, a) => s + a.successRate, 0) / running.length)
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: 32,
        left: 6,
        zIndex: 8,
        background: "rgba(4,4,18,0.82)",
        border: `1px solid ${color}33`,
        borderRadius: 3,
        padding: "5px 7px",
        fontFamily: "monospace",
        fontSize: 8,
        lineHeight: 1.7,
        color: "#ffffff88",
        backdropFilter: "blur(4px)",
        pointerEvents: "none",
      }}
    >
      <div style={{ color, marginBottom: 2, letterSpacing: "0.08em", fontWeight: "bold" }}>
        SYSTEM STATUS
      </div>
      <div>
        <span style={{ color: "#44ff88" }}>● ONLINE</span>
      </div>
      <div>Power <span style={{ color }}>97%</span></div>
      <div>Agents <span style={{ color }}>{running.length}/{agents.length}</span></div>
      <div>Efficiency <span style={{ color: eff > 80 ? "#44ff88" : "#ffcc00" }}>{eff}%</span></div>
    </div>
  );
}

// ─── Activity queue ───────────────────────────────────────────────────────────

function ActivityQueue({ dept, color, agents }: { dept: Dept; color: string; agents: typeof employees }) {
  const items = agents.slice(0, 4);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 26,
        right: 6,
        zIndex: 8,
        background: "rgba(4,4,18,0.82)",
        border: `1px solid ${color}33`,
        borderRadius: 3,
        padding: "4px 7px",
        fontFamily: "monospace",
        fontSize: 7.5,
        lineHeight: 1.6,
        backdropFilter: "blur(4px)",
        pointerEvents: "none",
        maxWidth: 110,
      }}
    >
      {items.map((a) => (
        <div key={a.id} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <span style={{ color: "#ffffff88", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 60 }}>
            {a.name.split(" ")[0]}
          </span>
          <span style={{ color: a.status === "running" ? "#44ff88" : "#ff5555", flexShrink: 0 }}>
            {a.status === "running" ? "ACTIVE" : "IDLE"}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Single room tile ─────────────────────────────────────────────────────────

const ROOM_W = 240;
const ROOM_H = 205;

function OfficeRoom({
  dept,
  agents,
  selected,
  onSelect,
}: {
  dept: Dept;
  agents: typeof employees;
  selected: boolean;
  onSelect: () => void;
}) {
  const cfg = DEPT_CFG[dept];
  const { color, shadow } = cfg;

  return (
    <div
      onClick={onSelect}
      style={{
        position: "relative",
        width: ROOM_W,
        height: ROOM_H,
        background: "rgba(4,4,20,0.72)",
        backdropFilter: "blur(1px)",
        border: `2px solid ${color}`,
        boxShadow: selected
          ? `0 0 0 2px ${color}, 0 0 30px ${shadow}, inset 0 0 40px ${shadow}`
          : `0 0 18px ${shadow}, inset 0 0 22px ${shadow}`,
        borderRadius: 5,
        overflow: "hidden",
        cursor: "pointer",
        flexShrink: 0,
        transition: "box-shadow 0.2s",
        zIndex: 1,
      }}
    >
      {/* Floor grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${color}0a 1px, transparent 1px),
            linear-gradient(90deg, ${color}0a 1px, transparent 1px)
          `,
          backgroundSize: "22px 22px",
          pointerEvents: "none",
        }}
      />

      {/* Top wall / header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 30,
          background: `linear-gradient(to bottom, ${color}2a, transparent)`,
          borderBottom: `1px solid ${color}44`,
          zIndex: 9,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 8px",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            fontWeight: "bold",
            color,
            letterSpacing: "0.18em",
          }}
        >
          {cfg.label} <span style={{ opacity: 0.5, fontSize: 7 }}>{cfg.num}</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              display: "block",
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#44ff88",
              boxShadow: "0 0 5px #44ff88",
            }}
          />
          <span style={{ fontFamily: "monospace", fontSize: 7, color: "#44ff88", letterSpacing: "0.1em" }}>
            ONLINE
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 24,
          background: "rgba(0,0,0,0.65)",
          borderTop: `1px solid ${color}33`,
          zIndex: 9,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 8px",
          pointerEvents: "none",
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: 7, color: "#ffffff44" }}>
          {cfg.sub.toUpperCase()}
        </span>
        <span style={{ fontFamily: "monospace", fontSize: 7, color: color + "cc" }}>
          {agents.filter((a) => a.status === "running").length} ACTIVE
        </span>
      </div>

      {/* Furniture layer */}
      <div style={{ position: "absolute", inset: 0, top: 30, bottom: 24, pointerEvents: "none" }}>
        <RoomFurniture
          dept={dept}
          color={color}
          w={ROOM_W}
          h={ROOM_H - 54}
        />
      </div>

      {/* Corner stats */}
      <CornerStats dept={dept} color={color} agents={agents} />

      {/* Activity queue */}
      <ActivityQueue dept={dept} color={color} agents={agents} />

      {/* Agents walking */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          top: 30,
          bottom: 24,
          overflow: "hidden",
        }}
      >
        {agents.slice(0, 6).map((a, i) => (
          <WalkingAgent
            key={a.id}
            color={color}
            roomW={ROOM_W - 36}
            roomH={ROOM_H - 58}
            seed={i * 11 + dept.charCodeAt(0) + dept.charCodeAt(2)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Global metrics bar ───────────────────────────────────────────────────────

function MetricsBar() {
  const [revenue, setRevenue] = useState(6469.92);
  const [orders, setOrders] = useState(82);
  const working = employees.filter((e) => e.status === "running").length;

  useEffect(() => {
    const t = setInterval(() => {
      setRevenue((v) => +(v + (Math.random() * 14 - 4)).toFixed(2));
      if (Math.random() > 0.72) setOrders((v) => v + 1);
    }, 1800);
    return () => clearInterval(t);
  }, []);

  const stats = [
    { k: "REVENUE", v: `$${revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, c: "#44ff88" },
    { k: "ORDERS", v: `${orders}`, c: "#00cfff" },
    { k: "PRODUCTS", v: "14 LIVE", c: "#ffcc00" },
    { k: "AGENTS", v: `${working}/${employees.length} ACTIVE`, c: "#ff6a00" },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 36,
        padding: "10px 20px",
        background: "rgba(4,4,20,0.98)",
        borderBottom: "1px solid #ffffff12",
        fontFamily: "monospace",
      }}
    >
      {stats.map(({ k, v, c }) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, color: "#ffffff44", letterSpacing: "0.2em" }}>{k}:</span>
          <motion.span
            animate={{ opacity: [1, 0.75, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: 12, fontWeight: "bold", color: c, letterSpacing: "0.05em" }}
          >
            {v}
          </motion.span>
        </div>
      ))}

      {/* right side live indicator */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{ display: "block", width: 6, height: 6, borderRadius: "50%", background: "#44ff88", boxShadow: "0 0 6px #44ff88" }}
        />
        <span style={{ fontSize: 9, color: "#44ff8888", letterSpacing: "0.2em" }}>LIVE</span>
      </div>
    </div>
  );
}

// ─── Expansion slot tile ──────────────────────────────────────────────────────

function ExpansionSlot() {
  return (
    <div
      style={{
        width: ROOM_W,
        height: ROOM_H,
        border: "1px dashed #ffffff14",
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        background: "rgba(255,255,255,0.01)",
        zIndex: 1,
        position: "relative",
      }}
    >
      <span style={{ fontFamily: "monospace", fontSize: 22, opacity: 0.12 }}>+</span>
      <span style={{ fontFamily: "monospace", fontSize: 8, color: "#ffffff1a", letterSpacing: "0.25em" }}>
        EXPANSION SLOT
      </span>
    </div>
  );
}

// ─── Selected dept detail bar ─────────────────────────────────────────────────

function DetailBar({ dept, agents }: { dept: Dept; agents: typeof employees }) {
  const cfg = DEPT_CFG[dept];
  const running = agents.filter((a) => a.status === "running");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      style={{
        padding: "12px 20px",
        borderTop: `1px solid ${cfg.color}44`,
        background: "rgba(4,4,20,0.95)",
        fontFamily: "monospace",
        display: "flex",
        gap: 28,
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      <div>
        <div style={{ color: cfg.color, fontSize: 10, letterSpacing: "0.2em", marginBottom: 4 }}>
          {cfg.label}
        </div>
        <div style={{ color: "#ffffff55", fontSize: 8 }}>
          {running.length}/{agents.length} agents · {cfg.sub}
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {agents.slice(0, 6).map((agent) => (
          <div key={agent.id}>
            <div style={{ color: "#ffffffcc", fontSize: 9, marginBottom: 2 }}>
              {agent.avatar} {agent.name.split(" ")[0]}
            </div>
            <div style={{ fontSize: 7, color: agent.status === "running" ? "#44ff88" : "#ff5555" }}>
              {agent.status.toUpperCase()}
            </div>
            <div style={{ fontSize: 7, color: cfg.color + "aa", marginTop: 1 }}>
              {agent.aiModel}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function VirtualOffice() {
  const [selectedDept, setSelectedDept] = useState<Dept | null>(null);

  const byDept = useMemo(() => {
    const m: Record<string, typeof employees> = {};
    for (const e of employees) {
      (m[e.department] ??= []).push(e);
    }
    return m;
  }, []);

  const depts = Object.keys(DEPT_CFG) as Dept[];

  return (
    <div
      style={{
        background: "#04040f",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #ffffff0d",
        boxShadow: "0 0 60px rgba(0,0,0,0.9)",
        width: "100%",
      }}
    >
      {/* Global metrics */}
      <MetricsBar />

      {/* Room grid */}
      <div
        style={{
          padding: "14px 14px 10px",
          display: "grid",
          gridTemplateColumns: `repeat(3, ${ROOM_W}px)`,
          gap: 10,
          justifyContent: "center",
          position: "relative",
          backgroundImage: "url('/dungeon-map.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* dark tint so neon pops against the warm stone */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(2,2,12,0.55)", pointerEvents: "none", zIndex: 0 }} />
        {depts.map((dept) => (
          <OfficeRoom
            key={dept}
            dept={dept}
            agents={byDept[dept] ?? []}
            selected={selectedDept === dept}
            onSelect={() => setSelectedDept(dept === selectedDept ? null : dept)}
          />
        ))}
        <ExpansionSlot />
      </div>

      {/* Detail panel */}
      {selectedDept && (
        <DetailBar dept={selectedDept} agents={byDept[selectedDept] ?? []} />
      )}

      {/* Footer */}
      <div
        style={{
          padding: "6px 20px",
          borderTop: "1px solid #ffffff08",
          background: "rgba(4,4,20,0.95)",
          display: "flex",
          justifyContent: "flex-end",
          gap: 20,
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: 8, color: "#ffffff22", letterSpacing: "0.15em" }}>
          drag to scroll · click room to inspect
        </span>
      </div>
    </div>
  );
}
