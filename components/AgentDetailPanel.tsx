'use client';

import { useState } from 'react';
import { Employee, AgentStatus } from '@/lib/types';
import { 
  X, TrendingUp, Zap, Shield, Clock, Activity, Cpu,
  DollarSign, Target, Users, BarChart3, CreditCard, Mail,
  MessageSquare, Globe, Search, PieChart, ArrowUpRight,
  Wallet, Percent, Calendar, Award, Terminal, Command, Power, Microchip
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  agent: Employee;
  onClose: () => void;
  onUpdateAgent: (id: string, updates: Partial<Employee>) => void;
  onToggleStatus: (id: string, newStatus: string) => void;
};

const MODELS = ['GPT-4o', 'Claude 3.5', 'Gemini Pro', 'Llama 3'];

type TabType = 'overview' | 'stats' | 'revenue' | 'settings';

export default function AgentDetailPanel({ agent, onClose, onUpdateAgent, onToggleStatus }: Props) {
  const [tab, setTab] = useState<TabType>(agent.revenueMetrics ? 'revenue' : 'overview');
  const [selectedModel, setSelectedModel] = useState('GPT-4o');

  const tokenPct = Math.min((agent.tokenUsage.used / agent.tokenUsage.limit) * 100, 100);
  const concurrencyPct = agent.concurrency.max > 0
    ? (agent.concurrency.current / agent.concurrency.max) * 100
    : 0;

  const hasRevenue = agent.revenueMetrics !== undefined;

  const formatCurrency = (val?: number) => {
    if (!val) return '$0';
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val}`;
  };

  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-[520px] z-50 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
      <div className="h-full bg-[hsl(var(--sidebar-background)/0.98)] backdrop-blur-2xl border-l border-white/10 flex flex-col overflow-hidden scanlines">
        
        {/* Header */}
        <div className="relative border-b border-white/5 bg-[hsl(var(--background)/0.5)] p-8 flex justify-between items-center flex-shrink-0 overflow-hidden">
          <div className="absolute inset-0 starfield opacity-10 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 rounded bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] flex items-center justify-center text-4xl shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]">
              {agent.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight leading-none text-white mb-2 uppercase">
                {agent.name}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-[hsl(var(--neon-cyan))] tracking-[0.3em] uppercase">{agent.role.toUpperCase()}</span>
                <span className="text-white/10">|</span>
                <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${agent.status === 'running' ? 'text-[hsl(var(--neon-green))]' : 'text-[hsl(var(--neon-yellow))]'}`}>
                  {agent.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/5 rounded border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group relative z-10"
          >
            <X className="w-6 h-6 text-muted-foreground group-hover:text-white" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-8 py-4 bg-[hsl(var(--background)/0.3)] border-b border-white/5 flex-shrink-0 gap-3">
          {(['overview', 'stats', ...(hasRevenue ? ['revenue'] : []), 'settings'] as TabType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded text-[10px] font-black tracking-[0.25em] transition-all border uppercase
                ${tab === t
                  ? 'bg-[hsl(var(--neon-cyan)/0.15)] text-[hsl(var(--neon-cyan))] border-[hsl(var(--neon-cyan)/0.4)] shadow-[0_0_15px_hsl(var(--neon-cyan)/0.2)]'
                  : 'text-muted-foreground border-transparent hover:border-white/10 hover:bg-white/5'
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 scrollbar-hide">
          
          {/* ── OVERVIEW TAB ── */}
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <StatBox label="SUCCESS" value={`${agent.successRate}%`} icon={CheckCircle2} color="green" />
                <StatBox label="LATENCY" value={`${agent.latency}ms`} icon={Clock} color="cyan" />
              </div>

              {/* Token Usage */}
              <div className="bg-[hsl(var(--card)/0.4)] rounded-md border border-white/5 p-6 panel-glow-purple relative overflow-hidden">
                <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-[hsl(var(--neon-purple))]" />
                    <span className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase">Token Allocation</span>
                  </div>
                  <span className="text-[10px] font-black text-white tabular-nums tracking-widest">
                    {agent.tokenUsage.used.toLocaleString()} / {agent.tokenUsage.limit.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-magenta))]" style={{ width: `${tokenPct}%`, boxShadow: '0 0 10px hsl(var(--neon-purple))' }} />
                </div>
              </div>

              {/* Concurrency */}
              <div className="bg-[hsl(var(--card)/0.4)] rounded-md border border-white/5 p-6 panel-glow-cyan">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                    <span className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase">Neural Concurrency</span>
                  </div>
                  <span className="text-[10px] font-black text-white tabular-nums tracking-widest">{agent.concurrency.current} / {agent.concurrency.max} Threads</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-[hsl(var(--neon-cyan))]" style={{ width: `${concurrencyPct}%`, boxShadow: '0 0 10px hsl(var(--neon-cyan))' }} />
                </div>
              </div>

              {/* System Prompt */}
              <div className="bg-[hsl(var(--card)/0.4)] rounded-md border border-white/5 p-6">
                <div className="flex items-center gap-3 mb-4 text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase">
                  <Terminal className="w-4 h-4 text-[hsl(var(--neon-cyan))]" /> Primary Instruction Set
                </div>
                <div className="bg-[hsl(var(--background)/0.8)] p-5 rounded border border-white/5 font-mono text-[11px] leading-relaxed text-slate-400">
                  {agent.systemPrompt}
                </div>
              </div>
            </>
          )}

          {/* ── STATS TAB ── */}
          {tab === 'stats' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <StatCard icon={<Clock className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />} label="Avg Latency" value={`${agent.latency}ms`} />
                <StatCard icon={<TrendingUp className="w-5 h-5 text-[hsl(var(--neon-green))]" />} label="Success Rate" value={`${agent.successRate}%`} />
                <StatCard icon={<Zap className="w-5 h-5 text-[hsl(var(--neon-purple))]" />} label="Tokens Used" value={agent.tokenUsage.used.toLocaleString()} />
                <StatCard icon={<Activity className="w-5 h-5 text-[hsl(var(--neon-yellow))]" />} label="Threads" value={`${agent.concurrency.current}/${agent.concurrency.max}`} />
              </div>
              
              <div className="bg-[hsl(var(--card)/0.4)] rounded-md border border-white/5 p-8 panel-glow-cyan relative overflow-hidden">
                <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
                <p className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase mb-8 text-center">Neural Performance Grade</p>
                <div className="flex items-center justify-center">
                  <div className={`w-32 h-32 rounded bg-[hsl(var(--background)/0.6)] border-2 flex items-center justify-center text-5xl font-black shadow-lg ${
                    agent.successRate >= 90 ? 'border-[hsl(var(--neon-green))] text-[hsl(var(--neon-green))] shadow-[0_0_20px_hsl(var(--neon-green)/0.2)]' :
                    agent.successRate >= 70 ? 'border-[hsl(var(--neon-yellow))] text-[hsl(var(--neon-yellow))] shadow-[0_0_20px_hsl(var(--neon-yellow)/0.2)]' :
                    'border-[hsl(var(--neon-magenta))] text-[hsl(var(--neon-magenta))] shadow-[0_0_20px_hsl(var(--neon-magenta)/0.2)]'
                  }`}>
                    {agent.successRate >= 90 ? 'A+' : agent.successRate >= 70 ? 'B' : 'Ω'}
                  </div>
                </div>
                <p className={`text-center font-black text-[11px] mt-8 tracking-[0.4em] uppercase ${
                  agent.successRate >= 90 ? 'text-[hsl(var(--neon-green))]' :
                  agent.successRate >= 70 ? 'text-[hsl(var(--neon-yellow))]' :
                  'text-[hsl(var(--neon-magenta))]'
                }`}>
                  {agent.successRate >= 90 ? 'Optimal Efficiency' : agent.successRate >= 70 ? 'Nominal Operation' : 'Critical Recalibration Required'}
                </p>
              </div>
            </>
          )}

          {/* ── REVENUE TAB ── */}
          {tab === 'revenue' && agent.revenueMetrics && (
            <>
              <div className="bg-[hsl(var(--card)/0.4)] rounded-md border border-white/5 p-8 panel-glow-purple relative overflow-hidden">
                <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-[hsl(var(--neon-green)/0.05)] rounded-full blur-[80px]" />
                <p className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase mb-2">Aggregate Value Generated</p>
                <div className="flex items-baseline gap-4 relative z-10">
                  <span className="text-5xl font-black text-[hsl(var(--neon-green))] tracking-tighter tabular-nums text-glow">
                    {formatCurrency(agent.revenueMetrics.revenue || agent.revenueMetrics.emailRevenue || agent.revenueMetrics.chatRevenue || agent.revenueMetrics.seoRevenue || agent.revenueMetrics.conversionValue)}
                  </span>
                  {agent.revenueMetrics.projectedAnnualImpact && (
                    <span className="text-[11px] font-black text-[hsl(var(--neon-green)/0.6)] tracking-widest">
                      +{formatCurrency(agent.revenueMetrics.projectedAnnualImpact)}/ANNUAL
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {agent.revenueMetrics.leadsGenerated !== undefined && <RevenueCard icon={<Target className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />} label="Leads" value={agent.revenueMetrics.leadsGenerated.toString()} />}
                {agent.revenueMetrics.dealsClosed !== undefined && <RevenueCard icon={<Award className="w-5 h-5 text-[hsl(var(--neon-green))]" />} label="Deals" value={agent.revenueMetrics.dealsClosed.toString()} />}
                {agent.revenueMetrics.activeClients !== undefined && <RevenueCard icon={<Users className="w-5 h-5 text-[hsl(var(--neon-purple))]" />} label="Clients" value={agent.revenueMetrics.activeClients.toString()} />}
                {agent.revenueMetrics.retentionRate !== undefined && <RevenueCard icon={<TrendingUp className="w-5 h-5 text-[hsl(var(--neon-yellow))]" />} label="Retention" value={`${agent.revenueMetrics.retentionRate}%`} />}
              </div>
            </>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === 'settings' && (
            <div className="space-y-8">
              <div className="bg-[hsl(var(--card)/0.4)] rounded-md border border-white/5 p-6 panel-glow-cyan">
                <h3 className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                  <Power className="w-4 h-4 text-[hsl(var(--neon-cyan))]" /> Neural Status Control
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => onToggleStatus(agent.id, 'running')}
                    className={`py-4 rounded-md border font-black text-[10px] tracking-[0.3em] uppercase transition-all flex flex-col items-center gap-3 ${
                      agent.status === 'running'
                        ? 'bg-[hsl(var(--neon-cyan)/0.15)] border-[hsl(var(--neon-cyan)/0.5)] text-[hsl(var(--neon-cyan))] shadow-[0_0_15px_hsl(var(--neon-cyan)/0.2)]'
                        : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/20'
                    }`}
                  >
                    <Play className="w-4 h-4" /> INITIATE
                  </button>
                  <button
                    onClick={() => onToggleStatus(agent.id, 'paused')}
                    className={`py-4 rounded-md border font-black text-[10px] tracking-[0.3em] uppercase transition-all flex flex-col items-center gap-3 ${
                      agent.status === 'paused'
                        ? 'bg-[hsl(var(--neon-yellow)/0.15)] border-[hsl(var(--neon-yellow)/0.5)] text-[hsl(var(--neon-yellow))] shadow-[0_0_15px_hsl(var(--neon-yellow)/0.2)]'
                        : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/20'
                    }`}
                  >
                    <Pause className="w-4 h-4" /> SUSPEND
                  </button>
                </div>
              </div>

              <div className="bg-[hsl(var(--card)/0.4)] rounded-md border border-white/5 p-6">
                <h3 className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                  <Microchip className="w-4 h-4 text-[hsl(var(--neon-purple))]" /> Model Configuration
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {MODELS.map((model) => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`p-3 rounded-md text-center border text-[10px] font-black tracking-widest transition-all ${
                        selectedModel === model
                          ? 'bg-[hsl(var(--neon-purple)/0.15)] border-[hsl(var(--neon-purple)/0.5)] text-[hsl(var(--neon-purple))] shadow-[0_0_15px_hsl(var(--neon-purple)/0.2)]'
                          : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/20'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[hsl(var(--card)/0.4)] rounded-md border border-white/5 p-6 border-magenta-500/20">
                <h3 className="text-[10px] font-black text-[hsl(var(--neon-magenta))] tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4" /> Danger Zone
                </h3>
                <button className="w-full py-4 rounded-md border border-[hsl(var(--neon-magenta)/0.4)] bg-[hsl(var(--neon-magenta)/0.1)] hover:bg-[hsl(var(--neon-magenta)/0.2)] transition-all text-[hsl(var(--neon-magenta))] font-black text-[10px] tracking-[0.4em] uppercase">
                  TERMINATE_PROCESS
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-[hsl(var(--background)/0.5)]">
          <button className="w-full py-5 bg-[hsl(var(--neon-purple))] hover:bg-[hsl(var(--neon-purple)/0.9)] rounded font-black text-background text-[11px] tracking-[0.4em] uppercase transition-all shadow-[0_0_25px_hsl(var(--neon-purple)/0.4)] transform hover:scale-[1.02] active:scale-[0.98]">
            Upgrade Neural Core
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    green: 'hsl(var(--neon-green))',
    cyan: 'hsl(var(--neon-cyan))',
    purple: 'hsl(var(--neon-purple))',
    yellow: 'hsl(var(--neon-yellow))',
  };
  return (
    <div className="bg-[hsl(var(--card)/0.4)] rounded-md p-5 border border-white/5 relative overflow-hidden group flex-1">
      <div className="absolute inset-0 scanlines opacity-10" />
      <Icon className="w-5 h-5 mb-3" style={{ color: colors[color] }} />
      <div className="text-2xl font-black text-white tabular-nums tracking-tight mb-1">{value}</div>
      <div className="text-[9px] text-muted-foreground font-black tracking-[0.3em] uppercase">{label}</div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-[hsl(var(--card)/0.4)] rounded-md p-5 border border-white/5 flex flex-col items-center gap-3 hover:border-white/20 transition-all">
      {icon}
      <span className="text-xl font-black text-white tabular-nums">{value}</span>
      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

function RevenueCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-[hsl(var(--card)/0.4)] rounded-md p-5 border border-white/5 flex items-center gap-4 hover:border-white/20 transition-all">
      <div className="p-2.5 bg-[hsl(var(--background)/0.5)] rounded border border-white/5">
        {icon}
      </div>
      <div>
        <span className="text-xl font-black text-white tabular-nums leading-none block mb-1">{value}</span>
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{label}</p>
      </div>
    </div>
  );
}
