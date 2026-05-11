'use client';

import { useTasks } from '@/hooks/use-tasks';
import TaskBoard from './TaskBoard';
import TaskCreator from './TaskCreator';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Activity, Layout, 
  RefreshCw, Layers, Brain
} from 'lucide-react';
import { useState } from 'react';

export default function TaskCommandCenter() {
  const { 
    tasks, loading, refresh, 
    createTask, autoAssign, 
    updateStatus, executeTask 
  } = useTasks();
  
  const [activeView, setActiveView] = useState<'board' | 'matrix'>('board');
  const [executionOutput, setExecutionOutput] = useState<{taskId: string, content: string} | null>(null);

  const handleExecute = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setExecutionOutput({ taskId, content: '' });
    updateStatus(taskId, 'in_progress');

    const response = await executeTask(taskId);
    if (response && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        setExecutionOutput(prev => prev ? { ...prev, content: prev.content + text } : null);
      }
      
      updateStatus(taskId, 'completed');
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 h-full relative">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Target className="w-5 h-5 text-[hsl(var(--neon-purple))]" />
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">Task Command Center</h1>
          </div>
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase opacity-60">Mission Control & Neural Distribution</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 rounded p-1 border border-white/5">
            <button 
              onClick={() => setActiveView('board')}
              className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${activeView === 'board' ? 'bg-[hsl(var(--neon-purple)/0.2)] text-[hsl(var(--neon-purple))] shadow-[0_0_10px_hsl(var(--neon-purple)/0.2)]' : 'text-muted-foreground hover:text-white'}`}
            >
              Kanban
            </button>
            <button 
              onClick={() => setActiveView('matrix')}
              className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${activeView === 'matrix' ? 'bg-[hsl(var(--neon-purple)/0.2)] text-[hsl(var(--neon-purple))] shadow-[0_0_10px_hsl(var(--neon-purple)/0.2)]' : 'text-muted-foreground hover:text-white'}`}
            >
              Matrix
            </button>
          </div>
          <TaskCreator onCreate={createTask} />
        </div>
      </header>

      {/* Main View Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center opacity-40">
            <RefreshCw className="w-8 h-8 animate-spin text-[hsl(var(--neon-cyan))]" />
          </div>
        ) : (
          <TaskBoard 
            tasks={tasks} 
            onAutoAssign={autoAssign} 
            onExecute={handleExecute}
            onStatusChange={updateStatus}
          />
        )}
      </div>

      {/* Floating Execution Console */}
      <AnimatePresence>
        {executionOutput && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-12 right-12 w-[400px] h-[300px] bg-black/90 backdrop-blur-xl border border-[hsl(var(--neon-cyan)/0.4)] rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between bg-[hsl(var(--neon-cyan)/0.1)]">
              <div className="flex items-center gap-2">
                <Brain className="w-3 h-3 text-[hsl(var(--neon-cyan))]" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Link Active</span>
              </div>
              <button 
                onClick={() => setExecutionOutput(null)}
                className="text-muted-foreground hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-4 font-mono text-[10px] leading-relaxed text-cyan-50/80 overflow-y-auto custom-scrollbar">
              <div className="text-[hsl(var(--neon-cyan))] mb-2 tracking-widest uppercase font-bold">>> EXECUTION LOG</div>
              {executionOutput.content}
              <span className="animate-pulse">_</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
