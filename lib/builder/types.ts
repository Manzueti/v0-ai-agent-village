import { z } from 'zod';

export const DEPARTMENTS = [
  'Revenue Hub',
  'Finance Vault',
  'Creative Studio',
  'Tech Nexus',
  'Command Deck',
] as const;

export const STAGES = ['idea', 'validating', 'launching', 'growing'] as const;

export const MilestoneSchema = z.object({
  title: z.string().describe('Short, action-oriented milestone, e.g. "Interview 10 target customers"'),
  description: z.string().describe('One or two sentences: what done looks like'),
  department: z.enum(DEPARTMENTS).describe('Village department best suited to do the work'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
});

export const BusinessPlanSchema = z.object({
  name: z.string().describe('Business name. Empty string if not decided yet'),
  tagline: z.string().describe('One-line pitch. Empty string if unknown'),
  stage: z.enum(STAGES),
  problem: z.string().describe('The customer problem being solved'),
  customer: z.string().describe('Who the target customer is, as specifically as known'),
  solution: z.string().describe('What the business offers'),
  revenueModel: z.string().describe('How it makes money'),
  pricing: z
    .array(z.object({ tier: z.string(), price: z.string(), includes: z.string() }))
    .describe('Price tiers, empty if not discussed'),
  channels: z.array(z.string()).describe('How it will reach customers'),
  risks: z.array(z.string()).describe('Biggest risks or open questions'),
  milestones: z.array(MilestoneSchema).describe('Up to 6 concrete next steps, in order'),
  readiness: z.number().min(0).max(100).describe('0-100: how complete and validated the plan is'),
});

export type BusinessPlan = z.infer<typeof BusinessPlanSchema>;
export type Milestone = z.infer<typeof MilestoneSchema>;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  /** Set when the reply failed; such messages are shown but never sent back to the model. */
  error?: boolean;
}

export interface Business {
  id: string;
  createdAt: string;
  updatedAt: string;
  advisorId: string;
  messages: ChatMessage[];
  plan: BusinessPlan;
  launchedMilestones: string[]; // titles already sent to the Task board
}

export const EMPTY_PLAN: BusinessPlan = {
  name: '',
  tagline: '',
  stage: 'idea',
  problem: '',
  customer: '',
  solution: '',
  revenueModel: '',
  pricing: [],
  channels: [],
  risks: [],
  milestones: [],
  readiness: 0,
};

/** Village agents who can act as the founder's AI co-founder. */
export const ADVISOR_IDS = ['ceo-visionary', 'cmo-growth', 'cto-tech', 'coo-ops', 'pricing-analyst'] as const;
