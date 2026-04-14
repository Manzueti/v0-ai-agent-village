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

// ═══════════════════════════════════════════════════════════════════════════════
// INFRASTRUCTURE TYPES - Zero Point of Failure System
// ═══════════════════════════════════════════════════════════════════════════════

export type NodeType = 
  | 'server' 
  | 'database' 
  | 'firewall' 
  | 'load-balancer' 
  | 'vpn' 
  | 'storage' 
  | 'cdn' 
  | 'api-gateway' 
  | 'cloud-service' 
  | 'container'
  | 'router'
  | 'dns';

export type NodeStatus = 'healthy' | 'warning' | 'critical' | 'offline' | 'failover';

export type ZoneId = 'data-center' | 'network' | 'cloud' | 'security' | 'edge';

export interface InfraNode {
  id: string;
  name: string;
  type: NodeType;
  zone: ZoneId;
  status: NodeStatus;
  isPrimary: boolean;
  replicaId?: string;
  metrics: {
    cpu: number;
    memory: number;
    network: number;
    latency: number;
    uptime: number;
  };
  position: { x: number; y: number };
  lastSync?: string;
  provider?: string;
}

export interface NodeConnection {
  id: string;
  from: string;
  to: string;
  type: 'data' | 'control' | 'backup' | 'vpn';
  status: 'active' | 'degraded' | 'down';
  bandwidth?: number;
}

export interface InfraZone {
  id: ZoneId;
  name: string;
  color: string;
  bgColor: string;
  description: string;
  operatorId: string;
  health: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface AIOperator extends Employee {
  assignedZone: ZoneId;
  managedNodes: string[];
  lastDecision?: {
    action: string;
    nodeId: string;
    timestamp: string;
    reasoning: string;
    outcome?: 'success' | 'pending' | 'failed';
  };
  aiModel: string;
}

export interface AIDecision {
  id: string;
  operatorId: string;
  action: 'failover' | 'scale' | 'restart' | 'alert' | 'heal' | 'reroute';
  targetNodeId: string;
  timestamp: string;
  reasoning: string;
  outcome: 'success' | 'pending' | 'failed';
  automated: boolean;
}

export interface SystemHealth {
  overall: number;
  zones: Record<ZoneId, number>;
  activeFailovers: number;
  pendingDecisions: number;
  lastUpdated: string;
}
