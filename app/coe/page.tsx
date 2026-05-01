'use client';

import { useState } from 'react';
import { employees } from '@/lib/data';
import { Employee } from '@/lib/types';
import { 
  Send, Bot, Terminal, Zap, Shield, Brain, Activity, Target, CheckCircle2, ChevronRight, Play, Loader2, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ExecutionLog = {
  id: string;
  agentId: string;
  agentName: string;
  instruction: string;
  status: 'executing' | 'completed' | 'error';
  result?: string;
  timestamp: Date;
};

export default function COEPlatform() {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(employees[0].id);
  const [instruction, setInstruction] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);

  const selectedAgent = employees.find(a => a.id === selectedAgentId);

  const handleExecute = async () => {
    if (!instruction.trim() || !selectedAgent || isExecuting) return;

    const newLogId = Date.now().toString();
    const newLog: ExecutionLog = {
      id: newLogId,
      agentId: selectedAgent.id,
      agentName: selectedAgent.name,
      instruction: instruction.trim(),
      status: 'executing',
      timestamp: new Date()
    };

    setLogs(prev => [newLog, ...prev]);
    setIsExecuting(true);
    setInstruction('');

    try {
      if (selectedAgent.id === 'hermes') {
        const response = await fetch('/api/hermes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `[COE DIRECTIVE]: ${newLog.instruction}` })
        });
        const data = await response.json();
        
        setLogs(prev => prev.map(log => 
          log.id === newLogId 
            ? { ...log, status: data.error ? 'error' : 'completed', result: data.response || data.error }
            : log
        ));
      } else {
        // Live Gemini execution for standard agents
        const response = await fetch('/api/coe/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            instruction: newLog.instruction,
            agentName: selectedAgent.name,
            agentRole: selectedAgent.role,
            systemPrompt: selectedAgent.systemPrompt
          })
        });

        if (!response.ok) throw new Error('Failed to connect to COE Matrix');

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          fullResponse += decoder.decode(value);
          
          setLogs(prev => prev.map(log => 
            log.id === newLogId 
              ? { ...log, status: 'completed', result: fullResponse }
              : log
          ));
        }
      }
    } catch (error: any) {
      setLogs(prev => prev.map(log => 
        log.id === newLogId ? { ...log, status: 'error', result: error.message || 'Execution failed' } : log
      ));
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 cyber-grid opacity-30" />
      <div className="fixed inset-0 hex-cyber opacity-20" />

      {/* Header */}
      <header className="relative z-10 border-b border-cyan-500/20 bg-[#020408]/80 backdrop-blur-xl px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/40 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Target className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">CENTER OF <span className="text-violet-400">EXCELLENCE</span></h1>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mt-1">Global Agent Instruction Matrix</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 glass-violet rounded-lg">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-mono text-xs tracking-wider">COE ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex p-8 gap-8 overflow-hidden h-[calc(100vh-100px)]">
        {/* Left Panel - Agents */}
        <div className="w-80 flex flex-col gap-4 h-full">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Select Agent Target
          </h2>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {employees.map(agent => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`w-full p-4 rounded-xl text-left transition-all border ${
                  selectedAgentId === agent.id
                    ? 'bg-violet-500/10 border-violet-500/50 shadow-lg shadow-violet-500/10'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{agent.avatar}</span>
                  <div>
                    <h3 className={`font-bold text-sm ${selectedAgentId === agent.id ? 'text-violet-400' : 'text-white'}`}>
                      {agent.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{agent.role}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center Panel - Instruction Interface */}
        <div className="flex-1 flex flex-col gap-6 h-full">
          {/* Active Agent Info */}
          {selectedAgent && (
            <div className="glass-ultron rounded-2xl p-6 border-violet-500/20 shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl">
                    {selectedAgent.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedAgent.name}</h2>
                    <p className="text-sm text-cyan-400 font-mono mt-1">LVL.{selectedAgent.level} // {selectedAgent.office}</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE NEURAL LINK
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-4 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                {selectedAgent.systemPrompt}
              </p>
            </div>
          )}

          {/* Instruction Input */}
          <div className="glass-ultron rounded-2xl p-6 border-cyan-500/20 flex flex-col flex-1 min-h-[300px]">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2 mb-4 shrink-0">
              <Terminal className="w-4 h-4 text-cyan-400" />
              New Directive / Instruction
            </h2>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={`Enter instructions for ${selectedAgent?.name} to execute or improve upon...`}
              className="flex-1 w-full bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 resize-none mb-4 custom-scrollbar"
            />
            <div className="flex justify-end shrink-0">
              <button
                onClick={handleExecute}
                disabled={!instruction.trim() || isExecuting}
                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold tracking-wider font-mono flex items-center gap-3 transition-all shadow-lg shadow-cyan-500/20 disabled:shadow-none"
              >
                {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {isExecuting ? 'TRANSMITTING...' : 'EXECUTE DIRECTIVE'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Execution Logs */}
        <div className="w-[400px] flex flex-col gap-4 h-full">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2 shrink-0">
            <Activity className="w-4 h-4 text-emerald-400" />
            Execution Matrix
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar pb-4">
            <AnimatePresence>
              {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 space-y-4 min-h-[300px]">
                  <Database className="w-12 h-12" />
                  <p className="text-xs font-mono text-center uppercase tracking-widest">No Directives Logged</p>
                </div>
              )}
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-xl border ${
                    log.status === 'executing' ? 'bg-amber-500/10 border-amber-500/30' :
                    log.status === 'error' ? 'bg-red-500/10 border-red-500/30' :
                    'bg-emerald-500/10 border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">{log.agentName}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono mb-3 line-clamp-2 opacity-80">
                    &gt; {log.instruction}
                  </p>
                  
                  {log.status === 'executing' ? (
                    <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      EXECUTING...
                    </div>
                  ) : log.status === 'error' ? (
                    <div className="text-[10px] font-mono text-red-400 bg-red-500/10 p-2 rounded">
                      ERROR: {log.result}
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                      <CheckCircle2 className="w-3 h-3 inline mr-1 mb-0.5" />
                      {log.result}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}