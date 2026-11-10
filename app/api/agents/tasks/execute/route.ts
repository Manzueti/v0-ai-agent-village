import { streamText } from 'ai';
import { modelFailureResponse, resolveModel } from '@/lib/ai-models';
import type { NextRequest } from 'next/server';
import { employees } from '@/lib/data';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { taskId, taskTitle, taskDescription, agentId } = await request.json();

    if (!agentId) {
      return new Response(JSON.stringify({ error: 'Agent ID is required for execution.' }), { status: 400 });
    }

    const agent = employees.find(e => e.id === agentId);
    if (!agent) {
      return new Response(JSON.stringify({ error: 'Agent not found.' }), { status: 404 });
    }

    const systemPrompt = `You are an AI agent named ${agent.name}. Your role is ${agent.role} in the ${agent.department} department.
Your personality is ${agent.personality}.

You are currently executing the following task:
Title: ${taskTitle}
Description: ${taskDescription}

Please perform the task and provide a detailed report of your actions and findings. 
Speak in character according to your personality.`;

    const resolved = resolveModel(agent.aiModel);
    if (!resolved.ok) return modelFailureResponse(resolved);

    const result = streamText({
      model: resolved.model,
      system: systemPrompt,
      prompt: `Begin execution of task ${taskId}: ${taskTitle}`,
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in task execution:', errorMessage);
    return new Response(`Failed to execute task: ${errorMessage}`, { status: 500 });
  }
}
