'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { HomeSection } from '@/components/home/HomeSection';

// ── Lazy-load each section (ssr:false keeps them client-only) ─────────────────

const VillagePage     = dynamic(() => import('./village/page'),        { ssr: false });
const TasksPage       = dynamic(() => import('./tasks/page'),          { ssr: false });
const CyberEmpirePage = dynamic(() => import('./cyberempire/page'),    { ssr: false });
const COEPage         = dynamic(() => import('./coe/page'),            { ssr: false });
const AIControlPage   = dynamic(() => import('./ai-control/page'),     { ssr: false });
const InfraPage       = dynamic(() => import('./infrastructure/page'), { ssr: false });

const SECTIONS: Record<string, React.ComponentType> = {
  village:        VillagePage,
  tasks:          TasksPage,
  cyberempire:    CyberEmpirePage,
  coe:            COEPage,
  'ai-control':   AIControlPage,
  infrastructure: InfraPage,
};

// ── Section router ────────────────────────────────────────────────────────────

function ActiveSection() {
  const searchParams = useSearchParams();
  const s = searchParams.get('s') ?? '';
  const Section = SECTIONS[s];

  return (
    <AnimatePresence mode="wait">
      {Section ? (
        <motion.div
          key={s}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Section />
        </motion.div>
      ) : (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <HomeSection />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full font-mono text-muted-foreground/40 text-xs tracking-[0.3em] uppercase">
        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
          INITIALIZING...
        </motion.span>
      </div>
    }>
      <ActiveSection />
    </Suspense>
  );
}

