import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import type { NextRequest } from 'next/server';
import { employees } from '@/lib/data';

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

    let modelInstance;
    const model = agent.aiModel;
    
    if (model.startsWith('deepseek')) {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'DEEPSEEK_API_KEY not configured.' }), { status: 500 });
      }
      const deepseek = createOpenAI({
        apiKey,
        baseURL: 'https://api.deepseek.com',
      });
      modelInstance = deepseek(model);
    } else {
      const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'GOOGLE_API_KEY not configured.' }), { status: 500 });
      }
      const google = createGoogleGenerativeAI({ apiKey });
      modelInstance = google(model === 'gemini-2.5-flash' ? 'gemini-1.5-flash' : model);
    }

    const result = streamText({
      model: modelInstance as any,
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
