'use client';

import { useState, useCallback, useEffect } from 'react';
import { InfraNode, InfraZone } from '@/lib/types';
import { nodes, connections, zones, operators, recentDecisions, systemHealth, getNodePair, getConnectionsForNode, getOperatorForZone } from '@/lib/infrastructure-data';
import IsometricMap from '@/components/infrastructure/IsometricMap';
import HealthBar from '@/components/infrastructure/HealthBar';
import AIDecisionLog from '@/components/infrastructure/AIDecisionLog';
import NodeDetailPanel from '@/components/infrastructure/NodeDetailPanel';
import { Shield, ShieldAlert, ShieldCheck, Terminal, Server, Activity, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

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
  }, []);

  const handleFailover = useCallback((nodeId: string) => {
    console.log('[v0] Triggering failover for node:', nodeId);
  }, []);

  const handleSimulateFailure = useCallback((nodeId: string) => {
    console.log('[v0] Simulating failure for node:', nodeId);
  }, []);

  const handleRefresh = useCallback(() => {
    console.log('[v0] Refreshing infrastructure data...');
  }, []);

  const nodePair = selectedNode ? getNodePair(selectedNode.id) : null;
  const replicaNode = nodePair 
    ? (selectedNode?.isPrimary ? nodePair.replica : nodePair.primary)
    : undefined;

  const nodeOperator = selectedNode 
    ? getOperatorForZone(selectedNode.zone) 
    : undefined;

  const nodeConnections = selectedNode 
    ? getConnectionsForNode(selectedNode.id)
    : [];

  return (
    <div className="h-screen flex flex-col bg-transparent relative overflow-hidden scanlines">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
      
      {/* Header / Health Bar */}
      <div className="relative z-20 border-b border-white/5 bg-[hsl(var(--background)/0.8)] backdrop-blur-xl">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] grid place-items-center shadow-[0_0_15px_hsl(var(--neon-cyan)/0.4)]">
                <Server className="w-5 h-5 text-background" />
              </div>
              <div>
                <span className="text-white font-black tracking-[0.2em] uppercase text-sm block leading-none">Infrastructure Matrix</span>
                <span className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase font-bold">VYBECORP Global Node Map</span>
              </div>
            </div>
            <div className="h-6 w-px bg-white/5" />
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[hsl(var(--neon-green))]" />
                <span className="text-[10px] font-black text-white tabular-nums tracking-widest">{systemHealth.overall}% HEALTH</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[hsl(var(--neon-cyan))] animate-pulse" />
                <span className="text-[10px] font-black text-white tabular-nums tracking-widest">{nodes.length} ACTIVE NODES</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleRefresh}
              className="px-4 py-1.5 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] text-[10px] text-[hsl(var(--neon-cyan))] font-black tracking-[0.2em] rounded uppercase hover:bg-[hsl(var(--neon-cyan)/0.2)] transition-all"
            >
              Sync Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
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
          <div className="absolute top-6 right-6 flex flex-col gap-2">
            <div className={`
              px-5 py-3 rounded bg-[hsl(var(--card)/0.6)] backdrop-blur-md border flex items-center gap-4 transition-all scanlines
              ${hermesStatus?.healthy 
                ? 'border-[hsl(var(--neon-green)/0.4)] panel-glow-cyan text-[hsl(var(--neon-green))]' 
                : 'border-[hsl(var(--neon-magenta)/0.4)] panel-glow-magenta text-[hsl(var(--neon-magenta))]'}
            `}>
              {hermesStatus?.healthy ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Guardian Status</span>
                <span className="text-xs font-black tracking-widest">
                  {hermesStatus ? (hermesStatus.healthy ? 'OPERATIONAL' : `CRITICAL: ${hermesStatus.issues}`) : 'INITIALIZING...'}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-8 left-8 bg-[hsl(var(--card)/0.6)] backdrop-blur-md rounded border border-white/5 p-4 panel-glow-cyan scanlines">
            <div className="text-[10px] font-black text-white tracking-[0.3em] uppercase mb-4 border-b border-white/5 pb-2">MAP_LEGEND</div>
            <div className="space-y-2.5">
              <LegendItem color="hsl(var(--neon-green))" label="Optimal Node" />
              <LegendItem color="hsl(var(--neon-yellow))" label="Warning State" />
              <LegendItem color="hsl(var(--neon-magenta))" label="Critical Failure" />
              <LegendItem color="hsl(var(--neon-purple))" label="Failover Ready" />
              <div className="h-px bg-white/5 my-3" />
              <div className="flex items-center gap-3">
                <div className="w-5 h-0.5 bg-[hsl(var(--neon-green))]" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Data Stream</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-0.5 bg-[hsl(var(--neon-purple))] border-t border-dashed" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Neural Link</span>
              </div>
            </div>
          </div>

          {/* Toggle Decision Log */}
          <button
            onClick={() => setShowDecisionLog(!showDecisionLog)}
            className="absolute top-6 left-6 px-4 py-2 bg-[hsl(var(--background)/0.6)] backdrop-blur-sm rounded border border-white/10 text-[10px] font-black text-white hover:bg-white/5 transition-all uppercase tracking-[0.2em]"
          >
            {showDecisionLog ? 'Suspend' : 'Display'} Logs
          </button>
        </div>

        {/* AI Decision Log Panel */}
        <AnimatePresence>
          {showDecisionLog && (
            <motion.div 
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              className="w-80 border-l border-white/5 bg-[hsl(var(--card)/0.4)] backdrop-blur-xl overflow-hidden flex flex-col scanlines"
            >
              <div className="p-4 border-b border-white/5 bg-[hsl(var(--background)/0.5)]">
                <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                  Neural Decision Feed
                </h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <AIDecisionLog 
                  decisions={recentDecisions} 
                  operators={operators}
                  maxItems={15}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

      {/* Footer decoration */}
      <footer className="relative z-20 h-10 border-t border-white/5 bg-[hsl(var(--background)/0.8)] backdrop-blur-md flex items-center justify-between px-8">
        <div className="flex gap-8 text-[10px] font-bold tracking-[0.3em] text-muted-foreground/40 uppercase">
          <span>Global Infrastructure Network</span>
          <span className="text-[hsl(var(--neon-green))]">● ALL SYSTEMS GO</span>
        </div>
        <div className="flex gap-8 text-[10px] font-bold tracking-[0.3em] text-muted-foreground/40 uppercase">
          <span>Tier-1 Architecture</span>
          <span>v2.5.0</span>
        </div>
      </footer>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color, color }} />
      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
    </div>
  );
}
