'use client';

import { InfraZone, AIOperator } from '@/lib/types';

interface ZoneOverlayProps {
  zone: InfraZone;
  operator?: AIOperator;
  isSelected?: boolean;
  onClick?: (zone: InfraZone) => void;
}

export default function ZoneOverlay({ zone, operator, isSelected, onClick }: ZoneOverlayProps) {
  return (
    <div
      className={`absolute rounded-xl border-2 transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'border-white/40 shadow-2xl' 
          : 'border-white/10 hover:border-white/25'
      }`}
      style={{
        left: zone.position.x,
        top: zone.position.y,
        width: zone.size.width,
        height: zone.size.height,
        backgroundColor: zone.bgColor,
      }}
      onClick={() => onClick?.(zone)}
    >
      {/* Zone Header */}
      <div 
        className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-2"
        style={{ backgroundColor: zone.color }}
      >
        <span className="text-white">{zone.name}</span>
        <span 
          className={`w-2 h-2 rounded-full ${
            zone.health === 100 ? 'bg-emerald-300' : 
            zone.health >= 90 ? 'bg-amber-300' : 'bg-red-300'
          }`}
        />
      </div>
      
      {/* Zone Health Indicator */}
      <div className="absolute top-2 right-3 flex items-center gap-1.5">
        <div className="w-16 h-1.5 bg-black/30 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              zone.health === 100 ? 'bg-emerald-400' : 
              zone.health >= 90 ? 'bg-amber-400' : 'bg-red-400'
            }`}
            style={{ width: `${zone.health}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-white/70">{zone.health}%</span>
      </div>
      
      {/* AI Operator Badge */}
      {operator && (
        <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-sm">
            {operator.avatar}
          </div>
          <div>
            <div className="text-[10px] font-semibold text-white">{operator.name}</div>
            <div className="text-[8px] text-white/60">{operator.role}</div>
          </div>
          <div 
            className={`w-2 h-2 rounded-full ${
              operator.status === 'running' ? 'bg-emerald-400 animate-pulse' : 
              operator.status === 'paused' ? 'bg-amber-400' : 
              operator.status === 'error' ? 'bg-red-400' : 'bg-slate-400'
            }`}
          />
        </div>
      )}
      
      {/* Zone Description (on hover) */}
      <div className="absolute bottom-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
        <div className="text-[9px] text-white/50 max-w-[120px] text-right">
          {zone.description}
        </div>
      </div>
    </div>
  );
}
