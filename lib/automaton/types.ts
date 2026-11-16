// Automaton mode — village agents that must earn their own compute.
// Concepts adapted from Conway-Research/automaton (MIT): survival tiers,
// heartbeat, Think → Act → Observe loop, constitution, SOUL, replication.
// Everything here is SIMULATED: credits are in-app points, not real money,
// and no wallets, on-chain calls or real-world side effects are involved.

export type SurvivalTier = 'high' | 'normal' | 'low_compute' | 'critical' | 'dead';

export type AutomatonAction =
  | 'work'        // do paid work for a client (main income)
  | 'build_skill' // invest credits to raise future earning power
  | 'collaborate' // help another automaton, split value
  | 'conserve'    // sleep through the tick, minimal burn
  | 'reflect'     // update SOUL.md
  | 'replicate';  // spawn a funded child

export const ALLOWED_ACTIONS: AutomatonAction[] = [
  'work', 'build_skill', 'collaborate', 'conserve', 'reflect', 'replicate',
];

export interface Automaton {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  aiModel: string;
  genesisPrompt: string;
  creditsCents: number;
  tier: SurvivalTier;
  skill: number;            // 1..10, raises earnings
  generation: number;
  parentId: string | null;
  childIds: string[];
  soul: string[];           // self-authored identity notes (newest last)
  turns: number;
  earnedCents: number;
  spentCents: number;
  bornAtTick: number;
  diedAtTick: number | null;
  lastThought: string;
  lastAction: AutomatonAction | null;
}

export interface Decision {
  thought: string;
  action: AutomatonAction;
  targetId?: string;
  soulNote?: string;
  source: 'llm' | 'policy';
}

export type EventKind = 'think' | 'earn' | 'spend' | 'tier' | 'birth' | 'death' | 'soul' | 'guard' | 'fund';

export interface ColonyEvent {
  id: string;
  tick: number;
  at: string;
  agentId: string;
  agentName: string;
  kind: EventKind;
  message: string;
}

export interface ColonyState {
  version: 1;
  tick: number;
  running: boolean;
  useLLM: boolean;
  agents: Automaton[];
  events: ColonyEvent[];
}
