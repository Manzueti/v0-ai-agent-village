'use client';

import { useState, useEffect } from 'react';
import { InfraNode } from '@/lib/types';
import { getNodePair } from '@/lib/infrastructure-data';
import { checkSyncStatus, FailoverEvent } from '@/lib/failover-simulation';
import { ArrowRightLeft, CheckCircle, AlertTriangle, Clock, RefreshCw, GitBranch, Loader2 } from 'lucide-react';

interface RedundancyViewProps {
  nodeId: string;
  nodes: InfraNode[];
  onFailover?: (primaryId: string) => void;
  activeFailover?: FailoverEvent | null;
}

export default function RedundancyView({ 
  nodeId, 
  nodes, 
  onFailover,
  activeFailover 
}: RedundancyViewProps) {
  const [syncStatus, setSyncStatus] = useState<{
    inSync: boolean;
    lagSeconds: number;
    lastSync: string;
  } | null>(null);

  const nodePair = getNodePair(nodeId);
  
  useEffect(() => {
    if (nodePair) {
      const status = checkSyncStatus(nodePair.primary.id);
      setSyncStatus(status);
      
      // Refresh sync status periodically
      const interval = setInterval(() => {
        setSyncStatus(checkSyncStatus(nodePair.primary.id));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [nodeId]);

  if (!nodePair) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-4 text-center">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
        <p className="text-sm text-slate-400">No replica pair found for this node</p>
      </div>
    );
  }

  const { primary, replica } = nodePair;
  const statusColors: Record<string, string> = {
    healthy: 'border-emerald-500 bg-emerald-500/10',
    warning: 'border-amber-500 bg-amber-500/10',
    critical: 'border-red-500 bg-red-500/10',
    offline: 'border-gray-500 bg-gray-500/10',
    failover: 'border-blue-500 bg-blue-500/10',
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          Redundancy Pair
        </h3>
        {syncStatus && (
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
            syncStatus.inSync 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-amber-500/20 text-amber-400'
          }`}>
            {syncStatus.inSync ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <Clock className="w-3 h-3" />
            )}
            {syncStatus.inSync ? 'In Sync' : `${syncStatus.lagSeconds}s lag`}
          </div>
        )}
      </div>

      {/* Node Pair Visualization */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Primary Node */}
        <NodeCard 
          node={primary} 
          label="PRIMARY" 
          statusColors={statusColors}
          isActive={primary.status === 'healthy' || primary.status === 'warning'}
        />

        {/* Connection Arrow */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <ArrowRightLeft className={`w-6 h-6 ${
              syncStatus?.inSync ? 'text-emerald-400' : 'text-amber-400'
            }`} />
            {!syncStatus?.inSync && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            )}
          </div>
          <span className="text-[9px] text-slate-500 mt-1">SYNC</span>
        </div>

        {/* Replica Node */}
        <NodeCard 
          node={replica} 
          label="REPLICA" 
          statusColors={statusColors}
          isActive={replica.status === 'healthy'}
        />
      </div>

      {/* Active Failover Progress */}
      {activeFailover && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            <span className="text-sm font-medium text-blue-400">Failover in Progress</span>
          </div>
          <div className="space-y-1">
            {activeFailover.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                {step.status === 'completed' && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                {step.status === 'running' && <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />}
                {step.status === 'pending' && <div className="w-3 h-3 rounded-full border border-slate-600" />}
                {step.status === 'failed' && <AlertTriangle className="w-3 h-3 text-red-400" />}
                <span className={`text-xs ${
                  step.status === 'completed' ? 'text-slate-400' :
                  step.status === 'running' ? 'text-white' :
                  step.status === 'failed' ? 'text-red-400' : 'text-slate-600'
                }`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Failover Button */}
      {!activeFailover && (
        <button
          onClick={() => onFailover?.(primary.id)}
          disabled={replica.status !== 'healthy'}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">Initiate Failover</span>
        </button>
      )}

      {replica.status !== 'healthy' && !activeFailover && (
        <p className="mt-2 text-xs text-amber-400 text-center">
          Failover unavailable: Replica is not healthy
        </p>
      )}
    </div>
  );
}

function NodeCard({ 
  node, 
  label, 
  statusColors,
  isActive 
}: { 
  node: InfraNode; 
  label: string; 
  statusColors: Record<string, string>;
  isActive: boolean;
}) {
  return (
    <div className={`flex-1 p-3 rounded-lg border-2 ${statusColors[node.status]} transition-all ${
      isActive ? 'scale-100' : 'scale-95 opacity-70'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          label === 'PRIMARY' 
            ? 'bg-amber-500 text-amber-950' 
            : 'bg-slate-600 text-slate-200'
        }`}>
          {label}
        </span>
        <span className={`text-[10px] uppercase ${
          node.status === 'healthy' ? 'text-emerald-400' :
          node.status === 'warning' ? 'text-amber-400' :
          node.status === 'critical' ? 'text-red-400' : 'text-slate-400'
        }`}>
          {node.status}
        </span>
      </div>
      
      <div className="text-sm font-medium text-white truncate mb-2">
        {node.name}
      </div>
      
      {/* Mini Metrics */}
      <div className="grid grid-cols-2 gap-1 text-[10px]">
        <div>
          <span className="text-slate-500">CPU</span>
          <div className={`font-mono ${
            node.metrics.cpu > 80 ? 'text-red-400' :
            node.metrics.cpu > 60 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {node.metrics.cpu.toFixed(0)}%
          </div>
        </div>
        <div>
          <span className="text-slate-500">MEM</span>
          <div className={`font-mono ${
            node.metrics.memory > 85 ? 'text-red-400' :
            node.metrics.memory > 70 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {node.metrics.memory.toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}
