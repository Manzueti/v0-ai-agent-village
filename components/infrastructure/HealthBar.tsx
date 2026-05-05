'use client';

import { SystemHealth, ZoneId } from '@/lib/types';
import { Activity, AlertTriangle, CheckCircle, RefreshCw, Clock, Wifi, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthBarProps {
  health: SystemHealth;
  onRefresh?: () => void;
}

const zoneLabels: Record<ZoneId, { name: string; color: string }> = {
  'data-center': { name: 'Data Center', color: 'hsl(var(--neon-blue))' },
  'network': { name: 'Network', color: 'hsl(var(--neon-purple))' },
  'cloud': { name: 'Cloud', color: 'hsl(var(--neon-cyan))' },
  'security': { name: 'Security', color: 'hsl(var(--neon-magenta))' },
  'edge': { name: 'Edge', color: 'hsl(var(--neon-green))' },
};

export default function HealthBar({ health, onRefresh }: HealthBarProps) {
  const getOverallColor = (value: number) => {
    if (value >= 95) return 'text-[hsl(var(--neon-green))]';
    if (value >= 80) return 'text-[hsl(var(--neon-yellow))]';
    return 'text-[hsl(var(--neon-magenta))]';
  };

  const getOverallBg = (value: number) => {
    if (value >= 95) return 'bg-[hsl(var(--neon-green))]';
    if (value >= 80) return 'bg-[hsl(var(--neon-yellow))]';
    return 'bg-[hsl(var(--neon-magenta))]';
  };

  return (
    <div className="bg-[hsl(var(--background)/0.8)] backdrop-blur-xl border-b border-white/5 px-8 py-3 relative overflow-hidden scanlines">
      <div className="flex items-center justify-between gap-8 relative z-10">
        {/* Overall Health */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Activity className={`w-5 h-5 ${getOverallColor(health.overall)} shadow-[0_0_10px_currentColor]`} />
            <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase">Matrix_Health</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${health.overall}%` }}
                className={`h-full ${getOverallBg(health.overall)} shadow-[0_0_8px_currentColor] transition-all duration-1000`}
              />
            </div>
            <span className={`text-xl font-black tabular-nums tracking-tighter ${getOverallColor(health.overall)} text-glow`}>
              {health.overall}%
            </span>
          </div>
        </div>

        {/* Zone Health Pills */}
        <div className="flex items-center gap-3">
          {(Object.entries(health.zones) as [ZoneId, number][]).map(([zoneId, zoneHealth]) => {
            const zone = zoneLabels[zoneId];
            return (
              <div 
                key={zoneId}
                className="flex items-center gap-3 px-3 py-1.5 rounded bg-white/5 border border-white/5 hover:border-white/10 transition-all"
              >
                <div 
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]"
                  style={{ backgroundColor: zone.color, color: zone.color }}
                />
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{zone.name}</span>
                <span className={`text-[9px] font-black tabular-nums ${
                  zoneHealth === 100 ? 'text-[hsl(var(--neon-green))]' : 
                  zoneHealth >= 90 ? 'text-[hsl(var(--neon-yellow))]' : 'text-[hsl(var(--neon-magenta))]'
                }`}>
                  {zoneHealth}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            {health.activeFailovers > 0 ? (
              <AlertTriangle className="w-4 h-4 text-[hsl(var(--neon-yellow))] animate-pulse shadow-[0_0_8px_currentColor]" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-[hsl(var(--neon-green))] shadow-[0_0_8px_currentColor]" />
            )}
            <span className="text-[9px] font-black text-white tracking-[0.2em] uppercase">
              {health.activeFailovers > 0 
                ? `${health.activeFailovers} Active_Failovers`
                : 'Node_Security: OPTIMAL'
              }
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Zap className={`w-4 h-4 ${health.pendingDecisions > 0 ? 'text-[hsl(var(--neon-cyan))] animate-pulse' : 'text-muted-foreground/30'}`} />
            <span className="text-[9px] font-black text-white tracking-[0.2em] uppercase">
              {health.pendingDecisions} Pending_Directives
            </span>
          </div>

          <button
            onClick={onRefresh}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-all group"
            title="Sync Matrix"
          >
            <RefreshCw className="w-4 h-4 text-muted-foreground group-hover:text-white transition-all group-active:rotate-180" />
          </button>
        </div>
      </div>
      
      {/* Decorative scanning line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--neon-cyan)/0.05)] to-transparent w-1/4 h-full -translate-x-full animate-scan-horizontal pointer-events-none" />
    </div>
  );
}
