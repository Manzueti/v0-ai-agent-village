'use client';

import { useState } from 'react';
import { operators, zones, recentDecisions, systemHealth, nodes } from '@/lib/infrastructure-data';
import { detectAnomalies } from '@/lib/ai-operators';
import GrokChat from '@/components/ai/GrokChat';
import AIDecisionLog from '@/components/infrastructure/AIDecisionLog';
import { Bot, Activity, AlertTriangle, CheckCircle, Zap, Shield, Play, Pause, Settings, TrendingUp } from 'lucide-react';

export default function AIControlPage() {
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const anomalies = detectAnomalies(nodes);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-emerald-500';
      case 'paused': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getZoneColor = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone?.color || '#64748b';
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Control Center</h1>
              <p className="text-xs text-slate-400">Manage AI Operators and view system intelligence</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white font-mono">{systemHealth.overall}%</span>
              <span className="text-xs text-slate-500">Health</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white font-mono">{operators.filter(o => o.status === 'running').length}/{operators.length}</span>
              <span className="text-xs text-slate-500">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${anomalies.length > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className="text-sm text-white font-mono">{anomalies.length}</span>
              <span className="text-xs text-slate-500">Anomalies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Operators */}
        <div className="w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-400" />
              AI Operators
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {operators.map((operator) => (
              <button
                key={operator.id}
                onClick={() => setSelectedOperator(operator.id === selectedOperator ? null : operator.id)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  selectedOperator === operator.id
                    ? 'bg-slate-800 border border-cyan-500/50'
                    : 'bg-slate-800/50 hover:bg-slate-800 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl flex-shrink-0">
                    {operator.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{operator.name}</span>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(operator.status)}`} />
                    </div>
                    <div className="text-xs text-slate-400 truncate">{operator.role}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: getZoneColor(operator.assignedZone) }}
                      />
                      <span className="text-[10px] text-slate-500 capitalize">
                        {operator.assignedZone.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedOperator === operator.id && (
                  <div className="mt-3 pt-3 border-t border-slate-700 space-y-3">
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-900/50 rounded p-2">
                        <div className="text-[10px] text-slate-500">Tokens Used</div>
                        <div className="text-xs font-mono text-white">
                          {(operator.tokenUsage.used / 1000).toFixed(0)}k / {(operator.tokenUsage.limit / 1000).toFixed(0)}k
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2">
                        <div className="text-[10px] text-slate-500">Success Rate</div>
                        <div className="text-xs font-mono text-emerald-400">{operator.successRate}%</div>
                      </div>
                    </div>

                    {/* Last Decision */}
                    {operator.lastDecision && (
                      <div className="bg-slate-900/50 rounded p-2">
                        <div className="text-[10px] text-slate-500 mb-1">Last Decision</div>
                        <div className="text-xs text-cyan-400 font-semibold uppercase">
                          {operator.lastDecision.action}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                          {operator.lastDecision.reasoning}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white transition-colors">
                        {operator.status === 'running' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        {operator.status === 'running' ? 'Pause' : 'Resume'}
                      </button>
                      <button className="flex items-center justify-center p-1.5 bg-slate-700 hover:bg-slate-600 rounded transition-colors">
                        <Settings className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Center Panel - Chat */}
        <div className="flex-1 flex flex-col">
          <GrokChat className="flex-1" />
        </div>

        {/* Right Panel - Logs & Anomalies */}
        <div className="w-96 border-l border-slate-800 bg-slate-900/50 flex flex-col">
          {/* Anomalies */}
          {anomalies.length > 0 && (
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Active Anomalies
              </h3>
              <div className="space-y-2">
                {anomalies.slice(0, 3).map((anomaly) => (
                  <div 
                    key={anomaly.nodeId}
                    className={`p-2 rounded-lg border ${
                      anomaly.severity === 'high' 
                        ? 'bg-red-500/10 border-red-500/30' 
                        : anomaly.severity === 'medium'
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-slate-800/50 border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white">{anomaly.nodeName}</span>
                      <span className={`text-[10px] uppercase font-bold ${
                        anomaly.severity === 'high' ? 'text-red-400' :
                        anomaly.severity === 'medium' ? 'text-amber-400' : 'text-slate-400'
                      }`}>
                        {anomaly.severity}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {anomaly.anomalies.join(' | ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Health Overview */}
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Zone Health
            </h3>
            <div className="space-y-2">
              {zones.map((zone) => (
                <div key={zone.id} className="flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: zone.color }}
                  />
                  <span className="text-xs text-slate-400 flex-1">{zone.name}</span>
                  <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        zone.health === 100 ? 'bg-emerald-500' :
                        zone.health >= 90 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${zone.health}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-white w-8 text-right">{zone.health}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Log */}
          <div className="flex-1 overflow-hidden">
            <AIDecisionLog 
              decisions={recentDecisions} 
              operators={operators}
              maxItems={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
