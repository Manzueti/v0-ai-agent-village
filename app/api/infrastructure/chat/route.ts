import { streamText } from 'ai';
import { createXai } from '@ai-sdk/xai';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { messages, infrastructureContext } = await request.json() as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>;
      infrastructureContext?: string;
    };

    const systemPrompt = `You are the AI Infrastructure Control Center assistant, powered by Grok. You help operators understand and manage their zero-point-of-failure infrastructure.

Current Infrastructure Overview:
${infrastructureContext || 'Infrastructure data not provided. Please ask for specific information.'}

Your capabilities:
1. Answer questions about infrastructure health and status
2. Explain why certain decisions were made
3. Recommend preventive actions
4. Help troubleshoot issues
5. Provide insights on performance optimization

You speak in a professional but approachable manner. You're concise but thorough when explaining technical concepts. You always prioritize system stability and zero-downtime operations.

When discussing nodes, always mention their Primary/Replica relationship and current sync status when relevant.`;

    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'XAI_API_KEY not configured. Please check your environment variables.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const xaiClient = createXai({ apiKey });
    
    const result = streamText({
      model: xaiClient('grok-4'),
      system: systemPrompt,
      prompt: lastUserMessage?.content || 'Hello',
    });

    return result.toTextStreamResponse();
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in infrastructure chat:', errorMessage);
    return new Response(`Failed to process chat message: ${errorMessage}`, { status: 500 });
  }
}
