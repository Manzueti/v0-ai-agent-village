export type AgentStatus = 'running' | 'paused' | 'error' | 'idle';

export type Employee = {
  id: string;
  name: string;
  role: string;
  office: string;
  level: number;
  status: AgentStatus;
  avatar: string;
  systemPrompt: string;

  // Metrics
  tokenUsage: { used: number; limit: number };
  concurrency: { current: number; max: number };
  latency: number;
  successRate: number;
};
