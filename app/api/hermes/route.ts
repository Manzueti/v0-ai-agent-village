import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getModelInstance, MAX_OUTPUT_TOKENS } from '@/lib/ai-models';
import { withApiGuard } from '@/lib/api-guard';

async function handlePOST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (typeof message !== 'string' || !message.trim() || message.length > 4000) {
      return NextResponse.json({ error: 'message must be a non-empty string up to 4000 characters' }, { status: 400 });
    }

    const model = getModelInstance('gemini-flash-latest');
    const { text } = await generateText({
      model: model as any,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      system: 'You are the Hermes Neural Agent, the central intelligence of the CyberEmpire infrastructure. You provide concise, expert guidance on system operations. Your personality is stoic and efficient.',
      prompt: message,
    });

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error('Hermes API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const POST = withApiGuard(handlePOST, { ai: true });
