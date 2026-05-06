'use client';

import {
  Activity, Box, Boxes, Cpu, Database, Factory, Gauge, Hammer, Layers, Network,
  Package, Settings, ShoppingCart, Sparkles, Terminal, Workflow, Wrench, Zap,
  Send, ChevronRight, Coins, FlaskConical, Pickaxe, Truck, MessageSquare, Bell,
  Trophy, Target, Flame, Star, Award, CheckCircle2, Circle,
} from "lucide-react";
import StylizedAvatar from "@/components/village/StylizedAvatar";

const NeonPanel = ({
  color = "purple",
  title,
  status,
  level,
  children,
  className = "",
  avatarColor,
  gender = "non-binary"
}: {
  color?: "cyan" | "magenta" | "purple" | "orange" | "yellow";
  title: string;
  status?: string;
  level?: string;
  children: React.ReactNode;
  className?: string;
  avatarColor?: string;
  gender?: 'male' | 'female' | 'non-binary';
}) => {
  const glow = {
    cyan: "panel-glow-cyan",
    magenta: "panel-glow-magenta",
    purple: "panel-glow-purple",
    orange: "panel-glow-orange",
    yellow: "panel-glow-yellow",
  }[color];
  const colorVar = {
    cyan: "var(--neon-cyan)",
    magenta: "var(--neon-magenta)",
    purple: "var(--neon-purple)",
    orange: "var(--neon-orange)",
    yellow: "var(--neon-yellow)",
  }[color];
  return (
    <div className={`relative rounded-md bg-[hsl(255_45%_8%/0.85)] backdrop-blur-sm scanlines ${glow} ${className} flex flex-col`}>
      <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: `hsl(${colorVar} / 0.4)` }}>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full pulse-dot" style={{ background: `hsl(${colorVar})`, boxShadow: `0 0 8px hsl(${colorVar})` }} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: `hsl(${colorVar})` }}>{title}</span>
          {level && <span className="text-[9px] text-muted-foreground tracking-wider">{level}</span>}
        </div>
        {status && (
          <span className="text-[9px] tracking-[0.2em] uppercase px-1.5 py-0.5 rounded-sm bg-[hsl(140_80%_55%/0.15)] text-[hsl(var(--neon-green))]">
            ● {status}
          </span>
        )}
      </div>
      <div className="flex-1 p-3 flex gap-4">
        <div className="w-16 h-16 shrink-0 relative">
          <StylizedAvatar 
            color={avatarColor || `hsl(${colorVar})`} 
            gender={gender} 
            isWorking={status === "Active" || status === "Etsy Live"} 
            className="w-full h-full"
          />
          <div className="absolute inset-x-0 -bottom-1 h-px bg-current opacity-20 blur-sm" style={{ color: avatarColor || `hsl(${colorVar})` }} />
        </div>
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
};

