'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, Users, Server, Brain, Settings, 
  Activity, Cpu, ChevronRight, Terminal,
  Zap, Shield, Wifi, Radio, Target, Trees, Factory
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState({ health: 97, active: 5 });

  const navItems = [
    { name: 'Home', href: '/', icon: Home, shortcut: '⌘1' },
    { name: 'VybeCorp', href: '/vybecorp', icon: Factory, shortcut: '⌘2' },
    { name: 'Village', href: '/village', icon: Trees, shortcut: '⌘3' },
    { name: 'Agents', href: '/agent-management', icon: Users, shortcut: '⌘4' },
    { name: 'Infrastructure', href: '/infrastructure', icon: Server, shortcut: '⌘5' },
    { name: 'AI Control', href: '/ai-control', icon: Brain, shortcut: '⌘6' },
    { name: 'COE', href: '/coe', icon: Target, shortcut: '⌘7' },
    { name: 'Settings', href: '#', icon: Settings, shortcut: '⌘,' },
  ];

  return (
    <motion.div 
      initial={{ x: -80 }}
      animate={{ x: 0 }}
      className="w-20 bg-[hsl(var(--sidebar-background)/0.95)] backdrop-blur-2xl border-r border-[hsl(var(--sidebar-border))] h-screen flex flex-col items-center py-6 gap-2 flex-shrink-0 relative overflow-hidden z-50 scanlines"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 starfield opacity-10 pointer-events-none" />
      
      {/* Logo */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-8 group"
      >
        <div className="w-12 h-12 rounded bg-gradient-to-br from-[hsl(var(--neon-magenta))] to-[hsl(var(--neon-purple))] flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_hsl(var(--neon-magenta)/0.4)]">
          <Terminal className="w-6 h-6 text-background relative z-10" />
          <div className="absolute inset-0 bg-white/10 animate-pulse" />
        </div>
      </motion.div>

      {/* Status Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-1.5 px-2 py-1 rounded bg-[hsl(var(--neon-green)/0.1)] border border-[hsl(var(--neon-green)/0.3)] mb-6"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--neon-green))] pulse-dot shadow-[0_0_8px_hsl(var(--neon-green))]" />
        <span className="text-[8px] font-mono text-[hsl(var(--neon-green))] uppercase tracking-[0.2em] font-bold">ONLINE</span>
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
                className={`relative w-14 h-14 flex items-center justify-center rounded transition-all duration-300 group ${
                  isActive
                    ? 'bg-[hsl(var(--neon-purple)/0.15)] border border-[hsl(var(--neon-purple)/0.5)] shadow-[0_0_15px_hsl(var(--neon-purple)/0.2)]'
                    : 'border border-transparent hover:border-[hsl(var(--neon-cyan)/0.3)] hover:bg-[hsl(var(--neon-cyan)/0.05)]'
                }`}
              >
                {/* Active glow */}
                {isActive && (
                  <div className="absolute inset-0 rounded bg-[hsl(var(--neon-purple)/0.1)] animate-pulse" />
                )}
                
                <Icon
                  className={`w-5 h-5 relative z-10 transition-all duration-300 ${
                    isActive ? 'text-[hsl(var(--neon-purple))] scale-110' : 'text-muted-foreground group-hover:text-[hsl(var(--neon-cyan))] group-hover:scale-110'
                  }`}
                />
                
                {/* Tooltip */}
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: hoveredItem === item.name ? 1 : 0, x: hoveredItem === item.name ? 0 : -10 }}
                  className="absolute left-full ml-3 px-3 py-1.5 bg-[hsl(var(--sidebar-background)/0.95)] border border-[hsl(var(--neon-cyan)/0.4)] panel-glow-cyan rounded-md text-[10px] text-white whitespace-nowrap z-50 font-bold tracking-widest uppercase"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[hsl(var(--neon-cyan))]">{item.name}</span>
                    <span className="text-muted-foreground/60">{item.shortcut}</span>
                  </div>
                </motion.span>
                
                {/* Active indicator line */}
                {isActive && (
                  <div className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-[2px] h-8 bg-[hsl(var(--neon-purple))] shadow-[0_0_10px_hsl(var(--neon-purple))]" />
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
        <div className="bg-[hsl(var(--secondary)/0.5)] border border-[hsl(var(--border))] rounded p-2.5 w-14 flex flex-col items-center gap-2 panel-glow-cyan overflow-hidden relative">
          <div className="absolute inset-0 scanlines opacity-20" />
          <Activity className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
          <div className="text-[10px] font-bold font-mono text-white tabular-nums">{systemStatus.health}%</div>
          <div className="w-full h-1 bg-[hsl(var(--background))] rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-[hsl(var(--neon-cyan))]" style={{ width: `${systemStatus.health}%`, boxShadow: '0 0 8px hsl(var(--neon-cyan))' }} />
          </div>
        </div>

        {/* Network Status */}
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3 h-3 text-[hsl(var(--neon-purple))]" />
          <span className="text-[9px] font-bold font-mono text-muted-foreground tracking-widest uppercase">{systemStatus.active}/5</span>
        </div>
        
        {/* Version */}
        <div className="text-[8px] font-bold font-mono text-muted-foreground/40 tracking-[0.2em] uppercase">
          v2.5.0
        </div>
      </motion.div>
    </motion.div>
  );
}
