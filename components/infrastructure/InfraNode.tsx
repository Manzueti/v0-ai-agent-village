'use client';

import { InfraNode as InfraNodeType } from '@/lib/types';
import { Database, Server, Shield, Globe, Cloud, HardDrive, Router, Layers, Lock, Wifi, Activity } from 'lucide-react';

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

const statusConfig: Record<string, { color: string; glow: string; border: string }> = {
  healthy: {
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.5)',
    border: 'border-emerald-500/50',
  },
  warning: {
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.5)',
    border: 'border-amber-500/50',
  },
  critical: {
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.6)',
    border: 'border-red-500/50',
  },
  offline: {
    color: '#64748b',
    glow: 'rgba(100, 116, 139, 0.3)',
    border: 'border-slate-500/50',
  },
  failover: {
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.5)',
    border: 'border-blue-500/50',
  },
};

const zoneGradients: Record<string, { from: string; to: string }> = {
  'data-center': { from: '#3b82f6', to: '#1d4ed8' },
  'network': { from: '#8b5cf6', to: '#6d28d9' },
  'cloud': { from: '#06b6d4', to: '#0891b2' },
  'security': { from: '#ef4444', to: '#dc2626' },
  'edge': { from: '#22c55e', to: '#16a34a' },
};

export default function InfraNode({ node, isSelected, onClick, scale = 1 }: InfraNodeProps) {
  const Icon = nodeIcons[node.type] || Server;
  const status = statusConfig[node.status] || statusConfig.healthy;
  const zoneGradient = zoneGradients[node.zone] || { from: '#64748b', to: '#475569' };
  
  const nodeWidth = 80 * scale;
  const nodeHeight = 60 * scale;
  
  return (
    <div
      className="absolute cursor-pointer transition-all duration-300 group"
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: `scale(${isSelected ? 1.15 : 1})`,
        zIndex: isSelected ? 50 : 10,
      }}
      onClick={() => onClick?.(node)}
    >
      {/* Main holographic container */}
      <div 
        className="relative"
        style={{ width: nodeWidth, height: nodeHeight + 30 }}
      >
        {/* Glow effect underneath */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-md transition-all duration-300"
          style={{
            width: nodeWidth * 0.8,
            height: 12,
            backgroundColor: status.glow,
            opacity: isSelected ? 0.8 : 0.4,
          }}
        />
        
        {/* Holographic base platform */}
        <svg
          className="absolute"
          style={{ top: nodeHeight + 5, left: -5, width: nodeWidth + 10, height: 25 }}
          viewBox="0 0 100 30"
        >
          {/* Platform shadow */}
          <ellipse cx="50" cy="20" rx="40" ry="8" fill="rgba(0,0,0,0.3)" />
          {/* Platform */}
          <ellipse 
            cx="50" 
            cy="15" 
            rx="40" 
            ry="8" 
            fill={`url(#platform-${node.id})`}
            className={isSelected ? 'animate-glow' : ''}
          />
          <defs>
            <linearGradient id={`platform-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={zoneGradient.from} stopOpacity="0.3" />
              <stop offset="100%" stopColor={zoneGradient.to} stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Main node body */}
        <div
          className={`relative rounded-lg border backdrop-blur-sm transition-all duration-300 overflow-hidden ${status.border} ${
            isSelected ? 'shadow-lg' : ''
          } ${node.status === 'critical' ? 'animate-pulse' : ''}`}
          style={{
            width: nodeWidth,
            height: nodeHeight,
            background: `linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)`,
            boxShadow: isSelected ? `0 0 30px ${status.glow}, inset 0 0 20px rgba(6, 182, 212, 0.1)` : `0 0 10px ${status.glow}`,
          }}
        >
          {/* Scanline effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute w-full h-8 bg-gradient-to-b from-white/5 to-transparent animate-scan"
              style={{ animationDuration: '3s' }}
            />
          </div>
          
          {/* Top accent bar */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, ${zoneGradient.from}, ${zoneGradient.to})` }}
          />
          
          {/* Icon */}
          <div className="flex items-center justify-center h-full">
            <Icon 
              className="text-white/80 transition-all duration-300 group-hover:text-white group-hover:scale-110" 
              style={{ width: nodeWidth * 0.4, height: nodeWidth * 0.4 }}
            />
          </div>
          
          {/* Status LED */}
          <div className="absolute top-2 right-2">
            <div 
              className={`w-2.5 h-2.5 rounded-full ${node.status === 'warning' || node.status === 'critical' ? 'animate-pulse' : ''}`}
              style={{ 
                backgroundColor: status.color,
                boxShadow: `0 0 8px ${status.glow}`,
              }}
            />
          </div>
          
          {/* Primary/Replica badge */}
          <div 
            className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono ${
              node.isPrimary 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
            }`}
          >
            {node.isPrimary ? 'PRIMARY' : 'REPLICA'}
          </div>
          
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-cyan-500/30" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-cyan-500/30" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-cyan-500/30" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-cyan-500/30" />
        </div>
      </div>
      
      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 translate-y-2 group-hover:translate-y-0">
        <div className="glass-strong rounded-lg px-4 py-3 min-w-[180px] shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-white">{node.name}</div>
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: status.color }}
            />
          </div>
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-mono mb-3">
            {node.type.replace('-', ' ')}
          </div>
          
          {/* Metrics */}
          <div className="space-y-2">
            <MetricBar label="CPU" value={node.metrics.cpu} />
            <MetricBar label="MEM" value={node.metrics.memory} />
            <MetricBar label="NET" value={node.metrics.network} />
          </div>
          
          {/* Footer stats */}
          <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span className="text-muted-foreground">{node.metrics.latency}ms</span>
            </div>
            <div className="font-mono text-emerald-400">{node.metrics.uptime}% uptime</div>
          </div>
        </div>
        
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900/95" />
      </div>
    </div>
  );
}

function MetricBar({ label, value }: { label: string; value: number }) {
  const getColor = (v: number) => {
    if (v < 50) return { bg: 'bg-emerald-500', text: 'text-emerald-400' };
    if (v < 75) return { bg: 'bg-amber-500', text: 'text-amber-400' };
    return { bg: 'bg-red-500', text: 'text-red-400' };
  };
  
  const colors = getColor(value);
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] text-muted-foreground w-7 font-mono">{label}</span>
      <div className="flex-1 h-1 bg-slate-700/50 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors.bg} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-[9px] font-mono w-8 text-right ${colors.text}`}>{value}%</span>
    </div>
  );
}
