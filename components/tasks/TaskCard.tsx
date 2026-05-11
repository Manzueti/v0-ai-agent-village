'use client';

import { Task } from '@/lib/tasks/types';
import { motion } from 'framer-motion';
import { 
  AlertCircle, CheckCircle2, Clock, 
  MoreVertical, User, Zap, Star
} from 'lucide-react';
import { employees } from '@/lib/data';

interface TaskCardProps {
  task: Task;
  onAutoAssign: (id: string) => void;
  onExecute: (id: string) => void;
}

export default function TaskCard({ task, onAutoAssign, onExecute }: TaskCardProps) {
  const agent = task.assignedTo ? employees.find(e => e.id === task.assignedTo) : null;

  const priorityColors = {
    low: 'text-blue-400 border-blue-400/30 bg-blue-400/5',
    medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
    high: 'text-orange-400 border-orange-400/30 bg-orange-400/5',
    critical: 'text-red-400 border-red-400/30 bg-red-400/5',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[hsl(var(--card)/0.4)] border border-white/10 rounded p-4 group hover:border-[hsl(var(--neon-purple)/0.4)] transition-all relative overflow-hidden"
    >
      <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <button className="text-muted-foreground hover:text-white transition-colors">
          <MoreVertical className="w-3 h-3" />
        </button>
      </div>

      <h4 className="text-xs font-black text-white mb-1 group-hover:text-[hsl(var(--neon-cyan))] transition-colors truncate">
        {task.title.toUpperCase()}
      </h4>
      <p className="text-[10px] text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
        {task.description}
      </p>

      <div className="space-y-3">
        {/* Assigned Agent */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            {agent ? (
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                {agent.avatar}
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border border-dashed border-white/20 flex items-center justify-center text-muted-foreground">
                <User className="w-2.5 h-2.5" />
              </div>
            )}
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              {agent ? agent.name : 'Unassigned'}
            </span>
          </div>
          
          {!agent && (
            <button 
              onClick={() => onAutoAssign(task.id)}
              className="text-[8px] font-black text-[hsl(var(--neon-cyan))] uppercase tracking-widest hover:underline"
            >
              Auto-Assign
            </button>
          )}
        </div>

        {/* Action Button */}
        {task.status === 'assigned' && (
          <button 
            onClick={() => onExecute(task.id)}
            className="w-full py-2 bg-[hsl(var(--neon-purple)/0.1)] border border-[hsl(var(--neon-purple)/0.3)] text-[hsl(var(--neon-purple))] rounded flex items-center justify-center gap-2 hover:bg-[hsl(var(--neon-purple)/0.2)] transition-all group/btn"
          >
            <Zap className="w-3 h-3 group-hover/btn:fill-current" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Initiate Execution</span>
          </button>
        )}

        <div className="flex items-center justify-between text-[8px] text-muted-foreground/40 font-mono tracking-widest">
          <span>{task.id.slice(0, 8)}</span>
          <div className="flex items-center gap-1">
            <Star className="w-2 h-2 fill-current" />
            <span>{task.xpReward} XP</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
