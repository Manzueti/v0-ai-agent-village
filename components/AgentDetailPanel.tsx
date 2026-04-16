'use client';

import { useState } from 'react';
import { Employee, AgentStatus } from '@/lib/types';
import { X, TrendingUp, Zap, Shield, Clock, Activity, Cpu } from 'lucide-react';

type Props = {
  agent: Employee;
  onClose: () => void;
  onUpdateAgent: (id: string, updates: Partial<Employee>) => void;
  onToggleStatus: (id: string, newStatus: string) => void;
};

const MODELS = ['GPT-4o', 'GPT-4 Turbo', 'Claude 3.5', 'Gemini 1.5'];

export default function AgentDetailPanel({ agent, onClose, onUpdateAgent, onToggleStatus }: Props) {
  const [tab, setTab] = useState<'overview' | 'stats' | 'settings'>('overview');
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const [memoryEnabled, setMemoryEnabled] = useState(true);

  const tokenPct = Math.min((agent.tokenUsage.used / agent.tokenUsage.limit) * 100, 100);
  const concurrencyPct = agent.concurrency.max > 0
    ? (agent.concurrency.current / agent.concurrency.max) * 100
    : 0;

  const statusOptions: { value: AgentStatus; label: string; color: string }[] = [
    { value: 'running', label: 'Running', color: 'bg-green-600 border-green-800' },
    { value: 'paused', label: 'Paused', color: 'bg-yellow-600 border-yellow-800' },
    { value: 'idle', label: 'Idle', color: 'bg-slate-500 border-slate-700' },
    { value: 'error', label: 'Error', color: 'bg-red-700 border-red-900' },
  ];

  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-[440px] z-50 animate-slide-in">
      <div className="h-full bg-gradient-to-b from-slate-900 to-slate-800 border-l-4 border-yellow-700 shadow-2xl flex flex-col text-white overflow-hidden">

        {/* Wooden Header */}
        <div className="bg-gradient-to-r from-amber-800 via-amber-600 to-amber-800 p-4 border-b-4 border-amber-900 flex justify-between items-center shadow-lg flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold tracking-wide" style={{ textShadow: '2px 2px 0 #000' }}>
              {agent.name}
            </h2>
            <p className="text-amber-200 text-xs font-semibold mt-0.5">{agent.role} · {agent.office}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-red-900 rounded-full border-2 border-black hover:bg-red-700 transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Avatar Display */}
        <div className="relative h-28 bg-slate-700/50 flex items-center justify-center flex-shrink-0">
          <div className="text-7xl" style={{ animation: 'bounce-slow 3s infinite ease-in-out' }}>
            {agent.avatar}
          </div>
          {/* Level Badge */}
          <div className="absolute top-3 left-4 bg-yellow-400 text-black font-bold text-sm px-3 py-0.5 rounded-full border-2 border-yellow-700 shadow">
            LVL {agent.level}
          </div>
          {/* Status Badge */}
          <div className={`absolute top-3 right-4 px-3 py-0.5 rounded-full text-xs font-bold border-2 ${
            agent.status === 'running' ? 'bg-green-500 border-green-900 text-white animate-pulse' :
            agent.status === 'paused' ? 'bg-yellow-500 border-yellow-900 text-black' :
            agent.status === 'error' ? 'bg-red-500 border-red-900 text-white' :
            'bg-slate-400 border-slate-700 text-black'
          }`}>
            {agent.status.toUpperCase()}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent h-10" />
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-around px-3 py-2 bg-slate-800 border-b border-slate-600 flex-shrink-0">
          {(['overview', 'stats', 'settings'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md font-bold uppercase text-xs border-b-4 transition-all ${
                tab === t
                  ? 'bg-green-600 border-green-900 text-white scale-105 shadow'
                  : 'bg-slate-600 border-slate-800 text-slate-300 hover:bg-slate-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">

          {/* ── OVERVIEW TAB ── */}
          {tab === 'overview' && (
            <>
              <div className="bg-slate-700/60 p-3 rounded-lg border-2 border-slate-600 shadow-inner">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-300 font-bold flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4" /> Elixir (Tokens)
                  </span>
                  <span className="text-xs text-slate-300">{agent.tokenUsage.used.toLocaleString()} / {agent.tokenUsage.limit.toLocaleString()}</span>
                </div>
                <div className="w-full h-4 bg-purple-950 rounded-full overflow-hidden border border-black">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-700" style={{ width: `${tokenPct}%` }} />
                </div>
                <p className="text-right text-xs text-slate-400 mt-1">{tokenPct.toFixed(1)}% used</p>
              </div>

              <div className="bg-slate-700/60 p-3 rounded-lg border-2 border-slate-600 shadow-inner">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-300 font-bold flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4" /> Success Rate
                  </span>
                  <span className="text-xs text-slate-300">{agent.successRate}%</span>
                </div>
                <div className="w-full h-4 bg-green-950 rounded-full overflow-hidden border border-black">
                  <div
                    className={`h-full transition-all duration-700 ${agent.successRate > 80 ? 'bg-gradient-to-r from-green-400 to-green-600' : agent.successRate > 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`}
                    style={{ width: `${agent.successRate}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-700/60 p-3 rounded-lg border-2 border-slate-600 shadow-inner">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-yellow-300 font-bold flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4" /> Concurrency
                  </span>
                  <span className="text-xs text-slate-300">{agent.concurrency.current} / {agent.concurrency.max} threads</span>
                </div>
                <div className="w-full h-4 bg-yellow-950 rounded-full overflow-hidden border border-black">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-700" style={{ width: `${concurrencyPct}%` }} />
                </div>
              </div>

              <div className="bg-slate-700/60 p-3 rounded-lg border-2 border-slate-600 shadow-inner">
                <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">System Prompt Preview</p>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{agent.systemPrompt}</p>
              </div>
            </>
          )}

          {/* ── STATS TAB ── */}
          {tab === 'stats' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={<Clock className="w-5 h-5 text-blue-400" />} label="Avg Latency" value={`${agent.latency}ms`} color="border-blue-800" />
                <StatCard icon={<TrendingUp className="w-5 h-5 text-green-400" />} label="Success Rate" value={`${agent.successRate}%`} color="border-green-800" />
                <StatCard icon={<Zap className="w-5 h-5 text-purple-400" />} label="Tokens Used" value={agent.tokenUsage.used.toLocaleString()} color="border-purple-800" />
                <StatCard icon={<Activity className="w-5 h-5 text-yellow-400" />} label="Concurrency" value={`${agent.concurrency.current}/${agent.concurrency.max}`} color="border-yellow-800" />
              </div>
              <div className="bg-slate-700/60 p-3 rounded-lg border-2 border-slate-600">
                <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-3">Performance Grade</p>
                <div className="flex items-center justify-center">
                  <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-3xl font-black shadow-lg ${
                    agent.successRate >= 90 ? 'border-green-500 text-green-400 bg-green-900/30' :
                    agent.successRate >= 70 ? 'border-yellow-500 text-yellow-400 bg-yellow-900/30' :
                    'border-red-500 text-red-400 bg-red-900/30'
                  }`}>
                    {agent.successRate >= 90 ? 'A' : agent.successRate >= 70 ? 'B' : 'D'}
                  </div>
                </div>
                <p className="text-center text-slate-400 text-xs mt-2">
                  {agent.successRate >= 90 ? 'Excellent performance' : agent.successRate >= 70 ? 'Acceptable performance' : 'Needs attention'}
                </p>
              </div>
            </>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === 'settings' && (
            <>
              {/* Status Control */}
              <div className="bg-slate-700/60 p-3 rounded-lg border-2 border-slate-600">
                <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">Agent Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onUpdateAgent(agent.id, { status: opt.value })}
                      className={`py-2 rounded-lg border-b-4 text-xs font-bold transition-all ${
                        agent.status === opt.value
                          ? `${opt.color} text-white scale-105 shadow`
                          : 'bg-slate-600 border-slate-800 text-slate-300 hover:bg-slate-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Memory Toggle */}
              <div className="bg-slate-700/60 p-3 rounded-lg border-2 border-slate-600 flex justify-between items-center">
                <span className="font-bold text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" /> Persistent Memory
                </span>
                <button
                  onClick={() => setMemoryEnabled(!memoryEnabled)}
                  className={`w-12 h-6 rounded-full border-2 relative transition-colors duration-200 ${memoryEnabled ? 'bg-green-600 border-green-900' : 'bg-slate-600 border-slate-800'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${memoryEnabled ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Model Selector */}
              <div className="bg-slate-700/60 p-3 rounded-lg border-2 border-slate-600">
                <span className="font-bold text-sm flex items-center gap-2 mb-3">
                  <Cpu className="w-4 h-4 text-cyan-400" /> Model Selector
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {MODELS.map((model) => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`p-2 rounded-lg text-center border-b-4 text-xs font-bold transition-all ${
                        selectedModel === model
                          ? 'bg-blue-600 border-blue-900 text-white scale-105 shadow'
                          : 'bg-slate-600 border-slate-800 text-slate-300 hover:bg-slate-500'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              {/* System Prompt Editor */}
              <div className="bg-slate-700/60 p-3 rounded-lg border-2 border-slate-600">
                <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">System Prompt</p>
                <textarea
                  className="w-full h-24 bg-slate-900 text-slate-300 text-xs rounded-md p-2 border border-slate-600 focus:border-yellow-600 outline-none resize-none leading-relaxed"
                  defaultValue={agent.systemPrompt}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-700 flex-shrink-0">
          <button className="w-full py-3 bg-gradient-to-b from-green-500 to-green-700 rounded-lg font-bold text-base border-b-4 border-green-900 hover:from-green-400 hover:to-green-600 active:border-b-0 active:translate-y-1 shadow-lg text-white tracking-wide transition-all" style={{ textShadow: '1px 1px 0 #000' }}>
            ⬆ UPGRADE AGENT
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className={`bg-slate-700/60 p-3 rounded-lg border-2 ${color} shadow-inner flex flex-col items-center gap-1`}>
      {icon}
      <span className="text-lg font-black text-white">{value}</span>
      <span className="text-xs text-slate-400 font-semibold">{label}</span>
    </div>
  );
}
