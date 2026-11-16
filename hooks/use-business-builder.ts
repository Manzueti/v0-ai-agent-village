'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Business, BusinessPlan, ChatMessage, Milestone } from '@/lib/builder/types';
import { ADVISOR_IDS, EMPTY_PLAN } from '@/lib/builder/types';
import type { Task } from '@/lib/tasks/types';

const STORAGE_KEY = 'business-builder-v1';

interface BuilderState {
  businesses: Business[];
  activeId: string | null;
}

function makeBusiness(advisorId: string = ADVISOR_IDS[0]): Business {
  const now = new Date().toISOString();
  return {
    id: `biz-${Date.now()}-${Math.floor(Math.random() * 1e4)}`,
    createdAt: now,
    updatedAt: now,
    advisorId,
    messages: [],
    plan: EMPTY_PLAN,
    launchedMilestones: [],
  };
}

function load(): BuilderState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BuilderState;
      if (Array.isArray(parsed.businesses) && parsed.businesses.length) return parsed;
    }
  } catch {}
  const first = makeBusiness();
  return { businesses: [first], activeId: first.id };
}

/** Messages worth sending back to the model: no failed replies, no empty placeholders. */
function history(messages: ChatMessage[]) {
  return messages
    .filter((m) => !m.error && m.content.trim())
    .slice(-40)
    .map(({ role, content }) => ({ role, content }));
}

export function useBusinessBuilder() {
  const [state, setState] = useState<BuilderState>({ businesses: [], activeId: null });
  const [loaded, setLoaded] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => { setState(load()); setLoaded(true); }, []);
  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state, loaded]);

  const active = state.businesses.find((b) => b.id === state.activeId) ?? state.businesses[0] ?? null;

  const patch = useCallback((id: string, fn: (b: Business) => Business) => {
    setState((s) => ({
      ...s,
      businesses: s.businesses.map((b) => (b.id === id ? { ...fn(b), updatedAt: new Date().toISOString() } : b)),
    }));
  }, []);

  const refreshPlan = useCallback(async (biz: Business, messages: ChatMessage[]) => {
    setPlanning(true);
    setPlanError(null);
    try {
      const res = await fetch('/api/builder/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ advisorId: biz.advisorId, messages: history(messages), plan: biz.plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `Plan update failed (${res.status})`);
      patch(biz.id, (b) => ({ ...b, plan: data as BusinessPlan }));
    } catch (e) {
      setPlanError(e instanceof Error ? e.message : 'Plan update failed');
    } finally {
      setPlanning(false);
    }
  }, [patch]);

  const send = useCallback(async (text: string) => {
    const biz = stateRef.current.businesses.find((b) => b.id === stateRef.current.activeId);
    if (!biz || !text.trim() || streaming) return;

    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const messages = [...biz.messages, userMsg];
    patch(biz.id, (b) => ({ ...b, messages: [...messages, { role: 'assistant', content: '' }] }));
    setStreaming(true);

    let reply = '';
    let failed = false;
    try {
      const res = await fetch('/api/builder/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ advisorId: biz.advisorId, messages: history(messages), plan: biz.plan }),
      });
      if (!res.ok || !res.body) {
        failed = true;
        reply = (await res.text().catch(() => '')) || `Request failed (${res.status})`;
      } else {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          reply += decoder.decode(value, { stream: true });
          const snapshot = reply;
          patch(biz.id, (b) => ({ ...b, messages: [...messages, { role: 'assistant', content: snapshot }] }));
        }
        if (!reply.trim()) { failed = true; reply = 'The model returned an empty reply. Try again.'; }
      }
    } catch (e) {
      failed = true;
      reply = e instanceof Error ? e.message : 'Network error';
    }

    const finalMessages: ChatMessage[] = [...messages, { role: 'assistant', content: reply, ...(failed ? { error: true } : {}) }];
    patch(biz.id, (b) => ({ ...b, messages: finalMessages }));
    setStreaming(false);
    if (!failed) await refreshPlan({ ...biz, messages: finalMessages }, finalMessages);
  }, [patch, refreshPlan, streaming]);

  const launchMilestone = useCallback(async (m: Milestone): Promise<Task> => {
    const biz = stateRef.current.businesses.find((b) => b.id === stateRef.current.activeId);
    const res = await fetch('/api/agents/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_custom',
        title: biz?.plan.name ? `[${biz.plan.name}] ${m.title}` : m.title,
        description: m.description,
        department: m.department,
        priority: m.priority,
        autoAssign: true,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? 'Could not create task');
    if (biz) patch(biz.id, (b) => ({ ...b, launchedMilestones: [...b.launchedMilestones, m.title] }));
    return data as Task;
  }, [patch]);

  return {
    loaded,
    businesses: state.businesses,
    active,
    streaming,
    planning,
    planError,
    send,
    launchMilestone,
    refreshPlan: () => active && active.messages.length > 0 && refreshPlan(active, active.messages),
    setAdvisor: (advisorId: string) => active && patch(active.id, (b) => ({ ...b, advisorId })),
    select: (id: string) => setState((s) => ({ ...s, activeId: id })),
    create: () => {
      const b = makeBusiness(active?.advisorId);
      setState((s) => ({ businesses: [b, ...s.businesses], activeId: b.id }));
    },
    remove: (id: string) =>
      setState((s) => {
        const rest = s.businesses.filter((b) => b.id !== id);
        const list = rest.length ? rest : [makeBusiness()];
        return { businesses: list, activeId: s.activeId === id ? list[0].id : s.activeId };
      }),
  };
}
