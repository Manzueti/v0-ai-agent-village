'use client';

import { useEffect, useState } from 'react';
import { MISSING_API_KEY_MESSAGE } from '@/lib/ai-key-copy';

export type AiStatus = {
  ready: boolean;
  loading: boolean;
  message: string | null;
};

export function useAiStatus(): AiStatus {
  const [status, setStatus] = useState<AiStatus>({
    ready: false,
    loading: true,
    message: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetch('/api/ai/status')
      .then(async (response) => {
        if (!response.ok) {
          return { ready: false, message: MISSING_API_KEY_MESSAGE };
        }
        const data = (await response.json()) as { ready?: boolean; message?: string | null };
        const ready = Boolean(data.ready);
        return {
          ready,
          message: ready ? null : data.message || MISSING_API_KEY_MESSAGE,
        };
      })
      .then((next) => {
        if (!cancelled) setStatus({ ...next, loading: false });
      })
      .catch(() => {
        if (!cancelled) {
          setStatus({
            ready: false,
            loading: false,
            message: 'AI provider status is unavailable. Refresh and try again.',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
