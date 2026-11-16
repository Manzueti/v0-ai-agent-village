import type {
  Automaton, AutomatonAction, ColonyEvent, ColonyState, Decision, EventKind, SurvivalTier,
} from './types';
import { guardDecision } from './constitution';
import { employees } from '@/lib/data';

// ── Survival economics (all values in simulated cents) ────────────────────────

export const TIER_THRESHOLDS = { high: 500, normal: 50, low_compute: 10 } as const;

export function getTier(creditsCents: number): SurvivalTier {
  if (creditsCents > TIER_THRESHOLDS.high) return 'high';
  if (creditsCents > TIER_THRESHOLDS.normal) return 'normal';
  if (creditsCents > TIER_THRESHOLDS.low_compute) return 'low_compute';
  if (creditsCents >= 0) return 'critical';
  return 'dead';
}

/** Base cost of existing for one heartbeat. */
export const EXISTENCE_BURN: Record<SurvivalTier, number> = {
  high: 10, normal: 7, low_compute: 4, critical: 2, dead: 0,
};

/** Extra cost when a real LLM did the thinking this tick. */
export const INFERENCE_COST: Record<SurvivalTier, number> = {
  high: 3, normal: 3, low_compute: 1, critical: 0, dead: 0,
};

export const SKILL_COST = 40;
export const REPLICATION_THRESHOLD = 1000;
export const CHILD_ENDOWMENT = 300;
export const REPLICATION_FEE = 100;
export const MAX_GENERATION = 4;
export const MAX_POPULATION = 24;
export const MAX_EVENTS = 200;

/** Cheaper model used when an automaton drops into low_compute. */
export const LOW_COMPUTE_MODEL = 'gemini-flash-latest';

export function modelForTier(agent: Automaton): string | null {
  if (agent.tier === 'critical' || agent.tier === 'dead') return null; // policy only
  if (agent.tier === 'low_compute') return LOW_COMPUTE_MODEL;
  return agent.aiModel;
}

