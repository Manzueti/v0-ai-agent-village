'use client';

import { InfraNode as InfraNodeType } from '@/lib/types';
import { Database, Server, Shield, Globe, Cloud, HardDrive, Router, Layers, Lock, Wifi } from 'lucide-react';

interface InfraNodeProps {
  node: InfraNodeType;
  isSelected?: boolean;
  onClick?: (node: InfraNodeType) => void;
  scale?: number;
}

const nodeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'server': Server,
  'database': Database,
  'firewall': Shield,
  'load-balancer': Layers,
  'vpn': Lock,
  'storage': HardDrive,
  'cdn': Globe,
  'api-gateway': Router,
  'cloud-service': Cloud,
  'container': Layers,
  'router': Router,
  'dns': Wifi,
};

const statusColors: Record<string, { bg: string; border: string; glow: string }> = {
  healthy: {
    bg: 'bg-emerald-500',
    border: 'border-emerald-400',
    glow: 'shadow-emerald-500/50',
  },
  warning: {
    bg: 'bg-amber-500',
    border: 'border-amber-400',
    glow: 'shadow-amber-500/50',
  },
  critical: {
    bg: 'bg-red-500',
    border: 'border-red-400',
    glow: 'shadow-red-500/50',
  },
  offline: {
    bg: 'bg-gray-500',
    border: 'border-gray-400',
    glow: 'shadow-gray-500/30',
  },
  failover: {
    bg: 'bg-blue-500',
    border: 'border-blue-400',
    glow: 'shadow-blue-500/50',
  },
};

const zoneColors: Record<string, string> = {
  'data-center': 'from-blue-600 to-blue-800',
  'network': 'from-violet-600 to-violet-800',
  'cloud': 'from-cyan-600 to-cyan-800',
  'security': 'from-red-600 to-red-800',
  'edge': 'from-emerald-600 to-emerald-800',
};

export default function InfraNode({ node, isSelected, onClick, scale = 1 }: InfraNodeProps) {
  const Icon = nodeIcons[node.type] || Server;
  const status = statusColors[node.status] || statusColors.healthy;
  const zoneGradient = zoneColors[node.zone] || 'from-gray-600 to-gray-800';
  
  const nodeSize = 70 * scale;
  const roofHeight = 20 * scale;
  
  return (
    <div
      className="absolute cursor-pointer transition-all duration-300 group"
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: `scale(${isSelected ? 1.1 : 1})`,
        zIndex: isSelected ? 50 : 10,
      }}
      onClick={() => onClick?.(node)}
    >
      {/* Isometric 3D Building */}
      <div className="relative" style={{ width: nodeSize, height: nodeSize + roofHeight }}>
        {/* Roof */}
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-br ${zoneGradient}`}
          style={{
            width: nodeSize * 0.9,
            height: roofHeight,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          }}
        />
        
        {/* Main Building Body */}
        <div
          className={`absolute bg-gradient-to-b from-slate-700 to-slate-900 border-2 ${status.border} rounded-sm flex items-center justify-center transition-all duration-300 ${isSelected ? `shadow-lg ${status.glow}` : ''} ${node.status === 'critical' ? 'animate-pulse' : ''}`}
          style={{
            top: roofHeight - 2,
            left: '50%',
            transform: 'translateX(-50%)',
            width: nodeSize * 0.85,
            height: nodeSize * 0.7,
          }}
        >
          <Icon className="text-white/90" style={{ width: nodeSize * 0.35, height: nodeSize * 0.35 }} />
          
          {/* Status LED */}
          <div 
            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${status.bg} ${node.status === 'warning' || node.status === 'critical' ? 'animate-pulse' : ''}`}
            style={{ boxShadow: `0 0 8px ${status.glow}` }}
          />
          
          {/* Primary/Replica Badge */}
          <div 
            className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${node.isPrimary ? 'bg-amber-500 text-amber-950' : 'bg-slate-500 text-slate-100'}`}
          >
            {node.isPrimary ? 'P' : 'R'}
          </div>
        </div>
        
        {/* 3D Side Effect (Left) */}
        <div
          className="absolute bg-slate-950/50"
          style={{
            top: roofHeight + nodeSize * 0.1,
            left: '50%',
            transform: 'translateX(-50%) translateX(-43%)',
            width: nodeSize * 0.12,
            height: nodeSize * 0.5,
            clipPath: 'polygon(100% 0, 100% 100%, 0 90%, 0 10%)',
          }}
        />
        
        {/* Shadow */}
        <div
          className="absolute bg-black/20 rounded-full blur-sm"
          style={{
            bottom: -5,
            left: '50%',
            transform: 'translateX(-50%)',
            width: nodeSize * 0.8,
            height: 8,
          }}
        />
      </div>
      
      {/* Hover Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2 min-w-[160px] shadow-xl">
          <div className="text-xs font-semibold text-white mb-1">{node.name}</div>
          <div className="text-[10px] text-slate-400 mb-2 capitalize">{node.type.replace('-', ' ')}</div>
          
          {/* Metrics */}
          <div className="space-y-1">
            <MetricBar label="CPU" value={node.metrics.cpu} />
            <MetricBar label="MEM" value={node.metrics.memory} />
            <MetricBar label="NET" value={node.metrics.network} />
          </div>
          
          <div className="mt-2 pt-2 border-t border-slate-700 flex items-center justify-between">
            <span className="text-[10px] text-slate-500">Latency</span>
            <span className="text-[10px] text-white font-mono">{node.metrics.latency}ms</span>
          </div>
        </div>
        
        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900/95" />
      </div>
    </div>
  );
}

function MetricBar({ label, value }: { label: string; value: number }) {
  const getColor = (v: number) => {
    if (v < 50) return 'bg-emerald-500';
    if (v < 75) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] text-slate-500 w-6">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor(value)} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[9px] text-white font-mono w-7 text-right">{value}%</span>
    </div>
  );
}
