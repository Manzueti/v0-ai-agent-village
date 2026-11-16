import { streamText } from 'ai';
import { z } from 'zod';
import { getModelInstance, errorStatus } from '@/lib/ai-models';
import { employees } from '@/lib/data';
import { ADVISOR_IDS } from '@/lib/builder/types';

export const runtime = 'nodejs';

const Body = z.object({
  advisorId: z.enum(ADVISOR_IDS),
  messages: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(8000) }))
    .min(1)
    .max(60),
  plan: z.unknown().optional(),
});

export async function POST(request: Request) {
  try {
    const body = Body.safeParse(await request.json());
    if (!body.success) return new Response('Invalid request body', { status: 400 });

    const { advisorId, messages, plan } = body.data;
    const advisor = employees.find((e) => e.id === advisorId)!;

    const system = `You are ${advisor.name}, ${advisor.role} of CyberEmpire, acting as an AI co-founder in the Business Builder.
Your background: ${advisor.systemPrompt}

You help the user start or grow a real business by chatting. Work like a sharp, practical co-founder:
- Early on, ask at most 2 focused questions per reply to pin down the customer, the problem and how it makes money.
- Once you know enough, propose concrete specifics: a name, positioning, pricing tiers, first channels, and next steps.
- Challenge weak assumptions honestly and point out the biggest risk. Never invent market statistics; say when something needs validating.
- Keep replies short and skimmable (under ~180 words), using short paragraphs or bullets.
- A live business-plan panel next to this chat updates from the conversation, so don't repeat the whole plan back.

The user's CyberEmpire village has AI departments that can execute work: Revenue Hub (sales), Finance Vault (pricing, billing), Creative Studio (design, content, social, SEO), Tech Nexus (engineering, data, security) and Command Deck (strategy, operations). Suggest which department should take on each next step when useful.

Current plan panel (JSON, may be partial):
${JSON.stringify(plan ?? {}).slice(0, 6000)}`;

    const result = streamText({
      model: getModelInstance(advisor.aiModel),
      system,
      messages,
    });
    return result.toTextStreamResponse();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Business builder chat failed:', message);
    return new Response(message, { status: errorStatus(error) });
  }
}