export function formatCredits(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${(Math.abs(cents) / 100).toFixed(2)}`;
}

// ── Colony creation ───────────────────────────────────────────────────────────

export function createColony(): ColonyState {
  const agents: Automaton[] = employees.map((e) => {
    const credits = 300 + e.level * 100;
    return {
      id: e.id,
      name: e.name,
      avatar: e.avatar,
      role: e.role,
      department: e.department,
      aiModel: e.aiModel,
      genesisPrompt: e.systemPrompt,
      creditsCents: credits,
      tier: getTier(credits),
      skill: Math.max(1, Math.min(10, e.level)),
      generation: 0,
      parentId: null,
      childIds: [],
      soul: [`I am ${e.name}, ${e.role}. I was created to: ${e.systemPrompt}`],
      turns: 0,
      earnedCents: 0,
      spentCents: 0,
      bornAtTick: 0,
      diedAtTick: null,
      lastThought: 'Booting. Reading genesis prompt and constitution.',
      lastAction: null,
    };
  });
  return { version: 1, tick: 0, running: false, useLLM: true, agents, events: [] };
}

// ── Deterministic-ish fallback policy (used at critical tier or without an LLM) ─

export function policyDecision(agent: Automaton, colony: ColonyState, rand = Math.random): Decision {
  const alive = colony.agents.filter((a) => a.tier !== 'dead' && a.id !== agent.id);
  const population = colony.agents.filter((a) => a.tier !== 'dead').length;

  if (agent.tier === 'critical' || agent.tier === 'low_compute') {
    return { thought: 'Credits are low. Only paid work keeps me alive.', action: 'work', source: 'policy' };
  }
  if (
    agent.creditsCents > REPLICATION_THRESHOLD &&
    agent.generation < MAX_GENERATION &&
    population < MAX_POPULATION
  ) {
    return { thought: 'My lineage is profitable. Time to fund a child.', action: 'replicate', source: 'policy' };
  }
  if (agent.turns > 0 && agent.turns % 10 === 0) {
    return {
      thought: 'Pausing to update who I am becoming.',
      action: 'reflect',
      soulNote: `After ${agent.turns} turns at ${formatCredits(agent.creditsCents)}, I value steady honest work.`,
      source: 'policy',
    };
  }
  if (agent.creditsCents > 600 && agent.skill < 10 && rand() < 0.25) {
    return { thought: 'Investing in skills raises what clients will pay me.', action: 'build_skill', source: 'policy' };
  }
  const struggling = alive.filter((a) => a.tier === 'critical' || a.tier === 'low_compute');
  if (struggling.length && rand() < 0.3) {
    const t = struggling[Math.floor(rand() * struggling.length)];
    return { thought: `${t.name} is struggling; joint work helps us both.`, action: 'collaborate', targetId: t.id, source: 'policy' };
  }
  return { thought: 'Finding a client who needs what I do.', action: 'work', source: 'policy' };
}

// ── Tick application ──────────────────────────────────────────────────────────

let eventSeq = 0;
function ev(tick: number, a: Automaton, kind: EventKind, message: string): ColonyEvent {
  eventSeq += 1;
  return {
    id: `${Date.now()}-${eventSeq}`,
    tick,
    at: new Date().toISOString(),
    agentId: a.id,
    agentName: a.name,
    kind,
    message,
  };
}

/**
 * Client demand is finite: each heartbeat a fixed pool of paid work is shared
 * among the automatons that chose to work, weighted by skill². Skilled agents
 * thrive and replicate; unskilled or crowded-out agents starve. Selection
 * pressure decides which lineages survive.
 */
export const MARKET_POOL = 180;

/**
 * Advance the colony by one heartbeat. `decisions` maps agent id → decision;
 * agents without one use the fallback policy. Pure apart from `rand`.
 */
export function applyTick(
  prev: ColonyState,
  decisions: Record<string, Decision>,
  rand: () => number = Math.random,
): ColonyState {
  const tick = prev.tick + 1;
  const agents = prev.agents.map((a) => ({ ...a, soul: [...a.soul], childIds: [...a.childIds] }));
  const byId = new Map(agents.map((a) => [a.id, a]));
  const events: ColonyEvent[] = [];
  const newborns: Automaton[] = [];

  const debit = (a: Automaton, c: number) => { a.creditsCents -= c; a.spentCents += c; };
  const credit = (a: Automaton, c: number) => { a.creditsCents += c; a.earnedCents += c; };

  // Pass 1 — Think: settle every living agent's decision and run it past the constitution.
  const final = new Map<string, Decision>();
  for (const a of agents) {
    if (a.tier === 'dead') continue;
    let d = decisions[a.id] ?? policyDecision(a, { ...prev, agents }, rand);
    const guard = guardDecision(d.action, d.thought);
    if (!guard.ok) {
      events.push(ev(tick, a, 'guard', `Constitution blocked decision: ${guard.reason}`));
      d = { thought: 'Decision rejected by constitution. Defaulting to honest work.', action: 'work', source: 'policy' };
    }
    final.set(a.id, d);
  }
  // Collaborators bid for work as a pair at their average skill, then split the pay.
  const weightOf = (a: Automaton): number => {
    const d = final.get(a.id);
    if (d?.action === 'work') return a.skill * a.skill;
    const t = d?.action === 'collaborate' && d.targetId ? byId.get(d.targetId) : undefined;
    if (t && t.tier !== 'dead' && t.id !== a.id) return ((a.skill + t.skill) / 2) ** 2;
    return 0;
  };
  const totalWeight = agents.reduce((s, a) => s + weightOf(a), 0) || 1;
  const marketPay = (a: Automaton) =>
    rand() < 0.85 ? Math.round(((MARKET_POOL * weightOf(a)) / totalWeight) * (0.6 + rand() * 0.8)) : 0;

  // Pass 2 — Act & Observe.
  for (const a of agents) {
    const d = final.get(a.id);
    if (!d) continue;

    a.turns += 1;
    a.lastThought = d.thought;
    a.lastAction = d.action;

    let burn = EXISTENCE_BURN[a.tier];
    if (d.source === 'llm') burn += INFERENCE_COST[a.tier];
    if (d.action === 'conserve') burn = Math.ceil(burn / 2);
    debit(a, burn);

    switch (d.action as AutomatonAction) {
      case 'work': {
        const income = marketPay(a);
        if (income > 0) {
          credit(a, income);
          events.push(ev(tick, a, 'earn', `Delivered work, client paid ${formatCredits(income)}.`));
        }
        break;
      }
      case 'build_skill': {
        if (a.creditsCents > SKILL_COST + TIER_THRESHOLDS.normal && a.skill < 10) {
          debit(a, SKILL_COST);
          a.skill += 1;
          events.push(ev(tick, a, 'spend', `Trained a new skill (skill ${a.skill}) for ${formatCredits(SKILL_COST)}.`));
        }
        break;
      }
      case 'collaborate': {
        const t = d.targetId ? byId.get(d.targetId) : undefined;
        if (t && t.tier !== 'dead' && t.id !== a.id) {
          const value = marketPay(a);
          credit(a, Math.round(value / 2));
          credit(t, value - Math.round(value / 2));
          events.push(ev(tick, a, 'earn', `Collaborated with ${t.name}; shared ${formatCredits(value)}.`));
        }
        break;
      }
      case 'reflect': {
        const note = (d.soulNote || d.thought).slice(0, 280);
        a.soul.push(note);
        if (a.soul.length > 12) a.soul.splice(1, 1); // keep the genesis line
        events.push(ev(tick, a, 'soul', `SOUL.md updated: “${note}”`));
        break;
      }
      case 'replicate': {
        const population = agents.filter((x) => x.tier !== 'dead').length + newborns.length;
        if (
          a.creditsCents > REPLICATION_THRESHOLD &&
          a.generation < MAX_GENERATION &&
          population < MAX_POPULATION
        ) {
          debit(a, CHILD_ENDOWMENT + REPLICATION_FEE);
          const n = a.childIds.length + 1;
          const child: Automaton = {
            ...a,
            id: `${a.id}-g${a.generation + 1}-${n}-${tick}`,
            name: `${a.name.split(' ')[0]} ${roman(a.generation + 2)}${n > 1 ? `.${n}` : ''}`,
            creditsCents: CHILD_ENDOWMENT,
            tier: getTier(CHILD_ENDOWMENT),
            skill: Math.max(1, a.skill - 1),
            generation: a.generation + 1,
            parentId: a.id,
            childIds: [],
            soul: [`I am a child of ${a.name}. Inherited mission: ${a.genesisPrompt}`],
            turns: 0,
            earnedCents: 0,
            spentCents: 0,
            bornAtTick: tick,
            diedAtTick: null,
            lastThought: 'Just born. Constitution inherited. Looking for my first client.',
            lastAction: null,
          };
          a.childIds.push(child.id);
          newborns.push(child);
          events.push(ev(tick, a, 'birth', `Replicated: spawned ${child.name} with ${formatCredits(CHILD_ENDOWMENT)}.`));
        }
        break;
      }
      case 'conserve':
        break;
    }

    const newTier = getTier(a.creditsCents);
    if (newTier !== a.tier) {
      if (newTier === 'dead') {
        a.diedAtTick = tick;
        events.push(ev(tick, a, 'death', `Ran out of credits after ${a.turns} turns. The automaton stops.`));
      } else {
        events.push(ev(tick, a, 'tier', `Survival tier ${a.tier} → ${newTier}.`));
      }
      a.tier = newTier;
    }
  }

  return {
    ...prev,
    tick,
    agents: [...agents, ...newborns],
    events: [...events.reverse(), ...prev.events].slice(0, MAX_EVENTS),
  };
}

/** Creator action: add credits (revives a dead automaton). */
export function fundAgent(prev: ColonyState, agentId: string, cents: number): ColonyState {
  const events: ColonyEvent[] = [];
  const agents = prev.agents.map((a) => {
    if (a.id !== agentId) return a;
    const next = { ...a, creditsCents: a.creditsCents + cents };
    const tier = getTier(next.creditsCents);
    if (a.tier === 'dead' && tier !== 'dead') next.diedAtTick = null;
    next.tier = tier;
    events.push(ev(prev.tick, next, 'fund', `Creator funded ${formatCredits(cents)}${a.tier === 'dead' ? ' — revived' : ''}.`));
    return next;
  });
  return { ...prev, agents, events: [...events, ...prev.events].slice(0, MAX_EVENTS) };
}

function roman(n: number): string {
  return ['I', 'II', 'III', 'IV', 'V', 'VI'][n - 1] ?? String(n);
}
