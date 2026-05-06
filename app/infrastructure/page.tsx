'use client';

import { useState, useCallback, useEffect } from 'react';
import { InfraNode, InfraZone } from '@/lib/types';
import { nodes, connections, zones, operators, recentDecisions, systemHealth, getNodePair, getConnectionsForNode, getOperatorForZone } from '@/lib/infrastructure-data';
import IsometricMap from '@/components/infrastructure/IsometricMap';
import HealthBar from '@/components/infrastructure/HealthBar';
import AIDecisionLog from '@/components/infrastructure/AIDecisionLog';
import NodeDetailPanel from '@/components/infrastructure/NodeDetailPanel';
import { Shield, ShieldAlert, ShieldCheck, Terminal, Server, Activity, Radio, FlaskConical, Beaker, Zap, Microscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InfrastructurePage() {
  const [selectedNode, setSelectedNode] = useState<InfraNode | null>(null);
  const [selectedZone, setSelectedZone] = useState<InfraZone | null>(null);
  const [showDecisionLog, setShowDecisionLog] = useState(true);
  const [hermesStatus, setHermesStatus] = useState<{healthy: boolean, issues: number} | null>(null);
  const [fluxLevel, setFluxLevel] = useState(72);

  useEffect(() => {
    const fluxInterval = setInterval(() => {
      setFluxLevel(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 5)));
    }, 2000);
    return () => clearInterval(fluxInterval);
  }, []);

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
    <div className="h-screen flex flex-col bg-transparent relative overflow-hidden scanlines font-mono">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
      
      {/* Header / Health Bar */}
      <div className="relative z-20 border-b border-[hsl(var(--neon-cyan)/0.3)] bg-[hsl(var(--background)/0.9)] backdrop-blur-xl">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg border border-[hsl(var(--neon-cyan)/0.5)] bg-[hsl(var(--neon-cyan)/0.05)] grid place-items-center shadow-[0_0_15px_hsl(var(--neon-cyan)/0.2)]">
                <FlaskConical className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />
              </div>
              <div>
                <span className="text-white font-black tracking-[0.2em] uppercase text-sm block leading-none">Infrastructure Lab</span>
                <span className="text-[9px] text-[hsl(var(--neon-cyan))] tracking-[0.2em] uppercase font-bold opacity-60">Neural Network Analysis Station</span>
              </div>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[hsl(var(--neon-green))]" />
                  <span className="text-[10px] font-black text-white tabular-nums tracking-widest uppercase">System Stability</span>
                </div>
                <div className="w-32 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                  <motion.div 
                    className="h-full bg-[hsl(var(--neon-green))] shadow-[0_0_8px_hsl(var(--neon-green))]"
                    animate={{ width: `${systemHealth.overall}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[hsl(var(--neon-yellow))]" />
                  <span className="text-[10px] font-black text-white tabular-nums tracking-widest uppercase">Neural Flux</span>
                </div>
                <div className="text-xs font-black text-[hsl(var(--neon-yellow))] mt-0.5 tabular-nums">
                  {fluxLevel.toFixed(1)} mHz
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-md border border-white/10">
              <Microscope className="w-4 h-4 text-muted-foreground" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Active Analysis: NODE_GLOBAL_01</span>
            </div>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.5)] text-[10px] text-[hsl(var(--neon-cyan))] font-black tracking-[0.3em] rounded uppercase hover:bg-[hsl(var(--neon-cyan)/0.2)] transition-all panel-glow-cyan"
            >
              Recalibrate
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Map Area */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-radial-at-c from-[hsl(var(--neon-cyan)/0.03)] via-transparent to-transparent pointer-events-none" />
          
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
              px-6 py-4 rounded-xl backdrop-blur-md border-2 flex items-center gap-5 transition-all scanlines shadow-2xl
              ${hermesStatus?.healthy 
                ? 'border-[hsl(var(--neon-green)/0.4)] bg-[hsl(var(--neon-green)/0.03)] panel-glow-cyan text-[hsl(var(--neon-green))]' 
                : 'border-[hsl(var(--neon-magenta)/0.4)] bg-[hsl(var(--neon-magenta)/0.03)] panel-glow-magenta text-[hsl(var(--neon-magenta))]'}
            `}>
              <div className="relative">
                {hermesStatus?.healthy ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
                <div className="absolute inset-0 animate-ping opacity-20 bg-current rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Lab Guardian</span>
                <span className="text-sm font-black tracking-widest">
                  {hermesStatus ? (hermesStatus.healthy ? 'STABLE' : `CONTAINMENT: ${hermesStatus.issues}`) : 'BOOTING...'}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-8 left-8 bg-[hsl(var(--background)/0.8)] backdrop-blur-xl rounded-xl border border-[hsl(var(--neon-cyan)/0.3)] p-6 panel-glow-cyan scanlines">
            <div className="text-[11px] font-black text-white tracking-[0.4em] uppercase mb-5 border-b border-white/10 pb-3 flex items-center gap-3">
              <Beaker className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
              Lab Spectrum
            </div>
            <div className="space-y-3.5">
              <LegendItem color="hsl(var(--neon-green))" label="Stable Link" />
              <LegendItem color="hsl(var(--neon-yellow))" label="Thermal Flux" />
              <LegendItem color="hsl(var(--neon-magenta))" label="Containment Breach" />
              <LegendItem color="hsl(var(--neon-purple))" label="Neural Ready" />
              <div className="h-px bg-white/10 my-4" />
              <div className="flex items-center gap-4">
                <div className="w-6 h-0.5 bg-[hsl(var(--neon-cyan))] shadow-[0_0_8px_hsl(var(--neon-cyan))]" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Electron Path</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-6 h-0.5 bg-[hsl(var(--neon-purple))] border-t border-dashed" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Neural Synapse</span>
              </div>
            </div>
          </div>

          {/* Toggle Decision Log */}
          <button
            onClick={() => setShowDecisionLog(!showDecisionLog)}
            className="absolute top-6 left-6 px-5 py-2.5 bg-[hsl(var(--background)/0.8)] backdrop-blur-sm rounded-lg border border-[hsl(var(--neon-cyan)/0.3)] text-[10px] font-black text-white hover:bg-[hsl(var(--neon-cyan)/0.1)] transition-all uppercase tracking-[0.3em] flex items-center gap-3"
          >
            <Terminal className="w-3.5 h-3.5 text-[hsl(var(--neon-cyan))]" />
            {showDecisionLog ? 'DEACTIVATE' : 'ACTIVATE'} TELEMETRY
          </button>
        </div>

        {/* AI Decision Log Panel */}
        <AnimatePresence>
          {showDecisionLog && (
            <motion.div 
              initial={{ x: 360, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 360, opacity: 0 }}
              className="w-96 border-l border-[hsl(var(--neon-cyan)/0.2)] bg-[hsl(var(--background)/0.6)] backdrop-blur-2xl overflow-hidden flex flex-col scanlines shadow-2xl"
            >
              <div className="p-5 border-b border-white/10 bg-[hsl(var(--background)/0.8)] flex items-center justify-between">
                <h3 className="text-[11px] font-black text-white tracking-[0.4em] uppercase flex items-center gap-3">
                  <Activity className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                  Neural Telemetry
                </h3>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--neon-green))] animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--neon-green)/0.3)]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--neon-green)/0.3)]" />
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--background)/0.4)] pointer-events-none z-10" />
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
      <footer className="relative z-20 h-12 border-t border-[hsl(var(--neon-cyan)/0.2)] bg-[hsl(var(--background)/0.9)] backdrop-blur-md flex items-center justify-between px-8">
        <div className="flex gap-8 text-[9px] font-black tracking-[0.4em] text-muted-foreground/50 uppercase items-center">
          <span className="flex items-center gap-2"><Server className="w-3 h-3" /> Core Matrix Network</span>
          <span className="text-[hsl(var(--neon-green))] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" /> 
            CALIBRATION NOMINAL
          </span>
        </div>
        <div className="flex gap-8 text-[9px] font-black tracking-[0.4em] text-muted-foreground/50 uppercase">
          <span>Neural Lab Spec. v4.8.2</span>
          <span>EST. 2026.05.06</span>
        </div>
      </footer>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-2.5 h-2.5 rounded-sm shadow-[0_0_10px_currentColor]" style={{ backgroundColor: color, color }} />
      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}
