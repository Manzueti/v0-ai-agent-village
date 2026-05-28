'use client';

import React, { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div className="p-4 rounded-md bg-red-900/20 border border-red-500/50 text-red-200 font-mono">
      <h2 className="text-lg font-bold mb-2 tracking-widest uppercase">System Malfunction</h2>
      <p className="text-xs mb-4 opacity-70">{message}</p>
      <button
        className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded text-[10px] tracking-widest uppercase hover:bg-red-500/30 transition"
        onClick={resetErrorBoundary}
      >
        Reboot Component
      </button>
    </div>
  );
}

export default function ErrorBoundary({ children, fallback }: Props) {
  return (
    <ReactErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
      onReset={() => {
        // Reset the state of your app so the error doesn't happen again
        console.log('Resetting Error Boundary...');
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
