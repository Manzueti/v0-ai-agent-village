import { Employee } from '../types';

export interface LevelConfig {
  level: number;
  xpRequired: number;
  title: string;
  perkUnlocked?: string;
}

export const LEVELS: LevelConfig[] = [
  { level: 1, xpRequired: 0, title: "Initiate" },
  { level: 2, xpRequired: 1000, title: "Operative", perkUnlocked: "Dual-tasking" },
  { level: 3, xpRequired: 2500, title: "Specialist", perkUnlocked: "Auto-heal" },
  { level: 4, xpRequired: 5000, title: "Expert", perkUnlocked: "Cross-pod collaboration" },
  { level: 5, xpRequired: 10000, title: "Master", perkUnlocked: "Model switching" },
  { level: 6, xpRequired: 20000, title: "Legend", perkUnlocked: "Command override" },
  { level: 7, xpRequired: 50000, title: "Transcendent", perkUnlocked: "Self-evolution" },
];

export function calculateLevel(xp: number): LevelConfig {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) return LEVELS[i];
  }
  return LEVELS[0];
}

export function xpForNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp);
  const nextLevelIndex = LEVELS.findIndex(l => l.level === currentLevel.level + 1);
  if (nextLevelIndex === -1) return Infinity;
  return LEVELS[nextLevelIndex].xpRequired - currentXp;
}

export function addXp(agent: Employee, xpGained: number): Employee {
  const newXp = agent.xp + xpGained;
  const newLevel = calculateLevel(newXp);
  
  return {
    ...agent,
    xp: newXp,
    level: newLevel.level,
    nextLevelXp: xpForNextLevel(newXp),
  };
}
