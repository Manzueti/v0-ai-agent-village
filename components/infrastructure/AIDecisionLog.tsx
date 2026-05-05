'use client';

import { AIDecision, AIOperator } from '@/lib/types';
import { Bot, CheckCircle, Clock, XCircle, ArrowRight, RefreshCw, AlertTriangle, Shield, Zap, GitBranch, Terminal } from 'lucide-react';

interface AIDecisionLogProps {
  decisions: AIDecision[];
  operators: AIOperator[];
  maxItems?: number;
}

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  failover: GitBranch,
  scale: Zap,
  restart: RefreshCw,
  alert: AlertTriangle,
  heal: CheckCircle,
  reroute: ArrowRight,
};

const actionColors: Record<string, string> = {
  failover: 'text-[hsl(var(--neon-purple))] bg-[hsl(var(--neon-purple)/0.1)] border-[hsl(var(--neon-purple)/0.3)]',
  scale: 'text-[hsl(var(--neon-cyan))] bg-[hsl(var(--neon-cyan)/0.1)] border-[hsl(var(--neon-cyan)/0.3)]',
  restart: 'text-[hsl(var(--neon-yellow))] bg-[hsl(var(--neon-yellow)/0.1)] border-[hsl(var(--neon-yellow)/0.3)]',
  alert: 'text-[hsl(var(--neon-magenta))] bg-[hsl(var(--neon-magenta)/0.1)] border-[hsl(var(--neon-magenta)/0.3)]',
  heal: 'text-[hsl(var(--neon-green))] bg-[hsl(var(--neon-green)/0.1)] border-[hsl(var(--neon-green)/0.3)]',
  reroute: 'text-[hsl(var(--neon-cyan))] bg-[hsl(var(--neon-cyan)/0.1)] border-[hsl(var(--neon-cyan)/0.3)]',
};

const outcomeIcons: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  success: { icon: CheckCircle, color: 'text-[hsl(var(--neon-green))]' },
  pending: { icon: Clock, color: 'text-[hsl(var(--neon-yellow))]' },
  failed: { icon: XCircle, color: 'text-[hsl(var(--neon-magenta))]' },
};

export default function AIDecisionLog({ decisions, operators, maxItems = 10 }: AIDecisionLogProps) {
  const displayedDecisions = decisions.slice(0, maxItems);
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'JUST NOW';
    if (diffMins < 60) return `${diffMins}M AGO`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}H AGO`;
    return date.toLocaleDateString();
  };

  const getOperator = (operatorId: string) => {
    return operators.find(op => op.id === operatorId);
  };

  return (
    <div className="bg-[hsl(var(--card)/0.4)] backdrop-blur-md rounded border border-white/5 overflow-hidden flex flex-col h-full scanlines">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[hsl(var(--background)/0.5)]">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
          <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase">Decision Log</span>
        </div>
        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{decisions.length} TOTAL_EVENTS</span>
      </div>
      
      {/* Decision List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {displayedDecisions.map((decision, index) => {
          const operator = getOperator(decision.operatorId);
          const ActionIcon = actionIcons[decision.action] || Bot;
          const actionColor = actionColors[decision.action] || 'text-muted-foreground bg-white/5 border-white/10';
          const outcome = outcomeIcons[decision.outcome];
          const OutcomeIcon = outcome?.icon || Clock;
          
          return (
            <div 
              key={decision.id}
              className={`px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-all group ${
                index === 0 ? 'bg-[hsl(var(--neon-cyan)/0.03)]' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Operator Avatar */}
                <div className="flex-shrink-0 w-9 h-9 rounded bg-[hsl(var(--background))] border border-white/10 flex items-center justify-center text-lg shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] group-hover:border-[hsl(var(--neon-cyan)/0.4)] transition-colors">
                  {operator?.avatar || '🤖'}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-white tracking-tight uppercase">
                        {operator?.name || 'Unknown'}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-[8px] font-black uppercase tracking-widest ${actionColor}`}>
                        <ActionIcon className="w-2.5 h-2.5" />
                        {decision.action}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <OutcomeIcon className={`w-3 h-3 ${outcome?.color} shadow-[0_0_5px_currentColor]`} />
                      <span className="text-[8px] font-black text-muted-foreground tracking-widest tabular-nums">{formatTime(decision.timestamp)}</span>
                    </div>
                  </div>
                  
                  {/* Target */}
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                    Target: <span className="text-[hsl(var(--neon-cyan))] font-black">{decision.targetNodeId.toUpperCase()}</span>
                  </div>
                  
                  {/* Reasoning */}
                  <p className="text-[10px] text-muted-foreground/60 leading-relaxed font-medium line-clamp-2 italic">
                    "{decision.reasoning}"
                  </p>
                  
                  {/* Automation Badge */}
                  {decision.automated && (
                    <div className="mt-2.5 inline-flex items-center gap-2 text-[8px] font-black text-[hsl(var(--neon-purple))] uppercase tracking-[0.2em]">
                      <Zap className="w-2.5 h-2.5" />
                      AUTO_PROTOCOL_ENGAGED
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      {decisions.length > maxItems && (
        <div className="p-3 bg-[hsl(var(--background)/0.3)] border-t border-white/5 text-center">
          <button className="text-[9px] font-black text-[hsl(var(--neon-cyan))] hover:text-white transition-colors uppercase tracking-[0.3em]">
            Access Archives ({decisions.length})
          </button>
        </div>
      )}
    </div>
  );
}
