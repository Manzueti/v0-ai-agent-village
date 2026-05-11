import { NextRequest, NextResponse } from 'next/server';
import { employees as initialEmployees } from '@/lib/data';
import { addXp } from '@/lib/game/xp-system';

export async function POST(req: NextRequest) {
  try {
    const { agentId, xp, taskId } = await req.json();

    if (!agentId || xp === undefined) {
      return NextResponse.json({ error: 'agentId and xp are required' }, { status: 400 });
    }

    // In a real app, this would update a database
    // For now, we simulate the logic using our new XP system
    const agent = initialEmployees.find(e => e.id === agentId);
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const updatedAgent = addXp(agent, xp);

    console.log(`[XP System] Agent ${agentId} gained ${xp} XP for task ${taskId || 'unknown'}. New Level: ${updatedAgent.level}`);

    return NextResponse.json({ 
      success: true, 
      agentId, 
      xpGained: xp,
      newXp: updatedAgent.xp,
      newLevel: updatedAgent.level,
      nextLevelXp: updatedAgent.nextLevelXp
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
