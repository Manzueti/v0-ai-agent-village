'use client';

import { useState } from 'react';
import { TASK_TEMPLATES, TaskTemplate } from '@/lib/tasks/types';
import { Plus, Zap, Target, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskCreatorProps {
  onCreate: (templateId: string, customizations?: any) => void;
}

export default function TaskCreator({ onCreate }: TaskCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-2 bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.4)] text-[hsl(var(--neon-cyan))] rounded flex items-center gap-3 hover:bg-[hsl(var(--neon-cyan)/0.2)] transition-all group"
      >
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.25em]">Initialize New Mission</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-4 w-[600px] bg-[hsl(var(--sidebar-background)/0.98)] backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl z-50 grid grid-cols-2 gap-4"
          >
            <div className="col-span-2 flex items-center justify-between mb-2">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Task Templates</h3>
              <button onClick={() => setIsOpen(false)} className="text-[8px] uppercase tracking-widest text-muted-foreground hover:text-white">Close</button>
            </div>

            {TASK_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => { onCreate(template.id); setIsOpen(false); }}
                className="text-left p-4 rounded bg-white/5 border border-white/5 hover:border-[hsl(var(--neon-cyan)/0.4)] hover:bg-[hsl(var(--neon-cyan)/0.05)] transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{template.department}</span>
                  <Zap className="w-3 h-3 text-[hsl(var(--neon-yellow))] opacity-40 group-hover:opacity-100" />
                </div>
                <h4 className="text-[11px] font-black text-white mb-1 tracking-wider uppercase group-hover:text-[hsl(var(--neon-cyan))]">{template.title}</h4>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{template.description}</p>
              </button>
            ))}
            
            <button className="col-span-2 mt-2 py-3 border border-dashed border-white/10 rounded text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:border-white/20 hover:text-white transition-all">
              Construct Custom Objective
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
