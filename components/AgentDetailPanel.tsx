'use client';

import { useState } from 'react';
import { Employee, AgentStatus } from '@/lib/types';
import { 
  X, TrendingUp, Zap, Shield, Clock, Activity, Cpu,
  DollarSign, Target, Users, BarChart3, CreditCard, Mail,
  MessageSquare, Globe, Search, PieChart, ArrowUpRight,
  Wallet, Percent, Calendar, Award
} from 'lucide-react';

type Props = {
  agent: Employee;
  onClose: () => void;
  onUpdateAgent: (id: string, updates: Partial<Employee>) => void;
  onToggleStatus: (id: string, newStatus: string) => void;
};

const MODELS = ['GPT-4o', 'GPT-4 Turbo', 'Claude 3.5', 'Gemini 1.5'];

type TabType = 'overview' | 'stats' | 'revenue' | 'settings';

export default function AgentDetailPanel({ agent, onClose, onUpdateAgent, onToggleStatus }: Props) {
  const [tab, setTab] = useState<TabType>(agent.revenueMetrics ? 'revenue' : 'overview');
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const [memoryEnabled, setMemoryEnabled] = useState(true);

  const tokenPct = Math.min((agent.tokenUsage.used / agent.tokenUsage.limit) * 100, 100);
  const concurrencyPct = agent.concurrency.max > 0
    ? (agent.concurrency.current / agent.concurrency.max) * 100
    : 0;

  const statusOptions: { value: AgentStatus; label: string; color: string }[] = [
    { value: 'running', label: 'Running', color: 'bg-cyan-500 border-cyan-700' },
    { value: 'paused', label: 'Paused', color: 'bg-amber-500 border-amber-700' },
    { value: 'idle', label: 'Idle', color: 'bg-slate-600 border-slate-700' },
    { value: 'error', label: 'Error', color: 'bg-red-500 border-red-700' },
  ];

  const hasRevenue = agent.revenueMetrics !== undefined;

  // Format currency
  const formatCurrency = (val?: number) => {
    if (!val) return '$0';
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val}`;
  };

  // Format percentage
  const formatPct = (val?: number) => {
    if (!val) return '0%';
    return `${val}%`;
  };

  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-[480px] z-50">
      <div className="h-full bg-[#020408] border-l border-cyan-500/30 shadow-2xl shadow-cyan-500/10 flex flex-col text-white overflow-hidden animate-slide-in">
        
        {/* Header */}
        <div className="relative border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 p-5 flex justify-between items-center flex-shrink-0">
          <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
          <div>
            <h2 className="text-xl font-bold tracking-wide text-cyan-400 font-mono">
              {agent.name}
            </h2>
            <p className="text-xs text-cyan-200/60 font-mono mt-1 uppercase tracking-wider">
              {agent.role} <span className="text-violet-400">//</span> {agent.office}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all group"
            aria-label="Close panel"
          >
            <X className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
          </button>
        </div>

        {/* Avatar Display */}
        <div className="relative h-32 flex items-center justify-center flex-shrink-0 border-b border-cyan-500/10">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="text-7xl animate-float-ultra" style={{ filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))' }}>
              {agent.avatar}
            </div>
            <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full" />
          </div>
          
          {/* Level Badge */}
          <div className="absolute top-4 left-5 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-cyan-300 font-mono text-xs px-3 py-1 rounded-full border border-cyan-500/40 backdrop-blur-sm">
            LVL {agent.level}
          </div>
          
          {/* Status Badge */}
          <div className={`absolute top-4 right-5 px-3 py-1 rounded-full text-xs font-mono border backdrop-blur-sm ${
            agent.status === 'running' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 status-pulse-cyan' :
            agent.status === 'paused' ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' :
            agent.status === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-300' :
            'bg-slate-500/20 border-slate-500/50 text-slate-400'
          }`}>
            {agent.status.toUpperCase()}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-around px-3 py-3 bg-[#020408] border-b border-cyan-500/10 flex-shrink-0">
          {(['overview', 'stats', ...(hasRevenue ? ['revenue'] : []), 'settings'] as TabType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg font-mono uppercase text-xs transition-all relative overflow-hidden ${
                tab === t
                  ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/20'
                  : 'bg-transparent border border-transparent text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              {t}
              {tab === t && (
                <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 relative">
          
          {/* ── OVERVIEW TAB ── */}
          {tab === 'overview' && (
            <>
              {/* Token Usage */}
              <div className="glass-ultron rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-cyan-400 font-mono text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4" /> TOKEN USAGE
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {agent.tokenUsage.used.toLocaleString()} <span className="text-cyan-500/50">/</span> {agent.tokenUsage.limit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-700" style={{ width: `${tokenPct}%` }} />
                </div>
                <p className="text-right text-xs text-slate-500 font-mono mt-2">{tokenPct.toFixed(1)}%</p>
              </div>

              {/* Success Rate */}
              <div className="glass-ultron rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-emerald-400 font-mono text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> SUCCESS RATE
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{agent.successRate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-emerald-500/20">
                  <div
                    className={`h-full transition-all duration-700 ${agent.successRate > 80 ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : agent.successRate > 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}
                    style={{ width: `${agent.successRate}%` }}
                  />
                </div>
              </div>

              {/* Concurrency */}
              <div className="glass-ultron rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-violet-400 font-mono text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4" /> CONCURRENCY
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{agent.concurrency.current} / {agent.concurrency.max}</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-violet-500/20">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700" style={{ width: `${concurrencyPct}%` }} />
                </div>
              </div>

              {/* System Prompt */}
              <div className="glass-ultron rounded-xl p-4">
                <p className="text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Cpu className="w-3 h-3" /> System Prompt
                </p>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-4 font-mono">{agent.systemPrompt}</p>
              </div>
            </>
          )}

          {/* ── STATS TAB ── */}
          {tab === 'stats' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={<Clock className="w-5 h-5 text-cyan-400" />} label="Avg Latency" value={`${agent.latency}ms`} />
                <StatCard icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} label="Success Rate" value={`${agent.successRate}%`} />
                <StatCard icon={<Zap className="w-5 h-5 text-violet-400" />} label="Tokens Used" value={agent.tokenUsage.used.toLocaleString()} />
                <StatCard icon={<Activity className="w-5 h-5 text-amber-400" />} label="Concurrency" value={`${agent.concurrency.current}/${agent.concurrency.max}`} />
              </div>
              
              {/* Performance Grade */}
              <div className="glass-ultron rounded-xl p-4">
                <p className="text-slate-400 font-mono text-xs uppercase tracking-wider mb-3">Performance Grade</p>
                <div className="flex items-center justify-center">
                  <div className={`w-24 h-24 rounded-2xl border-2 flex items-center justify-center text-4xl font-black shadow-lg ${
                    agent.successRate >= 90 ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-emerald-500/20' :
                    agent.successRate >= 70 ? 'border-amber-500 text-amber-400 bg-amber-500/10 shadow-amber-500/20' :
                    'border-red-500 text-red-400 bg-red-500/10 shadow-red-500/20'
                  }`}>
                    {agent.successRate >= 90 ? 'A' : agent.successRate >= 70 ? 'B' : 'D'}
                  </div>
                </div>
                <p className="text-center text-slate-500 text-xs mt-3 font-mono">
                  {agent.successRate >= 90 ? 'EXCELLENT PERFORMANCE' : agent.successRate >= 70 ? 'ACCEPTABLE PERFORMANCE' : 'NEEDS ATTENTION'}
                </p>
              </div>
            </>
          )}

          {/* ── REVENUE TAB ── */}
          {tab === 'revenue' && agent.revenueMetrics && (
            <>
              {/* Revenue Summary Card */}
              <div className="glass-ultron rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
                <p className="text-slate-500 font-mono text-xs uppercase tracking-wider mb-1">Total Revenue Generated</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-emerald-400 font-mono">
                    {formatCurrency(agent.revenueMetrics.revenue || agent.revenueMetrics.emailRevenue || agent.revenueMetrics.chatRevenue || agent.revenueMetrics.seoRevenue || agent.revenueMetrics.conversionValue)}
                  </span>
                  {agent.revenueMetrics.projectedAnnualImpact && (
                    <span className="text-xs text-emerald-500/70 font-mono">
                      +{formatCurrency(agent.revenueMetrics.projectedAnnualImpact)}/yr
                    </span>
                  )}
                </div>
              </div>

              {/* Sales Metrics */}
              {(agent.revenueMetrics.leadsGenerated !== undefined || agent.revenueMetrics.dealsClosed !== undefined) && (
                <>
                  <p className="text-cyan-400 font-mono text-xs uppercase tracking-wider mt-2 flex items-center gap-2">
                    <Target className="w-3 h-3" /> Sales Performance
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {agent.revenueMetrics.leadsGenerated !== undefined && (
                      <RevenueCard icon={<Target className="w-4 h-4 text-cyan-400" />} label="Leads" value={agent.revenueMetrics.leadsGenerated.toString()} />
                    )}
                    {agent.revenueMetrics.dealsClosed !== undefined && (
                      <RevenueCard icon={<Award className="w-4 h-4 text-emerald-400" />} label="Deals Won" value={agent.revenueMetrics.dealsClosed.toString()} />
                    )}
                    {agent.revenueMetrics.avgDealSize !== undefined && (
                      <RevenueCard icon={<DollarSign className="w-4 h-4 text-violet-400" />} label="Avg Deal" value={formatCurrency(agent.revenueMetrics.avgDealSize)} />
                    )}
                    {agent.revenueMetrics.winRate !== undefined && (
                      <RevenueCard icon={<Percent className="w-4 h-4 text-amber-400" />} label="Win Rate" value={`${agent.revenueMetrics.winRate}%`} />
                    )}
                    {agent.revenueMetrics.pipeline !== undefined && (
                      <RevenueCard icon={<BarChart3 className="w-4 h-4 text-fuchsia-400" />} label="Pipeline" value={formatCurrency(agent.revenueMetrics.pipeline)} />
                    )}
                    {agent.revenueMetrics.commission !== undefined && (
                      <RevenueCard icon={<Wallet className="w-4 h-4 text-emerald-400" />} label="Commission" value={formatCurrency(agent.revenueMetrics.commission)} />
                    )}
                  </div>
                </>
              )}

              {/* Client Success Metrics */}
              {agent.revenueMetrics.activeClients !== undefined && (
                <>
                  <p className="text-cyan-400 font-mono text-xs uppercase tracking-wider mt-2 flex items-center gap-2">
                    <Users className="w-3 h-3" /> Client Health
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <RevenueCard icon={<Users className="w-4 h-4 text-cyan-400" />} label="Active Clients" value={agent.revenueMetrics.activeClients.toString()} />
                    <RevenueCard icon={<Percent className="w-4 h-4 text-emerald-400" />} label="Retention" value={`${agent.revenueMetrics.retentionRate}%`} />
                    <RevenueCard icon={<ArrowUpRight className="w-4 h-4 text-violet-400" />} label="Upsell Revenue" value={formatCurrency(agent.revenueMetrics.upsellRevenue)} />
                    <RevenueCard icon={<Award className="w-4 h-4 text-amber-400" />} label="NPS Score" value={agent.revenueMetrics.npsScore?.toString() || 'N/A'} />
                  </div>
                </>
              )}

              {/* Marketing Metrics */}
              {(agent.revenueMetrics.organicTraffic !== undefined || agent.revenueMetrics.emailsSent !== undefined || agent.revenueMetrics.followersGained !== undefined) && (
                <>
                  <p className="text-cyan-400 font-mono text-xs uppercase tracking-wider mt-2 flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Marketing Performance
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {agent.revenueMetrics.organicTraffic !== undefined && (
                      <RevenueCard icon={<Search className="w-4 h-4 text-cyan-400" />} label="Organic Traffic" value={agent.revenueMetrics.organicTraffic.toLocaleString()} />
                    )}
                    {agent.revenueMetrics.keywordsRanked !== undefined && (
                      <RevenueCard icon={<Target className="w-4 h-4 text-emerald-400" />} label="Keywords" value={agent.revenueMetrics.keywordsRanked.toString()} />
                    )}
                    {agent.revenueMetrics.conversionsFromSEO !== undefined && (
                      <RevenueCard icon={<TrendingUp className="w-4 h-4 text-violet-400" />} label="SEO Conv." value={agent.revenueMetrics.conversionsFromSEO.toString()} />
                    )}
                    {agent.revenueMetrics.seoRevenue !== undefined && (
                      <RevenueCard icon={<DollarSign className="w-4 h-4 text-fuchsia-400" />} label="SEO Revenue" value={formatCurrency(agent.revenueMetrics.seoRevenue)} />
                    )}
                    {agent.revenueMetrics.followersGained !== undefined && (
                      <RevenueCard icon={<Users className="w-4 h-4 text-amber-400" />} label="Followers" value={`+${agent.revenueMetrics.followersGained}`} />
                    )}
                    {agent.revenueMetrics.engagementRate !== undefined && (
                      <RevenueCard icon={<Percent className="w-4 h-4 text-cyan-400" />} label="Engagement" value={`${agent.revenueMetrics.engagementRate}%`} />
                    )}
                    {agent.revenueMetrics.emailsSent !== undefined && (
                      <RevenueCard icon={<Mail className="w-4 h-4 text-emerald-400" />} label="Emails Sent" value={agent.revenueMetrics.emailsSent.toLocaleString()} />
                    )}
                    {agent.revenueMetrics.openRate !== undefined && (
                      <RevenueCard icon={<PieChart className="w-4 h-4 text-violet-400" />} label="Open Rate" value={`${agent.revenueMetrics.openRate}%`} />
                    )}
                  </div>
                </>
              )}

              {/* Finance Metrics */}
              {agent.revenueMetrics.invoicesSent !== undefined && (
                <>
                  <p className="text-cyan-400 font-mono text-xs uppercase tracking-wider mt-2 flex items-center gap-2">
                    <CreditCard className="w-3 h-3" /> Collections
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <RevenueCard icon={<CreditCard className="w-4 h-4 text-cyan-400" />} label="Invoices" value={agent.revenueMetrics.invoicesSent.toString()} />
                    <RevenueCard icon={<Percent className="w-4 h-4 text-emerald-400" />} label="Collection Rate" value={`${agent.revenueMetrics.collectionRate}%`} />
                    <RevenueCard icon={<Calendar className="w-4 h-4 text-amber-400" />} label="AR Days" value={agent.revenueMetrics.arDays?.toString() || 'N/A'} />
                    <RevenueCard icon={<Wallet className="w-4 h-4 text-violet-400" />} label="Recovered" value={formatCurrency(agent.revenueMetrics.latePaymentsRecovered)} />
                  </div>
                </>
              )}

              {/* Chat Metrics */}
              {agent.revenueMetrics.chatsHandled !== undefined && (
                <>
                  <p className="text-cyan-400 font-mono text-xs uppercase tracking-wider mt-2 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" /> Live Chat Sales
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <RevenueCard icon={<MessageSquare className="w-4 h-4 text-cyan-400" />} label="Chats" value={agent.revenueMetrics.chatsHandled.toString()} />
                    <RevenueCard icon={<Percent className="w-4 h-4 text-emerald-400" />} label="Conv. Rate" value={`${agent.revenueMetrics.conversionRate}%`} />
                    <RevenueCard icon={<DollarSign className="w-4 h-4 text-violet-400" />} label="AOV" value={formatCurrency(agent.revenueMetrics.avgOrderValue)} />
                    <RevenueCard icon={<TrendingUp className="w-4 h-4 text-fuchsia-400" />} label="Chat Revenue" value={formatCurrency(agent.revenueMetrics.chatRevenue)} />
                  </div>
                </>
              )}
            </>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === 'settings' && (
            <>
              {/* Status Control */}
              <div className="glass-ultron rounded-xl p-4">
                <p className="text-cyan-400 font-mono text-xs uppercase tracking-wider mb-3">Agent Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onUpdateAgent(agent.id, { status: opt.value })}
                      className={`py-2 rounded-lg border text-xs font-mono transition-all ${
                        agent.status === opt.value
                          ? `${opt.color} text-white shadow-lg`
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-cyan-500/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Memory Toggle */}
              <div className="glass-ultron rounded-xl p-4 flex justify-between items-center">
                <span className="font-mono text-sm flex items-center gap-2 text-slate-300">
                  <Shield className="w-4 h-4 text-cyan-400" /> Persistent Memory
                </span>
                <button
                  onClick={() => setMemoryEnabled(!memoryEnabled)}
                  className={`w-12 h-6 rounded-full border relative transition-colors duration-200 ${memoryEnabled ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-slate-800 border-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-200 ${memoryEnabled ? 'right-1 bg-emerald-400' : 'left-1 bg-slate-500'}`} />
                </button>
              </div>

              {/* Model Selector */}
              <div className="glass-ultron rounded-xl p-4">
                <span className="font-mono text-sm flex items-center gap-2 mb-3 text-slate-300">
                  <Cpu className="w-4 h-4 text-cyan-400" /> Model Selector
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {MODELS.map((model) => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`p-2 rounded-lg text-center border text-xs font-mono transition-all ${
                        selectedModel === model
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-cyan-500/30'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              {/* System Prompt Editor */}
              <div className="glass-ultron rounded-xl p-4">
                <p className="text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">System Prompt</p>
                <textarea
                  className="w-full h-24 bg-[#020408] text-slate-300 text-xs rounded-lg p-3 border border-cyan-500/20 focus:border-cyan-500/50 outline-none resize-none font-mono leading-relaxed"
                  defaultValue={agent.systemPrompt}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/20 flex-shrink-0 bg-[#020408]">
          <button className="w-full py-3 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-lg font-mono text-sm border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30 hover:border-cyan-500/60 transition-all uppercase tracking-wider">
            Upgrade Agent
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-ultron rounded-xl p-3 flex flex-col items-center gap-2 border-cyan-500/20">
      {icon}
      <span className="text-lg font-bold text-white font-mono">{value}</span>
      <span className="text-xs text-slate-500 font-mono uppercase">{label}</span>
    </div>
  );
}

function RevenueCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-ultron rounded-xl p-3 flex items-center gap-3">
      <div className="p-2 bg-slate-800/50 rounded-lg border border-cyan-500/20">
        {icon}
      </div>
      <div>
        <span className="text-lg font-bold text-white font-mono">{value}</span>
        <p className="text-xs text-slate-500 font-mono uppercase">{label}</p>
      </div>
    </div>
  );
}
