'use client';

import { employees } from '@/lib/data';
import AgentPod from '@/components/village/AgentPod';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const PhaserGame = dynamic(() => import('@/components/village/PhaserGame'), { ssr: false });

import { 
  Trees, Cloud, Sun, Wind, 
  ChevronRight, Brain, Activity, Terminal,
  Moon, Zap, ShieldAlert, RefreshCw, Factory,
  Eye, LayoutGrid
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

// --- Types ---
type SimState = 'day' | 'night' | 'emergency';
type WeatherState = 'clear' | 'neural-rain' | 'flux';
type ViewMode = 'grid' | 'visualizer';

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
          className="absolute w-px h-20 bg-gradient-to-b from-transparent via-[hsl(var(--neon-cyan)/0.4)] to-transparent"
        />
      ))}
    </div>
  );
};

export default function LandingPage() {
  const [time, setTime] = useState('');
  const [simState, setSimState] = useState<SimState>('day');
  const [weather, setWeather] = useState<WeatherState>('clear');
  const [isSyncing, setIsSyncing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

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
          bg: 'bg-[hsl(248_60%_4%)]',
          accent: 'text-[hsl(var(--neon-purple))]',
          glow: 'bg-[hsl(var(--neon-purple)/0.05)]',
          status: 'Neural Recharge',
          statusColor: 'text-[hsl(var(--neon-purple))]',
          gridOpacity: 'opacity-10',
          panelGlow: 'panel-glow-purple'
        };
      case 'emergency':
        return {
          bg: 'bg-[hsl(350_90%_5%)]',
          accent: 'text-[hsl(var(--neon-magenta))]',
          glow: 'bg-[hsl(var(--neon-magenta)/0.1)]',
          status: 'SYSTEM CRITICAL',
          statusColor: 'text-[hsl(var(--neon-magenta))]',
          gridOpacity: 'opacity-40',
          panelGlow: 'panel-glow-magenta'
        };
      default:
        return {
          bg: 'bg-[hsl(var(--background))]',
          accent: 'text-[hsl(var(--neon-cyan))]',
          glow: 'bg-[hsl(var(--neon-cyan)/0.1)]',
          status: 'Simulation Stable',
          statusColor: 'text-[hsl(var(--neon-green))]',
          gridOpacity: 'opacity-30',
          panelGlow: 'panel-glow-cyan'
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
    <div className={`min-h-screen ${theme.bg} relative overflow-hidden flex flex-col transition-colors duration-1000 scanlines`}>
      {/* Background Ambience */}
      <div className={`fixed inset-0 cyber-grid ${theme.gridOpacity} transition-opacity duration-1000 pointer-events-none`} />
      
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
        <div className={`absolute top-1/4 left-1/4 w-[600px] h-[600px] ${theme.glow} rounded-full blur-[120px] animate-pulse`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[600px] h-[600px] ${theme.glow} rounded-full blur-[120px] animate-pulse`} style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-24 left-12 opacity-10 animate-float-ultra pointer-events-none">
        {simState === 'night' ? <Moon className="w-48 h-48 text-[hsl(var(--neon-purple))]" /> : <Sun className="w-48 h-48 text-[hsl(var(--neon-yellow))]" />}
      </div>

      {/* Top Status Bar */}
      <header className={`relative z-20 border-b border-white/5 ${simState === 'emergency' ? 'bg-[hsl(var(--neon-magenta)/0.1)]' : 'bg-[hsl(var(--background)/0.8)]'} backdrop-blur-xl px-8 py-4 flex items-center justify-between transition-colors duration-500`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))] grid place-items-center shadow-[0_0_15px_hsl(var(--neon-magenta)/0.4)]`}>
              <Trees className="w-6 h-6 text-background" />
            </div>
            <div>
              <span className="text-white font-black tracking-[0.2em] uppercase text-sm block leading-none">Neural Neighborhood</span>
              <span className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase font-bold">VYBECORP Habitat Matrix</span>
            </div>
          </div>
          <div className="h-6 w-px bg-white/5" />
          <motion.div 
            animate={simState === 'emergency' ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
            className={`flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-md border border-white/10 text-[9px] font-black ${theme.statusColor} uppercase tracking-[0.25em]`}
          >
            <span className={`h-1.5 w-1.5 rounded-full bg-current ${simState === 'emergency' ? 'pulse-dot' : ''}`} />
            {simState === 'emergency' && <ShieldAlert className="w-3 h-3" />}
            {theme.status}
          </motion.div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 p-1 rounded-md bg-[hsl(var(--secondary)/0.5)] border border-white/5">
            <button 
              onClick={() => setSimState('day')}
              className={`p-1.5 rounded transition-all ${simState === 'day' ? 'text-[hsl(var(--neon-cyan))] bg-[hsl(var(--neon-cyan)/0.15)] shadow-[0_0_8px_hsl(var(--neon-cyan)/0.3)]' : 'text-muted-foreground hover:text-white'}`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setSimState('night')}
              className={`p-1.5 rounded transition-all ${simState === 'night' ? 'text-[hsl(var(--neon-purple))] bg-[hsl(var(--neon-purple)/0.15)] shadow-[0_0_8px_hsl(var(--neon-purple)/0.3)]' : 'text-muted-foreground hover:text-white'}`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button 
              onClick={toggleEmergency}
              className={`p-1.5 rounded transition-all ${simState === 'emergency' ? 'text-[hsl(var(--neon-magenta))] bg-[hsl(var(--neon-magenta)/0.15)] shadow-[0_0_8px_hsl(var(--neon-magenta)/0.3)]' : 'text-muted-foreground hover:text-white'}`}
            >
              <Zap className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-white/5 mx-1" />
            <button 
              onClick={syncAll}
              className={`p-1.5 rounded transition-all ${isSyncing ? 'animate-spin text-[hsl(var(--neon-cyan))]' : 'text-muted-foreground hover:text-white'}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-white/5 mx-1" />
            <button 
              onClick={() => setViewMode(prev => prev === 'grid' ? 'visualizer' : 'grid')}
              className={`p-1.5 rounded transition-all ${viewMode === 'visualizer' ? 'text-[hsl(var(--neon-cyan))] bg-[hsl(var(--neon-cyan)/0.15)]' : 'text-muted-foreground hover:text-white'}`}
              title="Toggle Neural Visualizer"
            >
              {viewMode === 'grid' ? <Eye className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-3 text-[hsl(var(--neon-cyan)/0.6)]">
            <Wind className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Flux: {weather.toUpperCase()}</span>
          </div>
          <span className={`text-2xl font-black tracking-tighter tabular-nums ${theme.accent} text-glow transition-colors`}>{time}</span>
        </div>
      </header>

      {/* Village Grid */}
      <main className="relative z-10 flex-1 overflow-y-auto p-12 custom-scrollbar scrollbar-hide">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black text-white tracking-tight mb-3 uppercase leading-none">
                {viewMode === 'visualizer' ? 'Neural Factory' : (simState === 'emergency' ? 'Containment Sector' : 'Habitat Matrix')}
              </h1>
              <p className="text-muted-foreground font-bold text-[11px] uppercase tracking-[0.3em]">
                {viewMode === 'visualizer' 
                  ? 'Real-time rendering of neural processing units.' 
                  : (simState === 'emergency' 
                    ? 'Protocols enforced. Neural flux exceeding safety thresholds.' 
                    : 'Live execution monitoring in autonomous housing units.')}
              </p>
            </div>
            {isSyncing && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] font-black text-[hsl(var(--neon-cyan))] flex items-center gap-3 bg-[hsl(var(--neon-cyan)/0.1)] px-4 py-2 rounded border border-[hsl(var(--neon-cyan)/0.3)] panel-glow-cyan"
              >
                <RefreshCw className="w-4 h-4 animate-spin" />
                GLOBAL_NEURAL_SYNC_IN_PROGRESS
              </motion.div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
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
              </motion.div>
            ) : (
              <motion.div
                key="visualizer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="flex justify-center items-center"
              >
                <PhaserGame />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Ground decoration */}
      <div className={`fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${simState === 'emergency' ? 'hsl(var(--neon-magenta))' : 'hsl(var(--neon-cyan))'} to-transparent blur-sm opacity-20`} />
    </div>
  );
}
