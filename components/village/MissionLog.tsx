'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, Shield, Target, TrendingUp, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MissionUpdate {
  id: string;
  agentName: string;
  department: string;
  update: string;
  timestamp: string;
  type: 'success' | 'warning' | 'info' | 'critical';
}

const INITIAL_UPDATES: MissionUpdate[] = [
  { id: '1', agentName: 'Sarah Hunter', department: 'Revenue Hub', update: 'Scanning Sector 7 for new business leads...', timestamp: 'SYSTEM', type: 'info' },
  { id: '2', agentName: 'Kai Chen', department: 'Finance Vault', update: 'Executed high-frequency trade on GEN stock. Profit: +1.2%', timestamp: 'SYSTEM', type: 'success' },
  { id: '3', agentName: 'Major Kusanagi', department: 'Tech Nexus', update: 'Blocked unauthorized access attempt from Pod B-2.', timestamp: 'SYSTEM', type: 'critical' },
];

export default function MissionLog() {
  const [updates, setUpdates] = useState<MissionUpdate[]>(INITIAL_UPDATES);

  useEffect(() => {
    // Simulate incoming mission updates
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.7) {
        const newUpdate: MissionUpdate = {
          id: Date.now().toString(),
          agentName: 'System Oracle',
          department: 'Command Deck',
          update: 'Global sync stable. All pods reporting nominal.',
          timestamp: new Date().toLocaleTimeString(),
          type: 'info'
        };
        setUpdates(prev => [newUpdate, ...prev].slice(0, 50));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden flex flex-col font-mono">
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-black text-white tracking-[0.3em] uppercase">Mission Log</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Live Feed</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {updates.map((update) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-3 rounded border-l-2 bg-white/5 ${
                update.type === 'success' ? 'border-green-500' :
                update.type === 'critical' ? 'border-red-500' :
                update.type === 'warning' ? 'border-yellow-500' : 'border-cyan-500'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-white uppercase">{update.agentName}</span>
                  <span className="text-[7px] text-muted-foreground uppercase tracking-widest">[{update.department}]</span>
                </div>
                <span className="text-[7px] text-muted-foreground tabular-nums">{update.timestamp}</span>
              </div>
              <p className="text-[10px] text-white/80 leading-relaxed tracking-wide">
                <span className="text-cyan-500 mr-2">{">"}</span>
                {update.update}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-2 bg-black/60 border-t border-white/5 flex items-center gap-4 px-4 overflow-hidden">
        <div className="flex items-center gap-2 text-[8px] font-bold text-muted-foreground whitespace-nowrap uppercase tracking-tighter">
          <Cpu className="w-3 h-3" /> System Load: 42%
        </div>
        <div className="flex items-center gap-2 text-[8px] font-bold text-muted-foreground whitespace-nowrap uppercase tracking-tighter">
          <Zap className="w-3 h-3" /> Power: 1.21 GW
        </div>
        <div className="flex items-center gap-2 text-[8px] font-bold text-muted-foreground whitespace-nowrap uppercase tracking-tighter">
          <Shield className="w-3 h-3" /> Security: Optimal
        </div>
      </div>
    </div>
  );
}
