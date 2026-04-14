import { InfraNode, NodeStatus, AIDecision } from './types';
import { nodes, getNodePair, getOperatorForZone } from './infrastructure-data';

export interface FailoverEvent {
  id: string;
  primaryId: string;
  replicaId: string;
  timestamp: string;
  reason: string;
  status: 'initiated' | 'in-progress' | 'completed' | 'failed';
  steps: FailoverStep[];
}

export interface FailoverStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  message?: string;
  timestamp?: string;
}

// Simulated state for demo purposes
let simulatedNodes: InfraNode[] = [...nodes];
let activeFailovers: FailoverEvent[] = [];

/**
 * Get current simulated nodes state
 */
export function getSimulatedNodes(): InfraNode[] {
  return simulatedNodes;
}

/**
 * Reset simulation to initial state
 */
export function resetSimulation(): void {
  simulatedNodes = [...nodes];
  activeFailovers = [];
}

/**
 * Simulate a node failure
 */
export function simulateFailure(nodeId: string): {
  success: boolean;
  node?: InfraNode;
  message: string;
} {
  const nodeIndex = simulatedNodes.findIndex(n => n.id === nodeId);
  if (nodeIndex === -1) {
    return { success: false, message: 'Node not found' };
  }

  const node = simulatedNodes[nodeIndex];
  
  // Update node status to critical
  simulatedNodes[nodeIndex] = {
    ...node,
    status: 'critical',
    metrics: {
      ...node.metrics,
      cpu: 95 + Math.random() * 5,
      memory: 90 + Math.random() * 10,
    },
  };

  return {
    success: true,
    node: simulatedNodes[nodeIndex],
    message: `Simulated failure on ${node.name}`,
  };
}

/**
 * Execute failover from primary to replica
 */
export async function executeFailover(
  primaryId: string,
  reason: string = 'Manual failover triggered'
): Promise<FailoverEvent> {
  const nodePair = getNodePair(primaryId);
  if (!nodePair) {
    throw new Error('No replica found for node');
  }

  const { primary, replica } = nodePair;
  const operator = getOperatorForZone(primary.zone);

  const failoverEvent: FailoverEvent = {
    id: `fo-${Date.now()}`,
    primaryId: primary.id,
    replicaId: replica.id,
    timestamp: new Date().toISOString(),
    reason,
    status: 'initiated',
    steps: [
      { name: 'Validate replica health', status: 'pending' },
      { name: 'Drain connections from primary', status: 'pending' },
      { name: 'Sync final data to replica', status: 'pending' },
      { name: 'Promote replica to primary', status: 'pending' },
      { name: 'Update routing configuration', status: 'pending' },
      { name: 'Verify new primary', status: 'pending' },
    ],
  };

  activeFailovers.push(failoverEvent);

  // Simulate the failover process
  await simulateFailoverSteps(failoverEvent, primary, replica);

  return failoverEvent;
}

/**
 * Simulate failover steps with delays
 */
async function simulateFailoverSteps(
  event: FailoverEvent,
  primary: InfraNode,
  replica: InfraNode
): Promise<void> {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  for (let i = 0; i < event.steps.length; i++) {
    event.status = 'in-progress';
    event.steps[i].status = 'running';
    event.steps[i].timestamp = new Date().toISOString();

    // Simulate step execution
    await delay(500 + Math.random() * 500);

    // Check for simulated failures (5% chance)
    if (Math.random() < 0.05) {
      event.steps[i].status = 'failed';
      event.steps[i].message = 'Step failed due to timeout';
      event.status = 'failed';
      return;
    }

    event.steps[i].status = 'completed';
    event.steps[i].message = getStepCompletionMessage(i, primary, replica);
  }

  // Update node statuses
  const primaryIndex = simulatedNodes.findIndex(n => n.id === primary.id);
  const replicaIndex = simulatedNodes.findIndex(n => n.id === replica.id);

  if (primaryIndex !== -1) {
    simulatedNodes[primaryIndex] = {
      ...simulatedNodes[primaryIndex],
      status: 'failover',
      isPrimary: false,
    };
  }

  if (replicaIndex !== -1) {
    simulatedNodes[replicaIndex] = {
      ...simulatedNodes[replicaIndex],
      status: 'healthy',
      isPrimary: true,
      replicaId: primary.id,
    };
  }

  event.status = 'completed';
}

