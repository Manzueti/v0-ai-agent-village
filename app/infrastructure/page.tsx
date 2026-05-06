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
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      
      {/* Mounting Rail Borders (Exposed Steel Motif) */}
      <div className="fixed left-0 top-0 bottom-0 w-1 bg-[#1a1a1a] z-50 border-r border-[#333]" />
      <div className="fixed right-0 top-0 bottom-0 w-1 bg-[#1a1a1a] z-50 border-l border-[#333]" />

      {/* Heavy Steel Header */}
      <div className="relative z-20 border-b-4 border-[#1a1a1a] bg-[#050505]">
        <div className="px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 bg-[#111] border-2 border-[#333] rounded-sm flex items-center justify-center shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] relative group">
                <div className="absolute inset-0 bg-[hsl(var(--neon-cyan)/0.05)] opacity-0 group-hover:opacity-100 transition-opacity" />
                <Factory className="w-8 h-8 text-white" />
                {/* Rivet details */}
                <div className="absolute top-1 left-1 w-1 h-1 bg-[#333] rounded-full" />
                <div className="absolute top-1 right-1 w-1 h-1 bg-[#333] rounded-full" />
                <div className="absolute bottom-1 left-1 w-1 h-1 bg-[#333] rounded-full" />
                <div className="absolute bottom-1 right-1 w-1 h-1 bg-[#333] rounded-full" />
              </div>
              <div>
                <span className="text-white font-black tracking-[0.5em] uppercase text-xl block leading-none">WAREHOUSE_COMPUTE_01</span>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-[#444] tracking-[0.3em] uppercase font-bold bg-[#111] px-2 py-0.5 border border-[#222]">CLUSTER_S7G</span>
                  <span className="text-[10px] text-[hsl(var(--neon-cyan))] tracking-[0.3em] uppercase font-black animate-pulse">LIVE_STREAM</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-16 border-l-2 border-[#1a1a1a] pl-16">
              <div className="flex flex-col">
                <span className="text-[9px] text-[#555] uppercase tracking-[0.4em] mb-2">POWER_DISTRIBUTION</span>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-white tabular-nums tracking-tighter">{computeLoad.toFixed(1)}%</span>
                  <div className="flex gap-1">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className={`w-1.5 h-4 ${i < computeLoad/8.3 ? 'bg-[hsl(var(--neon-cyan))] shadow-[0_0_8px_hsl(var(--neon-cyan)/0.5)]' : 'bg-[#111]'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-[#555] uppercase tracking-[0.4em] mb-2">THERMAL_MGMT</span>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm bg-[hsl(var(--neon-green))] shadow-[0_0_10px_hsl(var(--neon-green))]" />
                  <span className="text-sm font-black text-white uppercase tracking-widest">32.4°C :: NOMINAL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-[#444] uppercase tracking-widest mb-1">RACK_IDENTIFIER</span>
              <div className="flex items-center gap-3 px-4 py-2 bg-[#080808] border border-[#222] rounded-sm">
                <Cpu className="w-4 h-4 text-[#555]" />
                <span className="text-[11px] text-white font-black uppercase tracking-widest">NODE_NORTH_7</span>
              </div>
            </div>
            <button 
              onClick={handleRefresh}
              className="h-12 px-8 bg-white text-black text-[11px] font-black tracking-[0.5em] uppercase hover:bg-[hsl(var(--neon-cyan))] transition-all active:translate-y-0.5 shadow-2xl border-b-4 border-gray-400 active:border-b-0"
            >
              PURGE_CACHED
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Floor */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Isometric Map - Warehouse Context */}
        <div className="flex-1 relative bg-[#020202]">
          <div className="absolute inset-0 bg-radial-at-c from-[hsl(var(--neon-cyan)/0.02)] via-transparent to-transparent pointer-events-none" />
          
          {/* Warehouse Floor Markings */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="absolute top-1/2 left-10 right-10 h-px bg-white" />
            <div className="absolute left-1/2 top-10 bottom-10 w-px bg-white" />
          </div>

          <IsometricMap
            nodes={nodes}
            connections={connections}
            zones={zones}
            operators={operators}
            selectedNodeId={selectedNode?.id}
            selectedZoneId={selectedNode ? selectedNode.id : (selectedZone ? selectedZone.id : undefined)}
            onNodeSelect={handleNodeSelect}
            onZoneSelect={handleZoneSelect}
          />

          {/* Industrial Terminal Toggle */}
          <button
            onClick={() => setShowDecisionLog(!showDecisionLog)}
            className="absolute top-10 left-10 px-8 py-4 bg-[#050505] border-2 border-[#222] text-[11px] font-black text-[#555] hover:text-white hover:border-white transition-all uppercase tracking-[0.5em] flex items-center gap-4 group shadow-2xl"
          >
            <div className="w-2 h-2 bg-[#333] rounded-full group-hover:bg-[hsl(var(--neon-cyan))] shadow-[0_0_8px_currentColor]" />
            {showDecisionLog ? 'SUSPEND_IO' : 'ENGAGE_IO'}
          </button>

          {/* Heavy Metal Guardian Panel */}
          <div className="absolute top-10 right-10">
            <div className={`
              px-10 py-6 bg-[#050505] border-l-4 border-y border-r border-[#1a1a1a] flex items-center gap-8 shadow-2xl relative overflow-hidden
              ${hermesStatus?.healthy ? 'border-l-[hsl(var(--neon-cyan))]' : 'border-l-red-600'}
            `}>
              <div className="absolute top-0 right-0 p-1 opacity-20">
                <div className="w-4 h-4 border-t border-r border-[#333]" />
              </div>
              <div className="p-4 bg-[#0a0a0a] border border-[#222] relative">
                <Shield className={`w-10 h-10 ${hermesStatus?.healthy ? 'text-white' : 'text-red-600'} transition-colors duration-1000`} />
                {hermesStatus?.healthy && <div className="absolute inset-0 bg-[hsl(var(--neon-cyan))] opacity-10 blur-xl animate-pulse" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#444]">SECURITY_GATE</span>
                <span className="text-2xl font-black text-white tracking-[0.2em] mt-1">
                  {hermesStatus ? (hermesStatus.healthy ? 'VERIFIED' : 'BREACH') : 'SYNCING'}
                </span>
              </div>
            </div>
          </div>

          {/* Industrial Legend - Server Rack Style */}
          <div className="absolute bottom-12 left-12 bg-[#050505] border-2 border-[#1a1a1a] p-10 shadow-2xl">
            <div className="text-[12px] font-black text-white tracking-[0.6em] uppercase mb-8 border-b-2 border-[#111] pb-6 flex items-center gap-5">
              <Boxes className="w-5 h-5 text-[#555]" />
              MANIFEST_V4.2
            </div>
            <div className="space-y-6">
              <LegendItem color="#ffffff" label="PRIORITY_ASSET" />
              <LegendItem color="#333333" label="STANDBY_BUFFER" />
              <LegendItem color="hsl(var(--neon-cyan))" label="TRANSFER_FLOW" />
              <LegendItem color="#cc0000" label="HARDWARE_FAULT" />
              <div className="h-px bg-[#111] my-8" />
              <div className="flex items-center gap-6 group">
                <div className="w-10 h-1 bg-[#1a1a1a] border border-[#333] group-hover:border-[hsl(var(--neon-cyan)/0.5)] transition-colors" />
                <span className="text-[10px] font-black text-[#444] group-hover:text-white uppercase tracking-[0.4em] transition-colors">STEEL_CONDUIT</span>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-10 h-0.5 bg-[hsl(var(--neon-cyan))] shadow-[0_0_10px_hsl(var(--neon-cyan))] group-hover:shadow-[0_0_20px_hsl(var(--neon-cyan))]" />
                <span className="text-[10px] font-black text-[#444] group-hover:text-white uppercase tracking-[0.4em] transition-colors">ELECTRIC_ACCENT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Heavy Data Feed */}
        <AnimatePresence>
          {showDecisionLog && (
            <motion.div 
              initial={{ x: 450, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 450, opacity: 0 }}
              className="w-[450px] border-l-4 border-[#1a1a1a] bg-[#020202] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-[#1a1a1a] bg-[#050505] flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-3 h-3 bg-[hsl(var(--neon-cyan))] animate-flicker shadow-[0_0_10px_hsl(var(--neon-cyan))]" />
                  <h3 className="text-[13px] font-black text-white tracking-[0.7em] uppercase">
                    DATA_BUS_01
                  </h3>
                </div>
                <div className="px-2 py-0.5 border border-[#333] text-[9px] text-[#555] font-black uppercase tracking-widest">
                  PORT_8080
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[hsl(var(--neon-cyan))] via-[hsl(var(--neon-cyan)/0.3)] to-transparent opacity-40" />
                <AIDecisionLog 
                  decisions={recentDecisions} 
                  operators={operators}
                  maxItems={18}
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
      <footer className="relative z-20 h-16 border-t-4 border-[#1a1a1a] bg-[#050505] flex items-center justify-between px-12">
        <div className="flex gap-12 text-[10px] font-black tracking-[0.6em] text-[#333] uppercase items-center">
          <span className="flex items-center gap-4 hover:text-[#555] transition-colors"><Drill className="w-4 h-4" /> HEAVY_UNIT_PROC</span>
          <span className="text-white flex items-center gap-4 bg-[#0a0a0a] px-4 py-1.5 border border-[#1a1a1a]">
            <div className="w-2 h-2 bg-[hsl(var(--neon-green))] shadow-[0_0_8px_hsl(var(--neon-green))]" /> 
            CORE_GRID_STABLE
          </span>
        </div>
        <div className="flex gap-12 text-[10px] font-black tracking-[0.6em] text-[#333] uppercase">
          <span className="hover:text-[#555] transition-colors">WAREHOUSE_SPEC_2.5</span>
          <span className="text-[#555]">EST_05.06.2026</span>
        </div>
      </footer>
    </div>
  );
}
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-5">
      <div className="w-3 h-3 border border-[#333]" style={{ backgroundColor: color }} />
      <span className="text-[10px] font-black text-[#666] uppercase tracking-[0.3em]">{label}</span>
    </div>
  );
}
