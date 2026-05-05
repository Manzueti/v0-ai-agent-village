'use client';

import { useState } from 'react';
import { InfraNode, AIOperator, NodeConnection } from '@/lib/types';
import { X, Server, Database, Shield, Activity, GitBranch, RefreshCw, AlertTriangle, Play, Pause, Zap, Terminal, Power } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NodeDetailPanelProps {
  node: InfraNode;
  replicaNode?: InfraNode;
  operator?: AIOperator;
  connections: NodeConnection[];
  onClose: () => void;
  onFailover?: (nodeId: string) => void;
  onSimulateFailure?: (nodeId: string) => void;
}

export default function NodeDetailPanel({
  node,
  replicaNode,
  operator,
  connections,
  onClose,
  onFailover,
  onSimulateFailure,
}: NodeDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'metrics' | 'redundancy' | 'ai'>('metrics');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-[hsl(var(--neon-green))]';
      case 'warning': return 'text-[hsl(var(--neon-yellow))]';
      case 'critical': return 'text-[hsl(var(--neon-magenta))]';
      case 'failover': return 'text-[hsl(var(--neon-purple))]';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-[hsl(var(--neon-green))]';
      case 'warning': return 'bg-[hsl(var(--neon-yellow))]';
      case 'critical': return 'bg-[hsl(var(--neon-magenta))]';
      case 'failover': return 'bg-[hsl(var(--neon-purple))]';
      default: return 'bg-slate-500';
    }
  };

  const getMetricColor = (value: number) => {
    if (value < 50) return 'bg-[hsl(var(--neon-green))] shadow-[0_0_8px_hsl(var(--neon-green))]';
    if (value < 75) return 'bg-[hsl(var(--neon-yellow))] shadow-[0_0_8px_hsl(var(--neon-yellow))]';
    return 'bg-[hsl(var(--neon-magenta))] shadow-[0_0_8px_hsl(var(--neon-magenta))]';
  };

  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-[hsl(var(--sidebar-background)/0.98)] backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-50 flex flex-col scanlines overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-8 border-b border-white/5 bg-[hsl(var(--background)/0.5)] relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-10 pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className={`w-3 h-3 rounded-full ${getStatusBg(node.status)} ${node.status === 'healthy' ? 'pulse-dot shadow-[0_0_8px_currentColor]' : ''}`} style={{ color: getStatusBg(node.status).replace('bg-', '') }} />
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none mb-2">{node.name}</h2>
            <p className="text-[10px] font-black text-[hsl(var(--neon-cyan))] tracking-[0.3em] uppercase">{node.type.replace('-', '_')}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 hover:bg-white/5 rounded transition-colors group relative z-10"
        >
          <X className="w-8 h-8 text-muted-foreground group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-[hsl(var(--background)/0.3)] border-b border-white/5 p-4 gap-3">
        {(['metrics', 'redundancy', 'ai'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-[10px] font-black tracking-[0.25em] uppercase transition-all border rounded
              ${activeTab === tab
                ? 'bg-[hsl(var(--neon-cyan)/0.15)] text-[hsl(var(--neon-cyan))] border-[hsl(var(--neon-cyan)/0.4)] shadow-[0_0_15px_hsl(var(--neon-cyan)/0.2)]'
                : 'text-muted-foreground border-transparent hover:border-white/10 hover:bg-white/5'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 scrollbar-hide">
        {activeTab === 'metrics' && (
          <div className="space-y-8">
            {/* Status Card */}
            <div className="bg-[hsl(var(--card)/0.4)] rounded-md border border-white/5 p-6 panel-glow-cyan relative overflow-hidden">
              <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase">Protocol_Status</span>
                <span className={`px-3 py-1 rounded-sm border text-[9px] font-black uppercase tracking-widest ${
                  node.status === 'healthy' ? 'bg-[hsl(var(--neon-green)/0.1)] border-[hsl(var(--neon-green)/0.4)] text-[hsl(var(--neon-green))]' :
                  node.status === 'warning' ? 'bg-[hsl(var(--neon-yellow)/0.1)] border-[hsl(var(--neon-yellow)/0.4)] text-[hsl(var(--neon-yellow))]' :
                  node.status === 'critical' ? 'bg-[hsl(var(--neon-magenta)/0.1)] border-[hsl(var(--neon-magenta)/0.4)] text-[hsl(var(--neon-magenta))]' :
                  'bg-white/5 border-white/10 text-muted-foreground'
                }`}>
                  {node.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-white tracking-[0.2em] uppercase">
                <Activity className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                <span>Uptime: <span className="tabular-nums">{node.metrics.uptime}%</span></span>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-3">
                <Terminal className="w-4 h-4 text-[hsl(var(--neon-purple))]" /> Neural Load Metrics
              </h3>
              
              <div className="space-y-5">
                {[
                  { label: 'CPU_EXECUTION', value: node.metrics.cpu },
                  { label: 'MEMORY_BUFFER', value: node.metrics.memory },
                  { label: 'NETWORK_BANDWIDTH', value: node.metrics.network },
                ].map(metric => (
                  <div key={metric.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{metric.label}</span>
                      <span className="text-[10px] font-black text-white tabular-nums">{metric.value}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        className={`h-full ${getMetricColor(metric.value)} transition-all duration-1000`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between py-4 border-t border-white/5 mt-4">
                <span className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase">Latency_Delay</span>
                <span className="text-xl font-black text-[hsl(var(--neon-cyan))] tabular-nums text-glow">{node.metrics.latency}ms</span>
              </div>
            </div>

            {/* Connections */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-3">
                <GitBranch className="w-4 h-4 text-[hsl(var(--neon-green))]" /> Active Neural Streams
              </h3>
              <div className="space-y-2">
                {connections.slice(0, 5).map(conn => (
                  <div 
                    key={conn.id}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-md hover:border-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        conn.status === 'active' ? 'bg-[hsl(var(--neon-green))] shadow-[0_0_8px_hsl(var(--neon-green))]' :
                        conn.status === 'degraded' ? 'bg-[hsl(var(--neon-yellow))] shadow-[0_0_8px_hsl(var(--neon-yellow))]' : 'bg-[hsl(var(--neon-magenta))]'
                      }`} />
                      <span className="text-[11px] font-black text-white tracking-tight uppercase group-hover:text-[hsl(var(--neon-cyan))] transition-colors">
                        {conn.from === node.id ? conn.to : conn.from}
                      </span>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">{conn.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'redundancy' && (
          <div className="space-y-8">
            {/* Role Card */}
            <div className="bg-[hsl(var(--card)/0.4)] rounded-md border border-white/5 p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase">Node_Architecture_Role</span>
                <span className={`px-3 py-1 rounded-sm border text-[9px] font-black tracking-widest ${
                  node.isPrimary 
                    ? 'bg-[hsl(var(--neon-yellow)/0.1)] border-[hsl(var(--neon-yellow)/0.4)] text-[hsl(var(--neon-yellow))]' 
                    : 'bg-white/5 border-white/10 text-muted-foreground'
                }`}>
                  {node.isPrimary ? 'PRIMARY_NODE' : 'REPLICA_INSTANCE'}
                </span>
              </div>
              {node.lastSync && (
                <div className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-3">
                  <RefreshCw className="w-3 h-3" />
                  Last_Sync: {new Date(node.lastSync).toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Paired Node */}
            {replicaNode && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase">
                  {node.isPrimary ? 'Replica_Mirror_Instance' : 'Primary_Upstream_Node'}
                </h3>
                <div className="bg-white/5 border border-white/5 rounded-md p-6 panel-glow-purple">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${getStatusBg(replicaNode.status)} shadow-[0_0_8px_currentColor]`} style={{ color: getStatusBg(replicaNode.status).replace('bg-', '') }} />
                      <span className="text-sm font-black text-white tracking-tight uppercase">{replicaNode.name}</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      replicaNode.status === 'healthy' ? 'text-[hsl(var(--neon-green))]' : 'text-[hsl(var(--neon-yellow))]'
                    }`}>
                      {replicaNode.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6 bg-[hsl(var(--neon-green)/0.05)] p-2 rounded border border-[hsl(var(--neon-green)/0.2)]">
                    <RefreshCw className="w-3.5 h-3.5 text-[hsl(var(--neon-green))] animate-spin-slow" />
                    <span className="text-[9px] font-black text-[hsl(var(--neon-green))] uppercase tracking-[0.2em]">Neural_Sync: ACTIVE</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[hsl(var(--background)/0.5)] rounded p-4 border border-white/5">
                      <div className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] mb-1">Mirror_CPU</div>
                      <div className="text-sm font-black text-white tabular-nums">{replicaNode.metrics.cpu}%</div>
                    </div>
                    <div className="bg-[hsl(var(--background)/0.5)] rounded p-4 border border-white/5">
                      <div className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] mb-1">Mirror_MEM</div>
                      <div className="text-sm font-black text-white tabular-nums">{replicaNode.metrics.memory}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Failover Actions */}
            <div className="space-y-4 pt-4">
              <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase">Redundancy Control Operations</h3>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => onFailover?.(node.id)}
                  className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-[hsl(var(--neon-purple))] hover:bg-[hsl(var(--neon-purple)/0.9)] text-background rounded-md font-black tracking-[0.4em] uppercase text-xs transition-all shadow-[0_0_20px_hsl(var(--neon-purple)/0.3)] transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <GitBranch className="w-4 h-4" />
                  MANUAL_FAILOVER
                </button>
                <button
                  onClick={() => onSimulateFailure?.(node.id)}
                  className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-transparent hover:bg-[hsl(var(--neon-magenta)/0.1)] text-[hsl(var(--neon-magenta))] border border-[hsl(var(--neon-magenta)/0.4)] rounded-md font-black tracking-[0.4em] uppercase text-xs transition-all"
                >
                  <AlertTriangle className="w-4 h-4" />
                  SIMULATE_FAILURE
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && operator && (
          <div className="space-y-8">
            {/* AI Operator Card */}
            <div className="bg-gradient-to-br from-[hsl(var(--card)/0.6)] to-[hsl(var(--background)/0.8)] rounded-md p-6 border border-white/5 panel-glow-cyan relative overflow-hidden scanlines">
              <div className="flex items-center gap-5 mb-6 relative z-10">
                <div className="w-16 h-16 rounded bg-[hsl(var(--background))] border border-white/10 flex items-center justify-center text-4xl shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
                  {operator.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight uppercase leading-none mb-2">{operator.name}</h3>
                  <div className="text-[10px] font-black text-[hsl(var(--neon-cyan))] tracking-[0.3em] uppercase">{operator.role}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded border border-white/5">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    operator.status === 'running' ? 'bg-[hsl(var(--neon-green))] pulse-dot shadow-[0_0_8px_currentColor]' : 'bg-white/20'
                  }`} />
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">{operator.status}</span>
                </div>
                <span className="text-white/10">|</span>
                <span className="text-[9px] font-black text-[hsl(var(--neon-cyan))] uppercase tracking-[0.3em]">{operator.aiModel}</span>
              </div>
              
              <div className="bg-[hsl(var(--background)/0.6)] p-4 rounded border border-white/5 relative z-10">
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed font-mono italic opacity-70">
                  "{operator.systemPrompt.slice(0, 120)}..."
                </p>
              </div>
            </div>

            {/* Last Decision */}
            {operator.lastDecision && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase">Latest Neural Protocol</h3>
                <div className="bg-white/5 border border-white/5 rounded-md p-6 panel-glow-purple scanlines">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-[hsl(var(--neon-cyan))] uppercase tracking-[0.3em]">
                      {operator.lastDecision.action}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      operator.lastDecision.outcome === 'success' ? 'text-[hsl(var(--neon-green))]' :
                      operator.lastDecision.outcome === 'pending' ? 'text-[hsl(var(--neon-yellow))]' : 'text-[hsl(var(--neon-magenta))]'
                    }`}>
                      {operator.lastDecision.outcome}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-300 leading-relaxed italic">
                    "{operator.lastDecision.reasoning}"
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/5 text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] flex justify-between">
                    <span>Neural_Timestamp</span>
                    <span className="tabular-nums">{new Date(operator.lastDecision.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Actions */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-3">
                <Zap className="w-4 h-4 text-[hsl(var(--neon-yellow))]" /> AI Directive Execution
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <DirectiveButton icon={Play} label="Analysis" color="green" />
                <DirectiveButton icon={Zap} label="Heal" color="yellow" />
                <DirectiveButton icon={Shield} label="Security" color="cyan" />
                <DirectiveButton icon={RefreshCw} label="Restart" color="purple" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-8 border-t border-white/5 bg-[hsl(var(--background)/0.5)]">
        <button className="w-full py-5 bg-[hsl(var(--neon-cyan))] hover:bg-[hsl(var(--neon-cyan)/0.9)] rounded font-black text-background text-[11px] tracking-[0.4em] uppercase transition-all shadow-[0_0_25px_hsl(var(--neon-cyan)/0.4)] transform hover:scale-[1.02] active:scale-[0.98]">
          Node_Admin_Console
        </button>
      </div>
    </div>
  );
}

function DirectiveButton({ icon: Icon, label, color }: any) {
  const colors: any = {
    green: 'text-[hsl(var(--neon-green))]',
    yellow: 'text-[hsl(var(--neon-yellow))]',
    cyan: 'text-[hsl(var(--neon-cyan))]',
    purple: 'text-[hsl(var(--neon-purple))]',
  };
  return (
    <button className="flex flex-col items-center gap-3 p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-all group">
      <Icon className={`w-5 h-5 ${colors[color]} group-hover:scale-110 transition-transform`} />
      <span className="text-[9px] font-black text-muted-foreground group-hover:text-white uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}
