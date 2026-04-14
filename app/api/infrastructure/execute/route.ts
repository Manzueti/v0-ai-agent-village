import { streamText } from 'ai';
import { xai } from '@ai-sdk/xai';
import type { NextRequest } from 'next/server';
import { InfraNode } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { action, nodeId, node, replicaNode, operatorId, reason } = await request.json() as {
      action: 'failover' | 'scale' | 'restart' | 'heal' | 'reroute';
      nodeId: string;
      node: InfraNode;
      replicaNode?: InfraNode;
      operatorId: string;
      reason?: string;
    };

    const systemPrompt = `You are an AI infrastructure execution engine. You validate and execute infrastructure operations while ensuring zero downtime.

Your responsibilities:
1. Validate that the requested action is safe to execute
2. Check prerequisites (e.g., replica health before failover)
3. Execute the action with proper sequencing
4. Report the outcome with detailed logging

Actions you can execute:
- FAILOVER: Promote replica to primary, demote current primary
- SCALE: Adjust resource allocation (CPU, memory, replicas)
- RESTART: Graceful restart with connection draining
- HEAL: Auto-remediation (clear caches, reset connections, optimize)
- REROUTE: Redirect traffic through alternative paths

Always explain what you're doing step by step and report success/failure clearly.`;

    const userPrompt = `Execute the following action:

Action: ${action.toUpperCase()}
Target Node: ${nodeId}
Node Details: ${JSON.stringify(node, null, 2)}
${replicaNode ? `Replica Node: ${JSON.stringify(replicaNode, null, 2)}` : ''}
Operator: ${operatorId}
${reason ? `Reason: ${reason}` : ''}

Please validate the action, execute it, and report the outcome.`;

    const result = streamText({
      model: xai('grok-4', {
        apiKey: process.env.XAI_API_KEY,
      }),
      system: systemPrompt,
      prompt: userPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error executing infrastructure action:', error);
    return new Response('Failed to execute action', { status: 500 });
  }
}
