import { InfraNode, AIDecision, SystemHealth, ZoneId } from './types';
import { nodes, systemHealth, getNodesByZone, getOperatorForZone, getNodePair } from './infrastructure-data';

/**
 * Analyze a zone using Gemini AI
 */
export async function analyzeZone(zoneId: ZoneId): Promise<ReadableStream<Uint8Array> | null> {
  const zoneNodes = getNodesByZone(zoneId);
  const operator = getOperatorForZone(zoneId);
  
  if (!operator) return null;

  const response = await fetch('/api/infrastructure/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nodes: zoneNodes,
      health: systemHealth,
      zoneId,
    }),
  });

  if (!response.ok) throw new Error('Failed to analyze zone');
  return response.body;
}

/**
 * Execute a failover operation
 */
export async function executeFailover(
  nodeId: string, 
  operatorId: string,
  reason?: string
): Promise<ReadableStream<Uint8Array> | null> {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) throw new Error('Node not found');

  const nodePair = getNodePair(nodeId);
  const replicaNode = nodePair?.replica;

  const response = await fetch('/api/infrastructure/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'failover',
      nodeId,
      node,
      replicaNode,
      operatorId,
      reason,
    }),
  });

  if (!response.ok) throw new Error('Failed to execute failover');
  return response.body;
}

/**
 * Execute an auto-heal operation
 */
export async function executeHeal(
  nodeId: string,
  operatorId: string,
  symptoms: string[]
): Promise<ReadableStream<Uint8Array> | null> {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) throw new Error('Node not found');

  const response = await fetch('/api/infrastructure/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'heal',
      nodeId,
      node,
      operatorId,
      reason: `Auto-healing triggered due to: ${symptoms.join(', ')}`,
    }),
  });

  if (!response.ok) throw new Error('Failed to execute heal');
  return response.body;
}

/**
 * Get AI recommendations for the entire system
 */
export async function getSystemRecommendations(): Promise<ReadableStream<Uint8Array> | null> {
  const response = await fetch('/api/infrastructure/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nodes,
      health: systemHealth,
      query: 'Provide a comprehensive system health report with recommendations for all zones.',
    }),
  });

  if (!response.ok) throw new Error('Failed to get recommendations');
  return response.body;
}

/**
 * Chat with the AI about infrastructure
 */
export async function chatWithAI(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  infrastructureContext?: string
): Promise<ReadableStream<Uint8Array> | null> {
  const response = await fetch('/api/infrastructure/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      infrastructureContext: infrastructureContext || generateInfrastructureContext(),
    }),
  });

  if (!response.ok) throw new Error('Failed to chat with AI');
  return response.body;
}

/**
 * Generate infrastructure context for AI chat
 */
export function generateInfrastructureContext(): string {
  const healthyNodes = nodes.filter(n => n.status === 'healthy').length;
  const warningNodes = nodes.filter(n => n.status === 'warning').length;
  const criticalNodes = nodes.filter(n => n.status === 'critical').length;
  const primaryNodes = nodes.filter(n => n.isPrimary).length;
  const replicaNodes = nodes.filter(n => !n.isPrimary).length;

  return `
System Health: ${systemHealth.overall}%
Active Failovers: ${systemHealth.activeFailovers}
Pending Decisions: ${systemHealth.pendingDecisions}

Node Summary:
- Total Nodes: ${nodes.length}
- Healthy: ${healthyNodes}
- Warning: ${warningNodes}
- Critical: ${criticalNodes}
- Primary Nodes: ${primaryNodes}
- Replica Nodes: ${replicaNodes}

Zone Health:
- Data Center: ${systemHealth.zones['data-center']}%
- Network: ${systemHealth.zones['network']}%
- Cloud: ${systemHealth.zones['cloud']}%
- Security: ${systemHealth.zones['security']}%
- Edge: ${systemHealth.zones['edge']}%

High CPU Nodes (>70%): ${nodes.filter(n => n.metrics.cpu > 70).map(n => n.name).join(', ') || 'None'}
High Memory Nodes (>80%): ${nodes.filter(n => n.metrics.memory > 80).map(n => n.name).join(', ') || 'None'}
`;
}

/**
 * Detect anomalies in nodes
 */
export function detectAnomalies(nodeList: InfraNode[]): Array<{
  nodeId: string;
  nodeName: string;
  anomalies: string[];
  severity: 'low' | 'medium' | 'high';
}> {
  const anomalies: Array<{
    nodeId: string;
    nodeName: string;
    anomalies: string[];
    severity: 'low' | 'medium' | 'high';
  }> = [];

  for (const node of nodeList) {
    const nodeAnomalies: string[] = [];
    
    if (node.metrics.cpu > 90) nodeAnomalies.push('Critical CPU usage (>90%)');
    else if (node.metrics.cpu > 75) nodeAnomalies.push('High CPU usage (>75%)');
    
    if (node.metrics.memory > 90) nodeAnomalies.push('Critical memory usage (>90%)');
    else if (node.metrics.memory > 80) nodeAnomalies.push('High memory usage (>80%)');
    
    if (node.metrics.latency > 100) nodeAnomalies.push('High latency (>100ms)');
    
    if (node.status === 'warning') nodeAnomalies.push('Node in warning state');
    if (node.status === 'critical') nodeAnomalies.push('Node in critical state');
    
    if (nodeAnomalies.length > 0) {
      anomalies.push({
        nodeId: node.id,
        nodeName: node.name,
        anomalies: nodeAnomalies,
        severity: node.status === 'critical' || node.metrics.cpu > 90 || node.metrics.memory > 90 
          ? 'high' 
          : node.status === 'warning' || node.metrics.cpu > 75 || node.metrics.memory > 80
            ? 'medium'
            : 'low',
      });
    }
  }

  return anomalies;
}
