'use client';

import { useState } from 'react';
import { employees as initialEmployees } from '@/lib/data';
import { Employee, AgentStatus } from '@/lib/types';
import AgentHut from '@/components/AgentHut';
import AgentDetailPanel from '@/components/AgentDetailPanel';

export default function AgentVillage() {
  const [agents, setAgents] = useState<Employee[]>(initialEmployees);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? null;

  const handleToggleStatus = (id: string, newStatus: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, status: newStatus as AgentStatus } : agent
      )
    );
  };

  const handleUpdateAgent = (id: string, updates: Partial<Employee>) => {
    setAgents((prev) =>
      prev.map((agent) => (agent.id === id ? { ...agent, ...updates } : agent))
    );
  };

  const running = agents.filter((a) => a.status === 'running').length;
  const paused = agents.filter((a) => a.status === 'paused').length;
  const errors = agents.filter((a) => a.status === 'error').length;

  return (
    <div className="relative min-h-screen grass-bg overflow-auto">

      {/* Header Banner */}
      <header className="relative z-10 pt-8 pb-4 text-center">
        <div className="inline-block bg-gradient-to-b from-amber-800 to-amber-950 px-10 py-3 rounded-lg border-4 border-yellow-900 shadow-xl">
          <h1
            className="text-3xl font-black text-yellow-300 tracking-widest"
            style={{ textShadow: '2px 2px 0 #000, 4px 4px 0 #78350f' }}
          >
            AGENT VILLAGE
          </h1>
          <p className="text-yellow-200/80 text-xs mt-1 font-semibold tracking-wide">Manage your AI workforce</p>
        </div>

        {/* Resource Bar */}
        <div className="flex justify-center gap-4 mt-4">
          <ResourceChip emoji="🟢" label="Running" value={running} color="bg-green-800/80 border-green-900" />
          <ResourceChip emoji="⏸" label="Paused" value={paused} color="bg-yellow-800/80 border-yellow-900" />
          <ResourceChip emoji="🔴" label="Errors" value={errors} color="bg-red-800/80 border-red-900" />
        </div>
      </header>

      {/* Agent Grid */}
      <main className="relative z-10 container mx-auto p-8 pb-24">
        <div className="flex flex-wrap justify-center gap-10">
          {agents.map((agent) => (
            <AgentHut
              key={agent.id}
              agent={agent}
              onSelect={setSelectedAgentId}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      </main>

      {/* Detail Panel */}
      {selectedAgent && (
        <AgentDetailPanel
          agent={selectedAgent}
          onClose={() => setSelectedAgentId(null)}
          onUpdateAgent={handleUpdateAgent}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
}

function ResourceChip({
  emoji,
  label,
  value,
  color,
}: {
  emoji: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 text-white text-sm font-bold shadow ${color}`}>
      <span>{emoji}</span>
      <span>{value} {label}</span>
    </div>
  );
}
