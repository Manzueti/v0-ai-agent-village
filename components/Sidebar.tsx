'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, Users, Server, Brain, Settings, 
  Activity, Cpu, ChevronRight, Terminal,
  Zap, Shield, Wifi, Radio
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState({ health: 97, active: 5 });

  const navItems = [
    { name: 'Home', href: '/', icon: Home, shortcut: '⌘1' },
    { name: 'Agents', href: '/agent-management', icon: Users, shortcut: '⌘2' },
    { name: 'Infrastructure', href: '/infrastructure', icon: Server, shortcut: '⌘3' },
    { name: 'AI Control', href: '/ai-control', icon: Brain, shortcut: '⌘4' },
    { name: 'Settings', href: '#', icon: Settings, shortcut: '⌘,' },
  ];

  return (
    <motion.div 
      initial={{ x: -80 }}
      animate={{ x: 0 }}
      className="w-20 bg-[#020408]/95 backdrop-blur-2xl border-r border-cyan-500/20 h-screen flex flex-col items-center py-6 gap-2 flex-shrink-0 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      
      {/* Gradient Border */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-violet-500/30 to-cyan-500/50" />
      
      {/* Logo */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-8 group"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/40 flex items-center justify-center relative overflow-hidden">
          <Terminal className="w-6 h-6 text-cyan-400 relative z-10" />
          <div className="absolute inset-0 bg-cyan-500/10 animate-pulse" />
        </div>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-xl bg-cyan-500/20 blur-xl animate-ping opacity-30" style={{ animationDuration: '3s' }} />
      </motion.div>

      {/* Status Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-wider">ONLINE</span>
      </motion.div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 flex-1">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                href={item.href}
                className={`relative w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                    : 'border border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/5'
                }`}
              >
                {/* Active glow */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-cyan-500/10 animate-pulse" />
                )}
                
                <Icon
                  className={`w-5 h-5 relative z-10 transition-all duration-300 ${
                    isActive ? 'text-cyan-400 scale-110' : 'text-slate-500 group-hover:text-cyan-400 group-hover:scale-110'
                  }`}
                />
                
                {/* Tooltip */}
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: hoveredItem === item.name ? 1 : 0, x: hoveredItem === item.name ? 0 : -10 }}
                  className="absolute left-full ml-3 px-3 py-1.5 glass-ultron rounded-lg text-xs text-white whitespace-nowrap z-50 font-mono border border-cyan-500/20"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.name}</span>
                    <span className="text-slate-500">{item.shortcut}</span>
                  </div>
                </motion.span>
                
                {/* Active indicator line */}
                {isActive && (
                  <div className="absolute -right-px top-1/2 -translate-y-1/2 w-0.5 h-8 bg-gradient-to-b from-cyan-400 to-violet-400 rounded-l" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-auto flex flex-col items-center gap-4 pb-4"
      >
        {/* System Stats */}
        <div className="glass-ultron rounded-lg p-3 w-14 flex flex-col items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <div className="text-[10px] font-mono text-white">{systemStatus.health}%</div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400" style={{ width: `${systemStatus.health}%` }} />
          </div>
        </div>

        {/* Network Status */}
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3 h-3 text-violet-400" />
          <span className="text-[8px] font-mono text-slate-500">{systemStatus.active}/5</span>
        </div>
        
        {/* Version */}
        <div className="text-[8px] font-mono text-slate-600 tracking-wider">
          v2.4.1
        </div>
      </motion.div>
    </motion.div>
  );
}