const StatPill = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[hsl(255_40%_12%/0.7)] border border-[hsl(260_40%_25%)]">
    <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
    <span className="text-xs font-bold tabular-nums" style={{ color, textShadow: `0 0 8px ${color}` }}>{value}</span>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active = false, badge }: any) => (
  <button className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left text-xs transition-colors ${active ? "bg-[hsl(285_90%_65%/0.15)] text-[hsl(var(--neon-purple))]" : "text-muted-foreground hover:bg-[hsl(255_35%_16%)] hover:text-foreground"}`}>
    <Icon className="h-3.5 w-3.5" />
    <span className="flex-1 tracking-wide">{label}</span>
    {badge && <span className="text-[9px] px-1 rounded bg-[hsl(var(--neon-yellow)/0.2)] text-[hsl(var(--neon-yellow))]">{badge}</span>}
  </button>
);

const FactoryGrid = ({ color, density = "med" }: { color: string; density?: "low" | "med" | "high" }) => {
  const cells = density === "high" ? 64 : density === "med" ? 48 : 32;
  return (
    <div className="grid grid-cols-12 gap-px p-2 rounded bg-[hsl(248_60%_4%)] border" style={{ borderColor: `${color} / 0.3` as any, borderWidth: 1 }}>
      {Array.from({ length: cells }).map((_, i) => {
        const r = (i * 37) % 100;
        const filled = r > 30;
        const accent = r > 88;
        return (
          <div key={i} className="aspect-square rounded-[2px]"
            style={{
              background: accent ? color : filled ? `${color}` : "hsl(255 35% 12%)",
              opacity: accent ? 0.95 : filled ? 0.18 + ((r % 30) / 100) : 0.4,
              boxShadow: accent ? `0 0 6px ${color}` : "none",
            }} />
        );
      })}
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen w-full text-foreground relative overflow-hidden">
      <div className="absolute inset-0 starfield opacity-60 pointer-events-none" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-4 h-12 border-b border-[hsl(260_40%_18%)] bg-[hsl(250_50%_6%/0.9)] backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-sm bg-gradient-to-br from-[hsl(var(--neon-magenta))] to-[hsl(var(--neon-purple))] grid place-items-center">
              <Factory className="h-3.5 w-3.5 text-background" />
            </div>
            <span className="font-bold text-sm tracking-[0.25em]">VYBE<span className="text-[hsl(var(--neon-magenta))]">CORP</span></span>
          </div>
          <span className="text-[10px] text-muted-foreground tracking-wider px-2 py-0.5 rounded border border-[hsl(260_40%_22%)]">v0.4.2 — beta</span>
        </div>

        <div className="flex items-center gap-2">
          <StatPill label="Day" value="7 / 30" color="hsl(var(--neon-cyan))" />
          <StatPill label="Revenue" value="$1,392.04" color="hsl(var(--neon-green))" />
          <StatPill label="Orders" value="6" color="hsl(var(--neon-yellow))" />
          <StatPill label="Products" value="10 LIVE" color="hsl(var(--neon-magenta))" />
          <StatPill label="Agents" value="4 / 6" color="hsl(var(--neon-orange))" />
          <button className="ml-2 px-3 py-1 text-[10px] tracking-[0.25em] uppercase rounded bg-[hsl(var(--neon-magenta)/0.2)] border border-[hsl(var(--neon-magenta))] text-[hsl(var(--neon-magenta))] hover:bg-[hsl(var(--neon-magenta)/0.35)] transition">
            ▶ Run Tick
          </button>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-[220px_1fr_300px] gap-3 p-3 h-[calc(100vh-3rem)]">
        {/* Sidebar */}
        <aside className="flex flex-col gap-3 overflow-y-auto">
          <div className="rounded-md bg-[hsl(255_45%_8%/0.85)] border border-[hsl(var(--neon-cyan)/0.4)] p-3 panel-glow-cyan">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black tracking-tight text-[hsl(var(--neon-cyan))] text-glow">LV.4</span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[hsl(var(--neon-cyan))]">Commander</span>
            </div>
            <div className="h-1.5 rounded bg-[hsl(255_35%_16%)] overflow-hidden mb-1">
              <div className="h-full w-[75%] bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))]" />
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground tabular-nums">
              <span>6,000 XP</span><span>8,000 XP</span>
            </div>
            <div className="mt-3 pt-2 border-t border-[hsl(260_40%_22%)] space-y-1 text-[10px]">
              <div className="flex justify-between"><span className="text-muted-foreground">@androo.agi</span><span className="text-[hsl(var(--neon-green))]">● Active</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Produced</span><span className="text-[hsl(var(--neon-yellow))] tabular-nums">402 items</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">QA Pass</span><span className="tabular-nums">94.2%</span></div>
            </div>
          </div>

          {/* Active Missions */}
          <div className="rounded-md bg-[hsl(255_45%_8%/0.85)] border border-[hsl(var(--neon-yellow)/0.4)] p-3 panel-glow-yellow">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-3 w-3 text-[hsl(var(--neon-yellow))]" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-[hsl(var(--neon-yellow))] font-bold">Active Missions</span>
            </div>
            <div className="space-y-2.5 text-[10px]">
              {[
                { icon: "💰", title: "Reach $4,000 in Revenue", prog: "$3,012 / $4,000", pct: 75, xp: 600, color: "hsl(var(--neon-yellow))" },
                { icon: "📦", title: "Publish 15 SKUs", prog: "14 / 15", pct: 93, xp: 300, color: "hsl(var(--neon-magenta))" },
                { icon: "🛒", title: "Get 100 Total Sales", prog: "62 / 100", pct: 62, xp: 500, color: "hsl(var(--neon-cyan))" },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px]">{m.icon}</span>
                    <span className="flex-1 text-foreground">{m.title}</span>
                    <span className="text-[hsl(var(--neon-green))] text-[9px]">+{m.xp} XP</span>
                  </div>
                  <div className="h-1 rounded bg-[hsl(255_35%_16%)] overflow-hidden">
                    <div className="h-full" style={{ width: `${m.pct}%`, background: m.color, boxShadow: `0 0 6px ${m.color}` }} />
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-0.5 tabular-nums">{m.prog}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-[hsl(255_45%_8%/0.85)] border border-[hsl(260_40%_22%)] p-2">
            <div className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground px-2 py-1.5">Operations</div>
            <SidebarItem icon={Gauge} label="Dashboard" active />
            <SidebarItem icon={Factory} label="Factory Deck" badge="2" />
            <SidebarItem icon={Pickaxe} label="Mandate" />
            <SidebarItem icon={FlaskConical} label="WIP" />
            <SidebarItem icon={Hammer} label="Assembly" />
            <SidebarItem icon={Wrench} label="Tooling" />
            <SidebarItem icon={Boxes} label="Assets" />
            <SidebarItem icon={Database} label="Inventory" />

            <div className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground px-2 py-1.5 pt-3">Agents</div>
            <SidebarItem icon={Sparkles} label="Pixel" badge="!" />
            <SidebarItem icon={Cpu} label="Glint" />
            <SidebarItem icon={Network} label="Prism" />
            <SidebarItem icon={Workflow} label="Ledger" />

            <div className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground px-2 py-1.5 pt-3">System</div>
            <SidebarItem icon={ShoppingCart} label="Orders" badge="6" />
            <SidebarItem icon={Coins} label="Treasury" />
            <SidebarItem icon={Settings} label="Settings" />
          </div>

          <div className="rounded-md bg-gradient-to-br from-[hsl(var(--neon-magenta)/0.15)] to-[hsl(var(--neon-purple)/0.15)] border border-[hsl(var(--neon-magenta)/0.5)] p-3">
            <div className="text-[10px] tracking-[0.25em] uppercase text-[hsl(var(--neon-magenta))] font-bold mb-1">Press F</div>
            <div className="text-[10px] text-muted-foreground leading-relaxed">to toggle factory deck overlay & inspect production lines</div>
          </div>
        </aside>

        {/* Main grid of factory consoles */}
        <main className="grid grid-cols-3 grid-rows-3 gap-3 min-h-0 overflow-y-auto">
          <NeonPanel color="purple" title="Factory II" level="LV.2" status="Active">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>HEAT</span><div className="flex-1 h-1 rounded bg-[hsl(255_35%_16%)] overflow-hidden"><div className="h-full w-[62%] bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))]" /></div>
                <span className="text-[hsl(var(--neon-yellow))] tabular-nums flicker">62°</span>
              </div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                <span>Output @ <span className="text-[hsl(var(--neon-green))] tabular-nums">14 dpr</span></span>
                <span className="text-[hsl(var(--neon-cyan))]">· Mix-1</span>
                <span className="text-[hsl(var(--neon-magenta))]">· DLVR-1</span>
              </div>
              <div className="relative">
                <FactoryGrid color="hsl(285 90% 65%)" />
                {/* conveyor overlay */}
                <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[hsl(255_45%_8%)] border border-[hsl(var(--neon-cyan)/0.5)] overflow-hidden text-[hsl(var(--neon-cyan))]">
                  <div className="absolute inset-0 pipe-flow opacity-80" />
                </div>
                {/* workers */}
                <div className="absolute left-2 right-2 top-[18%] overflow-hidden h-2 text-[hsl(var(--neon-yellow))]">
                  <div className="worker h-2 w-2 rounded-sm bg-current shadow-[0_0_8px_currentColor]" />
                </div>
                <div className="absolute left-2 right-2 bottom-[14%] overflow-hidden h-2 text-[hsl(var(--neon-magenta))]">
                  <div className="worker h-2 w-2 rounded-sm bg-current shadow-[0_0_8px_currentColor]" style={{ animationDelay: "-2s", animationDuration: "7s" }} />
                </div>
                {/* radar blip */}
                <div className="absolute top-2 right-2 h-6 w-6 rounded-full border border-[hsl(var(--neon-green)/0.6)] grid place-items-center">
                  <div className="h-1 w-1 rounded-full bg-[hsl(var(--neon-green))] blip shadow-[0_0_6px_hsl(var(--neon-green))]" />
                  <div className="absolute inset-0 rounded-full border-t border-[hsl(var(--neon-green))] spin-slow" />
                </div>
                {/* alarm */}
                <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-[hsl(350_90%_60%/0.15)] border border-[hsl(350_90%_60%/0.6)] text-[8px] tracking-widest text-[hsl(350_90%_70%)] flicker">
                  <span className="h-1 w-1 rounded-full bg-current pulse-dot" />ALERT
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[9px]">
                <div className="px-1.5 py-1 rounded bg-[hsl(255_35%_12%)] border border-[hsl(260_40%_22%)]">
                  <div className="text-muted-foreground">PRESS</div>
                  <div className="text-[hsl(var(--neon-cyan))] tabular-nums font-bold">2.4 atm</div>
                </div>
                <div className="px-1.5 py-1 rounded bg-[hsl(255_35%_12%)] border border-[hsl(260_40%_22%)]">
                  <div className="text-muted-foreground">RPM</div>
                  <div className="text-[hsl(var(--neon-yellow))] tabular-nums font-bold">1,820</div>
                </div>
                <div className="px-1.5 py-1 rounded bg-[hsl(255_35%_12%)] border border-[hsl(260_40%_22%)]">
                  <div className="text-muted-foreground">YIELD</div>
                  <div className="text-[hsl(var(--neon-green))] tabular-nums font-bold">96%</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground tracking-widest">ORDER PRESERVED</span>
                <span className="text-[hsl(var(--neon-cyan))]">DELIVR ▸</span>
              </div>
            </div>
          </NeonPanel>

          <NeonPanel color="cyan" title="Factory Deck" level="LV.1" status="Active">
            <div className="space-y-2">
              <div className="flex gap-2 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-[hsl(var(--neon-cyan)/0.15)] text-[hsl(var(--neon-cyan))]">SERVICES</span>
                <span className="px-1.5 py-0.5 rounded bg-[hsl(var(--neon-yellow)/0.15)] text-[hsl(var(--neon-yellow))]">DESIGN</span>
                <span className="px-1.5 py-0.5 rounded bg-[hsl(var(--neon-magenta)/0.15)] text-[hsl(var(--neon-magenta))]">PACKAGE</span>
              </div>
              <div className="relative">
                <FactoryGrid color="hsl(190 100% 55%)" density="high" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 px-2 py-1 rounded bg-[hsl(248_60%_4%/0.85)] border border-[hsl(var(--neon-cyan)/0.5)] backdrop-blur-sm">
                  <span className="text-[9px] tracking-[0.25em] text-[hsl(var(--neon-cyan))]">PRESS</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-[hsl(var(--neon-cyan)/0.2)] border border-[hsl(var(--neon-cyan))] text-[9px] font-bold text-[hsl(var(--neon-cyan))]">I</kbd>
                  <span className="text-[9px] text-muted-foreground">→ inspect</span>
                  <span className="ml-auto text-[hsl(var(--neon-yellow))] text-[9px] flicker">●REC</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div className="px-2 py-1 rounded bg-[hsl(255_35%_12%)] border border-[hsl(260_40%_22%)]">
                  <div className="text-muted-foreground text-[9px]">THROUGHPUT</div>
                  <div className="text-[hsl(var(--neon-cyan))] tabular-nums font-bold">128/s</div>
                </div>
                <div className="px-2 py-1 rounded bg-[hsl(255_35%_12%)] border border-[hsl(260_40%_22%)]">
                  <div className="text-muted-foreground text-[9px]">QUEUE</div>
                  <div className="text-[hsl(var(--neon-yellow))] tabular-nums font-bold">14</div>
                </div>
                <div className="px-2 py-1 rounded bg-[hsl(255_35%_12%)] border border-[hsl(260_40%_22%)]">
                  <div className="text-muted-foreground text-[9px]">UPTIME</div>
                  <div className="text-[hsl(var(--neon-green))] tabular-nums font-bold">99.4%</div>
                </div>
              </div>
            </div>
          </NeonPanel>

          <NeonPanel color="orange" title="The Treasury" level="LV.1" status="Active">
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <div className="aspect-square rounded bg-gradient-to-br from-[hsl(var(--neon-orange)/0.4)] to-[hsl(var(--neon-yellow)/0.2)] border border-[hsl(var(--neon-orange))] grid place-items-center">
                <Coins className="h-10 w-10 text-[hsl(var(--neon-yellow))] text-glow" />
              </div>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Cash</span><span className="text-[hsl(var(--neon-yellow))] tabular-nums font-bold">$1,392.04</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Burn / day</span><span className="tabular-nums">$84.20</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Runway</span><span className="text-[hsl(var(--neon-green))] tabular-nums">16d</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Margin</span><span className="tabular-nums">38.4%</span></div>
                <div className="h-1.5 rounded bg-[hsl(255_35%_16%)] overflow-hidden mt-2">
                  <div className="h-full w-[68%] bg-gradient-to-r from-[hsl(var(--neon-orange))] to-[hsl(var(--neon-yellow))]" />
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground"><span>Reservoir</span><span>68%</span></div>
              </div>
            </div>
          </NeonPanel>

          <NeonPanel color="magenta" title="Armory" level="LV.1" status="Idle">
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-1.5">
                {["W", "S", "X", "Q", "E", "R", "T", "Y"].map((k, i) => (
                  <div key={i} className="aspect-square rounded bg-[hsl(255_35%_12%)] border border-[hsl(var(--neon-magenta)/0.4)] grid place-items-center text-[10px] font-bold tracking-widest"
                    style={{ color: i % 3 === 0 ? "hsl(var(--neon-magenta))" : "hsl(var(--neon-cyan))" }}>{k}</div>
                ))}
              </div>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Tools equipped</span><span className="tabular-nums">6 / 8</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Durability</span><span className="text-[hsl(var(--neon-green))] tabular-nums">A+</span></div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[hsl(var(--neon-magenta)/0.3)] text-[10px]">
                <span className="text-muted-foreground">Press R to reload</span>
                <ChevronRight className="h-3 w-3 text-[hsl(var(--neon-magenta))]" />
              </div>
            </div>
          </NeonPanel>

          <NeonPanel color="yellow" title="Logistics" level="LV.2" status="Active">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px]">
                <Truck className="h-3.5 w-3.5 text-[hsl(var(--neon-yellow))]" />
                <span className="text-muted-foreground">Fleet</span>
                <span className="ml-auto text-[hsl(var(--neon-yellow))] tabular-nums">8 / 12</span>
              </div>
              <FactoryGrid color="hsl(48 100% 60%)" density="low" />
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="px-2 py-1 rounded bg-[hsl(255_35%_12%)] border border-[hsl(260_40%_22%)]">
                  <div className="text-muted-foreground text-[9px]">SHIPPED</div>
                  <div className="text-[hsl(var(--neon-yellow))] tabular-nums font-bold">342</div>
                </div>
                <div className="px-2 py-1 rounded bg-[hsl(255_35%_12%)] border border-[hsl(260_40%_22%)]">
                  <div className="text-muted-foreground text-[9px]">IN-TRANSIT</div>
                  <div className="text-[hsl(var(--neon-cyan))] tabular-nums font-bold">27</div>
                </div>
              </div>
            </div>
          </NeonPanel>

          <NeonPanel color="cyan" title="R&D Lab" level="LV.3" status="Active">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <FlaskConical className="h-3.5 w-3.5 text-[hsl(var(--neon-cyan))]" />
                <span>Experiment 04 · brewing</span>
              </div>
              <FactoryGrid color="hsl(190 100% 55%)" density="med" />
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Stability</span><span className="text-[hsl(var(--neon-green))] tabular-nums">A-</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Yield</span><span className="text-[hsl(var(--neon-cyan))] tabular-nums">73.2%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tokens</span><span className="text-[hsl(var(--neon-yellow))] tabular-nums">4.2M</span></div>
              </div>
            </div>
          </NeonPanel>

          <NeonPanel color="magenta" title="Storefront" level="LV.2" status="Active">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px]">
                <ShoppingCart className="h-3.5 w-3.5 text-[hsl(var(--neon-magenta))]" />
                <span className="text-muted-foreground">Live SKUs</span>
                <span className="ml-auto text-[hsl(var(--neon-magenta))] tabular-nums">10</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded bg-gradient-to-br from-[hsl(var(--neon-magenta)/0.3)] to-[hsl(var(--neon-purple)/0.2)] border border-[hsl(var(--neon-magenta)/0.4)] grid place-items-center text-[9px] font-bold text-[hsl(var(--neon-magenta))]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Conv. rate</span>
                <span className="text-[hsl(var(--neon-green))] tabular-nums">4.8%</span>
              </div>
            </div>
          </NeonPanel>

          <NeonPanel color="purple" title="Power Grid" level="LV.2" status="Active">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-[hsl(var(--neon-purple))]" />
                <span>Load</span>
                <div className="flex-1 h-1 rounded bg-[hsl(255_35%_16%)] overflow-hidden"><div className="h-full w-[78%] bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-magenta))]" /></div>
                <span className="text-[hsl(var(--neon-purple))] tabular-nums">78%</span>
              </div>
              <div className="grid grid-cols-8 gap-px h-12 items-end">
                {Array.from({ length: 32 }).map((_, i) => {
                  const h = 30 + ((i * 53) % 70);
                  return <div key={i} className="bg-gradient-to-t from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] rounded-sm" style={{ height: `${h}%`, opacity: 0.4 + (h / 200) }} />;
                })}
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Capacity</span>
                <span className="text-[hsl(var(--neon-cyan))] tabular-nums">12.4 kW</span>
              </div>
            </div>
          </NeonPanel>

          <NeonPanel color="orange" title="Etsy Operations" level="LV.1" status="Etsy Live">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-[hsl(var(--neon-orange)/0.2)] text-[hsl(var(--neon-orange))]">● PRINTIFY</span>
                <span className="px-1.5 py-0.5 rounded bg-[hsl(var(--neon-green)/0.15)] text-[hsl(var(--neon-green))]">● ETSY LIVE</span>
                <span className="ml-auto text-muted-foreground tabular-nums">$2,392.04</span>
              </div>
              <div className="flex gap-1 text-[9px]">
                {["Dashboard", "Products", "Live Feed", "Catalog", "Analytics", "Automation"].map((t, i) => (
                  <span key={t} className={`px-1.5 py-0.5 rounded ${i === 2 ? "bg-[hsl(var(--neon-orange)/0.25)] text-[hsl(var(--neon-orange))] border border-[hsl(var(--neon-orange)/0.5)]" : "text-muted-foreground border border-[hsl(260_40%_22%)]"}`}>{t}</span>
                ))}
              </div>
              <div className="rounded bg-[hsl(248_60%_4%)] border border-[hsl(var(--neon-orange)/0.3)] p-2 font-mono text-[9px] leading-tight space-y-0.5">
                <div className="text-[hsl(var(--neon-green))]">androo:~/build$ run --phase 2</div>
                <div className="text-muted-foreground">→ Generating design for "Cabin Selectivity Serial Pop"</div>
                <div className="text-muted-foreground">→ Prompt: extended retro-botanical cactus illustration</div>
                <div className="text-muted-foreground">→ Style: vintage-botanical</div>
                <div className="text-muted-foreground">→ Resolution: 1080×1080px</div>
                <div className="text-[hsl(var(--neon-cyan))]">[1/3] Model: rendering...</div>
                <div className="flex gap-2"><span className="text-[hsl(var(--neon-yellow))]">Progress:</span><span className="text-[hsl(var(--neon-yellow))] tabular-nums">71%</span></div>
                <div className="flex gap-2"><span className="text-[hsl(var(--neon-magenta))]">Progress:</span><div className="flex-1 h-1 bg-[hsl(255_35%_16%)] rounded overflow-hidden self-center"><div className="h-full w-[71%] bg-[hsl(var(--neon-magenta))]" /></div></div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                <div className="px-1.5 py-1 rounded bg-[hsl(255_35%_12%)] border border-[hsl(260_40%_22%)]">
                  <div className="text-muted-foreground">LIVE ON ETSY</div>
                  <div className="text-[hsl(var(--neon-green))] tabular-nums font-bold">14</div>
                </div>
                <div className="px-1.5 py-1 rounded bg-[hsl(255_35%_12%)] border border-[hsl(260_40%_22%)]">
                  <div className="text-muted-foreground">PUBLISHED</div>
                  <div className="text-[hsl(var(--neon-orange))] tabular-nums font-bold">8</div>
                </div>
              </div>
            </div>
          </NeonPanel>
        </main>

        {/* Right rail: chat + tickers */}
        <aside className="flex flex-col gap-3 min-h-0">
          <div className="rounded-md bg-[hsl(255_45%_8%/0.85)] border border-[hsl(var(--neon-purple)/0.4)] panel-glow-purple flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[hsl(var(--neon-purple)/0.4)]">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3 w-3 text-[hsl(var(--neon-purple))]" />
                <span className="text-[10px] tracking-[0.25em] uppercase text-[hsl(var(--neon-purple))] font-bold">Pixel</span>
                <span className="text-[9px] text-muted-foreground">design agent</span>
              </div>
              <Bell className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-[11px] leading-relaxed">
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-[hsl(var(--neon-purple))] grid place-items-center text-[9px] font-bold text-background shrink-0">P</div>
                <div className="flex-1">
                  <div className="text-[9px] text-muted-foreground mb-1">Pixel · 09:42</div>
                  <div className="rounded-md bg-[hsl(255_35%_14%)] border border-[hsl(var(--neon-purple)/0.3)] p-2">
                    you know what resolution Polaroid <span className="text-[hsl(var(--neon-yellow))]">throwbacks</span> have? I keep getting <span className="text-[hsl(var(--neon-magenta))]">"low DPI"</span> warnings from my vibes.
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-[hsl(var(--neon-cyan))] grid place-items-center text-[9px] font-bold text-background shrink-0">G</div>
                <div className="flex-1">
                  <div className="text-[9px] text-muted-foreground mb-1">Glint · 09:43</div>
                  <div className="rounded-md bg-[hsl(255_35%_14%)] border border-[hsl(var(--neon-cyan)/0.3)] p-2">
                    Currently push for <span className="text-[hsl(var(--neon-cyan))]">300 DPI</span> at minimum and you'll get pixelation on textiles &gt; 18cm.
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-[hsl(var(--neon-orange))] grid place-items-center text-[9px] font-bold text-background shrink-0">L</div>
                <div className="flex-1">
                  <div className="text-[9px] text-muted-foreground mb-1">Ledger · 09:45</div>
                  <div className="rounded-md bg-[hsl(255_35%_14%)] border border-[hsl(var(--neon-orange)/0.3)] p-2">
                    Promised <span className="text-[hsl(var(--neon-yellow))]">Commander 16</span> products live by Friday. Can't afford slippage — both designs raw at 400 DPI. QA should be <span className="text-[hsl(var(--neon-green))]">all-pass</span>. Back-on-track. <span className="text-[hsl(var(--neon-green))]">Good recovery.</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Activity className="h-3 w-3 text-[hsl(var(--neon-green))] pulse-dot" />
                <span>Pixel is typing<span className="tracking-widest">...</span></span>
              </div>
            </div>
            <div className="p-2 border-t border-[hsl(var(--neon-purple)/0.4)]">
              <div className="flex items-center gap-2 rounded-md bg-[hsl(255_35%_14%)] border border-[hsl(260_40%_25%)] px-2 py-1.5">
                <Terminal className="h-3 w-3 text-[hsl(var(--neon-purple))]" />
                <input className="flex-1 bg-transparent outline-none text-[11px] placeholder:text-muted-foreground" placeholder="dispatch command…" />
                <Send className="h-3 w-3 text-[hsl(var(--neon-purple))]" />
              </div>
            </div>
          </div>

          <div className="rounded-md bg-[hsl(255_45%_8%/0.85)] border border-[hsl(260_40%_22%)] p-3">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-3 w-3 text-[hsl(var(--neon-yellow))]" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-[hsl(var(--neon-yellow))] font-bold">Mandate</span>
            </div>
            <div className="text-[10px] leading-relaxed text-muted-foreground">
              Ship <span className="text-[hsl(var(--neon-yellow))]">Commander 16</span> SKUs by <span className="text-[hsl(var(--neon-magenta))]">Day 9</span>. Maintain QA &gt; 90%. Keep treasury above <span className="text-[hsl(var(--neon-green))]">$1,000</span>.
            </div>
          </div>

          {/* Achievements */}
          <div className="rounded-md bg-[hsl(255_45%_8%/0.85)] border border-[hsl(var(--neon-magenta)/0.4)] panel-glow-magenta p-3">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-3 w-3 text-[hsl(var(--neon-magenta))]" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-[hsl(var(--neon-magenta))] font-bold">Latest Achievement</span>
            </div>
            <div className="flex items-center gap-2 mb-2 p-2 rounded bg-gradient-to-r from-[hsl(var(--neon-magenta)/0.2)] to-transparent border border-[hsl(var(--neon-magenta)/0.4)]">
              <Award className="h-6 w-6 text-[hsl(var(--neon-yellow))] text-glow shrink-0" />
              <div>
                <div className="text-[11px] font-bold text-[hsl(var(--neon-yellow))]">Two Grand</div>
                <div className="text-[9px] text-muted-foreground">$2,000 revenue milestone</div>
              </div>
              <span className="ml-auto text-[9px] text-[hsl(var(--neon-green))]">+1,000 XP</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { i: Star, c: "hsl(var(--neon-yellow))", on: true },
                { i: Flame, c: "hsl(var(--neon-orange))", on: true },
                { i: Trophy, c: "hsl(var(--neon-magenta))", on: true },
                { i: Sparkles, c: "hsl(var(--neon-cyan))", on: false },
                { i: Award, c: "hsl(var(--neon-purple))", on: false },
              ].map((a, i) => {
                const Ic = a.i;
                return (
                  <div key={i} className="aspect-square rounded grid place-items-center border"
                    style={{
                      borderColor: a.on ? a.c : "hsl(260 40% 22%)",
                      background: a.on ? `${a.c.replace(")", " / 0.15)")}` : "hsl(255 35% 12%)",
                      boxShadow: a.on ? `0 0 8px ${a.c.replace(")", " / 0.4)")}` : "none",
                    }}>
                    <Ic className="h-3.5 w-3.5" style={{ color: a.on ? a.c : "hsl(260 20% 35%)" }} />
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Footer ticker */}
      <footer className="absolute bottom-0 left-0 right-0 h-6 border-t border-[hsl(260_40%_18%)] bg-[hsl(250_50%_5%/0.95)] backdrop-blur overflow-hidden flex items-center">
        <div className="flex whitespace-nowrap ticker-track text-[10px] tracking-widest">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-8 px-4">
              <span className="text-[hsl(var(--neon-green))]">▲ ORDER #4821 SHIPPED · $124.00</span>
              <span className="text-muted-foreground">FACTORY II HEAT 62°</span>
              <span className="text-[hsl(var(--neon-magenta))]">PIXEL · DRAFTED 3 SKUs</span>
              <span className="text-[hsl(var(--neon-yellow))]">QA BATCH #91 PASSED</span>
              <span className="text-[hsl(var(--neon-cyan))]">PRISM SYNC OK</span>
              <span className="text-[hsl(var(--neon-orange))]">TREASURY +$84.20</span>
              <span className="text-muted-foreground">DAY 7 / 30 · TICK 14:09</span>
              <span className="text-[hsl(var(--neon-green))]">▲ ORDER #4822 QUEUED</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Index;
