'use client';

import { useState } from 'react';
import { InfraNode, AIOperator, NodeConnection } from '@/lib/types';
import { X, Server, Database, Shield, Activity, GitBranch, RefreshCw, AlertTriangle, Play, Pause, Zap } from 'lucide-react';

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

  const statusColors: Record<string, string> = {
    healthy: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-red-500',
    offline: 'bg-gray-500',
    failover: 'bg-blue-500',
  };

  const getMetricColor = (value: number) => {
    if (value < 50) return 'bg-emerald-500';
    if (value < 75) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${statusColors[node.status]}`} />
          <div>
            <h2 className="text-lg font-bold text-white">{node.name}</h2>
            <p className="text-xs text-slate-400 capitalize">{node.type.replace('-', ' ')}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        {(['metrics', 'redundancy', 'ai'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'metrics' && 'Metrics'}
            {tab === 'redundancy' && 'Redundancy'}
            {tab === 'ai' && 'AI Control'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-white">Status</span>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  node.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' :
                  node.status === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                  node.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {node.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Activity className="w-3 h-3" />
                <span>Uptime: {node.metrics.uptime}%</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Performance Metrics</h3>
              
              {[
                { label: 'CPU Usage', value: node.metrics.cpu },
                { label: 'Memory', value: node.metrics.memory },
                { label: 'Network', value: node.metrics.network },
              ].map(metric => (
                <div key={metric.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{metric.label}</span>
                    <span className="text-xs font-mono text-white">{metric.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getMetricColor(metric.value)} transition-all duration-500`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Latency */}
              <div className="flex items-center justify-between py-3 border-t border-slate-800">
                <span className="text-xs text-slate-400">Latency</span>
                <span className="text-sm font-mono text-white">{node.metrics.latency}ms</span>
              </div>
            </div>

            {/* Connections */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Active Connections</h3>
              <div className="space-y-2">
                {connections.slice(0, 5).map(conn => (
                  <div 
                    key={conn.id}
                    className="flex items-center justify-between p-2 bg-slate-800/50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        conn.status === 'active' ? 'bg-emerald-400' :
                        conn.status === 'degraded' ? 'bg-amber-400' : 'bg-red-400'
                      }`} />
                      <span className="text-xs text-slate-300">
                        {conn.from === node.id ? conn.to : conn.from}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase text-slate-500">{conn.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'redundancy' && (
          <div className="space-y-6">
            {/* Primary/Replica Status */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-white">Role</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  node.isPrimary 
                    ? 'bg-amber-500/20 text-amber-400' 
                    : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {node.isPrimary ? 'PRIMARY' : 'REPLICA'}
                </span>
              </div>
              {node.lastSync && (
                <div className="text-xs text-slate-400">
                  Last sync: {new Date(node.lastSync).toLocaleString()}
                </div>
              )}
            </div>

            {/* Paired Node */}
            {replicaNode && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white">
                  {node.isPrimary ? 'Replica Node' : 'Primary Node'}
                </h3>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusColors[replicaNode.status]}`} />
                      <span className="text-sm text-white">{replicaNode.name}</span>
                    </div>
                    <span className={`text-xs capitalize ${
                      replicaNode.status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {replicaNode.status}
                    </span>
                  </div>
                  
                  {/* Sync Status */}
                  <div className="flex items-center gap-2 mb-3">
                    <RefreshCw className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400">In Sync</span>
                  </div>
                  
                  {/* Mini Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-slate-500">CPU</div>
                      <div className="font-mono text-white">{replicaNode.metrics.cpu}%</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2">
                      <div className="text-slate-500">Memory</div>
                      <div className="font-mono text-white">{replicaNode.metrics.memory}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Failover Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Failover Controls</h3>
              <div className="space-y-2">
                <button
                  onClick={() => onFailover?.(node.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <GitBranch className="w-4 h-4" />
                  <span className="text-sm font-medium">Manual Failover</span>
                </button>
                <button
                  onClick={() => onSimulateFailure?.(node.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors border border-amber-500/30"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Simulate Failure</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && operator && (
          <div className="space-y-6">
            {/* AI Operator Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl">
                  {operator.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{operator.name}</h3>
                  <p className="text-xs text-slate-400">{operator.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${
                  operator.status === 'running' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                }`} />
                <span className="text-xs text-slate-400 capitalize">{operator.status}</span>
                <span className="text-xs text-slate-600">|</span>
                <span className="text-xs text-cyan-400 font-mono">{operator.aiModel}</span>
              </div>
              
              <p className="text-xs text-slate-500 leading-relaxed">
                {operator.systemPrompt.slice(0, 150)}...
              </p>
            </div>

            {/* Last Decision */}
            {operator.lastDecision && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white">Last Decision</h3>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-cyan-400 uppercase">
                      {operator.lastDecision.action}
                    </span>
                    <span className={`text-xs ${
                      operator.lastDecision.outcome === 'success' ? 'text-emerald-400' :
                      operator.lastDecision.outcome === 'pending' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {operator.lastDecision.outcome}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {operator.lastDecision.reasoning}
                  </p>
                  <div className="mt-2 text-[10px] text-slate-600">
                    {new Date(operator.lastDecision.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* AI Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">AI Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center gap-1 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-300">Run Analysis</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-300">Auto-Heal</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-slate-300">Check Security</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4 text-violet-400" />
                  <span className="text-xs text-slate-300">Restart Node</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
