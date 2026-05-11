'use client';

import { Task, TaskStatus } from '@/lib/tasks/types';
import TaskCard from './TaskCard';
import { motion } from 'framer-motion';

interface TaskBoardProps {
  tasks: Task[];
  onAutoAssign: (id: string) => void;
  onExecute: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'pending', label: 'Backlog', color: 'hsl(var(--neon-cyan))' },
  { id: 'assigned', label: 'Ready', color: 'hsl(var(--neon-purple))' },
  { id: 'in_progress', label: 'Active', color: 'hsl(var(--neon-yellow))' },
  { id: 'review', label: 'QC', color: 'hsl(var(--neon-magenta))' },
  { id: 'completed', label: 'Done', color: 'hsl(var(--neon-green))' },
  { id: 'failed', label: 'Downtime', color: 'hsl(var(--neon-red))' },
];

export default function TaskBoard({ tasks, onAutoAssign, onExecute, onStatusChange }: TaskBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-6 custom-scrollbar scrollbar-hide">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter(t => t.status === col.id);
        
        return (
          <div key={col.id} className="flex flex-col gap-4 min-w-[240px]">
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: col.color, boxShadow: `0 0 8px ${col.color}` }} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/80">{col.label}</h3>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/40">{colTasks.length}</span>
            </div>

            <div className="flex flex-col gap-3 p-2 rounded bg-white/[0.02] border border-white/5 min-h-[500px]">
              {colTasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 py-12">
                  <div className="h-10 w-10 border border-dashed border-white/20 rounded-full mb-4" />
                  <p className="text-[9px] uppercase tracking-widest">No Active Nodes</p>
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onAutoAssign={onAutoAssign}
                    onExecute={onExecute}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
