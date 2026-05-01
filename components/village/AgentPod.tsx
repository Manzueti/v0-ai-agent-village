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

import StylizedAvatar from './StylizedAvatar';

interface AgentPodProps {
  agent: Employee;
}

export default function AgentPod({ agent }: AgentPodProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activity, setActivity] = useState('Processing...');
  const [isWalking, setIsWalking] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

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

  // Random movement within the "pod"
  useEffect(() => {
    const moveAgent = () => {
      if (Math.random() > 0.3) {
        setIsWalking(true);
        setIsWorking(false);
        
        const newX = (Math.random() - 0.5) * 60;
        const newY = (Math.random() - 0.5) * 60;
        
        setPosition({ x: newX, y: newY });
        setActivity(getRandomActivity());

        // Finish walking after animation
        setTimeout(() => {
          setIsWalking(false);
          setIsWorking(true);
        }, 2000);
      }
    };

    const interval = setInterval(moveAgent, 5000);
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
    <div className={`relative w-72 h-[400px] ${theme.bg} rounded-[60px] border-x-4 border-y-8 ${theme.border} backdrop-blur-xl overflow-hidden group transition-all duration-500 hover:shadow-2xl ${theme.glow} flex flex-col items-center`}>
      {/* Pod Interior / Grid */}
      <div className={`absolute inset-0 cyber-grid opacity-20 pointer-events-none`} />
      
      {/* Glass Reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

      {/* Role-Specific Background Icons */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
        {theme.icons.map((Icon, i) => (
          <Icon key={i} className={`w-32 h-32 absolute rotate-${i * 45}`} />
        ))}
      </div>

      {/* Pod Base / Control Unit */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-900/80 border-t border-white/10 flex flex-col items-center justify-center gap-2 px-4">
        <div className="flex gap-4">
          <Monitor className={`w-4 h-4 ${theme.color} opacity-40`} />
          <Cpu className={`w-4 h-4 ${theme.color} opacity-40`} />
          <Zap className={`w-4 h-4 ${theme.color} opacity-40`} />
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full bg-${theme.accent}-500`}
            animate={{ width: ['20%', '80%', '40%', '90%'] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>
        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Pod Life Support: Optimal</span>
      </div>

      {/* Agent Avatar in Pod */}
      <motion.div
        animate={{ 
          x: position.x, 
          y: position.y,
          rotate: isWalking ? [0, 1, -1, 0] : [0, 0.5, -0.5, 0]
        }}
        transition={{ 
          duration: isWalking ? 2 : 3, 
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 w-32 h-32"
      >
        <StylizedAvatar 
          gender={agent.gender as any || 'non-binary'} 
          color={theme.color} 
          className="w-full h-full"
          isWalking={isWalking}
          isWorking={isWorking}
        />
        
        {/* Status Indicator (Pulse at feet) */}
        <div className={`absolute bottom-0 w-12 h-1 bg-${theme.accent}-500/40 blur-sm rounded-full animate-pulse`} />
        
        {/* Thought Bubble */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-white/10 px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 z-30 shadow-xl">
          <span className={`text-[10px] font-mono ${theme.color} font-bold tracking-tight uppercase`}>{activity}</span>
        </div>
      </motion.div>


      {/* Header Info */}
      <div className="absolute top-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-1.5 h-1.5 rounded-full bg-${theme.accent}-400 animate-ping`} />
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-[0.2em]">{agent.office}</span>
        </div>
        <span className="text-md font-black text-white tracking-tighter text-center">{agent.name.toUpperCase()}</span>
        <span className={`text-[9px] font-mono ${theme.color} uppercase tracking-widest mt-1 opacity-80 bg-slate-900/40 px-2 py-0.5 rounded-full`}>{agent.role}</span>
      </div>

      {/* Unit ID Badge */}
      <div className="absolute top-4 right-6 px-2 py-1 rounded border border-white/5 bg-slate-900/60 backdrop-blur-md">
        <span className="text-[8px] font-mono text-slate-500 tracking-tighter">UNIT_0{agent.id.length}</span>
      </div>

      {/* Ambient Scanning effect */}
      <div className={`absolute inset-0 bg-gradient-to-b from-${theme.accent}-500/10 to-transparent h-1/4 w-full -translate-y-full animate-scan pointer-events-none opacity-40`} />
      
      {/* Side "Pipes" / Docking mechanisms */}
      <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-transparent via-${theme.accent}-500/20 to-transparent`} />
      <div className={`absolute right-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-transparent via-${theme.accent}-500/20 to-transparent`} />
      
      {/* Interactive overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-${theme.accent}-500 animate-pulse`} />
        <div className={`absolute top-4 left-4 w-2 h-2 rounded-full bg-${theme.accent}-500 animate-pulse`} />
      </div>
    </div>
  );
}
