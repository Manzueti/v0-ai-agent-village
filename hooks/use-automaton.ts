'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ColonyState, Decision } from '@/lib/automaton/types';
import { applyTick, createColony, fundAgent, modelForTier } from '@/lib/automaton/engine';

const STORAGE_KEY = 'automaton-colony-v1';
export const HEARTBEAT_MS = 4000;
/** How many automatons get real LLM inference per heartbeat (cost control). */
const LLM_THINKERS_PER_TICK = 3;
const LLM_TIMEOUT_MS = 12000;

function load(): ColonyState {
  if (typeof window === 'undefined') return createColony();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ColonyState;
      if (parsed.version === 1) return { ...parsed, running: false };
    }
  } catch {}
  return createColony();
}

async function think(colony: ColonyState, agentId: string): Promise<Decision | null> {
  const agent = colony.agents.find((a) => a.id === agentId);
  if (!agent || agent.tier === 'dead' || agent.tier === 'critical') return null;
  const model = modelForTier(agent);
  if (!model) return null;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), LLM_TIMEOUT_MS);
  try {
    const res = await fetch('/api/automaton/think', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model,
        agent: {
          id: agent.id,
          name: agent.name,
          role: agent.role,
          genesisPrompt: agent.genesisPrompt.slice(0, 1000),
          creditsCents: agent.creditsCents,
          tier: agent.tier,
          skill: agent.skill,
          generation: agent.generation,
          turns: agent.turns,
          soul: agent.soul.slice(-12).map((s) => s.slice(0, 300)),
        },
        peers: colony.agents
          .filter((p) => p.id !== agent.id && p.tier !== 'dead')
          .slice(0, 30)
          .map((p) => ({ id: p.id, name: p.name, tier: p.tier, creditsCents: p.creditsCents })),
      }),
    });
    if (res.status === 503) throw new Error('no-provider');
    if (!res.ok) return null;
    const data = await res.json();
    return { thought: data.thought, action: data.action, targetId: data.targetId, soulNote: data.soulNote, source: 'llm' };
  } finally {
    clearTimeout(timer);
  }
}

export function useAutomaton() {
  const [colony, setColony] = useState<ColonyState>(() => createColony());
  const [llmStatus, setLlmStatus] = useState<'unknown' | 'ok' | 'unavailable'>('unknown');
  const busy = useRef(false);
  const cursor = useRef(0);
  const stateRef = useRef(colony);
  stateRef.current = colony;

  // Load persisted state after mount (avoids hydration mismatch).
  useEffect(() => { setColony(load()); }, []);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(colony)); } catch {}
  }, [colony]);

  const step = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      const snapshot = stateRef.current;
      const decisions: Record<string, Decision> = {};

      if (snapshot.useLLM && llmStatus !== 'unavailable') {
        const thinkers = snapshot.agents.filter((a) => a.tier !== 'dead' && a.tier !== 'critical');
        const picked = Array.from({ length: Math.min(LLM_THINKERS_PER_TICK, thinkers.length) }, (_, i) =>
          thinkers[(cursor.current + i) % thinkers.length]);
        cursor.current += picked.length;
        const results = await Promise.allSettled(picked.map((a) => think(snapshot, a.id)));
        results.forEach((r, i) => {
          if (r.status === 'fulfilled' && r.value) { decisions[picked[i].id] = r.value; setLlmStatus('ok'); }
          if (r.status === 'rejected' && String(r.reason).includes('no-provider')) setLlmStatus('unavailable');
        });
      }

      setColony((prev) => applyTick(prev, decisions));
    } finally {
      busy.current = false;
    }
  }, [llmStatus]);

  useEffect(() => {
    if (!colony.running) return;
    const id = setInterval(step, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [colony.running, step]);

  return {
    colony,
    llmStatus,
    step,
    toggleRunning: () => setColony((c) => ({ ...c, running: !c.running })),
    toggleLLM: () => setColony((c) => ({ ...c, useLLM: !c.useLLM })),
    fund: (id: string, cents: number) => setColony((c) => fundAgent(c, id, cents)),
    reset: () => { cursor.current = 0; setColony(createColony()); },
  };
}
