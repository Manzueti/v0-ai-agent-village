import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { generateText } from 'ai';
import { getModelInstance } from '@/lib/ai-models';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Attempt to use the local Hermes agent
    const hermesPath = process.env.HERMES_PATH || 'hermes';
    const projectDir = process.env.HERMES_PROJECT_DIR || process.cwd();

    try {
      const command = `"${hermesPath}" chat -q "${message.replace(/"/g, '\\"')}"`;
      const { stdout } = await execAsync(command, {
        cwd: projectDir,
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
      });

      if (stdout) {
        const cleanOutput = stdout
          .replace(/██╗[\s\S]*?╰─+╯/g, '')
          .replace(/Initializing agent\.\.\./g, '')
          .replace(/─+ ⚕ Hermes ─+/g, '')
          .trim();
        return NextResponse.json({ response: cleanOutput });
      }
    } catch (localError: any) {
      console.warn('Local Hermes agent failed, falling back to Cloud Neural Link (Gemini):', localError.message);
      
      // FALLBACK: Use Gemini if the local command is missing (typical for Vercel)
      const model = getModelInstance('gemini-1.5-flash');
      const { text } = await generateText({
        model: model as any,
        system: "You are the Hermes Neural Agent, the central intelligence of the CyberEmpire infrastructure. You provide concise, expert guidance on system operations. Your personality is stoic and efficient.",
        prompt: message,
      });

      return NextResponse.json({ 
        response: text,
        provider: 'cloud_fallback'
      });
    }

    return NextResponse.json({ error: 'No response received' }, { status: 500 });
  } catch (error: any) {
    console.error('Hermes API Critical Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
