import { generateText, Output } from 'ai';
import { z } from 'zod';
import { getModelInstance, aiErrorResponse } from '@/lib/ai-models';
import { employees } from '@/lib/data';
import { ADVISOR_IDS, BusinessPlanSchema } from '@/lib/builder/types';

export const runtime = 'nodejs';

const Body = z.object({
  advisorId: z.enum(ADVISOR_IDS),
  messages: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(8000) }))
    .min(1)
    .max(60),
  plan: z.unknown().optional(),
});

/** Turn the conversation so far into an updated, structured business plan. */
export async function POST(request: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const advisor = employees.find((e) => e.id === body.advisorId)!;
  const transcript = body.messages
    .map((m) => `${m.role === 'user' ? 'FOUNDER' : 'CO-FOUNDER'}: ${m.content}`)
    .join('\n\n');

  try {
    const { output } = await generateText({
      model: getModelInstance(advisor.aiModel),
      output: Output.object({ schema: BusinessPlanSchema }),
      system:
        'You maintain a structured business plan from a founder/co-founder conversation. ' +
        'Update the previous plan with everything agreed or clearly implied in the conversation. ' +
        'Keep fields that are still valid, leave unknown text fields as empty strings and unknown lists empty. ' +
        'Do not invent facts the conversation does not support. Milestones: up to 6 concrete next steps, ' +
        'each assigned to the best-suited department. readiness: 0 for a vague idea, ~50 once customer, problem, ' +
        'offer and pricing are defined, 80+ only when it is validated with real customers.',
      prompt: `Previous plan:\n${JSON.stringify(body.plan ?? {})}\n\nConversation:\n${transcript}`,
    });
    return Response.json(output);
  } catch (error) {
    return aiErrorResponse(error, 'Plan update failed');
  }
}
