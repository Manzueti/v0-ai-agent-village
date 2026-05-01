'use client';

import { Employee } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Terminal, Monitor, Coffee, Laptop, 
  Database, Briefcase, Zap, Brain,
  DollarSign, TrendingUp, Shield, 
  Edit3, Rocket, BarChart3, Target,
  Cpu, Code, Lock, Search
} from 'lucide-react';

interface AgentPodProps {
  agent: Employee;
}

export default function AgentPod({ agent }: AgentPodProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activity, setActivity] = useState('Processing...');

  // Theme configuration based on role
  const getTheme = () => {
    const role = agent.role.toLowerCase();
    const office = agent.office.toLowerCase();

    if (role.includes('trading') || role.includes('equities') || role.includes('pricing')) {
      return {
        color: 'text-emerald-400',
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-500/5',
        glow: 'shadow-emerald-500/10',
        icons: [TrendingUp, DollarSign, BarChart3],
        accent: 'emerald'
      };
    }
    if (role.includes('sales') || role.includes('lead') || role.includes('marketing')) {
      return {
        color: 'text-amber-400',
        border: 'border-amber-500/30',
        bg: 'bg-amber-500/5',
        glow: 'shadow-amber-500/10',
        icons: [Target, DollarSign, Zap],
        accent: 'amber'
      };
    }
    if (role.includes('security') || role.includes('guardian') || role.includes('deployment')) {
      return {
        color: 'text-red-400',
        border: 'border-red-500/30',
        bg: 'bg-red-500/5',
        glow: 'shadow-red-500/10',
        icons: [Shield, Lock, Rocket],
        accent: 'red'
      };
    }
    if (role.includes('engineer') || role.includes('logic') || role.includes('terminal')) {
      return {
        color: 'text-cyan-400',
        border: 'border-cyan-500/30',
        bg: 'bg-cyan-500/5',
        glow: 'shadow-cyan-500/10',
        icons: [Code, Cpu, Terminal],
        accent: 'cyan'
      };
    }
    if (role.includes('content') || role.includes('creative') || role.includes('social')) {
      return {
        color: 'text-violet-400',
        border: 'border-violet-500/30',
        bg: 'bg-violet-500/5',
        glow: 'shadow-violet-500/10',
        icons: [Edit3, Brain, Zap],
        accent: 'violet'
      };
    }
    // Default / Strategy / Data
    return {
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/5',
      glow: 'shadow-blue-500/10',
      icons: [Search, Database, Brain],
      accent: 'blue'
    };
  };

  const theme = getTheme();

  // Avatar mapping based on gender
  const getAvatar = () => {
    if (agent.gender === 'male') return '👨‍💻';
    if (agent.gender === 'female') return '👩‍💻';
    if (agent.gender === 'non-binary') return '🤖';
    return agent.avatar; // Fallback to original emoji
  };

  // Random movement within the "room"
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        setPosition({
          x: (Math.random() - 0.5) * 60,
          y: (Math.random() - 0.5) * 60
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
      'Executing directive',
      'Matrix stable'
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  };

  return (
    <div className={`relative w-72 h-72 ${theme.bg} rounded-3xl border ${theme.border} backdrop-blur-xl overflow-hidden group transition-all duration-500 hover:shadow-2xl ${theme.glow}`}>
      {/* Room Background / Grid */}
      <div className={`absolute inset-0 cyber-grid opacity-10 pointer-events-none`} />
      
      {/* Role-Specific Background Icons */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        {theme.icons.map((Icon, i) => (
          <Icon key={i} className={`w-32 h-32 absolute rotate-${i * 45}`} />
        ))}
      </div>

      {/* Desk / Workstation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-56 h-14 bg-slate-900/60 rounded-xl border border-white/5 flex items-center justify-around px-4 shadow-inner">
        <div className="flex gap-2">
          <Monitor className={`w-4 h-4 ${theme.color} opacity-40`} />
          <Laptop className={`w-4 h-4 ${theme.color} opacity-40`} />
        </div>
        <div className="h-4 w-px bg-white/5" />
        <div className="flex gap-2">
          {theme.icons.slice(0, 2).map((Icon, i) => (
            <Icon key={i} className={`w-3 h-3 ${theme.color} opacity-20`} />
          ))}
          <Coffee className="w-3 h-3 text-amber-500/20" />
        </div>
      </div>

      {/* Agent Avatar */}
      <motion.div
        animate={{ 
          x: position.x, 
          y: position.y,
          rotate: [0, 1, -1, 0]
        }}
        transition={{ 
          duration: 3, 
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
      >
        <div className="relative">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-${theme.accent}-500/20 to-slate-800 border border-${theme.accent}-500/30 flex items-center justify-center text-4xl shadow-xl`}>
            {getAvatar()}
          </div>
          {/* Status Indicator */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-[#020408] animate-pulse" />
        </div>
        
        {/* Thought Bubble */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-white/10 px-4 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
          <span className={`text-[10px] font-mono ${theme.color} font-bold tracking-tight uppercase`}>{activity}</span>
        </div>
      </motion.div>

      {/* Header Info */}
      <div className="absolute top-6 left-6 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-1.5 h-1.5 rounded-full bg-${theme.accent}-400`} />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">{agent.office}</span>
        </div>
        <span className="text-sm font-black text-white tracking-tighter">{agent.name.toUpperCase()}</span>
        <span className={`text-[9px] font-mono ${theme.color} uppercase tracking-widest mt-1 opacity-70`}>{agent.role}</span>
      </div>

      {/* Personality Badge */}
      {agent.personality && (
        <div className="absolute top-6 right-6">
          <div className="px-2 py-0.5 rounded border border-white/5 bg-white/5 backdrop-blur-sm">
            <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tighter">{agent.personality}</span>
          </div>
        </div>
      )}

      {/* Decorative Corner Accents */}
      <div className={`absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-${theme.accent}-500/10 rounded-tl-3xl`} />
      <div className={`absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-${theme.accent}-500/10 rounded-br-3xl`} />

      {/* Ambient Scanning effect */}
      <div className={`absolute inset-0 bg-gradient-to-b from-${theme.accent}-500/5 to-transparent h-1/3 w-full -translate-y-full animate-scan pointer-events-none opacity-50`} />
    </div>
  );
}
