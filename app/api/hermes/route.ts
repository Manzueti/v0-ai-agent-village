import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Path to the hermes executable in the venv
    const hermesPath = 'C:\\Users\\W7192277\\Documents\\GitHub\\hermes-agent\\venv\\Scripts\\hermes';
    const projectDir = 'C:\\Users\\W7192277\\Documents\\GitHub\\hermes-agent';

    // Execute the hermes chat command
    // We use -q for single query mode
    const command = `"${hermesPath}" chat -q "${message.replace(/"/g, '\\"')}"`;
    
    const { stdout, stderr } = await execAsync(command, {
      cwd: projectDir,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });

    if (stderr && !stdout) {
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    // Clean up the output (Hermes adds some ASCII art and banners)
    // We want to extract the actual response
    const cleanOutput = stdout
      .replace(/██╗[\s\S]*?╰─+╯/g, '') // Remove ASCII banner
      .replace(/Initializing agent\.\.\./g, '')
      .replace(/─+ ⚕ Hermes ─+/g, '')
      .trim();

    return NextResponse.json({ response: cleanOutput });
  } catch (error: any) {
    console.error('Hermes API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
