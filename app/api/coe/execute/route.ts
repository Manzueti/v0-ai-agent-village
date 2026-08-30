import { streamText } from 'ai';
import { getModelInstance } from '@/lib/ai-models';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { instruction, agentName, agentRole, systemPrompt, model = 'gemini-1.5-flash' } = await request.json() as {
      instruction: string;
      agentName: string;
      agentRole: string;
      systemPrompt: string;
      model?: string;
    };

    const corePrompt = `You are an expert AI Center of Excellence (COE) controller. Your role is to help the ${agentName} (${agentRole}) execute a specific directive and integrate it into their operational framework.

Agent's Core Identity:
${systemPrompt}

Current Directive:
${instruction}

Your task:
1. Analyze how this directive aligns with the agent's role and identity.
2. Provide a detailed report on how the directive is being executed or integrated.
3. Confirm the updates to the agent's neural pathways or operational procedures.
4. If the directive is complex, break down the execution steps.

Respond in a professional, technical, and authoritative tone, consistent with the CyberEmpire style. Identify yourself as being powered by ${model.includes('gemini') ? 'Gemini' : model.includes('deepseek') ? 'DeepSeek' : 'Neural Core'}.`;

    const modelInstance = getModelInstance(model);
    
    const result = streamText({
      model: modelInstance as any,
      system: corePrompt,
      prompt: `Execute the directive for ${agentName}: ${instruction}`,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in COE execution:', errorMessage);
    return new Response(`Failed to execute COE directive: ${errorMessage}`, { status: 500 });
  }
}
