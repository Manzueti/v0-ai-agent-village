'use client';

import { employees } from '@/lib/data';
import AgentPod from '@/components/village/AgentPod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trees, Cloud, Sun, Wind, 
  ChevronRight, Brain, Activity, Terminal,
  Moon, Zap, ShieldAlert, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

// --- Types ---
type SimState = 'day' | 'night' | 'emergency';
type WeatherState = 'clear' | 'neural-rain' | 'flux';

// --- Sub-components ---

const NeuralRain = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -100, x: Math.random() * 100 + '%' }}
          animate={{ y: '110vh' }}
          transition={{ 
            duration: 1 + Math.random() * 2, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 2
          }}
          className="absolute w-px h-20 bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent"
        />
      ))}
    </div>
  );
};

export default function VillagePage() {
  const [time, setTime] = useState('');
  const [simState, setSimState] = useState<SimState>('day');
  const [weather, setWeather] = useState<WeatherState>('clear');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
      
      // Auto-switch based on real time if not in emergency
      if (simState !== 'emergency') {
        const hour = now.getHours();
        if (hour >= 18 || hour < 6) {
          if (simState !== 'night') setSimState('night');
        } else {
          if (simState !== 'day') setSimState('day');
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [simState]);

  // Handle weather changes
  useEffect(() => {
    const weatherInterval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.8) setWeather('neural-rain');
      else if (rand > 0.7) setWeather('flux');
      else setWeather('clear');
    }, 30000);
    return () => clearInterval(weatherInterval);
  }, []);

  const theme = useMemo(() => {
    switch (simState) {
      case 'night':
        return {
          bg: 'bg-[#010204]',
          accent: 'text-violet-400',
          glow: 'bg-violet-500/5',
          status: 'Neural Recharge',
          statusColor: 'text-violet-400',
          gridOpacity: 'opacity-10'
        };
      case 'emergency':
        return {
          bg: 'bg-[#080202]',
          accent: 'text-red-500',
          glow: 'bg-red-500/10',
          status: 'SYSTEM CRITICAL',
          statusColor: 'text-red-500',
          gridOpacity: 'opacity-40'
        };
      default:
        return {
          bg: 'bg-[#020408]',
          accent: 'text-cyan-400',
          glow: 'bg-cyan-500/10',
          status: 'Simulation Stable',
          statusColor: 'text-emerald-400',
          gridOpacity: 'opacity-30'
        };
    }
  }, [simState]);

  const toggleEmergency = () => {
    setSimState(prev => prev === 'emergency' ? 'day' : 'emergency');
  };

  const syncAll = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className={`min-h-screen ${theme.bg} relative overflow-hidden flex flex-col transition-colors duration-1000`}>
      {/* Background Ambience */}
      <div className={`fixed inset-0 cyber-grid ${theme.gridOpacity} transition-opacity duration-1000`} />
      <div className="fixed inset-0 hex-cyber opacity-10" />
      
      {/* Weather Effects */}
      {weather === 'neural-rain' && <NeuralRain />}
      <AnimatePresence>
        {weather === 'flux' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/5 pointer-events-none z-10 mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      {/* Bioluminescent Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] ${theme.glow} rounded-full blur-[120px] animate-pulse`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] ${theme.glow} rounded-full blur-[120px] animate-pulse`} style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-20 left-10 text-cyan-400/10 animate-float-ultra">
        {simState === 'night' ? <Moon className="w-32 h-32" /> : <Sun className="w-32 h-32" />}
      </div>
      
      {/* Neural Interlink Canvas (Placeholder for Idea #2) */}
      <svg className="fixed inset-0 pointer-events-none z-0">
        {/* We'll implement connections here once pods have stable refs/positions */}
      </svg>

      {/* Top Status Bar */}
      <header className={`relative z-20 border-b border-white/10 ${simState === 'emergency' ? 'bg-red-950/20' : 'bg-[#020408]/80'} backdrop-blur-xl px-8 py-4 flex items-center justify-between transition-colors duration-500`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Trees className={`w-5 h-5 ${theme.statusColor}`} />
            <span className="text-white font-bold tracking-wider uppercase">Neural <span className={theme.statusColor}>Neighborhood</span></span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <motion.div 
            animate={simState === 'emergency' ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
            className={`flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-mono ${theme.statusColor} uppercase tracking-widest`}
          >
            {simState === 'emergency' && <ShieldAlert className="w-3 h-3" />}
            {theme.status}
          </motion.div>
        </div>

        <div className="flex items-center gap-6 font-mono">
          <div className="flex items-center gap-4 px-4 py-1.5 glass-ultron rounded-lg border border-white/5">
            <button 
              onClick={() => setSimState('day')}
              className={`p-1 rounded transition-colors ${simState === 'day' ? 'text-cyan-400 bg-cyan-400/20' : 'text-slate-500 hover:text-white'}`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setSimState('night')}
              className={`p-1 rounded transition-colors ${simState === 'night' ? 'text-violet-400 bg-violet-400/20' : 'text-slate-500 hover:text-white'}`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button 
              onClick={toggleEmergency}
              className={`p-1 rounded transition-colors ${simState === 'emergency' ? 'text-red-500 bg-red-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              <Zap className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button 
              onClick={syncAll}
              className={`p-1 rounded transition-all ${isSyncing ? 'animate-spin text-cyan-400' : 'text-slate-500 hover:text-white'}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-cyan-400/50">
            <Wind className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] uppercase tracking-tighter">Flux: {weather.toUpperCase()}</span>
          </div>
          <span className={`text-lg tracking-widest ${theme.accent} transition-colors`}>{time}</span>
        </div>
      </header>

      {/* Village Grid */}
      <main className="relative z-10 flex-1 overflow-y-auto p-12 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase">
                {simState === 'emergency' ? 'Containment Sector' : 'Neural Neighborhood'}
              </h1>
              <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">
                {simState === 'emergency' 
                  ? 'Protocols enforced. Neural flux exceeding safety thresholds.' 
                  : 'Live execution monitoring in autonomous housing units.'}
              </p>
            </div>
            {isSyncing && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] font-mono text-cyan-400 flex items-center gap-2 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20"
              >
                <RefreshCw className="w-3 h-3 animate-spin" />
                GLOBAL_NEURAL_SYNC_IN_PROGRESS
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {employees.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <AgentPod 
                  agent={agent} 
                  simState={simState} 
                  isGlobalSyncing={isSyncing}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Control Link */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group px-6 py-3 ${simState === 'emergency' ? 'bg-red-600 text-white' : 'bg-white text-black'} rounded-full font-bold flex items-center gap-2 shadow-2xl transition-all`}
          >
            <span>CONTROL CENTER</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      </div>

      {/* Floating Ground decoration */}
      <div className={`fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${simState === 'emergency' ? 'red' : 'cyan'}-500/20 to-transparent blur-sm`} />
    </div>
  );
}
