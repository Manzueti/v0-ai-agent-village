'use client';

import { employees } from '@/lib/data';
import AgentPod from '@/components/village/AgentPod';
import { motion } from 'framer-motion';
import { 
  Trees, Cloud, Sun, Wind, 
  ChevronRight, Brain, Activity, Terminal
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function VillagePage() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020408] relative overflow-hidden flex flex-col">
      {/* Background Ambience */}
      <div className="fixed inset-0 cyber-grid opacity-30" />
      <div className="fixed inset-0 hex-cyber opacity-20" />
      
      {/* Bioluminescent Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Dynamic Background Elements (The "Nature" part of the village) */}
      <div className="absolute top-20 left-10 text-cyan-400/20 animate-float-ultra">
        <Cloud className="w-32 h-32" />
      </div>
      <div className="absolute top-40 right-20 text-violet-400/20 animate-float-ultra" style={{ animationDelay: '2s' }}>
        <Cloud className="w-24 h-24" />
      </div>
      
      {/* Bioluminescent "Trees" (Abstract) */}
      <div className="fixed bottom-0 left-0 right-0 h-32 flex justify-around items-end opacity-20 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-gradient-to-t from-cyan-500 to-transparent"
            style={{ height: `${20 + Math.random() * 60}%` }}
            animate={{ height: ['40%', '60%', '40%'] }}
            transition={{ duration: 4 + i, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Top Status Bar */}
      <header className="relative z-10 border-b border-cyan-500/20 bg-[#020408]/80 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Trees className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-bold tracking-wider">AI AGENT <span className="text-emerald-400">VILLAGE</span></span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
            Simulation Stable
          </div>
        </div>
        <div className="flex items-center gap-6 font-mono text-cyan-400">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 animate-pulse" />
            <span className="text-xs opacity-50">Flow: Active</span>
          </div>
          <span className="text-lg tracking-widest">{time}</span>
        </div>
      </header>

      {/* Village Grid */}
      <main className="relative z-10 flex-1 overflow-y-auto p-12 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase">Neural Neighborhood</h1>
            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Live execution monitoring in autonomous housing units.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {employees.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <AgentPod agent={agent} />
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
            className="group px-6 py-3 bg-white text-black rounded-full font-bold flex items-center gap-2 shadow-2xl transition-all"
          >
            <span>CONTROL CENTER</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      </div>

      {/* Floating Ground decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent blur-sm" />
    </div>
  );
}
