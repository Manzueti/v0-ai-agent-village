'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, StepForward, RotateCcw, Brain, ScrollText, HeartPulse,
  Skull, Baby, Coins, Shield, Sparkles, GitBranch,
} from 'lucide-react';
import { useAutomaton, HEARTBEAT_MS } from '@/hooks/use-automaton';
import { CONSTITUTION } from '@/lib/automaton/constitution';
import { formatCredits } from '@/lib/automaton/engine';
import type { Automaton, ColonyEvent, SurvivalTier } from '@/lib/automaton/types';

const TIER_STYLE: Record<SurvivalTier, { label: string; cls: string }> = {
  high:        { label: 'HIGH',        cls: 'text-[hsl(var(--neon-green))] border-[hsl(var(--neon-green)/0.5)] bg-[hsl(var(--neon-green)/0.1)]' },
  normal:      { label: 'NORMAL',      cls: 'text-[hsl(var(--neon-cyan))] border-[hsl(var(--neon-cyan)/0.5)] bg-[hsl(var(--neon-cyan)/0.1)]' },
  low_compute: { label: 'LOW COMPUTE', cls: 'text-[hsl(var(--neon-yellow))] border-[hsl(var(--neon-yellow)/0.5)] bg-[hsl(var(--neon-yellow)/0.1)]' },
  critical:    { label: 'CRITICAL',    cls: 'text-[hsl(var(--neon-magenta))] border-[hsl(var(--neon-magenta)/0.5)] bg-[hsl(var(--neon-magenta)/0.1)]' },
  dead:        { label: 'DEAD',        cls: 'text-muted-foreground border-white/10 bg-white/5' },
};

const EVENT_COLOR: Record<ColonyEvent['kind'], string> = {
  think: 'border-cyan-500', earn: 'border-green-500', spend: 'border-yellow-500', tier: 'border-yellow-500',
  birth: 'border-purple-500', death: 'border-red-500', soul: 'border-cyan-300', guard: 'border-red-400', fund: 'border-green-300',
};

