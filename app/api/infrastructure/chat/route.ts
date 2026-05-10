import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { messages, infrastructureContext, model = 'gemini-1.5-flash' } = await request.json() as {
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
    
    let modelInstance;
    
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
      prompt: lastUserMessage?.content || 'Hello',
    });

    return result.toTextStreamResponse();
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in infrastructure chat:', errorMessage);
    return new Response(`Failed to process chat message: ${errorMessage}`, { status: 500 });
  }
}
