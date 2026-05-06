'use client';

import { useState, useCallback, useEffect } from 'react';
import { InfraNode, InfraZone } from '@/lib/types';
import { nodes, connections, zones, operators, recentDecisions, systemHealth, getNodePair, getConnectionsForNode, getOperatorForZone } from '@/lib/infrastructure-data';
import IsometricMap from '@/components/infrastructure/IsometricMap';
import HealthBar from '@/components/infrastructure/HealthBar';
import AIDecisionLog from '@/components/infrastructure/AIDecisionLog';
import NodeDetailPanel from '@/components/infrastructure/NodeDetailPanel';
import { Shield, ShieldAlert, ShieldCheck, Terminal, Server, Activity, Cpu, HardDrive, Factory, Box, Drill, Zap, Boxes } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InfrastructurePage() {
  const [selectedNode, setSelectedNode] = useState<InfraNode | null>(null);
  const [selectedZone, setSelectedZone] = useState<InfraZone | null>(null);
  const [showDecisionLog, setShowDecisionLog] = useState(true);
  const [hermesStatus, setHermesStatus] = useState<{healthy: boolean, issues: number} | null>(null);
  const [computeLoad, setComputeLoad] = useState(84);

  useEffect(() => {
    const loadInterval = setInterval(() => {
      setComputeLoad(prev => Math.min(100, Math.max(60, prev + (Math.random() - 0.5) * 2)));
    }, 1500);
    return () => clearInterval(loadInterval);
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
    const interval = setInterval(checkHermes, 30000);
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
    console.log('[v0] Syncing industrial grid...');
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
    <div className="h-screen flex flex-col bg-black relative overflow-hidden font-mono selection:bg-[hsl(var(--neon-cyan))] selection:text-black">
      {/* Industrial Background - Exposed Steel Texture & Grid */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      
      {/* Heavy Steel Header */}
      <div className="relative z-20 border-b-2 border-[#333] bg-[#0a0a0a]">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/5 border border-[#444] rounded-sm flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                <Factory className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white font-black tracking-[0.3em] uppercase text-base block leading-none">Warehouse_Compute_Lab</span>
                <span className="text-[9px] text-[#666] tracking-[0.4em] uppercase font-bold mt-1">Sector 7G // High-Density Rack Cluster</span>
              </div>
            </div>
            
            <div className="flex items-center gap-12 border-l border-[#222] pl-12">
              <div className="flex flex-col">
                <span className="text-[9px] text-[#666] uppercase tracking-widest mb-1">Total_Grid_Load</span>
                <div className="flex items-end gap-3">
                  <span className="text-xl font-black text-white tabular-nums">{computeLoad.toFixed(1)}%</span>
                  <div className="flex gap-0.5 mb-1.5">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`w-1 h-3 ${i < computeLoad/10 ? 'bg-[hsl(var(--neon-cyan))]' : 'bg-[#222]'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-[#666] uppercase tracking-widest mb-1">Grid_Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--neon-green))] shadow-[0_0_10px_hsl(var(--neon-green))]" />
                  <span className="text-xs font-black text-white uppercase tracking-tighter">Synchronized</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-white/5 border border-[#333] rounded-sm flex items-center gap-3">
              <HardDrive className="w-4 h-4 text-[#666]" />
              <span className="text-[10px] text-white font-bold uppercase tracking-widest">Rack_01 :: Online</span>
            </div>
            <button 
              onClick={handleRefresh}
              className="px-6 py-2 bg-white text-black text-[10px] font-black tracking-[0.3em] uppercase hover:bg-[hsl(var(--neon-cyan))] transition-all active:scale-95"
            >
              Flush_Grid
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Floor */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Isometric Map - Warehouse Context */}
        <div className="flex-1 relative bg-[#050505]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />
          
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

          {/* Heavy Metal Guardian Panel */}
          <div className="absolute top-8 right-8">
            <div className={`
              px-8 py-5 bg-[#0a0a0a] border-t-4 border-x border-b border-[#333] flex items-center gap-6 shadow-2xl
              ${hermesStatus?.healthy ? 'border-t-[hsl(var(--neon-cyan))]' : 'border-t-red-600'}
            `}>
              <div className="p-3 bg-white/5 border border-[#222]">
                <Shield className={`w-8 h-8 ${hermesStatus?.healthy ? 'text-white' : 'text-red-600'}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#666]">Security_Lock</span>
                <span className="text-lg font-black text-white tracking-widest">
                  {hermesStatus ? (hermesStatus.healthy ? 'SECURED' : 'BREACHED') : 'PENDING'}
                </span>
              </div>
            </div>
          </div>

          {/* Industrial Legend - Server Rack Style */}
          <div className="absolute bottom-10 left-10 bg-[#0a0a0a] border border-[#333] p-8 shadow-2xl">
            <div className="text-[11px] font-black text-white tracking-[0.5em] uppercase mb-6 border-b border-[#222] pb-4 flex items-center gap-4">
              <Box className="w-4 h-4 text-[#666]" />
              System_Legend
            </div>
            <div className="space-y-4">
              <LegendItem color="white" label="High_Priority_Node" />
              <LegendItem color="#666" label="Standby_Unit" />
              <LegendItem color="hsl(var(--neon-cyan))" label="Active_Transfer" />
              <LegendItem color="red" label="Critical_Fault" />
              <div className="h-px bg-[#222] my-6" />
              <div className="flex items-center gap-5">
                <div className="w-8 h-1 bg-white/10 border border-[#333]" />
                <span className="text-[9px] font-bold text-[#666] uppercase tracking-[0.3em]">Steel_Conduit</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-8 h-0.5 bg-[hsl(var(--neon-cyan))] shadow-[0_0_8px_hsl(var(--neon-cyan))]" />
                <span className="text-[9px] font-bold text-[#666] uppercase tracking-[0.3em]">Electric_Accent</span>
              </div>
            </div>
          </div>

          {/* Industrial Terminal Toggle */}
          <button
            onClick={() => setShowDecisionLog(!showDecisionLog)}
            className="absolute top-8 left-8 px-6 py-3 bg-[#0a0a0a] border border-[#333] text-[10px] font-black text-[#666] hover:text-white hover:border-white transition-all uppercase tracking-[0.4em] flex items-center gap-4 group"
          >
            <Terminal className="w-4 h-4 group-hover:text-[hsl(var(--neon-cyan))]" />
            {showDecisionLog ? 'Kill_Terminal' : 'Boot_Terminal'}
          </button>
        </div>

        {/* Heavy Data Feed */}
        <AnimatePresence>
          {showDecisionLog && (
            <motion.div 
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-[400px] border-l-2 border-[#1a1a1a] bg-[#050505] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between">
                <h3 className="text-[12px] font-black text-white tracking-[0.6em] uppercase flex items-center gap-4">
                  <Cpu className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />
                  Compute_Feed
                </h3>
                <span className="text-[9px] text-[#444] font-bold">L-04 // LIVE</span>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-[hsl(var(--neon-cyan))] opacity-20" />
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

      {/* Rack Detail Overlay */}
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

      {/* Industrial Footer */}
      <footer className="relative z-20 h-14 border-t-2 border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between px-10">
        <div className="flex gap-10 text-[10px] font-black tracking-[0.5em] text-[#444] uppercase items-center">
          <span className="flex items-center gap-3"><Boxes className="w-4 h-4" /> Heavy_Industrial_Computing</span>
          <span className="text-white flex items-center gap-3">
            <div className="w-2 h-2 bg-white" /> 
            GRID_NOMINAL // STABLE
          </span>
        </div>
        <div className="flex gap-10 text-[10px] font-black tracking-[0.5em] text-[#444] uppercase">
          <span>S-7G_WAREHOUSE_SPEC</span>
          <span>EST_05.06.2026</span>
        </div>
      </footer>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-5">
      <div className="w-3 h-3 border border-[#333]" style={{ backgroundColor: color }} />
      <span className="text-[10px] font-black text-[#666] uppercase tracking-[0.3em]">{label}</span>
    </div>
  );
}
