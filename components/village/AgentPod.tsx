'use client';

import { Employee } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Terminal, Monitor, Coffee, Laptop, 
  Database, Briefcase, Zap, Brain
} from 'lucide-react';

interface AgentPodProps {
  agent: Employee;
}

export default function AgentPod({ agent }: AgentPodProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isWorking, setIsWorking] = useState(true);
  const [activity, setActivity] = useState('Processing...');

  // Random movement within the "room"
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        setPosition({
          x: (Math.random() - 0.5) * 40,
          y: (Math.random() - 0.5) * 40
        });
        setActivity(getRandomActivity());
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getRandomActivity = () => {
    const activities = [
      'Refining logic...',
      'Analyzing data...',
      'Neural sync active',
      'Optimizing routes',
      'Thinking...',
      'Brewing coffee.js',
      'Debugging core'
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  };

  return (
    <div className="relative w-64 h-64 bg-slate-900/40 rounded-2xl border border-cyan-500/20 backdrop-blur-md overflow-hidden group">
      {/* Room Background / Floor */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      
      {/* Desk / Workstation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center justify-around px-4">
        <Monitor className="w-4 h-4 text-cyan-500/50" />
        <Laptop className="w-4 h-4 text-cyan-500/50" />
        <Coffee className="w-3 h-3 text-amber-500/30" />
      </div>

      {/* Agent Avatar */}
      <motion.div
        animate={{ 
          x: position.x, 
          y: position.y,
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          duration: 2, 
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/10">
            {agent.avatar}
          </div>
          {/* Status Indicator */}
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
        </div>
        
        {/* Thought Bubble (Visible on hover) */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono text-cyan-400">{activity}</span>
        </div>
      </motion.div>

      {/* Room Label */}
      <div className="absolute top-4 left-4 flex flex-col">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none mb-1">Room_{agent.id.slice(0,4)}</span>
        <span className="text-xs font-bold text-white tracking-wider">{agent.name.toUpperCase()}</span>
      </div>

      {/* Level / Role Badge */}
      <div className="absolute top-4 right-4 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
        <span className="text-[8px] font-mono text-cyan-400">LVL.{agent.level}</span>
      </div>

      {/* Room Decor (Random tech junk) */}
      <div className="absolute top-20 left-6 opacity-20">
        <Database className="w-4 h-4 text-slate-400" />
      </div>
      <div className="absolute bottom-20 right-6 opacity-20 rotate-12">
        <Zap className="w-4 h-4 text-violet-400" />
      </div>

      {/* Scanning effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent h-1/2 w-full -translate-y-full animate-scan pointer-events-none" />
    </div>
  );
}
