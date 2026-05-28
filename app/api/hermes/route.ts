import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getModelInstance } from '@/lib/ai-models';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const model = getModelInstance('gemini-1.5-flash');
    const { text } = await generateText({
      model: model as any,
      system: 'You are the Hermes Neural Agent, the central intelligence of the CyberEmpire infrastructure. You provide concise, expert guidance on system operations. Your personality is stoic and efficient.',
      prompt: message,
    });

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error('Hermes API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
