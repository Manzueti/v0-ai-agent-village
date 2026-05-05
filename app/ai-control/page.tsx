'use client';

import { useState } from 'react';
import { operators, zones, recentDecisions, systemHealth, nodes } from '@/lib/infrastructure-data';
import { detectAnomalies } from '@/lib/ai-operators';
import HermesChat from '@/components/ai/HermesChat';
import AIDecisionLog from '@/components/infrastructure/AIDecisionLog';
import { Bot, Activity, AlertTriangle, CheckCircle, Zap, Shield, Play, Pause, Settings, TrendingUp, Brain, Factory, Cpu, Radio, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIControlPage() {
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const anomalies = detectAnomalies(nodes);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-[hsl(var(--neon-green))]';
      case 'paused': return 'text-[hsl(var(--neon-yellow))]';
      case 'error': return 'text-[hsl(var(--neon-magenta))]';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'running': return 'bg-[hsl(var(--neon-green))]';
      case 'paused': return 'bg-[hsl(var(--neon-yellow))]';
      case 'error': return 'bg-[hsl(var(--neon-magenta))]';
      default: return 'bg-slate-500';
    }
  };

  const getZoneColor = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone?.color || 'hsl(var(--neon-cyan))';
  };

  return (
    <div className="h-screen flex flex-col bg-transparent relative overflow-hidden scanlines">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-20 border-b border-white/5 bg-[hsl(var(--background)/0.8)] backdrop-blur-xl px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] grid place-items-center shadow-[0_0_15px_hsl(var(--neon-cyan)/0.4)]">
              <Brain className="w-5 h-5 text-background" />
            </div>
            <div>
              <span className="text-white font-black tracking-[0.2em] uppercase text-sm block leading-none">AI Control Center</span>
              <span className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase font-bold">VYBECORP Neural Oversight</span>
            </div>
          </div>
          <div className="h-6 w-px bg-white/5" />
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[hsl(var(--neon-green))]" />
              <span className="text-[10px] font-black text-white tabular-nums tracking-widest">{systemHealth.overall}% HEALTH</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
              <span className="text-[10px] font-black text-white tabular-nums tracking-widest">{operators.filter(o => o.status === 'running').length}/{operators.length} ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${anomalies.length > 0 ? 'text-[hsl(var(--neon-magenta))]' : 'text-muted-foreground/30'}`} />
              <span className="text-[10px] font-black text-white tabular-nums tracking-widest">{anomalies.length} ANOMALIES</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-1.5 bg-[hsl(var(--neon-purple)/0.05)] border border-[hsl(var(--neon-purple)/0.2)] rounded-md">
          <span className="text-[hsl(var(--neon-purple))] font-black text-[9px] tracking-[0.2em] uppercase">LINK_STATUS: </span>
          <span className="text-white font-black text-[10px] tabular-nums tracking-widest">SECURE_TUNNEL</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Panel - Operators */}
        <div className="w-80 border-r border-white/5 bg-[hsl(var(--card)/0.4)] backdrop-blur-xl flex flex-col scanlines">
          <div className="p-4 border-b border-white/5 bg-[hsl(var(--background)/0.5)]">
            <h2 className="text-[10px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-3">
              <Shield className="w-4 h-4 text-[hsl(var(--neon-purple))]" />
              Neural Operators
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar scrollbar-hide">
            {operators.map((operator) => (
              <button
                key={operator.id}
                onClick={() => setSelectedOperator(operator.id === selectedOperator ? null : operator.id)}
                className={`w-full p-4 rounded-md text-left transition-all border group ${
                  selectedOperator === operator.id
                    ? 'bg-[hsl(var(--neon-cyan)/0.1)] border-[hsl(var(--neon-cyan)/0.4)] panel-glow-cyan shadow-lg'
                    : 'bg-white/5 border-transparent hover:border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded bg-[hsl(var(--background))] border border-white/10 flex items-center justify-center text-2xl flex-shrink-0 group-hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all ${selectedOperator === operator.id ? 'panel-glow-cyan' : ''}`}>
                    {operator.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-black text-white tracking-tight leading-none">{operator.name.toUpperCase()}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${getStatusBg(operator.status)} ${operator.status === 'running' ? 'pulse-dot' : 'opacity-40'}`} />
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">{operator.role}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <div 
                        className="w-2 h-2 rounded-sm shadow-[0_0_5px_currentColor]"
                        style={{ backgroundColor: getZoneColor(operator.assignedZone), color: getZoneColor(operator.assignedZone) }}
                      />
                      <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                        {operator.assignedZone.replace('-', '_')}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedOperator === operator.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 pt-4 border-t border-white/10 space-y-4"
                  >
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[hsl(var(--background)/0.5)] rounded p-3 border border-white/5">
                        <div className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-1">Usage</div>
                        <div className="text-[11px] font-black text-white tabular-nums tracking-widest">
                          {(operator.tokenUsage.used / 1000).toFixed(1)}K Units
                        </div>
                      </div>
                      <div className="bg-[hsl(var(--background)/0.5)] rounded p-3 border border-white/5">
                        <div className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-1">Success</div>
                        <div className="text-[11px] font-black text-[hsl(var(--neon-green))] tabular-nums tracking-widest">{operator.successRate}%</div>
                      </div>
                    </div>

                    {/* Last Decision */}
                    {operator.lastDecision && (
                      <div className="bg-[hsl(var(--background)/0.5)] rounded p-3 border border-white/5">
                        <div className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-2 border-b border-white/5 pb-1">Last Protocol</div>
                        <div className="text-[10px] text-[hsl(var(--neon-cyan))] font-black uppercase tracking-widest mb-1">
                          {operator.lastDecision.action}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">
                          "{operator.lastDecision.reasoning}"
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[hsl(var(--background))] hover:bg-white/5 border border-white/10 rounded font-black text-[9px] text-white tracking-[0.3em] uppercase transition-all">
                        {operator.status === 'running' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        {operator.status === 'running' ? 'Suspend' : 'Resume'}
                      </button>
                      <button className="flex items-center justify-center p-2 bg-[hsl(var(--background))] hover:bg-white/5 border border-white/10 rounded transition-all">
                        <Settings className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Center Panel - Chat */}
        <div className="flex-1 flex flex-col bg-transparent">
          <HermesChat className="flex-1" />
        </div>

        {/* Right Panel - Logs & Anomalies */}
        <div className="w-96 border-l border-white/5 bg-[hsl(var(--card)/0.4)] backdrop-blur-xl flex flex-col scanlines">
          {/* Anomalies */}
          {anomalies.length > 0 && (
            <div className="p-6 border-b border-white/5">
              <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-3 mb-6">
                <AlertTriangle className="w-4 h-4 text-[hsl(var(--neon-yellow))]" />
                Active Anomalies
              </h3>
              <div className="space-y-3">
                {anomalies.slice(0, 3).map((anomaly) => (
                  <div 
                    key={anomaly.nodeId}
                    className={`p-4 rounded border scanlines ${
                      anomaly.severity === 'high' 
                        ? 'bg-[hsl(var(--neon-magenta)/0.05)] border-[hsl(var(--neon-magenta)/0.3)] panel-glow-magenta' 
                        : anomaly.severity === 'medium'
                          ? 'bg-[hsl(var(--neon-yellow)/0.05)] border-[hsl(var(--neon-yellow)/0.3)] panel-glow-yellow'
                          : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black text-white tracking-tight uppercase">{anomaly.nodeName}</span>
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                        anomaly.severity === 'high' ? 'text-[hsl(var(--neon-magenta))]' :
                        anomaly.severity === 'medium' ? 'text-[hsl(var(--neon-yellow))]' : 'text-muted-foreground'
                      }`}>
                        {anomaly.severity}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-current" />
                      {anomaly.anomalies.join(' // ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Health Overview */}
          <div className="p-6 border-b border-white/5">
            <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-3 mb-6">
              <TrendingUp className="w-4 h-4 text-[hsl(var(--neon-green))]" />
              Sector Health
            </h3>
            <div className="space-y-4">
              {zones.map((zone) => (
                <div key={zone.id} className="flex items-center gap-4">
                  <div 
                    className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: zone.color, color: zone.color }}
                  />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex-1">{zone.name.toUpperCase()}</span>
                  <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        zone.health === 100 ? 'bg-[hsl(var(--neon-green))] shadow-[0_0_8px_hsl(var(--neon-green))]' :
                        zone.health >= 90 ? 'bg-[hsl(var(--neon-cyan))] shadow-[0_0_8px_hsl(var(--neon-cyan))]' : 'bg-[hsl(var(--neon-magenta))] shadow-[0_0_8px_hsl(var(--neon-magenta))]'
                      }`}
                      style={{ width: `${zone.health}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-white tabular-nums w-10 text-right">{zone.health}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Log */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 bg-[hsl(var(--background)/0.5)]">
              <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                Protocol Execution
              </h3>
            </div>
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

      {/* Footer decoration */}
      <footer className="relative z-20 h-10 border-t border-white/5 bg-[hsl(var(--background)/0.8)] backdrop-blur-md flex items-center justify-between px-8">
        <div className="flex gap-8 text-[10px] font-bold tracking-[0.3em] text-muted-foreground/40 uppercase">
          <span>AI Control Infrastructure</span>
          <span className="text-[hsl(var(--neon-cyan))]">● NEURAL_NET_STABLE</span>
        </div>
        <div className="flex gap-8 text-[10px] font-bold tracking-[0.3em] text-muted-foreground/40 uppercase">
          <span>Cybernetic Oversight</span>
          <span>v2.5.0</span>
        </div>
      </footer>
    </div>
  );
}
