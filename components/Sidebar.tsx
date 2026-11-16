'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home, Server, Brain, Settings,
  Activity, Terminal, Wifi, Target, Trees, Factory, HeartPulse, Rocket
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { name: 'Home',           href: '/',                     section: '',               icon: Home,     shortcut: '⌘1' },
  { name: 'Business Builder', href: '/?s=builder',        section: 'builder',        icon: Rocket,   shortcut: '⌘B' },
  { name: 'CyberEmpire',   href: '/?s=cyberempire',       section: 'cyberempire',    icon: Factory,  shortcut: '⌘2' },
  { name: 'Tasks',          href: '/?s=tasks',             section: 'tasks',          icon: Target,   shortcut: '⌘T' },
  { name: 'Ecosystem',      href: '/?s=village',           section: 'village',        icon: Trees,    shortcut: '⌘3' },
  { name: 'Infrastructure', href: '/?s=infrastructure',    section: 'infrastructure', icon: Server,   shortcut: '⌘4' },
  { name: 'AI Control',     href: '/?s=ai-control',        section: 'ai-control',     icon: Brain,    shortcut: '⌘5' },
  { name: 'Automaton',      href: '/?s=automaton',         section: 'automaton',      icon: HeartPulse, shortcut: '⌘7' },
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
  '/automaton':      'automaton',
  '/builder':        'builder',
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
      className="w-20 bg-[#030712]/70 backdrop-blur-2xl border-r border-cyan-400/10 shadow-[inset_-1px_0_0_rgba(34,211,238,0.06)] h-screen flex flex-col items-center py-6 gap-2 flex-shrink-0 relative overflow-hidden z-50"
    >
      
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-8 group"
      >
        <Link href="/">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 flex items-center justify-center relative overflow-hidden shadow-[0_0_24px_rgba(34,211,238,0.45)]">
            <Terminal className="w-6 h-6 text-background relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/20" />
          </div>
        </Link>
      </motion.div>

      {/* Status badge */}
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
                aria-label={item.name}
                aria-current={isActive ? 'page' : undefined}
                className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-colors duration-200 group ${
                  isActive
                    ? 'bg-cyan-400/12 border border-cyan-400/45 shadow-[0_0_18px_-4px_rgba(34,211,238,0.6)]'
                    : 'border border-transparent hover:border-cyan-400/25 hover:bg-cyan-400/[0.06]'
                }`}
              >

                <Icon className={`w-5 h-5 relative z-10 transition-all duration-300 ${
                  isActive
                    ? 'text-cyan-300'
                    : 'text-slate-400 group-hover:text-cyan-200'
                }`} />

                {/* Tooltip */}
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: hoveredItem === item.name ? 1 : 0, x: hoveredItem === item.name ? 0 : -10 }}
                  aria-hidden className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 glass-panel rounded-md text-[11px] text-white whitespace-nowrap z-50 font-semibold tracking-wide"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[hsl(var(--neon-cyan))]">{item.name}</span>
                    <span className="text-muted-foreground/60">{item.shortcut}</span>
                  </div>
                </motion.span>

                {isActive && (
                  <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
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
        <div className="glass-panel rounded-xl p-2.5 w-14 flex flex-col items-center gap-2 overflow-hidden relative">
                    <Activity className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
          <div className="text-[10px] font-bold font-mono text-white tabular-nums">97%</div>
          <div className="w-full h-1 bg-[hsl(var(--background))] rounded-full overflow-hidden border border-white/5">
            <div className="h-full w-[97%] bg-[hsl(var(--neon-cyan))]" style={{ boxShadow: '0 0 8px hsl(var(--neon-cyan))' }} />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3 h-3 text-cyan-300" />
          <span className="text-[9px] font-bold font-mono text-muted-foreground tracking-widest uppercase">5/5</span>
        </div>
        <div className="text-[8px] font-bold font-mono text-muted-foreground/40 tracking-[0.2em] uppercase">v2.5.0</div>
      </motion.div>
    </motion.div>
  );
}
