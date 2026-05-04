import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { instruction, agentName, agentRole, systemPrompt } = await request.json() as {
      instruction: string;
      agentName: string;
      agentRole: string;
      systemPrompt: string;
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

Respond in a professional, technical, and authoritative tone, consistent with the CyberEmpire style. Identify yourself as being powered by Gemini.`;

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GOOGLE_API_KEY not configured. Please check your environment variables.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const google = createGoogleGenerativeAI({ apiKey });
    
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: corePrompt,
      prompt: `Execute the directive for ${agentName}: ${instruction}`,
    });

    return result.toTextStreamResponse();
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in COE execution:', errorMessage);
    return new Response(`Failed to execute COE directive: ${errorMessage}`, { status: 500 });
  }
}
