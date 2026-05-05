'use client';

import { Employee } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { 
  Terminal, Monitor, Coffee, Laptop, 
  Database, Briefcase, Zap, Brain,
  DollarSign, TrendingUp, Shield, 
  Edit3, Rocket, BarChart3, Target,
  Cpu, Code, Lock, Search, RefreshCw,
  AlertTriangle, Info, Moon
} from 'lucide-react';

import StylizedAvatar from './StylizedAvatar';

interface AgentPodProps {
  agent: Employee;
  simState: 'day' | 'night' | 'emergency';
  isGlobalSyncing?: boolean;
}

export default function AgentPod({ agent, simState, isGlobalSyncing }: AgentPodProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activity, setActivity] = useState('Processing...');
  const [isWalking, setIsWalking] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Theme configuration based on role
  const theme = useMemo(() => {
    const role = agent.role.toLowerCase();
    
    let baseTheme = {
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/5',
      glow: 'shadow-blue-500/10',
      icons: [Search, Database, Brain],
      accent: 'blue',
      decoration: 'geometric'
    };

    if (role.includes('trading') || role.includes('equities') || role.includes('pricing')) {
      baseTheme = { ...baseTheme, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', glow: 'shadow-emerald-500/10', icons: [TrendingUp, DollarSign, BarChart3], accent: 'emerald', decoration: 'tickers' };
    } else if (role.includes('sales') || role.includes('lead') || role.includes('marketing')) {
      baseTheme = { ...baseTheme, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/5', glow: 'shadow-amber-500/10', icons: [Target, DollarSign, Zap], accent: 'amber', decoration: 'targets' };
    } else if (role.includes('security') || role.includes('guardian') || role.includes('deployment')) {
      baseTheme = { ...baseTheme, color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/5', glow: 'shadow-red-500/10', icons: [Shield, Lock, Rocket], accent: 'red', decoration: 'shields' };
    } else if (role.includes('engineer') || role.includes('logic') || role.includes('terminal')) {
      baseTheme = { ...baseTheme, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/5', glow: 'shadow-cyan-500/10', icons: [Code, Cpu, Terminal], accent: 'cyan', decoration: 'code' };
    } else if (role.includes('content') || role.includes('creative') || role.includes('social')) {
      baseTheme = { ...baseTheme, color: 'text-violet-400', border: 'border-violet-500/30', bg: 'bg-violet-500/5', glow: 'shadow-violet-500/10', icons: [Edit3, Brain, Zap], accent: 'violet', decoration: 'art' };
    }

    // Override for night/emergency
    if (simState === 'night') {
      baseTheme.bg = 'bg-slate-950/40';
      baseTheme.border = 'border-white/5';
    } else if (simState === 'emergency') {
      baseTheme.color = 'text-red-500';
      baseTheme.border = 'border-red-500/50';
      baseTheme.bg = 'bg-red-500/10';
      baseTheme.accent = 'red';
    }

    return baseTheme;
  }, [agent.role, simState]);

  // Handle Global Sync
  useEffect(() => {
    if (isGlobalSyncing) {
      setIsRebooting(true);
      setActivity('GLOBAL SYNCING...');
      setTimeout(() => setIsRebooting(false), 2000);
    }
  }, [isGlobalSyncing]);

  // Random movement within the "pod"
  useEffect(() => {
    const moveAgent = () => {
      if (isRebooting || isGlobalSyncing) return;
      
      const shouldMove = simState === 'night' ? Math.random() > 0.8 : Math.random() > 0.3;
      
      if (shouldMove) {
        setIsWalking(true);
        setIsWorking(false);
        
        const range = simState === 'night' ? 20 : 60;
        const newX = (Math.random() - 0.5) * range;
        const newY = (Math.random() - 0.5) * range;
        
        setPosition({ x: newX, y: newY });
        setActivity(getRandomActivity());

        setTimeout(() => {
          setIsWalking(false);
          setIsWorking(true);
        }, 2000);
      }
    };

    const interval = setInterval(moveAgent, simState === 'night' ? 10000 : 5000);
    return () => clearInterval(interval);
  }, [simState, isRebooting, isGlobalSyncing]);

  const getRandomActivity = () => {
    if (simState === 'night') return 'Neural Resting...';
    if (simState === 'emergency') return 'CONTAINING ERROR...';
    
    const activities = [
      'Refining logic...', 'Analyzing data...', 'Neural sync active',
      'Optimizing routes', 'Thinking...', 'Executing directive', 'Matrix stable'
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  };

  const handleReboot = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRebooting) return;
    setIsRebooting(true);
    setActivity('REBOOTING...');
    setTimeout(() => {
      setIsRebooting(false);
      setActivity('ONLINE');
    }, 1500);
  };

  return (
    <div 
      onClick={() => setShowStats(!showStats)}
      className={`relative w-72 h-[400px] ${theme.bg} rounded-[60px] border-x-4 border-y-8 ${theme.border} backdrop-blur-xl overflow-hidden group transition-all duration-500 hover:shadow-2xl ${theme.glow} flex flex-col items-center cursor-pointer`}
    >
      {/* Pod Interior / Grid */}
      <div className={`absolute inset-0 cyber-grid opacity-20 pointer-events-none`} />
      
      {/* Personalized Habitat Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {theme.decoration === 'code' && (
          <div className="p-8 text-[8px] font-mono text-cyan-400/50 leading-tight">
            {`function neuralSync() {\n  const flux = Math.random();\n  return flux > 0.5;\n}`}
          </div>
        )}
        {theme.decoration === 'tickers' && (
          <div className="absolute top-20 w-full overflow-hidden whitespace-nowrap">
            <motion.div animate={{ x: [-100, 100] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="text-[10px] font-mono text-emerald-400">
              BTC +4.2% | ETH +1.5% | SOL -0.8% | NVDA +2.1%
            </motion.div>
          </div>
        )}
        {theme.decoration === 'art' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 20 }} className="w-40 h-40 border border-violet-500/20 rounded-full" />
            <motion.div animate={{ rotate: -360, scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 15 }} className="w-32 h-32 border border-violet-500/20 rounded-lg absolute" />
          </div>
        )}
      </div>

      {/* Glass Reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />

      {/* Pod Base / Control Unit */}
      <div className={`absolute bottom-0 left-0 right-0 h-24 ${simState === 'emergency' ? 'bg-red-950/40' : 'bg-slate-900/80'} border-t border-white/10 flex flex-col items-center justify-center gap-2 px-4 transition-colors duration-500`}>
        <div className="flex gap-4">
          <Monitor className={`w-3 h-3 ${theme.color} opacity-40`} />
          <Cpu className={`w-3 h-3 ${theme.color} opacity-40`} />
          <Zap className={`w-3 h-3 ${theme.color} opacity-40`} />
        </div>
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full bg-${theme.accent}-500`}
            animate={{ width: isRebooting ? '100%' : ['20%', '80%', '40%', '90%'] }}
            transition={{ duration: isRebooting ? 1.5 : 5, repeat: isRebooting ? 0 : Infinity }}
          />
        </div>
        <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest">
          {isRebooting ? 'RE-INITIALIZING...' : `Life Support: ${simState === 'emergency' ? 'CRITICAL' : 'OPTIMAL'}`}
        </span>
      </div>

      {/* Agent Avatar */}
      <motion.div
        animate={isRebooting ? { 
          rotateY: 360,
          scale: [1, 0.8, 1],
          y: [0, -20, 0]
        } : { 
          x: position.x, 
          y: position.y,
          rotate: isWalking ? [0, 1, -1, 0] : [0, 0.5, -0.5, 0]
        }}
        transition={{ 
          duration: isRebooting ? 1.5 : (isWalking ? 2 : 3), 
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 w-32 h-32"
      >
        <StylizedAvatar 
          gender={agent.gender as any || 'non-binary'} 
          color={simState === 'emergency' ? '#ef4444' : (simState === 'night' ? '#8b5cf6' : theme.color)} 
          className="w-full h-full"
          isWalking={isWalking}
          isWorking={isWorking && !isRebooting}
        />
        
        {/* Status Indicator */}
        <div className={`absolute bottom-0 w-12 h-1 bg-${theme.accent}-500/40 blur-sm rounded-full animate-pulse`} />
        
        {/* Thought Bubble */}
        <AnimatePresence>
          {(activity || isRebooting) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-white/10 px-3 py-1.5 rounded-xl whitespace-nowrap z-30 shadow-2xl"
            >
              <div className="flex items-center gap-2">
                {isRebooting && <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />}
                <span className={`text-[9px] font-mono ${theme.color} font-bold tracking-tight uppercase`}>{activity}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Metrics Overlay (Idea #5) */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 z-40 p-6 flex flex-col justify-center"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Neural Stats</span>
              <button onClick={(e) => { e.stopPropagation(); setShowStats(false); }} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-[9px] text-slate-500 uppercase">Success</span>
                <span className="text-[9px] font-mono text-emerald-400">{agent.successRate}%</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-[9px] text-slate-500 uppercase">Latency</span>
                <span className="text-[9px] font-mono text-amber-400">{agent.latency}ms</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-[9px] text-slate-500 uppercase">Usage</span>
                <span className="text-[9px] font-mono text-cyan-400">{Math.round((agent.tokenUsage.used / agent.tokenUsage.limit) * 100)}%</span>
              </div>
            </div>
            <button 
              onClick={handleReboot}
              className="mt-6 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-mono text-white flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3 h-3 ${isRebooting ? 'animate-spin' : ''}`} />
              MANUAL_OVERRIDE
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info */}
      <div className="absolute top-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-1.5 h-1.5 rounded-full bg-${theme.accent}-400 animate-ping`} />
          <span className="text-[8px] font-mono text-slate-400 uppercase tracking-[0.2em]">{agent.office}</span>
        </div>
        <span className="text-md font-black text-white tracking-tighter text-center">{agent.name.toUpperCase()}</span>
        <span className={`text-[8px] font-mono ${theme.color} uppercase tracking-widest mt-1 opacity-80 bg-slate-900/40 px-2 py-0.5 rounded-full`}>{agent.role}</span>
      </div>

      {/* Unit ID Badge */}
      <div className="absolute top-4 right-6 px-2 py-0.5 rounded border border-white/5 bg-slate-900/60 backdrop-blur-md">
        <span className="text-[7px] font-mono text-slate-500 tracking-tighter">UNIT_{agent.id.slice(0, 3).toUpperCase()}</span>
      </div>

      {/* Status Icons */}
      <div className="absolute top-4 left-6 flex gap-1">
        {simState === 'emergency' && <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />}
        {simState === 'night' && <Moon className="w-3 h-3 text-violet-400" />}
        <Info className="w-3 h-3 text-slate-600 hover:text-white transition-colors" />
      </div>

      {/* Ambient Scanning effect */}
      <div className={`absolute inset-0 bg-gradient-to-b from-${theme.accent}-500/10 to-transparent h-1/4 w-full -translate-y-full animate-scan pointer-events-none opacity-40`} />
    </div>
  );
}
