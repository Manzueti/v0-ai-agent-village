export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'review' | 'completed' | 'failed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskComplexity = 'low' | 'medium' | 'high';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  complexity: TaskComplexity;
  department: string;
  assignedTo?: string; // agentId
  subTasks: SubTask[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  result?: string;
  xpReward: number;
}

export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  department: string;
  priority: TaskPriority;
  complexity: TaskComplexity;
  subTasks: string[]; // default titles
  xpReward: number;
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'market-research',
    title: 'Market Research',
    description: 'Analyze industry trends and competitor activities.',
    department: 'Revenue Hub',
    priority: 'medium',
    complexity: 'medium',
    subTasks: ['Identify top 5 competitors', 'Analyze pricing models', 'Identify market gaps'],
    xpReward: 250,
  },
  {
    id: 'security-audit',
    title: 'Security Audit',
    description: 'Perform a comprehensive security scan of all infrastructure nodes.',
    department: 'Tech Nexus',
    priority: 'high',
    complexity: 'high',
    subTasks: ['Scan for vulnerabilities', 'Check firewall logs', 'Validate encryption protocols'],
    xpReward: 500,
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    description: 'Develop marketing copy and visual assets for the next campaign.',
    department: 'Creative Studio',
    priority: 'low',
    complexity: 'medium',
    subTasks: ['Draft 3 blog posts', 'Design 5 social media banners', 'Review brand consistency'],
    xpReward: 200,
  },
  {
    id: 'financial-forecasting',
    title: 'Financial Forecasting',
    description: 'Project Q3 and Q4 revenue based on current trends.',
    department: 'Finance Vault',
    priority: 'high',
    complexity: 'high',
    subTasks: ['Collect historical data', 'Apply predictive models', 'Calculate risk factors'],
    xpReward: 450,
  },
  {
    id: 'lead-enrichment',
    title: 'Lead Enrichment',
    description: 'Verify and add details to the current sales pipeline.',
    department: 'Revenue Hub',
    priority: 'medium',
    complexity: 'low',
    subTasks: ['Verify email addresses', 'Find LinkedIn profiles', 'Determine company size'],
    xpReward: 150,
  },
  {
    id: 'infrastructure-scaling',
    title: 'Infrastructure Scaling',
    description: 'Optimize load balancer settings for expected traffic surge.',
    department: 'Tech Nexus',
    priority: 'critical',
    complexity: 'medium',
    subTasks: ['Analyze current load', 'Adjust auto-scaling rules', 'Test failover response'],
    xpReward: 350,
  },
  {
    id: 'strategic-alignment',
    title: 'Strategic Alignment',
    description: 'Align department goals with the Sovereign mission directive.',
    department: 'Command Deck',
    priority: 'critical',
    complexity: 'high',
    subTasks: ['Review quarterly goals', 'Define KPIs', 'Brief department heads'],
    xpReward: 600,
  },
  {
    id: 'seo-optimization',
    title: 'SEO Optimization',
    description: 'Improve keyword rankings for core service pages.',
    department: 'Creative Studio',
    priority: 'medium',
    complexity: 'medium',
    subTasks: ['Keyword research', 'On-page optimization', 'Backlink strategy'],
    xpReward: 300,
  },
];
