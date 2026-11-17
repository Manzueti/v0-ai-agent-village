import { streamText } from 'ai';
import { getModelInstance, MAX_OUTPUT_TOKENS } from '@/lib/ai-models';
import type { NextRequest } from 'next/server';
import { withApiGuard } from '@/lib/api-guard';

export const runtime = 'nodejs';

async function handlePOST(request: NextRequest) {
  try {
    const { messages, infrastructureContext, model = 'gemini-flash-latest' } = await request.json() as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>;
      infrastructureContext?: string;
      model?: string;
    };

    const systemPrompt = `You are the AI Infrastructure Control Center assistant. You help operators manage their zero-point-of-failure infrastructure.

Current Infrastructure Overview:
${infrastructureContext || 'Infrastructure data not provided.'}

Your capabilities:
1. Answer questions about infrastructure health and status
2. Recommend preventive actions
3. Help troubleshoot issues

You speak in a professional, concise manner. Priority: system stability.`;

    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    
    const modelInstance = getModelInstance(model);
    
    const result = streamText({
      model: modelInstance as any,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
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

export const POST = withApiGuard(handlePOST, { ai: true });
