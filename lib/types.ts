export type AgentStatus = 'running' | 'paused' | 'error' | 'idle';

// Revenue metrics for money-making agents
export type RevenueMetrics = {
  // Sales agents
  leadsGenerated?: number;
  dealsWon?: number;
  dealsClosed?: number;
  avgDealSize?: number;
  winRate?: number;
  commission?: number;
  revenue?: number;
  pipeline?: number;
  
  // Client success
  activeClients?: number;
  retentionRate?: number;
  upsellRevenue?: number;
  npsScore?: number;
  
  // Market intelligence
  opportunitiesFound?: number;
  marketSize?: number;
  trendReports?: number;
  actionableInsights?: number;
  
  // Pricing
  experimentsRun?: number;
  conversionLift?: number;
  arpuIncrease?: number;
  projectedAnnualImpact?: number;
  
  // Billing
  invoicesSent?: number;
  collectionRate?: number;
  arDays?: number;
  latePaymentsRecovered?: number;
  
  // Social/Content
  followersGained?: number;
  engagementRate?: number;
  leadsFromSocial?: number;
  conversionValue?: number;
  
  // SEO
  organicTraffic?: number;
  keywordsRanked?: number;
  conversionsFromSEO?: number;
  seoRevenue?: number;
  
  // Email
  emailsSent?: number;
  openRate?: number;
  clickRate?: number;
  emailRevenue?: number;
  
  // Chat
  chatsHandled?: number;
  chatConversionRate?: number;
  avgOrderValue?: number;
  chatRevenue?: number;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  office: string;
  level: number;
  status: AgentStatus;
  avatar: string;
  systemPrompt: string;
  revenueMetrics?: RevenueMetrics;

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
