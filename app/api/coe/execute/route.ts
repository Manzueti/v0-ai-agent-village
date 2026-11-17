import { streamText } from 'ai';
import { getModelInstance, MAX_OUTPUT_TOKENS } from '@/lib/ai-models';
import type { NextRequest } from 'next/server';
import { withApiGuard } from '@/lib/api-guard';
import { employees } from '@/lib/data';

const MAX_INSTRUCTION_CHARS = 4000;

export const runtime = 'nodejs';

async function handlePOST(request: NextRequest) {
  try {
    const { instruction, agentId, agentName } = (await request.json()) as {
      instruction?: unknown;
      agentId?: unknown;
      agentName?: unknown;
    };

    if (typeof instruction !== 'string' || !instruction.trim() || instruction.length > MAX_INSTRUCTION_CHARS) {
      return Response.json(
        { error: `instruction must be a non-empty string up to ${MAX_INSTRUCTION_CHARS} characters` },
        { status: 400 }
      );
    }

    // The agent's identity, prompt and model come from server-side data only;
    // the client names the agent but can no longer supply a system prompt or model.
    const agent =
      employees.find((e) => e.id === agentId) ?? employees.find((e) => e.name === agentName);
    if (!agent) {
      return Response.json({ error: 'Unknown agent' }, { status: 404 });
    }
    const { name: agentNameResolved, role: agentRole, systemPrompt, aiModel: model } = agent;

    const corePrompt = `You are an expert AI Center of Excellence (COE) controller. Your role is to help the ${agentNameResolved} (${agentRole}) execute a specific directive and integrate it into their operational framework.

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
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      system: corePrompt,
      prompt: `Execute the directive for ${agentNameResolved}: ${instruction}`,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in COE execution:', errorMessage);
    return new Response(`Failed to execute COE directive: ${errorMessage}`, { status: 500 });
  }
}

export const POST = withApiGuard(handlePOST, { ai: true });