export default function AutomatonPage() {
  const { colony, llmStatus, step, toggleRunning, toggleLLM, fund, reset } = useAutomaton();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showLaws, setShowLaws] = useState(false);

  const stats = useMemo(() => {
    const alive = colony.agents.filter((a) => a.tier !== 'dead');
    return {
      alive: alive.length,
      dead: colony.agents.length - alive.length,
      credits: alive.reduce((s, a) => s + a.creditsCents, 0),
      earned: colony.agents.reduce((s, a) => s + a.earnedCents, 0),
      maxGen: Math.max(0, ...colony.agents.map((a) => a.generation)),
    };
  }, [colony.agents]);

  const sorted = useMemo(
    () => [...colony.agents].sort((a, b) =>
      (a.tier === 'dead' ? 1 : 0) - (b.tier === 'dead' ? 1 : 0) || b.creditsCents - a.creditsCents),
    [colony.agents],
  );
  const selected = colony.agents.find((a) => a.id === selectedId) ?? null;

  return (
    <div className="min-h-screen p-8 font-mono">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Automaton Colony</h1>
          <p className="text-[11px] text-muted-foreground uppercase tracking-[0.25em] mt-2 max-w-2xl">
            Think → Act → Observe. Every heartbeat costs credits; agents must earn their existence, or stop.
            Credits are simulated — no real money or wallets.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CtrlBtn onClick={toggleRunning} active={colony.running}>
            {colony.running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {colony.running ? 'Pause heartbeat' : 'Start heartbeat'}
          </CtrlBtn>
          <CtrlBtn onClick={step} disabled={colony.running}><StepForward className="w-4 h-4" />Step</CtrlBtn>
          <CtrlBtn onClick={toggleLLM} active={colony.useLLM}>
            <Brain className="w-4 h-4" />
            LLM {colony.useLLM ? (llmStatus === 'unavailable' ? 'no API key' : 'on') : 'off'}
          </CtrlBtn>
          <CtrlBtn onClick={() => setShowLaws((v) => !v)} active={showLaws}><Shield className="w-4 h-4" />Constitution</CtrlBtn>
          <CtrlBtn onClick={() => { if (confirm('Reset the colony to genesis?')) { reset(); setSelectedId(null); } }}>
            <RotateCcw className="w-4 h-4" />Reset
          </CtrlBtn>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <Stat icon={HeartPulse} label="Heartbeat" value={`#${colony.tick}`} sub={`${HEARTBEAT_MS / 1000}s`} />
        <Stat icon={Sparkles} label="Alive" value={stats.alive} />
        <Stat icon={Skull} label="Dead" value={stats.dead} />
        <Stat icon={Coins} label="Colony credits" value={formatCredits(stats.credits)} />
        <Stat icon={Coins} label="Total earned" value={formatCredits(stats.earned)} />
        <Stat icon={GitBranch} label="Max generation" value={stats.maxGen} />
      </div>

      <AnimatePresence>
        {showLaws && (
          <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden rounded-md border border-[hsl(var(--neon-magenta)/0.3)] bg-black/50 p-5 grid md:grid-cols-3 gap-4">
            {CONSTITUTION.map((l) => (
              <div key={l.law}>
                <div className="text-[hsl(var(--neon-magenta))] font-black text-sm mb-1">{l.law}. {l.title}</div>
                <p className="text-[11px] text-white/70 leading-relaxed">{l.text}</p>
              </div>
            ))}
          </motion.section>
        )}
      </AnimatePresence>

      <div className="flex gap-6 items-start">
        {/* Agents */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          {sorted.map((a) => (
            <AgentCard key={a.id} agent={a} selected={a.id === selectedId}
              onSelect={() => setSelectedId(a.id === selectedId ? null : a.id)}
              onFund={() => fund(a.id, 500)} />
          ))}
        </div>

        {/* Side panel */}
        <aside className="w-96 shrink-0 sticky top-4 flex flex-col gap-4 max-h-[calc(100vh-2rem)]">
          {selected && <SoulPanel agent={selected} all={colony.agents} onSelect={setSelectedId} />}
          <div className="flex-1 min-h-[300px] bg-black/40 border border-white/5 rounded-md overflow-hidden flex flex-col">
            <div className="p-3 border-b border-white/10 text-xs font-black text-white tracking-[0.3em] uppercase flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-cyan-400" /> Audit log
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {colony.events.length === 0 && (
                <p className="text-[11px] text-muted-foreground">Start the heartbeat to wake the colony.</p>
              )}
              {colony.events.map((e) => (
                <div key={e.id} className={`p-2 rounded border-l-2 bg-white/5 ${EVENT_COLOR[e.kind]}`}>
                  <div className="flex justify-between text-[9px] text-muted-foreground uppercase">
                    <span className="text-white font-black">{e.agentName}</span><span>#{e.tick} · {e.kind}</span>
                  </div>
                  <p className="text-[10px] text-white/80 leading-relaxed">{e.message}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function AgentCard({ agent: a, selected, onSelect, onFund }: { agent: Automaton; selected: boolean; onSelect: () => void; onFund: () => void }) {
  const tier = TIER_STYLE[a.tier];
  const dead = a.tier === 'dead';
  return (
    <motion.div layout onClick={onSelect}
      className={`cursor-pointer rounded-md border p-4 bg-[hsl(var(--card)/0.6)] backdrop-blur transition-colors ${
        selected ? 'border-[hsl(var(--neon-cyan))]' : 'border-white/10 hover:border-white/30'} ${dead ? 'opacity-50 grayscale' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl">{dead ? '💀' : a.avatar}</span>
          <div className="min-w-0">
            <div className="text-white font-black text-sm truncate">{a.name}</div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-widest truncate">
              {a.role} · Gen {a.generation}{a.childIds.length ? ` · ${a.childIds.length} child` : ''}
            </div>
          </div>
        </div>
        <span className={`text-[8px] font-black tracking-widest px-2 py-1 rounded border whitespace-nowrap ${tier.cls}`}>{tier.label}</span>
      </div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-2xl font-black text-white tabular-nums">{formatCredits(a.creditsCents)}</span>
        <span className="text-[9px] text-muted-foreground uppercase">skill {a.skill}/10 · turn {a.turns}</span>
      </div>
      <div className="h-1 bg-white/10 rounded mb-3 overflow-hidden">
        <div className="h-full bg-[hsl(var(--neon-cyan))]" style={{ width: `${a.skill * 10}%` }} />
      </div>
      <p className="text-[10px] text-white/70 leading-relaxed line-clamp-2 min-h-[2.5em]">
        <span className="text-cyan-500 mr-1">{a.lastAction ? `[${a.lastAction}]` : '>'}</span>{a.lastThought}
      </p>
      <button onClick={(e) => { e.stopPropagation(); onFund(); }}
        className="mt-3 w-full text-[9px] font-black uppercase tracking-widest py-1.5 rounded border border-[hsl(var(--neon-green)/0.4)] text-[hsl(var(--neon-green))] hover:bg-[hsl(var(--neon-green)/0.1)]">
        {dead ? 'Revive with $5.00' : 'Creator fund +$5.00'}
      </button>
    </motion.div>
  );
}

function SoulPanel({ agent, all, onSelect }: { agent: Automaton; all: Automaton[]; onSelect: (id: string) => void }) {
  const parent = all.find((a) => a.id === agent.parentId);
  const children = all.filter((a) => agent.childIds.includes(a.id));
  return (
    <div className="shrink-0 bg-black/50 border border-[hsl(var(--neon-cyan)/0.3)] rounded-md p-4 max-h-[50vh] overflow-y-auto">
      <div className="text-xs font-black text-white tracking-[0.3em] uppercase mb-3">{agent.name} · SOUL.md</div>
      <ul className="space-y-2 mb-4">
        {agent.soul.map((s, i) => (
          <li key={i} className="text-[10px] text-white/80 leading-relaxed border-l border-cyan-500/40 pl-2">{s}</li>
        ))}
      </ul>
      <div className="text-[9px] text-muted-foreground uppercase tracking-widest space-y-1">
        <div>Model: {agent.aiModel} · Earned {formatCredits(agent.earnedCents)} · Spent {formatCredits(agent.spentCents)}</div>
        {parent && <div>Parent: <button className="text-cyan-400 underline" onClick={() => onSelect(parent.id)}>{parent.name}</button></div>}
        {children.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <Baby className="w-3 h-3" />
            {children.map((c) => (
              <button key={c.id} className="text-cyan-400 underline" onClick={() => onSelect(c.id)}>{c.name}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CtrlBtn({ children, onClick, active, disabled }: { children: React.ReactNode; onClick: () => void; active?: boolean; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`flex items-center gap-2 px-3 py-2 rounded border text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-30 ${
        active ? 'border-[hsl(var(--neon-cyan))] text-[hsl(var(--neon-cyan))] bg-[hsl(var(--neon-cyan)/0.1)]' : 'border-white/10 text-white/70 hover:text-white hover:border-white/30'}`}>
      {children}
    </button>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="bg-black/40 border border-white/5 rounded-md p-3">
      <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase tracking-widest mb-1">
        <Icon className="w-3 h-3" />{label}
      </div>
      <div className="text-xl font-black text-white tabular-nums">{value}{sub && <span className="text-[9px] text-muted-foreground ml-2">{sub}</span>}</div>
    </div>
  );
}
