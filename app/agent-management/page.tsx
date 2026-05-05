'use client';

import { useState, useEffect } from 'react';
import { employees as initialEmployees } from '@/lib/data';
import { Employee, AgentStatus } from '@/lib/types';
import { 
  Cpu, Activity, Zap, Shield, Terminal, 
  Play, Pause, RotateCcw, AlertTriangle, CheckCircle,
  ChevronRight, Hash, Lock, Globe, Database, Layers,
  Brain, Microchip, Wifi, Radio, Clock, TrendingUp,
  Settings, FileCode, Server, Power, X
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
      case 'running': return 'bg-cyan-500';
      case 'paused': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusGlow = (status: AgentStatus) => {
    switch (status) {
      case 'running': return 'shadow-cyan-500/50';
      case 'paused': return 'shadow-amber-500/50';
      case 'error': return 'shadow-red-500/50';
      default: return 'shadow-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] relative overflow-hidden scanline-overlay">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-30" />
      <div className="fixed inset-0 hex-cyber opacity-20" />
      <div className="fixed inset-0 circuit-bg" />
      
      {/* Ambient Orbs */}
      <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] animate-float-ultra" />
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] animate-float-ultra" style={{ animationDelay: '3s' }} />

      {/* Header */}
      <header className="relative z-10 border-b border-cyan-500/20 bg-[#020408]/80 backdrop-blur-xl">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Brain className="w-7 h-7 text-cyan-400" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-cyan-500/20 blur-xl animate-pulse" />
              </div>
                  <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white tracking-wider">
                    <span className="text-cyan-400">AI</span>VILLAGE
                  </h1>
                  <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono tracking-widest rounded">
                    MANAGEMENT
                  </span>
                </div>
                <p className="text-slate-400 text-sm font-mono">AUTONOMOUS WORKFORCE MATRIX // NEURAL CONTROL</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 glass-ultron rounded-lg">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-mono text-xs tracking-wider">SYSTEM ONLINE</span>
              </div>
              <div className="font-mono text-cyan-400 text-lg tracking-wider">
                {systemTime}
              </div>
            </div>
          </div>

          {/* Metrics Bar */}
          <div className="flex items-center gap-4 mt-6">
            <MetricCard label="ACTIVE AGENTS" value={running} total={agents.length} color="cyan" icon={Cpu} />
            <MetricCard label="PAUSED" value={paused} total={agents.length} color="amber" icon={Pause} />
            <MetricCard label="ERRORS" value={errors} total={agents.length} color="red" icon={AlertTriangle} />
            <MetricCard label="AVG SUCCESS" value={`${avgSuccess}%`} color="emerald" icon={TrendingUp} />
            <div className="flex-1" />
            <div className="px-4 py-2 glass-violet rounded-lg">
              <span className="text-violet-400 font-mono text-xs">TOKENS: </span>
              <span className="text-white font-mono">{(totalTokens / 1000).toFixed(0)}k</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedAgentId(agent.id)}
              onMouseEnter={() => setHoveredAgentId(agent.id)}
              onMouseLeave={() => setHoveredAgentId(null)}
              className={`group relative cursor-pointer ${hoveredAgentId === agent.id ? 'z-20' : 'z-10'}`}
            >
              <div className={`
                relative overflow-hidden rounded-xl glass-ultron p-6
                transition-all duration-300
                ${selectedAgentId === agent.id ? 'ring-2 ring-cyan-500/50 shadow-2xl shadow-cyan-500/20' : ''}
                ${hoveredAgentId === agent.id ? 'scale-[1.02] shadow-2xl' : ''}
              `}>
                {/* Gradient border on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/20 via-transparent to-violet-500/20" />
                </div>

                {/* Status indicator line */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${getStatusColor(agent.status)} ${agent.status === 'running' ? 'animate-pulse' : ''}`} />

                {/* Content */}
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center
                        bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700
                        group-hover:border-cyan-500/50 transition-all duration-300
                        ${agent.status === 'running' ? `shadow-lg ${getStatusGlow(agent.status)}` : ''}
                      `}>
                        <span className="text-2xl">{agent.avatar}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg group-hover:text-cyan-300 transition-colors">
                          {agent.name.toUpperCase()}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-mono">{agent.role.toUpperCase()}</span>
                          <span className="text-slate-600 text-xs">|</span>
                          <span className="text-cyan-400/60 text-xs font-mono">LVL.{agent.level}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`
                      w-3 h-3 rounded-full ${getStatusColor(agent.status)}
                      ${agent.status === 'running' ? 'animate-pulse' : ''}
                    `} />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-800">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Zap className="w-3 h-3 text-violet-400" />
                        <span className="text-[10px] text-slate-400 font-mono">TOKENS</span>
                      </div>
                      <div className="font-mono text-sm text-white">
                        {Math.round((agent.tokenUsage.used / agent.tokenUsage.limit) * 100)}%
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-violet-400 transition-all duration-500"
                          style={{ width: `${(agent.tokenUsage.used / agent.tokenUsage.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-800">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Activity className="w-3 h-3 text-cyan-400" />
                        <span className="text-[10px] text-slate-400 font-mono">SUCCESS</span>
                      </div>
                      <div className={`font-mono text-sm ${agent.successRate >= 90 ? 'text-emerald-400' : agent.successRate >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                        {agent.successRate}%
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${agent.successRate >= 90 ? 'bg-emerald-400' : agent.successRate >= 70 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${agent.successRate}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Wifi className={`w-3 h-3 ${agent.status === 'running' ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
                      <span className="text-[10px] text-slate-500 font-mono">{agent.latency}ms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">{agent.concurrency.current}/{agent.concurrency.max}</span>
                      <span className="text-[10px] text-slate-600">THREADS</span>
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
            className="fixed top-0 right-0 h-full w-[480px] z-50"
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
      <div className="fixed bottom-4 left-4 text-[10px] font-mono text-slate-600 flex items-center gap-2">
        <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-pulse" />
        <span>AI VILLAGE v2.4.1 // NEURAL WORKFORCE ACTIVE</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, total, color, icon: Icon }: {
  label: string;
  value: number | string;
  total?: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const colorClasses: Record<string, string> = {
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
    red: 'text-red-400 border-red-500/30 bg-red-500/5',
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
  };

  return (
    <div className={`px-4 py-3 rounded-lg border ${colorClasses[color]} flex items-center gap-3`}>
      <Icon className={`w-5 h-5 text-${color}-400`} />
      <div>
        <div className="text-[10px] font-mono text-slate-400 tracking-wider">{label}</div>
        <div className="text-xl font-bold font-mono text-white">
          {value}
          {total !== undefined && (
            <span className="text-sm text-slate-500">/{total}</span>
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
    // Default to chat tab for Hermes
    if (agent.id === 'hermes') {
      setActiveTab('chat');
    } else {
      setActiveTab('overview');
    }
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
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `ERROR: ${data.error}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect to Hermes Agent.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  const tokenPct = Math.min((agent.tokenUsage.used / agent.tokenUsage.limit) * 100, 100);
  const concurrencyPct = agent.concurrency.max > 0
    ? (agent.concurrency.current / agent.concurrency.max) * 100
    : 0;

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'running': return 'text-cyan-400';
      case 'paused': return 'text-amber-400';
      case 'error': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: Terminal },
    { id: 'metrics', label: 'METRICS', icon: Activity },
    ...(agent.id === 'hermes' ? [{ id: 'chat', label: 'THINKING', icon: Brain }] : []),
    { id: 'config', label: 'CONFIG', icon: Settings },
  ] as const;

  return (
    <div className="h-full bg-[#020408]/95 backdrop-blur-2xl border-l border-cyan-500/20 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 flex items-center justify-center">
              <span className="text-4xl">{agent.avatar}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wider">{agent.name.toUpperCase()}</h2>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 text-sm font-mono">{agent.role.toUpperCase()}</span>
                <span className="text-slate-600">|</span>
                <span className={`text-sm font-mono ${getStatusColor(agent.status)}`}>{agent.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all
                ${activeTab === tab.id 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'chat' && agent.id === 'hermes' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 space-y-4 mb-4 overflow-y-auto pr-2 custom-scrollbar">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50 space-y-4">
                  <Brain className="w-12 h-12" />
                  <p className="font-mono text-xs uppercase tracking-widest text-center">
                    Hermes Local Matrix Initialized.<br/>Awaiting Neural Input...
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[85%] p-3 rounded-lg font-mono text-xs leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' 
                      : 'bg-slate-800/80 border border-slate-700 text-slate-300'}
                  `}>
                    <div className="mb-1 text-[8px] opacity-50 uppercase tracking-tighter">
                      {msg.role === 'user' ? 'Local_Terminal' : 'Hermes_Matrix'}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-lg flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest animate-pulse">
                      Processing Matrix...
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
                placeholder="EXECUTE COMMAND..."
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg p-3 pr-12 font-mono text-xs text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none transition-all"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isThinking || !inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-cyan-500 hover:text-cyan-400 disabled:opacity-30"
              >
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <StatBox label="SUCCESS RATE" value={`${agent.successRate}%`} icon={CheckCircle} color="emerald" />
              <StatBox label="LATENCY" value={`${agent.latency}ms`} icon={Clock} color="cyan" />
              <StatBox label="LEVEL" value={agent.level.toString()} icon={Layers} color="violet" />
              <StatBox label="OFFICE" value={agent.office} icon={Server} color="amber" />
            </div>

            {/* Token Usage */}
            <div className="glass-ultron rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-400" />
                  <span className="text-sm text-slate-300 font-mono">TOKEN ALLOCATION</span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {agent.tokenUsage.used.toLocaleString()} / {agent.tokenUsage.limit.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500" style={{ width: `${tokenPct}%` }} />
              </div>
            </div>

            {/* Concurrency */}
            <div className="glass-ultron rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-slate-300 font-mono">CONCURRENCY</span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {agent.concurrency.current} / {agent.concurrency.max} THREADS
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${concurrencyPct}%` }} />
              </div>
            </div>

            {/* System Prompt */}
            <div className="glass-ultron rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-300 font-mono">SYSTEM PROMPT</span>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800">
                <p className="text-xs text-slate-400 leading-relaxed font-mono">{agent.systemPrompt}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-4">
            <MetricDetail label="Total Tokens Used" value={agent.tokenUsage.used.toLocaleString()} icon={Database} />
            <MetricDetail label="Token Limit" value={agent.tokenUsage.limit.toLocaleString()} icon={Shield} />
            <MetricDetail label="Current Threads" value={agent.concurrency.current.toString()} icon={Cpu} />
            <MetricDetail label="Max Threads" value={agent.concurrency.max.toString()} icon={Layers} />
            <MetricDetail label="Avg Latency" value={`${agent.latency}ms`} icon={Clock} />
            <MetricDetail label="Success Rate" value={`${agent.successRate}%`} icon={CheckCircle} />
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            {/* Status Control */}
            <div className="glass-ultron rounded-xl p-4">
              <h3 className="text-sm text-slate-300 font-mono mb-4 flex items-center gap-2">
                <Power className="w-4 h-4 text-cyan-400" />
                STATUS CONTROL
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onToggleStatus(agent.id, 'running')}
                  className={`p-3 rounded-lg border font-mono text-xs transition-all ${
                    agent.status === 'running'
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-cyan-500/30'
                  }`}
                >
                  <Play className="w-4 h-4 mx-auto mb-1" />
                  RUN
                </button>
                <button
                  onClick={() => onToggleStatus(agent.id, 'paused')}
                  className={`p-3 rounded-lg border font-mono text-xs transition-all ${
                    agent.status === 'paused'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-amber-500/30'
                  }`}
                >
                  <Pause className="w-4 h-4 mx-auto mb-1" />
                  PAUSE
                </button>
              </div>
            </div>

            {/* Model Selection */}
            <div className="glass-ultron rounded-xl p-4">
              <h3 className="text-sm text-slate-300 font-mono mb-4 flex items-center gap-2">
                <Microchip className="w-4 h-4 text-violet-400" />
                AI MODEL
              </h3>
              <div className="space-y-2">
                {['GPT-4o', 'Claude 3.5', 'Gemini 2.5 Flash', 'Gemini Pro'].map((model) => (
                  <button
                    key={model}
                    className="w-full p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:border-violet-500/30 transition-all text-left"
                  >
                    <span className="text-xs font-mono text-slate-300">{model}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-ultron rounded-xl p-4 border-red-500/20">
              <h3 className="text-sm text-red-400 font-mono mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                DANGER ZONE
              </h3>
              <button className="w-full p-3 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-all text-red-400 font-mono text-xs">
                TERMINATE AGENT
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-cyan-500/20">
        <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg font-bold text-white font-mono tracking-wider hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
          UPGRADE AGENT
        </button>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color }: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const colors: Record<string, string> = {
    emerald: 'text-emerald-400 border-emerald-500/30',
    cyan: 'text-cyan-400 border-cyan-500/30',
    violet: 'text-violet-400 border-violet-500/30',
    amber: 'text-amber-400 border-amber-500/30',
  };

  return (
    <div className={`glass-ultron rounded-xl p-4 border ${colors[color]}`}>
      <Icon className={`w-5 h-5 text-${color}-400 mb-2`} />
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      <div className="text-[10px] text-slate-400 font-mono tracking-wider">{label}</div>
    </div>
  );
}

function MetricDetail({ label, value, icon: Icon }: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="glass-ultron rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-cyan-400" />
        <span className="text-sm text-slate-300 font-mono">{label}</span>
      </div>
      <span className="text-sm text-white font-mono">{value}</span>
    </div>
  );
}
