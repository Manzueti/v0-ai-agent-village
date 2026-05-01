import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { NextRequest } from 'next/server';
import { InfraNode, SystemHealth } from '@/lib/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { nodes, health, zoneId, query } = await request.json() as {
      nodes: InfraNode[];
      health: SystemHealth;
      zoneId?: string;
      query?: string;
    };

    const systemPrompt = `You are an expert AI infrastructure operator. Your role is to analyze infrastructure health, detect anomalies, predict failures, and recommend actions.

You manage a zero-point-of-failure enterprise infrastructure with the following zones:
- Data Center: Servers, databases, storage clusters
- Network: Firewalls, load balancers, VPNs
- Cloud: AWS, Azure, GCP services
- Security: Authentication, SIEM, WAF
- Edge: CDN, edge compute, DNS

Each critical node has a Primary/Replica pair for redundancy. Your analysis should:
1. Identify current health issues and their severity
2. Predict potential failures based on metrics (CPU > 80%, Memory > 85%, etc.)
3. Recommend specific actions (scale, restart, failover, reroute)
4. Explain your reasoning clearly

Always respond in a structured format with clear sections.`;

    const userPrompt = query 
      ? `User query: ${query}\n\nCurrent Infrastructure State:\n${JSON.stringify({ nodes, health }, null, 2)}`
      : `Analyze the following infrastructure state and provide recommendations:\n\n${JSON.stringify({ nodes, health, zoneId }, null, 2)}`;

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
