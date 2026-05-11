import { NextRequest, NextResponse } from 'next/server';
import { createTaskFromTemplate, findBestAgent } from '@/lib/tasks/engine';
import { Task } from '@/lib/tasks/types';

// In-memory store for demo purposes. 
// In a real app, use a database or global state manager.
let tasks: Task[] = [];

export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, templateId, customizations, taskId, agentId } = body;

    switch (action) {
      case 'create_from_template':
        const newTask = createTaskFromTemplate(templateId, customizations);
        if (newTask) {
          tasks.push(newTask);
          return NextResponse.json(newTask);
        }
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });

      case 'auto_assign':
        const taskToAssign = tasks.find(t => t.id === taskId);
        if (!taskToAssign) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        
        const bestAgent = findBestAgent(taskToAssign);
        if (bestAgent) {
          taskToAssign.assignedTo = bestAgent.id;
          taskToAssign.status = 'assigned';
          taskToAssign.updatedAt = new Date().toISOString();
          return NextResponse.json(taskToAssign);
        }
        return NextResponse.json({ error: 'No suitable agent found' }, { status: 404 });

      case 'update_status':
        const taskToUpdate = tasks.find(t => t.id === taskId);
        if (!taskToUpdate) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        
        taskToUpdate.status = body.status;
        taskToUpdate.updatedAt = new Date().toISOString();
        return NextResponse.json(taskToUpdate);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
