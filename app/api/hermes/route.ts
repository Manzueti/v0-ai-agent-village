import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { modelFailureResponse, resolveModel } from '@/lib/ai-models';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const resolved = resolveModel('gemini-1.5-flash');
    if (!resolved.ok) return modelFailureResponse(resolved);

    const { text } = await generateText({
      model: resolved.model,
      system: 'You are the Hermes Neural Agent, the central intelligence of the CyberEmpire infrastructure. You provide concise, expert guidance on system operations. Your personality is stoic and efficient.',
      prompt: message,
    });

    return NextResponse.json({ response: text });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Hermes API Error:', errorMessage);
    return NextResponse.json({ error: 'Hermes request failed.', message: errorMessage }, { status: 500 });
  }
}
