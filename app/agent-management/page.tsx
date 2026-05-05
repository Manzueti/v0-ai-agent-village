'use client';

import { useState, useEffect } from 'react';
import { employees as initialEmployees } from '@/lib/data';
import { Employee, AgentStatus } from '@/lib/types';
import { 
  Cpu, Activity, Zap, Shield, Terminal, 
  Play, Pause, RotateCcw, AlertTriangle, CheckCircle,
  ChevronRight, Hash, Lock, Globe, Database, Layers,
  Brain, Microchip, Wifi, Radio, Clock, TrendingUp,
  Settings, FileCode, Server, Power, X, Factory
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgentMatrix() {
  const [agents, setAgents] = useState<Employee[]>(initialEmployees);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);
  const [systemTime, setSystemTime] = useState('');

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? null;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleStatus = (id: string, newStatus: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, status: newStatus as AgentStatus } : agent
      )
    );
  };

  const running = agents.filter((a) => a.status === 'running').length;
  const paused = agents.filter((a) => a.status === 'paused').length;
  const errors = agents.filter((a) => a.status === 'error').length;
  const totalTokens = agents.reduce((acc, a) => acc + a.tokenUsage.used, 0);
  const avgSuccess = Math.round(agents.reduce((acc, a) => acc + a.successRate, 0) / agents.length);

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'running': return 'text-[hsl(var(--neon-cyan))]';
      case 'paused': return 'text-[hsl(var(--neon-yellow))]';
      case 'error': return 'text-[hsl(var(--neon-magenta))]';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: AgentStatus) => {
    switch (status) {
      case 'running': return 'bg-[hsl(var(--neon-cyan))]';
      case 'paused': return 'bg-[hsl(var(--neon-yellow))]';
      case 'error': return 'bg-[hsl(var(--neon-magenta))]';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden scanlines">
      {/* Background Ambience */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[hsl(var(--background)/0.8)] backdrop-blur-xl">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] flex items-center justify-center shadow-[0_0_20px_hsl(var(--neon-cyan)/0.4)]">
                  <Brain className="w-7 h-7 text-background" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-white tracking-[0.2em] uppercase">
                    VYBE<span className="text-[hsl(var(--neon-cyan))]">CORP</span>
                  </h1>
                  <span className="px-2 py-0.5 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.3)] text-[hsl(var(--neon-cyan))] text-[10px] font-black tracking-[0.3em] rounded uppercase">
                    Agent Matrix
                  </span>
                </div>
                <p className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">Autonomous Workforce // Neural Control Tier-1</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-[hsl(var(--neon-green)/0.05)] border border-[hsl(var(--neon-green)/0.2)] rounded-md">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--neon-green))] pulse-dot shadow-[0_0_8px_hsl(var(--neon-green))]" />
                <span className="text-[hsl(var(--neon-green))] font-black text-[10px] tracking-[0.2em] uppercase">SYSTEM ONLINE</span>
              </div>
              <div className="font-black text-[hsl(var(--neon-cyan))] text-2xl tracking-tighter tabular-nums text-glow">
                {systemTime}
              </div>
            </div>
          </div>

          {/* Metrics Bar */}
          <div className="flex items-center gap-4 mt-8">
            <MetricCard label="ACTIVE" value={running} total={agents.length} color="cyan" icon={Cpu} />
            <MetricCard label="PAUSED" value={paused} total={agents.length} color="yellow" icon={Pause} />
            <MetricCard label="ERRORS" value={errors} total={agents.length} color="magenta" icon={AlertTriangle} />
            <MetricCard label="SUCCESS" value={`${avgSuccess}%`} color="green" icon={TrendingUp} />
            <div className="flex-1" />
            <div className="px-4 py-3 bg-[hsl(var(--neon-purple)/0.05)] border border-[hsl(var(--neon-purple)/0.2)] rounded-md panel-glow-purple">
              <span className="text-[hsl(var(--neon-purple))] font-black text-[10px] tracking-[0.2em] uppercase">TOKEN_FLOW: </span>
              <span className="text-white font-black text-sm tabular-nums tracking-tight">{(totalTokens / 1000).toFixed(1)}k units</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-10 scrollbar-hide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedAgentId(agent.id)}
              onMouseEnter={() => setHoveredAgentId(agent.id)}
              onMouseLeave={() => setHoveredAgentId(null)}
              className={`group relative cursor-pointer ${hoveredAgentId === agent.id ? 'z-20' : 'z-10'}`}
            >
              <div className={`
                relative overflow-hidden rounded-md bg-[hsl(var(--card)/0.6)] backdrop-blur-md border border-white/5 p-6
                transition-all duration-300 scanlines
                ${selectedAgentId === agent.id ? 'border-[hsl(var(--neon-cyan)/0.6)] panel-glow-cyan shadow-2xl' : ''}
                ${hoveredAgentId === agent.id ? 'scale-[1.02] border-[hsl(var(--neon-purple)/0.4)] panel-glow-purple shadow-2xl' : ''}
              `}>
                {/* Status indicator line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] ${getStatusBg(agent.status)} ${agent.status === 'running' ? 'animate-pulse shadow-[0_0_10px_currentColor]' : ''} opacity-60`} />

                {/* Content */}
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-14 h-14 rounded bg-[hsl(var(--background))] border border-white/10 flex items-center justify-center
                        group-hover:border-[hsl(var(--neon-cyan)/0.5)] transition-all duration-500
                        ${agent.status === 'running' ? 'shadow-[inset_0_0_10px_hsl(var(--neon-cyan)/0.2)]' : ''}
                      `}>
                        <span className="text-3xl filter saturate-0 group-hover:filter-none transition-all">{agent.avatar}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-black text-lg group-hover:text-[hsl(var(--neon-cyan))] transition-colors tracking-tight leading-none mb-1">
                          {agent.name.toUpperCase()}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase">{agent.role.toUpperCase()}</span>
                          <span className="text-white/10 text-[10px]">|</span>
                          <span className="text-[hsl(var(--neon-cyan)/0.6)] text-[9px] font-black tracking-[0.2em] uppercase">LVL_{agent.level}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`
                      w-1.5 h-1.5 rounded-full ${getStatusBg(agent.status)}
                      ${agent.status === 'running' ? 'pulse-dot shadow-[0_0_8px_currentColor]' : 'opacity-40'}
                    `} />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[hsl(var(--background)/0.5)] rounded p-3 border border-white/5 relative overflow-hidden group/stat">
                      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--neon-purple)/0.05)] to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-3.5 h-3.5 text-[hsl(var(--neon-purple))]" />
                        <span className="text-[9px] font-black text-muted-foreground tracking-[0.2em] uppercase">Usage</span>
                      </div>
                      <div className="font-black text-base text-white tabular-nums tracking-tight">
                        {Math.round((agent.tokenUsage.used / agent.tokenUsage.limit) * 100)}%
                      </div>
                      <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-[hsl(var(--neon-purple))] transition-all duration-1000 shadow-[0_0_8px_hsl(var(--neon-purple))]"
                          style={{ width: `${(agent.tokenUsage.used / agent.tokenUsage.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-[hsl(var(--background)/0.5)] rounded p-3 border border-white/5 relative overflow-hidden group/stat">
                      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--neon-cyan)/0.05)] to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-3.5 h-3.5 text-[hsl(var(--neon-cyan))]" />
                        <span className="text-[9px] font-black text-muted-foreground tracking-[0.2em] uppercase">Success</span>
                      </div>
                      <div className={`font-black text-base tabular-nums tracking-tight ${agent.successRate >= 90 ? 'text-[hsl(var(--neon-green))]' : agent.successRate >= 70 ? 'text-[hsl(var(--neon-yellow))]' : 'text-[hsl(var(--neon-magenta))]'}`}>
                        {agent.successRate}%
                      </div>
                      <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden border border-white/5">
                        <div 
                          className={`h-full transition-all duration-1000 ${agent.successRate >= 90 ? 'bg-[hsl(var(--neon-green))] shadow-[0_0_8px_hsl(var(--neon-green))]' : agent.successRate >= 70 ? 'bg-[hsl(var(--neon-yellow))]' : 'bg-[hsl(var(--neon-magenta))]'}`}
                          style={{ width: `${agent.successRate}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Wifi className={`w-3.5 h-3.5 ${agent.status === 'running' ? 'text-[hsl(var(--neon-cyan))] animate-pulse' : 'text-muted-foreground/30'}`} />
                      <span className="text-[10px] text-muted-foreground font-black tracking-[0.1em] tabular-nums">{agent.latency}ms</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground font-black tracking-[0.1em] tabular-nums">{agent.concurrency.current}/{agent.concurrency.max}</span>
                      <span className="text-[9px] text-muted-foreground/40 font-black tracking-[0.2em] uppercase">Threads</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Agent Detail Panel */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-0 right-0 h-full w-[520px] z-50"
          >
            <AgentDetailPanel 
              agent={selectedAgent} 
              onClose={() => setSelectedAgentId(null)}
              onToggleStatus={handleToggleStatus}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Elements */}
      <div className="fixed bottom-6 left-10 text-[9px] font-black text-muted-foreground/40 flex items-center gap-4 tracking-[0.3em] uppercase pointer-events-none">
        <div className="w-1.5 h-1.5 bg-[hsl(var(--neon-cyan))] rounded-full animate-pulse shadow-[0_0_8px_hsl(var(--neon-cyan))]" />
        <span>VYBECORP AGENT MATRIX v2.5.0 // NEURAL_FLOW: ACTIVE</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, total, color, icon: Icon }: any) {
  const colorMap: any = {
    cyan: 'hsl(var(--neon-cyan))',
    yellow: 'hsl(var(--neon-yellow))',
    magenta: 'hsl(var(--neon-magenta))',
    green: 'hsl(var(--neon-green))',
  };
  const glowMap: any = {
    cyan: 'panel-glow-cyan',
    yellow: 'panel-glow-yellow',
    magenta: 'panel-glow-magenta',
    green: 'panel-glow-cyan',
  };

  return (
    <div className={`px-5 py-4 rounded bg-[hsl(var(--card)/0.4)] backdrop-blur-sm border border-white/5 ${glowMap[color]} flex items-center gap-4 min-w-[180px]`} style={{ borderColor: `${colorMap[color]}33` }}>
      <Icon className="w-6 h-6" style={{ color: colorMap[color] }} />
      <div>
        <div className="text-[9px] font-black text-muted-foreground tracking-[0.3em] uppercase mb-1">{label}</div>
        <div className="text-2xl font-black text-white tabular-nums tracking-tighter">
          {value}
          {total !== undefined && (
            <span className="text-sm text-muted-foreground font-bold ml-1.5 opacity-40">/{total}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function AgentDetailPanel({ 
  agent, 
  onClose, 
  onToggleStatus 
}: { 
  agent: Employee; 
  onClose: () => void;
  onToggleStatus: (id: string, status: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'config' | 'chat'>('overview');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (agent.id === 'hermes') setActiveTab('chat');
    else setActiveTab('overview');
  }, [agent.id]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isThinking) return;
    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    setIsThinking(true);
    try {
      const response = await fetch('/api/hermes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      if (data.response) setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      else if (data.error) setMessages(prev => [...prev, { role: 'assistant', content: `ERROR: ${data.error}` }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect to Hermes Matrix.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  const tokenPct = Math.min((agent.tokenUsage.used / agent.tokenUsage.limit) * 100, 100);

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: Terminal },
    { id: 'metrics', label: 'METRICS', icon: Activity },
    ...(agent.id === 'hermes' ? [{ id: 'chat', label: 'MATRIX', icon: Brain }] : []),
    { id: 'config', label: 'SYSTEM', icon: Settings },
  ] as const;

  return (
    <div className="h-full bg-[hsl(var(--sidebar-background)/0.98)] backdrop-blur-2xl border-l border-white/10 flex flex-col scanlines shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] border border-white/10 flex items-center justify-center shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]">
              <span className="text-5xl">{agent.avatar}</span>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-2">{agent.name.toUpperCase()}</h2>
              <div className="flex items-center gap-3">
                <span className="text-[hsl(var(--neon-cyan))] text-[10px] font-black tracking-[0.3em] uppercase">{agent.role.toUpperCase()}</span>
                <span className="text-white/10">|</span>
                <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${agent.status === 'running' ? 'text-[hsl(var(--neon-green))]' : 'text-[hsl(var(--neon-yellow))]'}`}>
                  {agent.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded transition-colors group">
            <X className="w-8 h-8 text-muted-foreground group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-3 px-5 py-2.5 rounded text-[10px] font-black tracking-[0.25em] transition-all border
                ${activeTab === tab.id 
                  ? 'bg-[hsl(var(--neon-cyan)/0.15)] text-[hsl(var(--neon-cyan))] border-[hsl(var(--neon-cyan)/0.4)] shadow-[0_0_15px_hsl(var(--neon-cyan)/0.2)]' 
                  : 'text-muted-foreground border-transparent hover:border-white/10 hover:bg-white/5'}
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar scrollbar-hide">
        {activeTab === 'chat' && agent.id === 'hermes' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 space-y-6 mb-6 overflow-y-auto pr-2 custom-scrollbar">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30 space-y-6">
                  <Brain className="w-16 h-16" />
                  <p className="font-black text-[10px] uppercase tracking-[0.4em] text-center leading-loose">
                    Hermes Local Matrix Initialized.<br/>Awaiting Neural Input Streams...
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[90%] p-4 rounded-md font-mono text-[11px] leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-[hsl(var(--neon-purple)/0.1)] border border-[hsl(var(--neon-purple)/0.3)] text-[hsl(var(--neon-purple))]' 
                      : 'bg-[hsl(var(--background)/0.8)] border border-white/5 text-slate-300 panel-glow-cyan'}
                  `}>
                    <div className="mb-2 text-[8px] font-black opacity-50 uppercase tracking-[0.3em]">
                      {msg.role === 'user' ? 'local_access' : 'hermes_output'}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-[hsl(var(--background)/0.8)] border border-white/10 p-4 rounded-md flex items-center gap-4 panel-glow-cyan">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[hsl(var(--neon-cyan))] rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-[hsl(var(--neon-cyan))] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-[hsl(var(--neon-cyan))] rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-[9px] font-black text-[hsl(var(--neon-cyan)/0.6)] uppercase tracking-[0.3em] animate-pulse">
                      Processing Neural Flow...
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="DISPATCH COMMAND..."
                className="w-full bg-[hsl(var(--background)/0.8)] border border-white/10 rounded-md p-4 pr-14 font-mono text-xs text-white placeholder:text-muted-foreground/30 focus:border-[hsl(var(--neon-cyan)/0.5)] focus:outline-none transition-all"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isThinking || !inputValue.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[hsl(var(--neon-cyan))] hover:text-white disabled:opacity-20 transition-colors"
              >
                <Zap className="w-5 h-5 shadow-[0_0_10px_currentColor]" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <StatBox label="SUCCESS" value={`${agent.successRate}%`} icon={CheckCircle} color="green" />
              <StatBox label="LATENCY" value={`${agent.latency}ms`} icon={Clock} color="cyan" />
              <StatBox label="TIER" value={`LVL ${agent.level}`} icon={Layers} color="purple" />
              <StatBox label="HABITAT" value={agent.office} icon={Factory} color="yellow" />
            </div>

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

            <div className="bg-[hsl(var(--card)/0.4)] rounded-md border border-white/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileCode className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                <span className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase">Instructional Set</span>
              </div>
              <div className="bg-[hsl(var(--background)/0.8)] rounded-md p-5 border border-white/5 font-mono text-[11px] leading-relaxed text-slate-400">
                {agent.systemPrompt}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-4">
            <MetricDetail label="Total Consumption" value={`${agent.tokenUsage.used.toLocaleString()} units`} icon={Database} />
            <MetricDetail label="Capacity Limit" value={`${agent.tokenUsage.limit.toLocaleString()} units`} icon={Shield} />
            <MetricDetail label="Neural Threads" value={agent.concurrency.current.toString()} icon={Cpu} />
            <MetricDetail label="Max Scalability" value={agent.concurrency.max.toString()} icon={Layers} />
            <MetricDetail label="Execution Delay" value={`${agent.latency}ms`} icon={Clock} />
            <MetricDetail label="Validation Rate" value={`${agent.successRate}%`} icon={CheckCircle} />
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-8">
            <div className="bg-[hsl(var(--card)/0.4)] rounded-md border border-white/5 p-6 panel-glow-cyan">
              <h3 className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                <Power className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                Neural Status Control
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
                  <Play className="w-5 h-5" />
                  INITIATE
                </button>
                <button
                  onClick={() => onToggleStatus(agent.id, 'paused')}
                  className={`py-4 rounded-md border font-black text-[10px] tracking-[0.3em] uppercase transition-all flex flex-col items-center gap-3 ${
                    agent.status === 'paused'
                      ? 'bg-[hsl(var(--neon-yellow)/0.15)] border-[hsl(var(--neon-yellow)/0.5)] text-[hsl(var(--neon-yellow))] shadow-[0_0_15px_hsl(var(--neon-yellow)/0.2)]'
                      : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/20'
                  }`}
                >
                  <Pause className="w-5 h-5" />
                  SUSPEND
                </button>
              </div>
            </div>

            <div className="bg-[hsl(var(--card)/0.4)] rounded-md border border-white/5 p-6 border-magenta-500/20">
              <h3 className="text-[10px] font-black text-[hsl(var(--neon-magenta))] tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                <AlertTriangle className="w-4 h-4" />
                Terminal Operations
              </h3>
              <button className="w-full py-4 rounded-md border border-[hsl(var(--neon-magenta)/0.4)] bg-[hsl(var(--neon-magenta)/0.1)] hover:bg-[hsl(var(--neon-magenta)/0.2)] transition-all text-[hsl(var(--neon-magenta))] font-black text-[10px] tracking-[0.4em] uppercase shadow-[0_0_20px_hsl(var(--neon-magenta)/0.1)]">
                TERMINATE_PROCESS
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-8 border-t border-white/5 bg-[hsl(var(--background)/0.5)]">
        <button className="w-full py-5 bg-[hsl(var(--neon-purple))] hover:bg-[hsl(var(--neon-purple)/0.9)] rounded font-black text-background text-[11px] tracking-[0.4em] uppercase transition-all shadow-[0_0_25px_hsl(var(--neon-purple)/0.4)] transform hover:scale-[1.02] active:scale-[0.98]">
          Upgrade Neural Core
        </button>
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
    <div className="bg-[hsl(var(--card)/0.4)] rounded-md p-5 border border-white/5 relative overflow-hidden group">
      <div className="absolute inset-0 scanlines opacity-10" />
      <Icon className="w-5 h-5 mb-3" style={{ color: colors[color] }} />
      <div className="text-2xl font-black text-white tabular-nums tracking-tight mb-1">{value}</div>
      <div className="text-[9px] text-muted-foreground font-black tracking-[0.3em] uppercase">{label}</div>
    </div>
  );
}

function MetricDetail({ label, value, icon: Icon }: any) {
  return (
    <div className="bg-[hsl(var(--card)/0.3)] rounded p-5 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
      <div className="flex items-center gap-4">
        <Icon className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
        <span className="text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase">{label}</span>
      </div>
      <span className="text-[11px] text-white font-black tracking-widest uppercase tabular-nums">{value}</span>
    </div>
  );
}
