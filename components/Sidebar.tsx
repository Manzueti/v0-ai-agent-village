'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Server, Brain, Settings, Activity, Hexagon } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Agents', href: '/agent-management', icon: Users },
    { name: 'Infrastructure', href: '/infrastructure', icon: Server },
    { name: 'AI Control', href: '/ai-control', icon: Brain },
    { name: 'Settings', href: '#', icon: Settings },
  ];

  return (
    <div className="w-20 bg-sidebar border-r border-sidebar-border h-screen flex flex-col items-center py-4 gap-2 flex-shrink-0 relative">
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines opacity-30" />
      
      {/* Gradient border right */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-transparent to-violet-500/50" />
      
      {/* Logo */}
      <div className="relative mb-6 group">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 transition-all duration-300 group-hover:shadow-cyan-500/50 group-hover:scale-105">
          <Hexagon className="w-6 h-6 text-white" />
        </div>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-xl bg-cyan-500/20 animate-pulse-ring" />
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-wider">Online</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                  : 'bg-sidebar-accent/50 border border-transparent hover:border-sidebar-border hover:bg-sidebar-accent'
              }`}
              title={item.name}
            >
              {/* Active glow */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-cyan-500/10 animate-border-glow" />
              )}
              
              <item.icon
                className={`w-5 h-5 relative z-10 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground'
                }`}
              />
              
              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-2 py-1 bg-popover border border-border rounded text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 font-mono">
                {item.name}
              </span>
              
              {/* Active indicator line */}
              {isActive && (
                <div className="absolute -right-px top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto flex flex-col items-center gap-3">
        {/* System activity */}
        <div className="flex flex-col items-center gap-1">
          <Activity className="w-4 h-4 text-cyan-400/60" />
          <span className="text-[8px] font-mono text-muted-foreground">97%</span>
        </div>
        
        {/* Version */}
        <div className="text-[8px] font-mono text-muted-foreground/50 tracking-wider">
          v2.4.1
        </div>
      </div>
    </div>
  );
}
