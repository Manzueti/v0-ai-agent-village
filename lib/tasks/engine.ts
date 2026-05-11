import { Employee } from '../types';
import { Task, TaskPriority, TaskComplexity, TaskTemplate, TASK_TEMPLATES } from './types';
import { employees } from '../data';

export function calculateAgentScore(agent: Employee, task: Task): number {
  let score = 0;

  // Department match (+30 pts)
  if (agent.department === task.department) {
    score += 30;
  }

  // Role relevance (+15 per match)
  const taskKeywords = [...task.title.toLowerCase().split(' '), ...task.description.toLowerCase().split(' ')];
  const roleKeywords = agent.role.toLowerCase().split(' ');
  roleKeywords.forEach(kw => {
    if (taskKeywords.includes(kw)) score += 15;
  });

  // Success rate (+20 max)
  score += (agent.successRate / 100) * 20;

  // Level (+3 per level)
  score += agent.level * 3;

  // Load availability (+15 for low load)
  const loadScore = (1 - agent.concurrency.current / agent.concurrency.max) * 15;
  score += loadScore;

  // Model capability (+20 for reasoner on critical tasks)
  if (task.priority === 'critical' && agent.aiModel.includes('reasoner')) {
    score += 20;
  }

  // Personality fit
  if (task.priority === 'critical' && agent.personality === 'aggressive') score += 10;
  if (task.complexity === 'high' && agent.personality === 'analytical') score += 10;

  return score;
}

export function findBestAgent(task: Task, availableAgents: Employee[] = employees): Employee | null {
  if (availableAgents.length === 0) return null;

  let bestAgent: Employee | null = null;
  let highestScore = -1;

  availableAgents.forEach(agent => {
    const score = calculateAgentScore(agent, task);
    if (score > highestScore) {
      highestScore = score;
      bestAgent = agent;
    }
  });

  return bestAgent;
}

export function createTaskFromTemplate(templateId: string, customizations: Partial<Task> = {}): Task | null {
  const template = TASK_TEMPLATES.find(t => t.id === templateId);
  if (!template) return null;

  const taskId = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  return {
    id: taskId,
    title: customizations.title || template.title,
    description: customizations.description || template.description,
    status: 'pending',
    priority: customizations.priority || template.priority,
    complexity: customizations.complexity || template.complexity,
    department: customizations.department || template.department,
    subTasks: template.subTasks.map((st, i) => ({
      id: `${taskId}-sub-${i}`,
      title: st,
      completed: false
    })),
    xpReward: template.xpReward,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
