import { Employee } from '@/lib/types';
import { Pause, Play, RotateCcw, Zap, Users } from 'lucide-react';

type Props = {
  agent: Employee;
  onSelect: (id: string) => void;
  onToggleStatus: (id: string, newStatus: string) => void;
};

export default function AgentHut({ agent, onSelect, onToggleStatus }: Props) {
  const roofColors: Record<string, string> = {
    Strategy: 'from-red-600 to-red-800',
    'Prompt Engineering': 'from-blue-600 to-blue-800',
    Content: 'from-yellow-500 to-yellow-700',
    Deployment: 'from-purple-600 to-purple-800',
    Data: 'from-cyan-600 to-cyan-800',
    Security: 'from-emerald-600 to-emerald-800',
  };

  const roofClass = roofColors[agent.role] || 'from-gray-600 to-gray-800';

  const statusBadge = {
    running: 'bg-green-500 border-green-900 text-white animate-pulse',
    paused: 'bg-yellow-500 border-yellow-900 text-black',
    error: 'bg-red-500 border-red-900 text-white',
    idle: 'bg-slate-400 border-slate-700 text-black',
  };

  return (
    <div
      className="relative w-52 h-72 cursor-pointer group"
      onClick={() => onSelect(agent.id)}
      role="button"
      aria-label={`View details for ${agent.name}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(agent.id)}
    >
      {/* THE ROOF */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-44 h-14 bg-gradient-to-b ${roofClass} rounded-t-3xl border-4 border-black z-10`}
      >
        <div className="absolute top-2 left-0 right-0 h-0.5 bg-black/30 rounded" />
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-black/30 rounded" />
      </div>

      {/* BUILDING BASE */}
      <div className="absolute bottom-0 w-full h-52 bg-gradient-to-b from-amber-800 to-amber-950 rounded-t-lg border-4 border-amber-950 shadow-2xl flex flex-col items-center justify-start pt-3">
        {/* Window / Avatar */}
        <div className="w-14 h-14 bg-amber-200 border-2 border-amber-900 rounded-t-full flex items-center justify-center text-3xl shadow-inner">
          {agent.avatar}
        </div>

        {/* Name Plate */}
        <div className={`mt-2 bg-gradient-to-r ${roofClass} px-3 py-0.5 rounded-md border-2 border-black shadow-md`}>
          <h3 className="text-white font-bold text-xs text-center tracking-wide uppercase" style={{ textShadow: '1px 1px 0 #000' }}>
            {agent.name}
          </h3>
        </div>

        {/* Level Badge */}
        <div className="absolute -top-2 right-3 bg-yellow-400 text-black font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-yellow-700 shadow z-20">
          {agent.level}
        </div>

        {/* Status Badge */}
        <div
          className={`mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold border-2 ${statusBadge[agent.status]}`}
        >
          {agent.status.toUpperCase()}
        </div>

        {/* Resource Bars */}
        <div className="w-full px-3 mt-3 flex flex-col gap-1.5">
          {/* Token Bar */}
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-purple-400 flex-shrink-0" />
            <div className="flex-1 h-2 bg-purple-950 rounded-full overflow-hidden border border-black">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
                style={{ width: `${Math.min((agent.tokenUsage.used / agent.tokenUsage.limit) * 100, 100)}%` }}
              />
            </div>
          </div>
          {/* Concurrency Bar */}
          <div className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-yellow-400 flex-shrink-0" />
            <div className="flex-1 h-2 bg-yellow-950 rounded-full overflow-hidden border border-black">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
                style={{ width: `${agent.concurrency.max > 0 ? (agent.concurrency.current / agent.concurrency.max) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTROL BUTTONS (hover only) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(agent.id, agent.status === 'running' ? 'paused' : 'running');
          }}
          className="p-1.5 bg-slate-800 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform"
          aria-label={agent.status === 'running' ? 'Pause agent' : 'Resume agent'}
        >
          {agent.status === 'running' ? (
            <Pause className="w-3 h-3 text-yellow-400" />
          ) : (
            <Play className="w-3 h-3 text-green-400" />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(agent.id, 'running');
          }}
          className="p-1.5 bg-slate-800 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform"
          aria-label="Restart agent"
        >
          <RotateCcw className="w-3 h-3 text-blue-400" />
        </button>
      </div>
    </div>
  );
}
