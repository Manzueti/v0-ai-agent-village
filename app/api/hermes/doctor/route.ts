import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const hermesPath = 'C:\\Users\\W7192277\\Documents\\GitHub\\hermes-agent\\venv\\Scripts\\hermes';
    const projectDir = 'C:\\Users\\W7192277\\Documents\\GitHub\\hermes-agent';

    // Run hermes doctor
    const { stdout, stderr } = await execAsync(`"${hermesPath}" doctor`, {
      cwd: projectDir,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });

    const output = stdout || stderr;

    // Parse the output to find issues
    const issueMatch = output.match(/Found (\d+) issue\(s\)/);
    const issuesCount = issueMatch ? parseInt(issueMatch[1]) : 0;
    
    // Check for "✓" vs "⚠" or "✗"
    const healthy = !output.includes('✗') && issuesCount === 0;

    return NextResponse.json({
      healthy,
      issuesCount,
      rawOutput: output,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Hermes Doctor API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
