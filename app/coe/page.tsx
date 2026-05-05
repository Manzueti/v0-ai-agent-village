'use client';

import { useState } from 'react';
import { employees } from '@/lib/data';
import { Employee } from '@/lib/types';
import { 
  Send, Bot, Terminal, Zap, Shield, Brain, Activity, Target, CheckCircle2, ChevronRight, Play, Loader2, Database, Factory, Sparkles, Command, Cpu
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
    <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col scanlines">
      {/* Background Ambience */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-20 border-b border-white/5 bg-[hsl(var(--background)/0.8)] backdrop-blur-xl px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-magenta))] grid place-items-center shadow-[0_0_15px_hsl(var(--neon-purple)/0.4)]">
              <Target className="w-6 h-6 text-background" />
            </div>
            <div>
              <span className="text-white font-black tracking-[0.2em] uppercase text-sm block leading-none">Center of Excellence</span>
              <span className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase font-bold">VYBECORP Global Directive Matrix</span>
            </div>
          </div>
          <div className="h-6 w-px bg-white/5" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--neon-purple)/0.05)] border border-[hsl(var(--neon-purple)/0.2)] rounded-md">
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--neon-purple))] pulse-dot shadow-[0_0_8px_hsl(var(--neon-purple))]" />
            <span className="text-[9px] font-black text-[hsl(var(--neon-purple))] uppercase tracking-[0.25em]">COE_ACTIVE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-muted-foreground/40">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Capacity: 100%</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex p-8 gap-8 overflow-hidden h-[calc(100vh-100px)]">
        {/* Left Panel - Agents */}
        <div className="w-80 flex flex-col gap-4 h-full">
          <h2 className="text-[10px] font-black text-white font-mono uppercase tracking-[0.3em] flex items-center gap-3 px-2">
            <Shield className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
            Target Selection
          </h2>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar scrollbar-hide">
            {employees.map(agent => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`w-full p-4 rounded-md text-left transition-all border group ${
                  selectedAgentId === agent.id
                    ? 'bg-[hsl(var(--neon-purple)/0.1)] border-[hsl(var(--neon-purple)/0.4)] panel-glow-purple shadow-lg'
                    : 'bg-white/5 border-transparent hover:border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded bg-[hsl(var(--background))] border border-white/10 flex items-center justify-center text-2xl flex-shrink-0 group-hover:border-[hsl(var(--neon-purple)/0.5)] transition-all ${selectedAgentId === agent.id ? 'panel-glow-purple' : ''}`}>
                    {agent.avatar}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-black text-sm tracking-tight leading-none mb-1 ${selectedAgentId === agent.id ? 'text-[hsl(var(--neon-purple))]' : 'text-white'}`}>
                      {agent.name.toUpperCase()}
                    </h3>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest truncate">{agent.role}</p>
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
            <motion.div 
              layoutId="agent-info"
              className="bg-[hsl(var(--card)/0.4)] backdrop-blur-md rounded-md p-6 border border-white/5 shrink-0 relative overflow-hidden scanlines panel-glow-cyan"
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded bg-[hsl(var(--background))] border border-white/10 flex items-center justify-center text-3xl shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
                    {selectedAgent.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-2">{selectedAgent.name.toUpperCase()}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-[hsl(var(--neon-cyan))] text-[10px] font-black tracking-[0.3em] uppercase">LVL_{selectedAgent.level}</span>
                      <span className="text-white/10">|</span>
                      <span className="text-muted-foreground text-[10px] font-black tracking-[0.3em] uppercase">{selectedAgent.office.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 rounded bg-[hsl(var(--neon-green)/0.05)] border border-[hsl(var(--neon-green)/0.2)] text-[10px] font-black text-[hsl(var(--neon-green))] flex items-center gap-3 tracking-[0.2em]">
                  <div className="w-1.5 h-1.5 rounded-full bg-current pulse-dot shadow-[0_0_8px_currentColor]" />
                  SYNC_STABLE
                </div>
              </div>
              <div className="mt-6 relative z-10">
                <div className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.4em] mb-2 px-1">CURRENT_SYSTEM_PROMPT</div>
                <div className="bg-[hsl(var(--background)/0.8)] p-4 rounded border border-white/5 font-mono text-[11px] leading-relaxed text-slate-400 max-h-32 overflow-y-auto scrollbar-hide">
                  {selectedAgent.systemPrompt}
                </div>
              </div>
            </motion.div>
          )}

          {/* Instruction Input */}
          <div className="bg-[hsl(var(--card)/0.4)] backdrop-blur-md rounded-md p-6 border border-white/5 flex flex-col flex-1 min-h-[300px] relative overflow-hidden scanlines panel-glow-purple">
            <h2 className="text-[10px] font-black text-white font-mono uppercase tracking-[0.3em] flex items-center gap-3 mb-6 shrink-0 relative z-10">
              <Command className="w-4 h-4 text-[hsl(var(--neon-purple))]" />
              New Operational Directive
            </h2>
            <div className="relative flex-1 flex flex-col z-10">
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder={`Dispatch high-level instructions to ${selectedAgent?.name}...`}
                className="flex-1 w-full bg-[hsl(var(--background)/0.6)] border border-white/5 rounded-md p-6 text-sm text-white font-mono placeholder:text-muted-foreground/20 focus:outline-none focus:border-[hsl(var(--neon-purple)/0.4)] transition-all resize-none mb-6 custom-scrollbar scrollbar-hide shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]"
              />
              <div className="flex justify-end shrink-0">
                <button
                  onClick={handleExecute}
                  disabled={!instruction.trim() || isExecuting}
                  className={`
                    px-10 py-4 bg-[hsl(var(--neon-purple))] hover:bg-[hsl(var(--neon-purple)/0.9)] 
                    disabled:bg-white/5 disabled:text-muted-foreground/20 
                    text-background rounded-md font-black tracking-[0.4em] font-mono text-xs 
                    flex items-center gap-4 transition-all shadow-[0_0_25px_hsl(var(--neon-purple)/0.4)] 
                    transform hover:scale-[1.02] active:scale-[0.98]
                  `}
                >
                  {isExecuting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                  {isExecuting ? 'TRANSMITTING...' : 'EXECUTE_DIRECTIVE'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Execution Logs */}
        <div className="w-[420px] flex flex-col gap-4 h-full">
          <h2 className="text-[10px] font-black text-white font-mono uppercase tracking-[0.3em] flex items-center gap-3 px-2 shrink-0">
            <Activity className="w-4 h-4 text-[hsl(var(--neon-green))]" />
            Neural Execution Log
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar scrollbar-hide pb-6">
            <AnimatePresence>
              {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/20 space-y-6 min-h-[300px]">
                  <Database className="w-16 h-16" />
                  <p className="font-black text-[10px] uppercase tracking-[0.5em] text-center leading-loose">No Directives Logged In Buffer</p>
                </div>
              )}
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-5 rounded border scanlines relative overflow-hidden ${
                    log.status === 'executing' ? 'bg-[hsl(var(--neon-yellow)/0.05)] border-[hsl(var(--neon-yellow)/0.3)] panel-glow-yellow' :
                    log.status === 'error' ? 'bg-[hsl(var(--neon-magenta)/0.05)] border-[hsl(var(--neon-magenta)/0.3)] panel-glow-magenta' :
                    'bg-[hsl(var(--neon-green)/0.05)] border-[hsl(var(--neon-green)/0.3)] panel-glow-cyan'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className="text-xs font-black text-white tracking-tight uppercase">{log.agentName}</span>
                    <span className="text-[9px] font-black text-muted-foreground tracking-widest tabular-nums opacity-60">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-black tracking-widest mb-4 line-clamp-2 uppercase bg-[hsl(var(--background)/0.5)] p-2 rounded relative z-10">
                    &gt; {log.instruction}
                  </p>
                  
                  <div className="relative z-10">
                    {log.status === 'executing' ? (
                      <div className="flex items-center gap-3 text-[10px] font-black text-[hsl(var(--neon-yellow))] tracking-[0.2em]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        TRANSMITTING_TO_NEURAL_CORE...
                      </div>
                    ) : log.status === 'error' ? (
                      <div className="text-[10px] font-black text-[hsl(var(--neon-magenta))] bg-[hsl(var(--neon-magenta)/0.1)] p-3 rounded border border-[hsl(var(--neon-magenta)/0.2)] tracking-widest uppercase">
                        ERROR_ENCOUNTERED: {log.result}
                      </div>
                    ) : (
                      <div className="text-[10px] font-medium text-[hsl(var(--neon-green))] bg-[hsl(var(--neon-green)/0.05)] p-4 rounded border border-[hsl(var(--neon-green)/0.2)] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto scrollbar-hide font-mono">
                        <div className="flex items-center gap-2 mb-2 text-[9px] font-black opacity-50 uppercase tracking-[0.3em]">
                          <CheckCircle2 className="w-3 h-3" />
                          Execution_Output
                        </div>
                        {log.result}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer decoration */}
      <footer className="relative z-20 h-10 border-t border-white/5 bg-[hsl(var(--background)/0.8)] backdrop-blur-md flex items-center justify-between px-8">
        <div className="flex gap-8 text-[10px] font-bold tracking-[0.3em] text-muted-foreground/40 uppercase">
          <span>Global Directive Authority</span>
          <span className="text-[hsl(var(--neon-purple))]">● UPLINK_ENCRYPTED</span>
        </div>
        <div className="flex gap-8 text-[10px] font-bold tracking-[0.3em] text-muted-foreground/40 uppercase">
          <span>COE Neural OS</span>
          <span>v2.5.0</span>
        </div>
      </footer>
    </div>
  );
}
