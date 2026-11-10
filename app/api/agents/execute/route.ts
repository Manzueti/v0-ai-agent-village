import { streamText } from 'ai';
import type { NextRequest } from 'next/server';
import { employees } from '@/lib/data';
import { modelFailureResponse, resolveModel } from '@/lib/ai-models';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { agentId, task } = await request.json() as {
      agentId: string;
      task?: string;
    };

    const agent = employees.find(e => e.id === agentId);
    if (!agent) {
      return new Response(JSON.stringify({ error: 'Agent not found' }), { status: 404 });
    }

    const systemPrompt = `You are ${agent.name}, the ${agent.role} in the ${agent.department} department.
Your personality is ${agent.personality}.
Your system prompt: ${agent.systemPrompt}

You are currently executing a mission in the space command center.
Respond as the agent, describing your actions and progress.
Keep it concise and game-like.`;

    const userPrompt = task || "Find a business opportunity and report progress.";

    const resolved = resolveModel(agent.aiModel);
    if (!resolved.ok) return modelFailureResponse(resolved);

    const result = streamText({
      model: resolved.model,
      system: systemPrompt,
      prompt: userPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error executing agent task:', errorMessage);
    return new Response(`Failed to execute agent task: ${errorMessage}`, { status: 500 });
  }
}
