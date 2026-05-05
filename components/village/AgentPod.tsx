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
  AlertTriangle, Info, Moon, Factory
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
      color: 'hsl(var(--neon-cyan))',
      border: 'border-[hsl(var(--neon-cyan)/0.3)]',
      bg: 'bg-[hsl(var(--neon-cyan)/0.05)]',
      glow: 'panel-glow-cyan',
      icons: [Search, Database, Brain],
      accent: 'cyan',
      decoration: 'geometric'
    };

    if (role.includes('trading') || role.includes('equities') || role.includes('pricing')) {
      baseTheme = { ...baseTheme, color: 'hsl(var(--neon-green))', border: 'border-[hsl(var(--neon-green)/0.3)]', bg: 'bg-[hsl(var(--neon-green)/0.05)]', glow: 'panel-glow-cyan', icons: [TrendingUp, DollarSign, BarChart3], accent: 'green', decoration: 'tickers' };
    } else if (role.includes('sales') || role.includes('lead') || role.includes('marketing')) {
      baseTheme = { ...baseTheme, color: 'hsl(var(--neon-yellow))', border: 'border-[hsl(var(--neon-yellow)/0.3)]', bg: 'bg-[hsl(var(--neon-yellow)/0.05)]', glow: 'panel-glow-yellow', icons: [Target, DollarSign, Zap], accent: 'yellow', decoration: 'targets' };
    } else if (role.includes('security') || role.includes('guardian') || role.includes('deployment')) {
      baseTheme = { ...baseTheme, color: 'hsl(var(--neon-magenta))', border: 'border-[hsl(var(--neon-magenta)/0.3)]', bg: 'bg-[hsl(var(--neon-magenta)/0.05)]', glow: 'panel-glow-magenta', icons: [Shield, Lock, Rocket], accent: 'magenta', decoration: 'shields' };
    } else if (role.includes('engineer') || role.includes('logic') || role.includes('terminal')) {
      baseTheme = { ...baseTheme, color: 'hsl(var(--neon-cyan))', border: 'border-[hsl(var(--neon-cyan)/0.3)]', bg: 'bg-[hsl(var(--neon-cyan)/0.05)]', glow: 'panel-glow-cyan', icons: [Code, Cpu, Terminal], accent: 'cyan', decoration: 'code' };
    } else if (role.includes('content') || role.includes('creative') || role.includes('social')) {
      baseTheme = { ...baseTheme, color: 'hsl(var(--neon-purple))', border: 'border-[hsl(var(--neon-purple)/0.3)]', bg: 'bg-[hsl(var(--neon-purple)/0.05)]', glow: 'panel-glow-purple', icons: [Edit3, Brain, Zap], accent: 'purple', decoration: 'art' };
    }

    if (simState === 'night') {
      baseTheme.bg = 'bg-[hsl(248_60%_4%)/0.8]';
      baseTheme.border = 'border-white/5';
    } else if (simState === 'emergency') {
      baseTheme.color = 'hsl(var(--neon-magenta))';
      baseTheme.border = 'border-[hsl(var(--neon-magenta)/0.5)]';
      baseTheme.bg = 'bg-[hsl(var(--neon-magenta)/0.1)]';
      baseTheme.accent = 'magenta';
      baseTheme.glow = 'panel-glow-magenta';
    }

    return baseTheme;
  }, [agent.role, simState]);

  useEffect(() => {
    if (isGlobalSyncing) {
      setIsRebooting(true);
      setActivity('GLOBAL SYNCING...');
      setTimeout(() => setIsRebooting(false), 2000);
    }
  }, [isGlobalSyncing]);

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
    const activities = ['Refining logic...', 'Analyzing data...', 'Neural sync active', 'Optimizing routes', 'Thinking...', 'Executing directive', 'Matrix stable'];
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
      className={`relative w-72 h-[420px] ${theme.bg} rounded-[40px] border-x-2 border-y-4 ${theme.border} backdrop-blur-xl overflow-hidden group transition-all duration-500 hover:shadow-2xl ${theme.glow} flex flex-col items-center cursor-pointer scanlines shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]`}
    >
      <div className={`absolute inset-0 cyber-grid opacity-10 pointer-events-none`} />
      
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {theme.decoration === 'code' && (
          <div className="p-8 text-[7px] font-mono text-[hsl(var(--neon-cyan)/0.6)] leading-tight">
            {`function neuralSync() {\n  const flux = Math.random();\n  return flux > 0.5;\n}`}
          </div>
        )}
        {theme.decoration === 'tickers' && (
          <div className="absolute top-20 w-full overflow-hidden whitespace-nowrap">
            <motion.div animate={{ x: [-100, 100] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="text-[9px] font-black text-[hsl(var(--neon-green)/0.6)] uppercase tracking-widest">
              VYBE +12% | GEN +4.2% | DATA -0.8% | AI +8.1%
            </motion.div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none" />

      {/* Control Unit */}
      <div className={`absolute bottom-0 left-0 right-0 h-28 ${simState === 'emergency' ? 'bg-[hsl(var(--neon-magenta)/0.15)]' : 'bg-[hsl(var(--background)/0.6)]'} border-t border-white/5 flex flex-col items-center justify-center gap-3 px-6 transition-colors duration-500 backdrop-blur-md`}>
        <div className="flex gap-5 opacity-40">
          <Monitor className={`w-3.5 h-3.5 ${theme.color}`} />
          <Cpu className={`w-3.5 h-3.5 ${theme.color}`} />
          <Zap className={`w-3.5 h-3.5 ${theme.color}`} />
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            className="h-full bg-current shadow-[0_0_8px_currentColor]"
            style={{ color: theme.color }}
            animate={{ width: isRebooting ? '100%' : ['20%', '80%', '40%', '90%'] }}
            transition={{ duration: isRebooting ? 1.5 : 5, repeat: isRebooting ? 0 : Infinity }}
          />
        </div>
        <span className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">
          {isRebooting ? 'RE_INITIALIZING...' : `Life_Support: ${simState === 'emergency' ? 'CRITICAL' : 'OPTIMAL'}`}
        </span>
      </div>

      {/* Agent Avatar */}
      <motion.div
        animate={isRebooting ? { rotateY: 360, scale: [1, 0.8, 1], y: [0, -20, 0] } : { x: position.x, y: position.y, rotate: isWalking ? [0, 1, -1, 0] : [0, 0.5, -0.5, 0] }}
        transition={{ duration: isRebooting ? 1.5 : (isWalking ? 2 : 3), ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 w-36 h-36"
      >
        <StylizedAvatar 
          gender={agent.gender as any || 'non-binary'} 
          color={simState === 'emergency' ? 'hsl(var(--neon-magenta))' : (simState === 'night' ? 'hsl(var(--neon-purple))' : theme.color)} 
          className="w-full h-full"
          isWalking={isWalking}
          isWorking={isWorking && !isRebooting}
        />
        
        <div className="absolute bottom-0 w-16 h-1.5 bg-current blur-md rounded-full animate-pulse opacity-40" style={{ color: theme.color }} />
        
        <AnimatePresence>
          {(activity || isRebooting) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[hsl(var(--background)/0.9)] border border-white/10 px-4 py-2 rounded-md whitespace-nowrap z-30 shadow-2xl panel-glow-cyan"
            >
              <div className="flex items-center gap-3">
                {isRebooting && <RefreshCw className="w-3 h-3 animate-spin text-[hsl(var(--neon-cyan))]" />}
                <span className={`text-[10px] font-black ${theme.color} tracking-widest uppercase`}>{activity}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Metrics Overlay */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[hsl(var(--background)/0.7)] z-40 p-8 flex flex-col justify-center scanlines"
          >
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-2">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Unit_Data</span>
              <button onClick={(e) => { e.stopPropagation(); setShowStats(false); }} className="text-muted-foreground hover:text-white transition-colors">✕</button>
            </div>
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Efficiency</span>
                <span className="text-xs font-black text-[hsl(var(--neon-green))] tabular-nums">{agent.successRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Latency</span>
                <span className="text-xs font-black text-[hsl(var(--neon-yellow))] tabular-nums">{agent.latency}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Matrix Load</span>
                <span className="text-xs font-black text-[hsl(var(--neon-cyan))] tabular-nums">{Math.round((agent.tokenUsage.used / agent.tokenUsage.limit) * 100)}%</span>
              </div>
            </div>
            <button 
              onClick={handleReboot}
              className="mt-10 w-full py-3 bg-[hsl(var(--neon-cyan)/0.1)] hover:bg-[hsl(var(--neon-cyan)/0.2)] border border-[hsl(var(--neon-cyan)/0.3)] rounded text-[9px] font-black text-white flex items-center justify-center gap-3 transition-all tracking-[0.3em] uppercase"
            >
              <RefreshCw className={`w-4 h-4 ${isRebooting ? 'animate-spin' : ''}`} />
              RECALIBRATE
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info */}
      <div className="absolute top-12 flex flex-col items-center w-full px-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-current pulse-dot shadow-[0_0_8px_currentColor]" style={{ color: theme.color }} />
          <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">{agent.office.toUpperCase()}</span>
        </div>
        <span className="text-lg font-black text-white tracking-tight text-center leading-none mb-2">{agent.name.toUpperCase()}</span>
        <div className={`text-[9px] font-black ${theme.color} uppercase tracking-[0.2em] bg-white/5 border border-white/5 px-3 py-1 rounded-full backdrop-blur-sm`}>{agent.role}</div>
      </div>

      {/* Unit ID Badge */}
      <div className="absolute top-5 right-8 px-2 py-0.5 rounded border border-white/5 bg-[hsl(var(--background)/0.8)] backdrop-blur-md">
        <span className="text-[8px] font-black text-muted-foreground/40 tracking-widest">ID_{agent.id.slice(0, 4).toUpperCase()}</span>
      </div>

      {/* Status Icons */}
      <div className="absolute top-5 left-8 flex gap-2">
        {simState === 'emergency' && <AlertTriangle className="w-3.5 h-3.5 text-[hsl(var(--neon-magenta))] animate-pulse shadow-[0_0_8px_currentColor]" />}
        {simState === 'night' && <Moon className="w-3.5 h-3.5 text-[hsl(var(--neon-purple))] shadow-[0_0_8px_currentColor]" />}
        <Info className="w-3.5 h-3.5 text-muted-foreground/40 hover:text-white transition-colors" />
      </div>

      <div className={`absolute inset-0 bg-gradient-to-b from-current to-transparent h-1/4 w-full -translate-y-full animate-scan pointer-events-none opacity-20 shadow-[0_0_20px_currentColor]`} style={{ color: theme.color }} />
    </div>
  );
}
