'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { employees as initialEmployees } from '@/lib/data';
import { Employee, AgentStatus } from '@/lib/types';
import {
  Activity, Box, Boxes, Cpu, Database, Factory, Gauge, Hammer, Layers, Network,
  Package, Settings, ShoppingCart, Sparkles, Terminal, Workflow, Wrench, Zap,
  Send, ChevronRight, Coins, FlaskConical, Pickaxe, Truck, MessageSquare, Bell,
  Trophy, Target, Flame, Star, Award, CheckCircle2, Circle, X, Power, Play, Pause,
  Clock, CheckCircle, Wifi, Radio, Brain, FileCode, Shield
} from "lucide-react";
import StylizedAvatar from "@/components/village/StylizedAvatar";
import { motion, AnimatePresence } from 'framer-motion';

const NeonPanel = ({
  color = "purple",
  title,
  status,
  level,
  children,
  className = "",
  avatarColor,
  gender = "non-binary",
  isAvatarWorking = false
}: {
  color?: "cyan" | "magenta" | "purple" | "orange" | "yellow";
  title: string;
  status?: string;
  level?: string;
  children: React.ReactNode;
  className?: string;
  avatarColor?: string;
  gender?: 'male' | 'female' | 'non-binary';
  isAvatarWorking?: boolean;
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
            isWorking={isAvatarWorking || status === "Active" || status === "Etsy Live"} 
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

const SidebarItem = ({ icon: Icon, label, active = false, badge, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left text-xs transition-colors ${active ? "bg-[hsl(285_90%_65%/0.15)] text-[hsl(var(--neon-purple))]" : "text-muted-foreground hover:bg-[hsl(255_35%_16%)] hover:text-foreground"}`}
  >
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
  const [activeView, setActiveView] = useState<'dashboard' | 'agents'>('dashboard');
  const [agents, setAgents] = useState<Employee[]>(initialEmployees);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [systemTime, setSystemTime] = useState('');

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? null;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleStatus = (id: string, newStatus: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, status: newStatus as AgentStatus } : agent
      )
    );
  };

  const getStatusBg = (status: AgentStatus) => {
    switch (status) {
      case 'running': return 'bg-[hsl(var(--neon-cyan))]';
      case 'paused': return 'bg-[hsl(var(--neon-yellow))]';
      case 'error': return 'bg-[hsl(var(--neon-magenta))]';
      default: return 'bg-slate-500';
    }
  };

  const runningCount = agents.filter(a => a.status === 'running').length;

  return (
    <div className="min-h-screen w-full text-foreground relative overflow-hidden font-mono selection:bg-[hsl(var(--neon-magenta))] selection:text-white bg-[hsl(var(--background))]">
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
          <span className="text-[10px] text-muted-foreground tracking-wider px-2 py-0.5 rounded border border-[hsl(260_40%_22%)]">v0.5.0 — production</span>
        </div>

        <div className="flex items-center gap-2">
          <StatPill label="Day" value="7 / 30" color="hsl(var(--neon-cyan))" />
          <StatPill label="Revenue" value="$1,392.04" color="hsl(var(--neon-green))" />
          <StatPill label="Sync" value={systemTime} color="hsl(var(--neon-cyan))" />
          <StatPill label="Agents" value={`${runningCount} / ${agents.length}`} color="hsl(var(--neon-orange))" />
          <button className="ml-2 px-3 py-1 text-[10px] tracking-[0.25em] uppercase rounded bg-[hsl(var(--neon-magenta)/0.2)] border border-[hsl(var(--neon-magenta))] text-[hsl(var(--neon-magenta))] hover:bg-[hsl(var(--neon-magenta)/0.35)] transition">
            ▶ Run Tick
          </button>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-[220px_1fr_300px] gap-3 p-3 h-[calc(100vh-3rem)]">
        {/* Sidebar */}
        <aside className="flex flex-col gap-3 overflow-y-auto custom-scrollbar scrollbar-hide">
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
          </div>

          <div className="rounded-md bg-[hsl(255_45%_8%/0.85)] border border-[hsl(260_40%_22%)] p-2">
            <div className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground px-2 py-1.5">Operations</div>
            <SidebarItem icon={Gauge} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
            <SidebarItem icon={Network} label="Neural Matrix" active={activeView === 'agents'} onClick={() => setActiveView('agents')} badge={agents.length.toString()} />
            <SidebarItem icon={Pickaxe} label="Mandate" />
            <SidebarItem icon={FlaskConical} label="WIP" />
            <SidebarItem icon={Hammer} label="Assembly" />
            
            <div className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground px-2 py-1.5 pt-3">Systems</div>
            <SidebarItem icon={ShoppingCart} label="Orders" badge="6" />
            <SidebarItem icon={Coins} label="Treasury" />
            <SidebarItem icon={Settings} label="Settings" />
          </div>

          {/* Mini Agent List */}
          <div className="rounded-md bg-[hsl(255_45%_8%/0.85)] border border-white/5 p-3 flex-1 overflow-y-auto scrollbar-hide">
            <div className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-4">Neural Workforce</div>
            <div className="space-y-2">
              {agents.map(agent => (
                <button 
                  key={agent.id}
                  onClick={() => { setSelectedAgentId(agent.id); setActiveView('agents'); }}
                  className="w-full flex items-center gap-3 p-2 rounded bg-white/5 border border-white/5 hover:border-[hsl(var(--neon-cyan)/0.3)] transition-all group"
                >
                  <div className="w-8 h-8 shrink-0">
                    <StylizedAvatar 
                      color={agent.id === 'hermes' ? 'hsl(var(--neon-purple))' : 'hsl(var(--neon-cyan))'} 
                      gender={agent.gender as any} 
                      isWorking={agent.status === 'running'}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-[10px] text-white font-bold tracking-tight truncate">{agent.name.toUpperCase()}</div>
                    <div className="text-[8px] text-muted-foreground uppercase">{agent.role}</div>
                  </div>
                  <div className={`w-1 h-1 rounded-full ${getStatusBg(agent.status)} ${agent.status === 'running' ? 'pulse-dot' : 'opacity-40'}`} />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main View Area */}
        <main className="min-h-0 overflow-y-auto custom-scrollbar scrollbar-hide relative">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-2 xl:grid-cols-3 gap-3"
              >
                <NeonPanel color="purple" title="Factory II" level="LV.2" status="Active">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>HEAT</span><div className="flex-1 h-1 rounded bg-[hsl(255_35%_16%)] overflow-hidden"><div className="h-full w-[62%] bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))]" /></div>
                      <span className="text-[hsl(var(--neon-yellow))] tabular-nums flicker">62°</span>
                    </div>
                    <div className="relative">
                      <FactoryGrid color="hsl(285 90% 65%)" />
                      <div className="absolute top-2 right-2 h-6 w-6 rounded-full border border-[hsl(var(--neon-green)/0.6)] grid place-items-center">
                        <div className="h-1 w-1 rounded-full bg-[hsl(var(--neon-green))] blip" />
                      </div>
                    </div>
                  </div>
                </NeonPanel>

                <NeonPanel color="cyan" title="Assembly" level="LV.1" status="Active" avatarColor="hsl(var(--neon-cyan))">
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-1.5 text-[9px]">
                      <div className="px-1.5 py-1 rounded bg-[hsl(255_35%_12%)] border border-white/5">
                        <div className="text-muted-foreground uppercase">Rate</div>
                        <div className="text-[hsl(var(--neon-cyan))] tabular-nums font-bold">128/s</div>
                      </div>
                      <div className="px-1.5 py-1 rounded bg-[hsl(255_35%_12%)] border border-white/5">
                        <div className="text-muted-foreground uppercase">Queue</div>
                        <div className="text-[hsl(var(--neon-yellow))] tabular-nums font-bold">14</div>
                      </div>
                    </div>
                    <FactoryGrid color="hsl(190 100% 55%)" density="high" />
                  </div>
                </NeonPanel>

                <NeonPanel color="orange" title="Treasury" level="LV.1" status="Active" avatarColor="hsl(var(--neon-orange))">
                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex justify-between"><span className="text-muted-foreground">Cash</span><span className="text-[hsl(var(--neon-yellow))] tabular-nums font-bold">$1,392.04</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Burn</span><span className="tabular-nums">$84.20</span></div>
                    <div className="h-1.5 rounded bg-[hsl(255_35%_16%)] overflow-hidden mt-2">
                      <div className="h-full w-[68%] bg-gradient-to-r from-[hsl(var(--neon-orange))] to-[hsl(var(--neon-yellow))]" />
                    </div>
                  </div>
                </NeonPanel>

                <NeonPanel color="magenta" title="Logistics" level="LV.2" status="Active" avatarColor="hsl(var(--neon-magenta))">
                   <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px]">
                      <Truck className="h-3 w-3 text-[hsl(var(--neon-yellow))]" />
                      <span className="text-muted-foreground">Fleet: 8 / 12</span>
                    </div>
                    <FactoryGrid color="hsl(330 100% 60%)" density="low" />
                  </div>
                </NeonPanel>

                <NeonPanel color="yellow" title="R&D Lab" level="LV.3" status="Active" avatarColor="hsl(var(--neon-yellow))" gender="female">
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between"><span className="text-muted-foreground">Stability</span><span className="text-[hsl(var(--neon-green))] tabular-nums">94%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Yield</span><span className="text-[hsl(var(--neon-cyan))] tabular-nums">73.2%</span></div>
                  </div>
                </NeonPanel>

                <NeonPanel color="purple" title="Matrix" level="LV.1" status="Active" avatarColor="hsl(var(--neon-purple))">
                  <div className="font-mono text-[9px] text-[hsl(var(--neon-purple))] leading-tight">
                    {`>> Neural sync active\n>> Processing frame 412\n>> Grid synchronized`}
                  </div>
                </NeonPanel>
              </motion.div>
            ) : (
              <motion.div 
                key="agents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {agents.map((agent) => (
                  <div 
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`
                      relative rounded-md bg-[hsl(255_45%_8%/0.85)] border-2 p-6 cursor-pointer group transition-all duration-300
                      ${selectedAgentId === agent.id ? 'border-[hsl(var(--neon-cyan))] panel-glow-cyan bg-white/5' : 'border-white/5 hover:border-white/20'}
                    `}
                  >
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-16 h-16 shrink-0 relative">
                        <StylizedAvatar 
                          color={agent.id === 'hermes' ? 'hsl(var(--neon-purple))' : 'hsl(var(--neon-cyan))'} 
                          gender={agent.gender as any} 
                          isWorking={agent.status === 'running'} 
                          className="w-full h-full"
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-black text-lg tracking-tighter leading-none mb-1 group-hover:text-[hsl(var(--neon-cyan))] transition-colors">{agent.name.toUpperCase()}</h3>
                        <div className="text-[9px] font-black text-muted-foreground tracking-widest uppercase">{agent.role}</div>
                      </div>
                      <div className={`ml-auto w-1.5 h-1.5 rounded-full ${getStatusBg(agent.status)} ${agent.status === 'running' ? 'pulse-dot shadow-[0_0_8px_currentColor]' : 'opacity-40'}`} />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                          <Activity className="w-3 h-3 text-[hsl(var(--neon-green))]" /> Success
                        </span>
                        <span className="text-white font-bold tabular-nums">{agent.successRate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                          <Zap className="w-3 h-3 text-[hsl(var(--neon-purple))]" /> Usage
                        </span>
                        <span className="text-white font-bold tabular-nums">{Math.round((agent.tokenUsage.used / agent.tokenUsage.limit) * 100)}%</span>
                      </div>
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">ID_{agent.id.slice(0, 4)}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-muted-foreground font-black tabular-nums">{agent.latency}ms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right rail: chat + tickers */}
        <aside className="flex flex-col gap-3 min-h-0">
          <div className="rounded-md bg-[hsl(255_45%_8%/0.85)] border border-[hsl(var(--neon-purple)/0.4)] panel-glow-purple flex flex-col flex-1 min-h-0 relative overflow-hidden">
            <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
            <div className="flex items-center justify-between px-3 py-2 border-b border-[hsl(var(--neon-purple)/0.4)] relative z-10">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3 w-3 text-[hsl(var(--neon-purple))]" />
                <span className="text-[10px] tracking-[0.25em] uppercase text-[hsl(var(--neon-purple))] font-bold">Neural Feed</span>
              </div>
              <Bell className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[11px] leading-relaxed relative z-10 custom-scrollbar scrollbar-hide">
              <div className="p-3 rounded bg-white/5 border border-white/5">
                <div className="text-[8px] text-[hsl(var(--neon-cyan))] font-black uppercase mb-1 tracking-widest">System Alert</div>
                <div className="text-slate-300">Prism sync completed at 300 DPI. All systems operational.</div>
              </div>
              <div className="p-3 rounded bg-white/5 border border-white/5 border-l-[hsl(var(--neon-yellow))] border-l-2">
                <div className="text-[8px] text-[hsl(var(--neon-yellow))] font-black uppercase mb-1 tracking-widest">Pending Task</div>
                <div className="text-slate-300">Ship Commander 16 SKUs by Day 9.</div>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-[hsl(255_45%_8%/0.85)] border border-[hsl(260_40%_22%)] p-3">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-3 w-3 text-[hsl(var(--neon-magenta))]" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-[hsl(var(--neon-magenta))] font-bold">Last Milestone</span>
            </div>
            <div className="text-[10px] text-white font-bold">$2,000 Revenue Reached</div>
            <div className="text-[8px] text-muted-foreground mt-1">Unlocked "Two Grand" achievement</div>
          </div>
        </aside>
      </div>

      {/* Agent Detail Panel Modal Overlay */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            className="fixed top-0 right-0 h-full w-[520px] z-50 shadow-2xl"
          >
            <AgentDetailPanel 
              agent={selectedAgent} 
              onClose={() => setSelectedAgentId(null)}
              onToggleStatus={handleToggleStatus}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

// --- Subcomponents for Agent Details ---

function AgentDetailPanel({ 
  agent, 
  onClose, 
  onToggleStatus 
}: { 
  agent: Employee; 
  onClose: () => void;
  onToggleStatus: (id: string, status: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'config' | 'chat'>('overview');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (agent.id === 'hermes') setActiveTab('chat');
    else setActiveTab('overview');
  }, [agent.id]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isThinking) return;
    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    setIsThinking(true);
    try {
      const response = await fetch('/api/hermes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      if (data.response) setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect to Hermes Matrix.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: Terminal },
    { id: 'metrics', label: 'METRICS', icon: Activity },
    ...(agent.id === 'hermes' ? [{ id: 'chat', label: 'MATRIX', icon: Brain }] : []),
    { id: 'config', label: 'SYSTEM', icon: Settings },
  ] as const;

  return (
    <div className="h-full bg-[hsl(250_50%_4%/0.98)] backdrop-blur-3xl border-l border-white/10 flex flex-col scanlines">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 shrink-0 relative">
              <StylizedAvatar 
                color={agent.id === 'hermes' ? 'hsl(var(--neon-purple))' : 'hsl(var(--neon-cyan))'} 
                gender={agent.gender as any} 
                isWorking={agent.status === 'running'} 
              />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-2">{agent.name.toUpperCase()}</h2>
              <div className="flex items-center gap-3">
                <span className="text-[hsl(var(--neon-cyan))] text-[10px] font-black tracking-[0.3em] uppercase">{agent.role}</span>
                <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${agent.status === 'running' ? 'text-[hsl(var(--neon-green))]' : 'text-[hsl(var(--neon-yellow))]'}`}>
                  {agent.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all group">
            <X className="w-8 h-8 text-muted-foreground group-hover:text-white" />
          </button>
        </div>

        <div className="flex gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-3 px-5 py-2.5 rounded text-[10px] font-black tracking-[0.25em] transition-all border
                ${activeTab === tab.id 
                  ? 'bg-[hsl(var(--neon-cyan)/0.15)] text-[hsl(var(--neon-cyan))] border-[hsl(var(--neon-cyan)/0.4)] shadow-[0_0_15px_hsl(var(--neon-cyan)/0.2)]' 
                  : 'text-muted-foreground border-transparent hover:border-white/10 hover:bg-white/5'}
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar scrollbar-hide">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <StatBox label="SUCCESS" value={`${agent.successRate}%`} icon={CheckCircle} color="green" />
              <StatBox label="LATENCY" value={`${agent.latency}ms`} icon={Clock} color="cyan" />
            </div>
            <div className="bg-[hsl(var(--card)/0.4)] rounded-md border border-white/5 p-6 panel-glow-purple">
              <div className="flex items-center justify-between mb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                <span>Neural Usage</span>
                <span>{Math.round((agent.tokenUsage.used / agent.tokenUsage.limit) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-magenta))]" style={{ width: `${(agent.tokenUsage.used / agent.tokenUsage.limit) * 100}%` }} />
              </div>
            </div>
            <div className="bg-white/5 rounded p-5 border border-white/5 font-mono text-[11px] leading-relaxed text-slate-400">
              {agent.systemPrompt}
            </div>
          </div>
        )}
        
        {activeTab === 'chat' && (
           <div className="h-full flex flex-col">
            <div className="flex-1 space-y-6 mb-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded border font-mono text-[11px] max-w-[90%] ${msg.role === 'user' ? 'bg-[hsl(var(--neon-purple)/0.1)] border-[hsl(var(--neon-purple)/0.3)] text-[hsl(var(--neon-purple))]' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="DISPATCH COMMAND..."
                className="w-full bg-white/5 border border-white/10 rounded p-4 pr-12 font-mono text-xs text-white focus:outline-none focus:border-[hsl(var(--neon-cyan)/0.5)]"
              />
              <button onClick={handleSendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--neon-cyan))]">
                <Zap className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-4">
             <div className="bg-white/5 rounded p-5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Database className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Total Consumption</span>
                </div>
                <span className="text-[11px] text-white font-black tabular-nums">{agent.tokenUsage.used.toLocaleString()} units</span>
             </div>
             <div className="bg-white/5 rounded p-5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Shield className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Capacity Limit</span>
                </div>
                <span className="text-[11px] text-white font-black tabular-nums">{agent.tokenUsage.limit.toLocaleString()} units</span>
             </div>
             <div className="bg-white/5 rounded p-5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Cpu className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Neural Threads</span>
                </div>
                <span className="text-[11px] text-white font-black tabular-nums">{agent.concurrency.current}</span>
             </div>
          </div>
        )}

        {activeTab === 'config' && (
           <div className="space-y-8">
            <div className="bg-white/5 rounded p-6 border border-white/5">
              <h3 className="text-[10px] font-black text-muted-foreground tracking-widest uppercase mb-6 flex items-center gap-3">
                <Power className="w-4 h-4 text-[hsl(var(--neon-cyan))]" /> Status Control
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => onToggleStatus(agent.id, 'running')}
                  className={`py-4 rounded font-black text-[10px] tracking-widest uppercase transition-all ${agent.status === 'running' ? 'bg-[hsl(var(--neon-cyan)/0.2)] text-[hsl(var(--neon-cyan))] border border-[hsl(var(--neon-cyan)/0.4)]' : 'bg-white/5 text-muted-foreground'}`}
                >
                  Initiate
                </button>
                <button 
                  onClick={() => onToggleStatus(agent.id, 'paused')}
                  className={`py-4 rounded font-black text-[10px] tracking-widest uppercase transition-all ${agent.status === 'paused' ? 'bg-[hsl(var(--neon-yellow)/0.2)] text-[hsl(var(--neon-yellow))] border border-[hsl(var(--neon-yellow)/0.4)]' : 'bg-white/5 text-muted-foreground'}`}
                >
                  Suspend
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-white/5 bg-black/50">
        <button className="w-full py-5 bg-[hsl(var(--neon-purple))] hover:bg-[hsl(var(--neon-purple)/0.9)] rounded font-black text-background text-[11px] tracking-[0.4em] uppercase transition-all">
          Upgrade Neural Core
        </button>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    green: 'hsl(var(--neon-green))',
    cyan: 'hsl(var(--neon-cyan))',
    purple: 'hsl(var(--neon-purple))',
    yellow: 'hsl(var(--neon-yellow))',
  };
  return (
    <div className="bg-[hsl(var(--card)/0.4)] rounded p-5 border border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 scanlines opacity-10" />
      <Icon className="w-5 h-5 mb-3" style={{ color: colors[color] }} />
      <div className="text-2xl font-black text-white tabular-nums tracking-tight mb-1">{value}</div>
      <div className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</div>
    </div>
  );
}

export default Index;
