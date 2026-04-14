import { InfraNode, NodeConnection, InfraZone, AIOperator, AIDecision, SystemHealth, ZoneId } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// ZONES - Enterprise Infrastructure Zones
// ═══════════════════════════════════════════════════════════════════════════════

export const zones: InfraZone[] = [
  {
    id: 'data-center',
    name: 'Data Center',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    description: 'Core servers, databases, and storage clusters',
    operatorId: 'ops-datacenter',
    health: 98,
    position: { x: 0, y: 0 },
    size: { width: 400, height: 300 },
  },
  {
    id: 'network',
    name: 'Network',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    description: 'Firewalls, load balancers, VPNs, and routing',
    operatorId: 'ops-network',
    health: 100,
    position: { x: 420, y: 0 },
    size: { width: 350, height: 280 },
  },
  {
    id: 'cloud',
    name: 'Cloud Services',
    color: '#06B6D4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    description: 'AWS, Azure, GCP services and SaaS integrations',
    operatorId: 'ops-cloud',
    health: 95,
    position: { x: 0, y: 320 },
    size: { width: 380, height: 260 },
  },
  {
    id: 'security',
    name: 'Security',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    description: 'Authentication, monitoring, threat detection',
    operatorId: 'ops-security',
    health: 100,
    position: { x: 400, y: 300 },
    size: { width: 320, height: 240 },
  },
  {
    id: 'edge',
    name: 'Edge',
    color: '#22C55E',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    description: 'CDN, edge compute, and user endpoints',
    operatorId: 'ops-edge',
    health: 92,
    position: { x: 740, y: 150 },
    size: { width: 280, height: 220 },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// NODES - Infrastructure Nodes with Primary/Replica Pairs
// ═══════════════════════════════════════════════════════════════════════════════

export const nodes: InfraNode[] = [
  // ─── Data Center Zone ───
  {
    id: 'db-primary-1',
    name: 'PostgreSQL Primary',
    type: 'database',
    zone: 'data-center',
    status: 'healthy',
    isPrimary: true,
    replicaId: 'db-replica-1',
    metrics: { cpu: 45, memory: 62, network: 78, latency: 12, uptime: 99.99 },
    position: { x: 80, y: 80 },
    lastSync: '2024-01-15T10:30:00Z',
  },
  {
    id: 'db-replica-1',
    name: 'PostgreSQL Replica',
    type: 'database',
    zone: 'data-center',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 22, memory: 58, network: 45, latency: 15, uptime: 99.98 },
    position: { x: 180, y: 80 },
    lastSync: '2024-01-15T10:30:00Z',
  },
  {
    id: 'server-primary-1',
    name: 'App Server A',
    type: 'server',
    zone: 'data-center',
    status: 'healthy',
    isPrimary: true,
    replicaId: 'server-replica-1',
    metrics: { cpu: 67, memory: 74, network: 56, latency: 8, uptime: 99.95 },
    position: { x: 80, y: 180 },
  },
  {
    id: 'server-replica-1',
    name: 'App Server B',
    type: 'server',
    zone: 'data-center',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 34, memory: 45, network: 32, latency: 9, uptime: 99.94 },
    position: { x: 180, y: 180 },
  },
  {
    id: 'storage-primary-1',
    name: 'SAN Primary',
    type: 'storage',
    zone: 'data-center',
    status: 'healthy',
    isPrimary: true,
    replicaId: 'storage-replica-1',
    metrics: { cpu: 15, memory: 82, network: 91, latency: 3, uptime: 99.999 },
    position: { x: 280, y: 130 },
  },
  {
    id: 'storage-replica-1',
    name: 'SAN Replica',
    type: 'storage',
    zone: 'data-center',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 12, memory: 80, network: 88, latency: 4, uptime: 99.998 },
    position: { x: 350, y: 130 },
  },

  // ─── Network Zone ───
  {
    id: 'fw-primary-1',
    name: 'Firewall Primary',
    type: 'firewall',
    zone: 'network',
    status: 'healthy',
    isPrimary: true,
    replicaId: 'fw-replica-1',
    metrics: { cpu: 28, memory: 35, network: 95, latency: 1, uptime: 100 },
    position: { x: 480, y: 60 },
  },
  {
    id: 'fw-replica-1',
    name: 'Firewall Standby',
    type: 'firewall',
    zone: 'network',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 5, memory: 20, network: 10, latency: 1, uptime: 100 },
    position: { x: 560, y: 60 },
  },
  {
    id: 'lb-primary-1',
    name: 'Load Balancer A',
    type: 'load-balancer',
    zone: 'network',
    status: 'healthy',
    isPrimary: true,
    replicaId: 'lb-replica-1',
    metrics: { cpu: 52, memory: 44, network: 88, latency: 2, uptime: 99.99 },
    position: { x: 480, y: 150 },
  },
  {
    id: 'lb-replica-1',
    name: 'Load Balancer B',
    type: 'load-balancer',
    zone: 'network',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 48, memory: 42, network: 85, latency: 2, uptime: 99.99 },
    position: { x: 560, y: 150 },
  },
  {
    id: 'vpn-1',
    name: 'VPN Gateway',
    type: 'vpn',
    zone: 'network',
    status: 'healthy',
    isPrimary: true,
    replicaId: 'vpn-2',
    metrics: { cpu: 18, memory: 25, network: 72, latency: 15, uptime: 99.9 },
    position: { x: 640, y: 100 },
  },
  {
    id: 'vpn-2',
    name: 'VPN Backup',
    type: 'vpn',
    zone: 'network',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 5, memory: 15, network: 8, latency: 18, uptime: 99.9 },
    position: { x: 700, y: 100 },
  },

  // ─── Cloud Zone ───
  {
    id: 'aws-primary',
    name: 'AWS US-East',
    type: 'cloud-service',
    zone: 'cloud',
    status: 'healthy',
    isPrimary: true,
    replicaId: 'aws-replica',
    metrics: { cpu: 55, memory: 68, network: 82, latency: 25, uptime: 99.95 },
    position: { x: 60, y: 380 },
    provider: 'AWS',
  },
  {
    id: 'aws-replica',
    name: 'AWS US-West',
    type: 'cloud-service',
    zone: 'cloud',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 42, memory: 55, network: 75, latency: 35, uptime: 99.94 },
    position: { x: 150, y: 380 },
    provider: 'AWS',
  },
  {
    id: 'azure-1',
    name: 'Azure Functions',
    type: 'container',
    zone: 'cloud',
    status: 'warning',
    isPrimary: true,
    replicaId: 'azure-2',
    metrics: { cpu: 78, memory: 85, network: 65, latency: 45, uptime: 99.8 },
    position: { x: 60, y: 460 },
    provider: 'Azure',
  },
  {
    id: 'azure-2',
    name: 'Azure Backup',
    type: 'container',
    zone: 'cloud',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 25, memory: 40, network: 30, latency: 50, uptime: 99.9 },
    position: { x: 150, y: 460 },
    provider: 'Azure',
  },
  {
    id: 'api-gateway-1',
    name: 'API Gateway',
    type: 'api-gateway',
    zone: 'cloud',
    status: 'healthy',
    isPrimary: true,
    replicaId: 'api-gateway-2',
    metrics: { cpu: 35, memory: 28, network: 92, latency: 5, uptime: 99.99 },
    position: { x: 260, y: 420 },
  },
  {
    id: 'api-gateway-2',
    name: 'API Gateway DR',
    type: 'api-gateway',
    zone: 'cloud',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 10, memory: 15, network: 20, latency: 8, uptime: 99.99 },
    position: { x: 330, y: 420 },
  },

  // ─── Security Zone ───
  {
    id: 'auth-primary',
    name: 'Auth Server',
    type: 'server',
    zone: 'security',
    status: 'healthy',
    isPrimary: true,
    replicaId: 'auth-replica',
    metrics: { cpu: 42, memory: 55, network: 68, latency: 8, uptime: 99.99 },
    position: { x: 450, y: 360 },
  },
  {
    id: 'auth-replica',
    name: 'Auth Standby',
    type: 'server',
    zone: 'security',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 15, memory: 35, network: 25, latency: 10, uptime: 99.99 },
    position: { x: 530, y: 360 },
  },
  {
    id: 'siem-1',
    name: 'SIEM Primary',
    type: 'server',
    zone: 'security',
    status: 'healthy',
    isPrimary: true,
    replicaId: 'siem-2',
    metrics: { cpu: 68, memory: 75, network: 45, latency: 20, uptime: 99.95 },
    position: { x: 450, y: 440 },
  },
  {
    id: 'siem-2',
    name: 'SIEM Replica',
    type: 'server',
    zone: 'security',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 55, memory: 70, network: 40, latency: 22, uptime: 99.94 },
    position: { x: 530, y: 440 },
  },
  {
    id: 'waf-1',
    name: 'WAF Primary',
    type: 'firewall',
    zone: 'security',
    status: 'healthy',
    isPrimary: true,
    replicaId: 'waf-2',
    metrics: { cpu: 32, memory: 28, network: 88, latency: 2, uptime: 100 },
    position: { x: 620, y: 400 },
  },
  {
    id: 'waf-2',
    name: 'WAF Standby',
    type: 'firewall',
    zone: 'security',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 8, memory: 15, network: 12, latency: 2, uptime: 100 },
    position: { x: 680, y: 400 },
  },

  // ─── Edge Zone ───
  {
    id: 'cdn-1',
    name: 'CDN North',
    type: 'cdn',
    zone: 'edge',
    status: 'healthy',
    isPrimary: true,
    replicaId: 'cdn-2',
    metrics: { cpu: 25, memory: 45, network: 95, latency: 5, uptime: 99.99 },
    position: { x: 790, y: 200 },
  },
  {
    id: 'cdn-2',
    name: 'CDN South',
    type: 'cdn',
    zone: 'edge',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 22, memory: 42, network: 92, latency: 8, uptime: 99.98 },
    position: { x: 870, y: 200 },
  },
  {
    id: 'edge-compute-1',
    name: 'Edge Node A',
    type: 'container',
    zone: 'edge',
    status: 'healthy',
    isPrimary: true,
    replicaId: 'edge-compute-2',
    metrics: { cpu: 55, memory: 48, network: 78, latency: 12, uptime: 99.9 },
    position: { x: 790, y: 280 },
  },
  {
    id: 'edge-compute-2',
    name: 'Edge Node B',
    type: 'container',
    zone: 'edge',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 52, memory: 45, network: 75, latency: 14, uptime: 99.9 },
    position: { x: 870, y: 280 },
  },
  {
    id: 'dns-primary',
    name: 'DNS Primary',
    type: 'dns',
    zone: 'edge',
    status: 'healthy',
    isPrimary: true,
    replicaId: 'dns-replica',
    metrics: { cpu: 12, memory: 18, network: 65, latency: 1, uptime: 100 },
    position: { x: 950, y: 240 },
  },
  {
    id: 'dns-replica',
    name: 'DNS Secondary',
    type: 'dns',
    zone: 'edge',
    status: 'healthy',
    isPrimary: false,
    metrics: { cpu: 10, memory: 15, network: 60, latency: 2, uptime: 100 },
    position: { x: 1010, y: 240 },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONNECTIONS - Node Interconnections
// ═══════════════════════════════════════════════════════════════════════════════

export const connections: NodeConnection[] = [
  // Data Center internal
  { id: 'conn-1', from: 'server-primary-1', to: 'db-primary-1', type: 'data', status: 'active' },
  { id: 'conn-2', from: 'server-replica-1', to: 'db-replica-1', type: 'data', status: 'active' },
  { id: 'conn-3', from: 'db-primary-1', to: 'storage-primary-1', type: 'data', status: 'active' },
  { id: 'conn-4', from: 'db-replica-1', to: 'storage-replica-1', type: 'backup', status: 'active' },
  
  // Primary-Replica sync
  { id: 'conn-5', from: 'db-primary-1', to: 'db-replica-1', type: 'backup', status: 'active' },
  { id: 'conn-6', from: 'server-primary-1', to: 'server-replica-1', type: 'backup', status: 'active' },
  { id: 'conn-7', from: 'storage-primary-1', to: 'storage-replica-1', type: 'backup', status: 'active' },
  
  // Network to Data Center
  { id: 'conn-8', from: 'lb-primary-1', to: 'server-primary-1', type: 'data', status: 'active' },
  { id: 'conn-9', from: 'lb-replica-1', to: 'server-replica-1', type: 'data', status: 'active' },
  { id: 'conn-10', from: 'fw-primary-1', to: 'lb-primary-1', type: 'control', status: 'active' },
  
  // Cloud to Network
  { id: 'conn-11', from: 'api-gateway-1', to: 'lb-primary-1', type: 'data', status: 'active' },
  { id: 'conn-12', from: 'aws-primary', to: 'api-gateway-1', type: 'data', status: 'active' },
  { id: 'conn-13', from: 'azure-1', to: 'api-gateway-1', type: 'data', status: 'active' },
  
  // Security connections
  { id: 'conn-14', from: 'auth-primary', to: 'server-primary-1', type: 'control', status: 'active' },
  { id: 'conn-15', from: 'waf-1', to: 'fw-primary-1', type: 'control', status: 'active' },
  { id: 'conn-16', from: 'siem-1', to: 'fw-primary-1', type: 'control', status: 'active' },
  
  // Edge connections
  { id: 'conn-17', from: 'cdn-1', to: 'lb-primary-1', type: 'data', status: 'active' },
  { id: 'conn-18', from: 'edge-compute-1', to: 'api-gateway-1', type: 'data', status: 'active' },
  { id: 'conn-19', from: 'dns-primary', to: 'cdn-1', type: 'control', status: 'active' },
  
  // VPN connections
  { id: 'conn-20', from: 'vpn-1', to: 'fw-primary-1', type: 'vpn', status: 'active' },
  { id: 'conn-21', from: 'vpn-1', to: 'auth-primary', type: 'vpn', status: 'active' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// AI OPERATORS - AI Employees Managing Infrastructure
// ═══════════════════════════════════════════════════════════════════════════════

export const operators: AIOperator[] = [
  {
    id: 'ops-datacenter',
    name: 'Atlas',
    role: 'Data Center Operator',
    office: 'Data Center',
    level: 5,
    status: 'running',
    avatar: '🏢',
    systemPrompt: 'You are Atlas, the AI operator for the Data Center zone. You monitor servers, databases, and storage clusters. You ensure data integrity, optimize performance, and execute failovers when primary nodes fail.',
    tokenUsage: { used: 85000, limit: 200000 },
    concurrency: { current: 4, max: 8 },
    latency: 120,
    successRate: 99.5,
    assignedZone: 'data-center',
    managedNodes: ['db-primary-1', 'db-replica-1', 'server-primary-1', 'server-replica-1', 'storage-primary-1', 'storage-replica-1'],
    aiModel: 'grok-4',
    lastDecision: {
      action: 'health-check',
      nodeId: 'db-primary-1',
      timestamp: new Date().toISOString(),
      reasoning: 'Routine health verification completed. All database metrics within normal parameters.',
      outcome: 'success',
    },
  },
  {
    id: 'ops-network',
    name: 'Nexus',
    role: 'Network Operator',
    office: 'Network Operations',
    level: 5,
    status: 'running',
    avatar: '🌐',
    systemPrompt: 'You are Nexus, the AI operator for the Network zone. You manage firewalls, load balancers, and VPN gateways. You optimize traffic routing, detect intrusions, and ensure zero-downtime connectivity.',
    tokenUsage: { used: 62000, limit: 150000 },
    concurrency: { current: 3, max: 6 },
    latency: 80,
    successRate: 100,
    assignedZone: 'network',
    managedNodes: ['fw-primary-1', 'fw-replica-1', 'lb-primary-1', 'lb-replica-1', 'vpn-1', 'vpn-2'],
    aiModel: 'grok-4',
    lastDecision: {
      action: 'reroute',
      nodeId: 'lb-primary-1',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      reasoning: 'Traffic spike detected. Redistributed load across both load balancers for optimal performance.',
      outcome: 'success',
    },
  },
  {
    id: 'ops-cloud',
    name: 'Stratos',
    role: 'Cloud Operator',
    office: 'Cloud Command',
    level: 4,
    status: 'running',
    avatar: '☁️',
    systemPrompt: 'You are Stratos, the AI operator for the Cloud zone. You manage AWS, Azure, and GCP resources. You handle auto-scaling, cost optimization, and cross-cloud failover orchestration.',
    tokenUsage: { used: 95000, limit: 180000 },
    concurrency: { current: 5, max: 10 },
    latency: 200,
    successRate: 98.5,
    assignedZone: 'cloud',
    managedNodes: ['aws-primary', 'aws-replica', 'azure-1', 'azure-2', 'api-gateway-1', 'api-gateway-2'],
    aiModel: 'grok-4',
    lastDecision: {
      action: 'scale',
      nodeId: 'azure-1',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      reasoning: 'Azure Functions approaching memory threshold (85%). Scaled up container resources to prevent degradation.',
      outcome: 'success',
    },
  },
  {
    id: 'ops-security',
    name: 'Sentinel',
    role: 'Security Operator',
    office: 'Security Operations Center',
    level: 5,
    status: 'running',
    avatar: '🛡️',
    systemPrompt: 'You are Sentinel, the AI operator for the Security zone. You monitor authentication systems, SIEM alerts, and WAF rules. You detect threats, enforce compliance, and coordinate incident response.',
    tokenUsage: { used: 78000, limit: 200000 },
    concurrency: { current: 6, max: 12 },
    latency: 50,
    successRate: 100,
    assignedZone: 'security',
    managedNodes: ['auth-primary', 'auth-replica', 'siem-1', 'siem-2', 'waf-1', 'waf-2'],
    aiModel: 'grok-4',
    lastDecision: {
      action: 'alert',
      nodeId: 'waf-1',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      reasoning: 'Detected unusual request pattern from IP range. Updated WAF rules to block suspicious traffic. No breach detected.',
      outcome: 'success',
    },
  },
  {
    id: 'ops-edge',
    name: 'Horizon',
    role: 'Edge Operator',
    office: 'Edge Control',
    level: 4,
    status: 'running',
    avatar: '🌍',
    systemPrompt: 'You are Horizon, the AI operator for the Edge zone. You manage CDN nodes, edge compute, and DNS services. You optimize content delivery, minimize latency, and ensure global availability.',
    tokenUsage: { used: 45000, limit: 100000 },
    concurrency: { current: 2, max: 4 },
    latency: 150,
    successRate: 99.2,
    assignedZone: 'edge',
    managedNodes: ['cdn-1', 'cdn-2', 'edge-compute-1', 'edge-compute-2', 'dns-primary', 'dns-replica'],
    aiModel: 'grok-4',
    lastDecision: {
      action: 'heal',
      nodeId: 'cdn-1',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      reasoning: 'CDN cache hit ratio dropped below threshold. Purged stale cache entries and pre-warmed popular content.',
      outcome: 'success',
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// RECENT DECISIONS - AI Decision Log
// ═══════════════════════════════════════════════════════════════════════════════

export const recentDecisions: AIDecision[] = [
  {
    id: 'dec-1',
    operatorId: 'ops-security',
    action: 'alert',
    targetNodeId: 'waf-1',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    reasoning: 'Detected unusual request pattern from IP range 192.168.x.x. Updated WAF rules to block suspicious traffic.',
    outcome: 'success',
    automated: true,
  },
  {
    id: 'dec-2',
    operatorId: 'ops-cloud',
    action: 'scale',
    targetNodeId: 'azure-1',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    reasoning: 'Azure Functions memory at 85%. Scaled container resources from 2GB to 4GB to prevent degradation.',
    outcome: 'success',
    automated: true,
  },
  {
    id: 'dec-3',
    operatorId: 'ops-datacenter',
    action: 'heal',
    targetNodeId: 'db-primary-1',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    reasoning: 'Database connection pool exhausted. Terminated idle connections and increased pool size from 100 to 150.',
    outcome: 'success',
    automated: true,
  },
  {
    id: 'dec-4',
    operatorId: 'ops-network',
    action: 'reroute',
    targetNodeId: 'lb-primary-1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    reasoning: 'Traffic spike detected (3x normal). Redistributed load 60/40 across primary and secondary load balancers.',
    outcome: 'success',
    automated: true,
  },
  {
    id: 'dec-5',
    operatorId: 'ops-edge',
    action: 'heal',
    targetNodeId: 'cdn-1',
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    reasoning: 'Cache hit ratio dropped to 72%. Purged 2.3GB stale entries and pre-warmed top 1000 assets.',
    outcome: 'success',
    automated: true,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM HEALTH - Global Health Status
// ═══════════════════════════════════════════════════════════════════════════════

export const systemHealth: SystemHealth = {
  overall: 97,
  zones: {
    'data-center': 98,
    'network': 100,
    'cloud': 95,
    'security': 100,
    'edge': 92,
  },
  activeFailovers: 0,
  pendingDecisions: 0,
  lastUpdated: new Date().toISOString(),
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getNodesByZone(zoneId: ZoneId): InfraNode[] {
  return nodes.filter(node => node.zone === zoneId);
}

export function getOperatorForZone(zoneId: ZoneId): AIOperator | undefined {
  return operators.find(op => op.assignedZone === zoneId);
}

export function getNodePair(nodeId: string): { primary: InfraNode; replica: InfraNode } | null {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return null;
  
  if (node.isPrimary && node.replicaId) {
    const replica = nodes.find(n => n.id === node.replicaId);
    if (replica) return { primary: node, replica };
  } else if (!node.isPrimary) {
    const primary = nodes.find(n => n.replicaId === node.id);
    if (primary) return { primary, replica: node };
  }
  
  return null;
}

export function getConnectionsForNode(nodeId: string): NodeConnection[] {
  return connections.filter(conn => conn.from === nodeId || conn.to === nodeId);
}

export function getZoneHealth(zoneId: ZoneId): number {
  const zoneNodes = getNodesByZone(zoneId);
  if (zoneNodes.length === 0) return 100;
  
  const healthyNodes = zoneNodes.filter(n => n.status === 'healthy').length;
  return Math.round((healthyNodes / zoneNodes.length) * 100);
}
