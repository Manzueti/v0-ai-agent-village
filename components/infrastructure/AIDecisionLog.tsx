'use client';

import { AIDecision, AIOperator } from '@/lib/types';
import { Bot, CheckCircle, Clock, XCircle, ArrowRight, RefreshCw, AlertTriangle, Shield, Zap, GitBranch } from 'lucide-react';

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
  failover: 'text-blue-400 bg-blue-400/10',
  scale: 'text-violet-400 bg-violet-400/10',
  restart: 'text-amber-400 bg-amber-400/10',
  alert: 'text-red-400 bg-red-400/10',
  heal: 'text-emerald-400 bg-emerald-400/10',
  reroute: 'text-cyan-400 bg-cyan-400/10',
};

const outcomeIcons: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  success: { icon: CheckCircle, color: 'text-emerald-400' },
  pending: { icon: Clock, color: 'text-amber-400' },
  failed: { icon: XCircle, color: 'text-red-400' },
};

export default function AIDecisionLog({ decisions, operators, maxItems = 10 }: AIDecisionLogProps) {
  const displayedDecisions = decisions.slice(0, maxItems);
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getOperator = (operatorId: string) => {
    return operators.find(op => op.id === operatorId);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">AI Decision Log</span>
        </div>
        <span className="text-xs text-slate-500">{decisions.length} total</span>
      </div>
      
      {/* Decision List */}
      <div className="max-h-[400px] overflow-y-auto">
        {displayedDecisions.map((decision, index) => {
          const operator = getOperator(decision.operatorId);
          const ActionIcon = actionIcons[decision.action] || Bot;
          const actionColor = actionColors[decision.action] || 'text-slate-400 bg-slate-400/10';
          const outcome = outcomeIcons[decision.outcome];
          const OutcomeIcon = outcome?.icon || Clock;
          
          return (
            <div 
              key={decision.id}
              className={`px-4 py-3 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                index === 0 ? 'bg-slate-800/20' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Operator Avatar */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm">
                  {operator?.avatar || '🤖'}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {operator?.name || 'Unknown'}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${actionColor}`}>
                        <ActionIcon className="w-3 h-3" />
                        {decision.action}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <OutcomeIcon className={`w-3.5 h-3.5 ${outcome?.color}`} />
                      <span className="text-[10px] text-slate-500">{formatTime(decision.timestamp)}</span>
                    </div>
                  </div>
                  
                  {/* Target */}
                  <div className="text-xs text-slate-400 mb-1">
                    Target: <span className="text-cyan-400 font-mono">{decision.targetNodeId}</span>
                  </div>
                  
                  {/* Reasoning */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {decision.reasoning}
                  </p>
                  
                  {/* Automation Badge */}
                  {decision.automated && (
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[9px] text-violet-400">
                      <Zap className="w-2.5 h-2.5" />
                      Automated
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
        <div className="px-4 py-2 bg-slate-800/30 text-center">
          <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            View all {decisions.length} decisions
          </button>
        </div>
      )}
    </div>
  );
}
