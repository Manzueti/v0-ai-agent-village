'use client';

import { SystemHealth, ZoneId } from '@/lib/types';
import { Activity, AlertTriangle, CheckCircle, RefreshCw, Clock } from 'lucide-react';

interface HealthBarProps {
  health: SystemHealth;
  onRefresh?: () => void;
}

const zoneLabels: Record<ZoneId, { name: string; color: string }> = {
  'data-center': { name: 'Data Center', color: '#3B82F6' },
  'network': { name: 'Network', color: '#8B5CF6' },
  'cloud': { name: 'Cloud', color: '#06B6D4' },
  'security': { name: 'Security', color: '#EF4444' },
  'edge': { name: 'Edge', color: '#22C55E' },
};

export default function HealthBar({ health, onRefresh }: HealthBarProps) {
  const getOverallColor = (value: number) => {
    if (value >= 95) return 'text-emerald-400';
    if (value >= 80) return 'text-amber-400';
    return 'text-red-400';
  };

  const getOverallBg = (value: number) => {
    if (value >= 95) return 'bg-emerald-500';
    if (value >= 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-4 py-3">
      <div className="flex items-center justify-between gap-6">
        {/* Overall Health */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className={`w-5 h-5 ${getOverallColor(health.overall)}`} />
            <span className="text-sm font-semibold text-white">System Health</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getOverallBg(health.overall)} transition-all duration-500`}
                style={{ width: `${health.overall}%` }}
              />
            </div>
            <span className={`text-lg font-bold font-mono ${getOverallColor(health.overall)}`}>
              {health.overall}%
            </span>
          </div>
        </div>

        {/* Zone Health Pills */}
        <div className="flex items-center gap-2">
          {(Object.entries(health.zones) as [ZoneId, number][]).map(([zoneId, zoneHealth]) => {
            const zone = zoneLabels[zoneId];
            return (
              <div 
                key={zoneId}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-800/80"
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: zone.color }}
                />
                <span className="text-[10px] text-slate-400">{zone.name}</span>
                <span className={`text-[10px] font-mono font-bold ${
                  zoneHealth === 100 ? 'text-emerald-400' : 
                  zoneHealth >= 90 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {zoneHealth}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4">
          {/* Active Failovers */}
          <div className="flex items-center gap-1.5">
            {health.activeFailovers > 0 ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            )}
            <span className="text-xs text-slate-400">
              {health.activeFailovers > 0 
                ? `${health.activeFailovers} Failover${health.activeFailovers > 1 ? 's' : ''}`
                : 'All Primary'
              }
            </span>
          </div>

          {/* Pending Decisions */}
          <div className="flex items-center gap-1.5">
            <Clock className={`w-4 h-4 ${health.pendingDecisions > 0 ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span className="text-xs text-slate-400">
              {health.pendingDecisions} Pending
            </span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="p-1.5 hover:bg-slate-800 rounded transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
