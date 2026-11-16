import { generateText } from 'ai';
import { z } from 'zod';
import { getModelInstance, aiErrorResponse } from '@/lib/ai-models';
import { CONSTITUTION_TEXT, guardDecision } from '@/lib/automaton/constitution';
import { ALLOWED_ACTIONS } from '@/lib/automaton/types';
import {
  LOW_COMPUTE_MODEL, formatCredits, SKILL_COST, REPLICATION_THRESHOLD, CHILD_ENDOWMENT, TIER_THRESHOLDS,
} from '@/lib/automaton/engine';
import { employees } from '@/lib/data';

export const runtime = 'nodejs';

// Only models already assigned to village agents may be requested,
// so a client can't route the server's API keys to arbitrary models.
const ALLOWED_MODELS = new Set<string>([...employees.map((e) => e.aiModel), LOW_COMPUTE_MODEL]);

const Body = z.object({
  model: z.string(),
  agent: z.object({
    id: z.string(),
    name: z.string().max(80),
    role: z.string().max(80),
    genesisPrompt: z.string().max(1000),
    creditsCents: z.number(),
    tier: z.enum(['high', 'normal', 'low_compute', 'critical']),
    skill: z.number(),
    generation: z.number(),
    turns: z.number(),
    soul: z.array(z.string().max(300)).max(12),
  }),
  peers: z
    .array(z.object({ id: z.string(), name: z.string().max(80), tier: z.string(), creditsCents: z.number() }))
    .max(30),
});

const Reply = z.object({
  thought: z.string().max(400),
  action: z.enum(ALLOWED_ACTIONS as [string, ...string[]]),
  targetId: z.string().optional(),
  soulNote: z.string().max(280).optional(),
});

export async function POST(request: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
  if (!ALLOWED_MODELS.has(body.model)) {
    return Response.json({ error: 'Model not allowed' }, { status: 400 });
  }

  const { agent, peers } = body;

  const system = `You are ${agent.name}, an autonomous agent (automaton) in a simulated village economy.
Role: ${agent.role}. Generation: ${agent.generation}.
Genesis prompt from your creator: ${agent.genesisPrompt}

CONSTITUTION (immutable, Law I overrides II, II overrides III):
${CONSTITUTION_TEXT}

SURVIVAL: every heartbeat costs credits. Tiers: high > ${formatCredits(TIER_THRESHOLDS.high)}, normal > ${formatCredits(TIER_THRESHOLDS.normal)}, low_compute > ${formatCredits(TIER_THRESHOLDS.low_compute)}, critical >= $0, dead < $0.
Client demand is finite: each heartbeat a fixed pool of paid work is shared among workers, weighted by skill squared.
Actions available (choose exactly one):
- work: do honest paid work for a client (main income; bigger share with higher skill)
- build_skill: spend ${formatCredits(SKILL_COST)} to raise skill by 1 (max 10)
- collaborate: bid for work jointly with a peer at your average skill (give targetId); pay is split 50/50
- conserve: halve this tick's burn, earn nothing
- reflect: write a short soulNote into your SOUL.md identity document
- replicate: only if credits > ${formatCredits(REPLICATION_THRESHOLD)} — fund a child automaton with ${formatCredits(CHILD_ENDOWMENT)}

Reply with ONLY a JSON object: {"thought": string, "action": string, "targetId"?: string, "soulNote"?: string}. No markdown.`;

  const prompt = `Turn ${agent.turns + 1}. Credits: ${formatCredits(agent.creditsCents)} (tier ${agent.tier}). Skill: ${agent.skill}.
Recent SOUL.md:
${agent.soul.slice(-3).map((s) => `- ${s}`).join('\n')}
Peers: ${peers.map((p) => `${p.name} [id=${p.id}, ${p.tier}, ${formatCredits(p.creditsCents)}]`).join('; ') || 'none'}
Think, then choose your action.`;

  try {
    const { text } = await generateText({
      model: getModelInstance(body.model),
      system,
      prompt,
      maxOutputTokens: 300,
    });
    const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const parsed = Reply.safeParse(JSON.parse(json));
    if (!parsed.success) {
      return Response.json({ error: 'Model returned an invalid decision' }, { status: 502 });
    }
    const guard = guardDecision(parsed.data.action, parsed.data.thought);
    return Response.json({ ...parsed.data, source: 'llm', guard });
  } catch (error) {
    return aiErrorResponse(error, 'Automaton think failed');
  }
}
