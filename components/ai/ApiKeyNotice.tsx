'use client';

import { KeyRound } from 'lucide-react';
import { MISSING_API_KEY_MESSAGE } from '@/lib/ai-key-copy';

export function ApiKeyNotice({ message }: { message?: string | null }) {
  return (
    <div
      role="status"
      className="rounded-md border border-[hsl(var(--neon-yellow)/0.45)] bg-[hsl(var(--neon-yellow)/0.08)] px-4 py-3"
    >
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[hsl(var(--neon-yellow))]">
        <KeyRound className="h-3.5 w-3.5" />
        Add your API key
      </div>
      <p className="mt-2 font-mono text-[11px] leading-relaxed text-slate-300">
        {message || MISSING_API_KEY_MESSAGE}
      </p>
    </div>
  );
}
