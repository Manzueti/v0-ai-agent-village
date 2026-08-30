import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import type { NextRequest } from 'next/server';
import { InfraNode, SystemHealth } from '@/lib/types';
import { getModelInstance } from '@/lib/ai-models';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { nodes, health, zoneId, query, model = 'gemini-1.5-flash' } = await request.json() as {
      nodes: InfraNode[];
      health: SystemHealth;
      zoneId?: string;
      query?: string;
      model?: string;
    };

    const systemPrompt = `You are an expert AI infrastructure operator. Your role is to analyze infrastructure health, detect anomalies, predict failures, and recommend actions.

Zones: Data Center, Network, Cloud, Security, Edge.
Analysis goals:
1. Identify health issues
2. Predict failures
3. Recommend actions (scale, restart, failover, reroute)
4. Explain reasoning`;

    const userPrompt = query 
      ? `User query: ${query}\n\nState:\n${JSON.stringify({ nodes, health }, null, 2)}`
      : `Analyze state:\n\n${JSON.stringify({ nodes, health, zoneId }, null, 2)}`;

    const modelInstance = getModelInstance(model);

    const result = streamText({
      model: modelInstance as any,
      system: systemPrompt,
      prompt: userPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error analyzing infrastructure:', errorMessage);
    return new Response(`Failed to analyze infrastructure: ${errorMessage}`, { status: 500 });
  }
}
