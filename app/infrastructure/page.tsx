'use client';

import { useState, useCallback, useEffect } from 'react';
import { InfraNode, InfraZone } from '@/lib/types';
import { nodes, connections, zones, operators, recentDecisions, systemHealth, getNodePair, getConnectionsForNode, getOperatorForZone } from '@/lib/infrastructure-data';
import IsometricMap from '@/components/infrastructure/IsometricMap';
import HealthBar from '@/components/infrastructure/HealthBar';
import AIDecisionLog from '@/components/infrastructure/AIDecisionLog';
import NodeDetailPanel from '@/components/infrastructure/NodeDetailPanel';
import { Shield, ShieldAlert, ShieldCheck, Terminal } from 'lucide-react';

export default function InfrastructurePage() {
  const [selectedNode, setSelectedNode] = useState<InfraNode | null>(null);
  const [selectedZone, setSelectedZone] = useState<InfraZone | null>(null);
  const [showDecisionLog, setShowDecisionLog] = useState(true);
  const [hermesStatus, setHermesStatus] = useState<{healthy: boolean, issues: number} | null>(null);

  useEffect(() => {
    const checkHermes = async () => {
      try {
        const res = await fetch('/api/hermes/doctor');
        const data = await res.json();
        setHermesStatus({ healthy: data.healthy, issues: data.issuesCount });
      } catch (e) {
        setHermesStatus({ healthy: false, issues: -1 });
      }
    };
    checkHermes();
    const interval = setInterval(checkHermes, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const handleNodeSelect = useCallback((node: InfraNode | null) => {
    setSelectedNode(node);
    setSelectedZone(null);
  }, []);

  const handleZoneSelect = useCallback((zone: InfraZone | null) => {
    setSelectedZone(zone);
    // Don't clear node selection when clicking zone
  }, []);

  const handleFailover = useCallback((nodeId: string) => {
    console.log('[v0] Triggering failover for node:', nodeId);
    // TODO: Call AI API to execute failover
  }, []);

  const handleSimulateFailure = useCallback((nodeId: string) => {
    console.log('[v0] Simulating failure for node:', nodeId);
    // TODO: Update node status to critical
  }, []);

  const handleRefresh = useCallback(() => {
    console.log('[v0] Refreshing infrastructure data...');
    // TODO: Fetch latest data from API
  }, []);

  // Get paired node if selected
  const nodePair = selectedNode ? getNodePair(selectedNode.id) : null;
  const replicaNode = nodePair 
    ? (selectedNode?.isPrimary ? nodePair.replica : nodePair.primary)
    : undefined;

  // Get operator for selected node/zone
  const nodeOperator = selectedNode 
    ? getOperatorForZone(selectedNode.zone) 
    : undefined;

  // Get connections for selected node
  const nodeConnections = selectedNode 
    ? getConnectionsForNode(selectedNode.id)
    : [];

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Health Bar */}
      <HealthBar health={systemHealth} onRefresh={handleRefresh} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 relative">
          <IsometricMap
            nodes={nodes}
            connections={connections}
            zones={zones}
            operators={operators}
            selectedNodeId={selectedNode?.id}
            selectedZoneId={selectedZone?.id}
            onNodeSelect={handleNodeSelect}
            onZoneSelect={handleZoneSelect}
          />

          {/* Hermes Guardian Status */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className={`
              px-4 py-2 rounded-xl border flex items-center gap-3 backdrop-blur-md transition-all
              ${hermesStatus?.healthy 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'}
            `}>
              {hermesStatus?.healthy ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">Hermes Guardian</span>
                <span className="text-xs font-bold font-mono">
                  {hermesStatus ? (hermesStatus.healthy ? 'STABLE' : `ISSUES: ${hermesStatus.issues}`) : 'CONNECTING...'}
                </span>
              </div>
              <Terminal className="w-4 h-4 ml-2 opacity-30" />
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-16 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-800 p-3">
            <div className="text-xs font-semibold text-white mb-2">Legend</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-400">Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-[10px] text-slate-400">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-[10px] text-slate-400">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-[10px] text-slate-400">Failover</span>
              </div>
              <div className="h-px bg-slate-700 my-2" />
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-emerald-500" />
                <span className="text-[10px] text-slate-400">Data Flow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-violet-500" style={{ borderStyle: 'dashed' }} />
                <span className="text-[10px] text-slate-400">Control</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-amber-500" style={{ borderStyle: 'dotted' }} />
                <span className="text-[10px] text-slate-400">Backup</span>
              </div>
            </div>
          </div>

          {/* Toggle Decision Log */}
          <button
            onClick={() => setShowDecisionLog(!showDecisionLog)}
            className="absolute top-4 left-4 px-3 py-2 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-800 text-xs text-white hover:bg-slate-800 transition-colors"
          >
            {showDecisionLog ? 'Hide' : 'Show'} AI Log
          </button>
        </div>

        {/* AI Decision Log Panel */}
        {showDecisionLog && (
          <div className="w-80 border-l border-slate-800 bg-slate-950 overflow-hidden">
            <AIDecisionLog 
              decisions={recentDecisions} 
              operators={operators}
              maxItems={15}
            />
          </div>
        )}
      </div>

      {/* Node Detail Panel */}
      {selectedNode && (
        <NodeDetailPanel
          node={selectedNode}
          replicaNode={replicaNode}
          operator={nodeOperator}
          connections={nodeConnections}
          onClose={() => setSelectedNode(null)}
          onFailover={handleFailover}
          onSimulateFailure={handleSimulateFailure}
        />
      )}
    </div>
  );
}
