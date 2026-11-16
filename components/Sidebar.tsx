'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home, Server, Brain, Settings,
  Activity, Terminal, Wifi, Target, Trees, Factory
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { name: 'Home',           href: '/',                     section: '',               icon: Home,     shortcut: '⌘1' },
  { name: 'CyberEmpire',   href: '/?s=cyberempire',       section: 'cyberempire',    icon: Factory,  shortcut: '⌘2' },
  { name: 'Tasks',          href: '/?s=tasks',             section: 'tasks',          icon: Target,   shortcut: '⌘T' },
  { name: 'Ecosystem',      href: '/?s=village',           section: 'village',        icon: Trees,    shortcut: '⌘3' },
  { name: 'Infrastructure', href: '/?s=infrastructure',    section: 'infrastructure', icon: Server,   shortcut: '⌘4' },
  { name: 'AI Control',     href: '/?s=ai-control',        section: 'ai-control',     icon: Brain,    shortcut: '⌘5' },
  { name: 'COE',            href: '/?s=coe',               section: 'coe',            icon: Target,   shortcut: '⌘6' },
  { name: 'Settings',       href: '#',                     section: '__settings__',   icon: Settings, shortcut: '⌘,' },
] as const;

// Path → section mapping for backward-compat with old direct routes
const PATH_TO_SECTION: Record<string, string> = {
  '/village':        'village',
  '/tasks':          'tasks',
  '/cyberempire':    'cyberempire',
  '/coe':            'coe',
  '/ai-control':     'ai-control',
  '/infrastructure': 'infrastructure',
};

export default function Sidebar() {
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const currentSection = searchParams.get('s') ?? PATH_TO_SECTION[pathname] ?? '';

  return (
    <motion.div
      initial={{ x: -80 }}
      animate={{ x: 0 }}
      className="w-20 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] h-screen flex flex-col items-center py-6 gap-2 flex-shrink-0 relative overflow-hidden z-50"
    >

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-8 group"
      >
        <Link href="/">
          <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center relative overflow-hidden">
            <Terminal className="w-5 h-5 text-primary-foreground relative z-10" />
          </div>
        </Link>
      </motion.div>

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[hsl(var(--neon-green)/0.1)] mb-6"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--neon-green))] pulse-dot" />
        <span className="text-[10px] font-medium text-[hsl(var(--neon-green))]">Online</span>
      </motion.div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 flex-1">
        {NAV_ITEMS.map((item, index) => {
          const isActive = item.section === currentSection;
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
                className={`relative w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive
                    ? 'bg-[hsl(var(--sidebar-accent))]'
                    : 'hover:bg-[hsl(var(--sidebar-accent)/0.6)]'
                }`}
              >
                <Icon className={`w-5 h-5 relative z-10 transition-all duration-300 ${
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground group-hover:text-foreground'
                }`} />

                {/* Tooltip */}
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: hoveredItem === item.name ? 1 : 0, x: hoveredItem === item.name ? 0 : -10 }}
                  className="absolute left-full ml-3 px-3 py-1.5 bg-popover border border-border rounded-full text-xs text-foreground whitespace-nowrap z-50 font-medium shadow-lg pointer-events-none"
                >
                  <div className="flex items-center gap-3">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground/60">{item.shortcut}</span>
                  </div>
                </motion.span>

                {isActive && (
                  <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-primary" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-auto flex flex-col items-center gap-4 pb-4"
      >
        <div className="bg-[hsl(var(--secondary)/0.5)] border border-[hsl(var(--border))] rounded-[var(--radius)] p-2.5 w-14 flex flex-col items-center gap-2 overflow-hidden relative">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <div className="text-[10px] font-bold font-mono text-foreground tabular-nums">97%</div>
          <div className="w-full h-1 bg-[hsl(var(--background))] rounded-full overflow-hidden border border-white/5">
            <div className="h-full w-[97%] bg-primary" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3 h-3 text-[hsl(var(--neon-purple))]" />
          <span className="text-[9px] font-bold font-mono text-muted-foreground tracking-widest uppercase">5/5</span>
        </div>
        <div className="text-[8px] font-bold font-mono text-muted-foreground/40 tracking-[0.2em] uppercase">v2.5.0</div>
      </motion.div>
    </motion.div>
  );
}