function getStepCompletionMessage(stepIndex: number, primary: InfraNode, replica: InfraNode): string {
  const messages = [
    `Replica ${replica.name} health verified: ${replica.metrics.uptime}% uptime`,
    `Drained ${Math.floor(Math.random() * 100) + 50} active connections from ${primary.name}`,
    `Synchronized ${Math.floor(Math.random() * 50) + 10}MB of data to replica`,
    `${replica.name} promoted to primary role`,
    `Updated ${Math.floor(Math.random() * 5) + 3} routing entries`,
    `New primary verified and accepting traffic`,
  ];
  return messages[stepIndex] || 'Step completed';
}

/**
 * Get active failover events
 */
export function getActiveFailovers(): FailoverEvent[] {
  return activeFailovers;
}

/**
 * Get failover history
 */
export function getFailoverHistory(): FailoverEvent[] {
  return activeFailovers.filter(f => f.status === 'completed' || f.status === 'failed');
}

/**
 * Check sync status between primary and replica
 */
export function checkSyncStatus(primaryId: string): {
  inSync: boolean;
  lagSeconds: number;
  lastSync: string;
} {
  const nodePair = getNodePair(primaryId);
  if (!nodePair) {
    return { inSync: false, lagSeconds: -1, lastSync: 'Unknown' };
  }

  // Simulate sync status
  const lagSeconds = Math.floor(Math.random() * 3);
  const inSync = lagSeconds < 2;

  return {
    inSync,
    lagSeconds,
    lastSync: new Date(Date.now() - lagSeconds * 1000).toISOString(),
  };
}

/**
 * Auto-heal a node
 */
export async function autoHealNode(nodeId: string): Promise<{
  success: boolean;
  actions: string[];
  newStatus: NodeStatus;
}> {
  const nodeIndex = simulatedNodes.findIndex(n => n.id === nodeId);
  if (nodeIndex === -1) {
    return { success: false, actions: ['Node not found'], newStatus: 'offline' };
  }

  const node = simulatedNodes[nodeIndex];
  const actions: string[] = [];

  // Simulate healing actions based on issues
  if (node.metrics.cpu > 80) {
    actions.push('Terminated idle processes');
    actions.push('Scaled up CPU allocation');
  }

  if (node.metrics.memory > 75) {
    actions.push('Cleared application caches');
    actions.push('Garbage collected orphaned objects');
  }

  if (node.metrics.latency > 50) {
    actions.push('Optimized network routes');
    actions.push('Cleared connection pool');
  }

  // Update node with healed metrics
  simulatedNodes[nodeIndex] = {
    ...node,
    status: 'healthy',
    metrics: {
      cpu: Math.max(20, node.metrics.cpu - 30 - Math.random() * 20),
      memory: Math.max(30, node.metrics.memory - 25 - Math.random() * 15),
      network: node.metrics.network,
      latency: Math.max(5, node.metrics.latency - 20 - Math.random() * 10),
      uptime: node.metrics.uptime,
    },
  };

  return {
    success: true,
    actions,
    newStatus: 'healthy',
  };
}

/**
 * Generate a decision record for an action
 */
export function generateDecision(
  operatorId: string,
  action: AIDecision['action'],
  targetNodeId: string,
  reasoning: string,
  automated: boolean = true
): AIDecision {
  return {
    id: `dec-${Date.now()}`,
    operatorId,
    action,
    targetNodeId,
    timestamp: new Date().toISOString(),
    reasoning,
    outcome: 'success',
    automated,
  };
}
