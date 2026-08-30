'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  ArrowRight, Bot, BrainCircuit, Building2, CheckCircle2, CircleDollarSign,
  Code2, Factory, Palette, Scale, ShieldCheck, Sparkles, Target, Workflow,
} from 'lucide-react';

const VillagePage = dynamic(() => import('./village/page'), { ssr: false });
const TasksPage = dynamic(() => import('./tasks/page'), { ssr: false });
const CyberEmpirePage = dynamic(() => import('./cyberempire/page'), { ssr: false });
const COEPage = dynamic(() => import('./coe/page'), { ssr: false });
const AIControlPage = dynamic(() => import('./ai-control/page'), { ssr: false });
const InfraPage = dynamic(() => import('./infrastructure/page'), { ssr: false });

const SECTIONS: Record<string, React.ComponentType> = {
  village: VillagePage,
  tasks: TasksPage,
  cyberempire: CyberEmpirePage,
  coe: COEPage,
  'ai-control': AIControlPage,
  infrastructure: InfraPage,
};

const METRICS = [
  { value: '20', label: 'Agents online', detail: 'Across 5 business units' },
  { value: '93%', label: 'Autonomous completion', detail: 'Last 30 operating cycles' },
  { value: '24/7', label: 'Company uptime', detail: 'Follow-the-sun execution' },
  { value: '3', label: 'Human approvals', detail: 'Awaiting executive review' },
] as const;

const EXECUTIVES = [
  { name: 'ATLAS', role: 'Chief Executive Agent', status: 'Allocating Q3 objectives', color: 'hsl(var(--neon-magenta))' },
  { name: 'ORBIT', role: 'Chief Operating Agent', status: 'Resolving 4 dependencies', color: 'hsl(var(--neon-cyan))' },
  { name: 'SENTRY', role: 'Chief Governance Agent', status: 'All policies enforced', color: 'hsl(var(--neon-green))' },
] as const;

const DEPARTMENTS = [
  {
    name: 'Growth & Revenue',
    mandate: 'Find demand, qualify opportunities, and turn market signals into durable revenue.',
    agents: '5 agents', output: '+18% pipeline velocity', icon: CircleDollarSign,
    color: 'hsl(var(--neon-green))', href: '/?s=cyberempire',
  },
  {
    name: 'Product & Creative',
    mandate: 'Research customer needs, design experiences, and ship campaigns as one continuous loop.',
    agents: '4 agents', output: '3 launches active', icon: Palette,
    color: 'hsl(var(--neon-magenta))', href: '/?s=village',
  },
  {
    name: 'Engineering & Systems',
    mandate: 'Build, deploy, observe, and repair the digital infrastructure that powers the company.',
    agents: '5 agents', output: '99.99% availability', icon: Code2,
    color: 'hsl(var(--neon-cyan))', href: '/?s=infrastructure',
  },
  {
    name: 'Finance & Intelligence',
    mandate: 'Forecast cash, model scenarios, and continuously optimize how resources are allocated.',
    agents: '3 agents', output: '12.4 mo. runway', icon: BrainCircuit,
    color: 'hsl(var(--neon-yellow))', href: '/?s=cyberempire',
  },
  {
    name: 'Governance & Operations',
    mandate: 'Enforce policy, audit decisions, manage exceptions, and route high-impact choices to humans.',
    agents: '3 agents', output: '0 policy breaches', icon: Scale,
    color: 'hsl(var(--neon-purple))', href: '/?s=ai-control',
  },
] as const;

const OPERATING_LOOP = [
  { step: '01', title: 'Set objective', detail: 'Humans define the mission, budget, policy, and decision boundaries.', icon: Sparkles },
  { step: '02', title: 'Agent planning', detail: 'Executive agents decompose goals into owned, measurable workstreams.', icon: CheckCircle2 },
  { step: '03', title: 'Autonomous execution', detail: 'Specialist agents collaborate, use tools, and deliver verifiable outputs.', icon: Workflow },
  { step: '04', title: 'Review & escalate', detail: 'Results are audited continuously; exceptions return to human leadership.', icon: ShieldCheck },
] as const;

function ActiveSection() {
  const searchParams = useSearchParams();
  const sectionKey = searchParams.get('s') ?? '';
  const Section = SECTIONS[sectionKey];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={Section ? sectionKey : 'home'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {Section ? <Section /> : <HomeSection />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground/40">INITIALIZING...</div>}>
      <ActiveSection />
    </Suspense>
  );
}

function HomeSection() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="scanlines relative min-h-screen overflow-hidden bg-transparent font-mono">
      <div className="cyber-grid pointer-events-none fixed inset-0 opacity-20" />
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-[50%] w-[50%] animate-pulse rounded-full bg-[hsl(var(--neon-cyan)/0.15)] blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[50%] w-[50%] animate-pulse rounded-full bg-[hsl(var(--neon-magenta)/0.1)] blur-[120px]" style={{ animationDelay: '2s' }} />

      <div className="container relative z-10 mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <header className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between lg:mb-24">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded bg-gradient-to-br from-[hsl(var(--neon-magenta))] to-[hsl(var(--neon-purple))] shadow-[0_0_25px_hsl(var(--neon-magenta)/0.5)]">
              <Factory className="h-7 w-7 text-background" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-[0.4em] text-white">CYBER<span className="text-[hsl(var(--neon-magenta))]">EMPIRE</span></h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Autonomous AI Company // Operating System</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-left sm:text-right">
            <div className="text-glow text-3xl font-black tabular-nums tracking-tighter text-[hsl(var(--neon-cyan))]">{time}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">System Time // UTC-0</div>
          </motion.div>
        </header>

        <div className="mb-24 grid items-center gap-14 lg:mb-32 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="panel-glow-cyan mb-8 inline-block rounded border border-[hsl(var(--neon-cyan)/0.4)] bg-[hsl(var(--neon-cyan)/0.1)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.3em] text-[hsl(var(--neon-cyan))]">
              <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--neon-cyan))]" />
              Autonomous Company Online
            </div>
            <h2 className="mb-8 text-5xl font-black leading-[0.9] tracking-tight sm:text-6xl lg:text-8xl">
              THE COMPANY <br />
              <span className="bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--neon-purple))] to-[hsl(var(--neon-magenta))] bg-clip-text text-transparent">RUN BY</span>{' '}<br />
              AI AGENTS.
            </h2>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Set the mission. Define the guardrails. A coordinated workforce of executive and specialist agents plans, executes, measures, and improves every function of the business.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/?s=village" className="rounded bg-[hsl(var(--neon-purple))] px-8 py-5 font-black uppercase tracking-widest text-background shadow-[0_0_30px_hsl(var(--neon-purple)/0.5)] transition-all hover:scale-105 sm:px-10">Enter Agent Network</Link>
              <Link href="/?s=tasks" className="rounded border border-[hsl(var(--neon-cyan)/0.5)] px-8 py-5 font-black uppercase tracking-widest text-[hsl(var(--neon-cyan))] transition-all hover:scale-105 hover:bg-[hsl(var(--neon-cyan)/0.1)] sm:px-10">Open Work Queue</Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <div className="panel-glow-cyan relative overflow-hidden rounded-md border border-[hsl(var(--neon-cyan)/0.3)] bg-[hsl(var(--card)/0.7)] p-7 shadow-2xl backdrop-blur-md sm:p-9">
              <div className="scanlines pointer-events-none absolute inset-0 opacity-15" />
              <div className="relative">
                <div className="mb-6 flex items-start justify-between gap-6 border-b border-white/10 pb-6">
                  <div>
                    <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[hsl(var(--neon-cyan))]">Primary company objective</div>
                    <h3 className="text-2xl font-black leading-tight text-white sm:text-3xl">Become the operating layer for autonomous business.</h3>
                  </div>
                  <Target className="h-8 w-8 shrink-0 text-[hsl(var(--neon-magenta))]" />
                </div>
                <div className="mb-8">
                  <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">Objective progress</span>
                    <span className="text-[hsl(var(--neon-green))]">68%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ delay: 0.7, duration: 1 }} className="h-full bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-green))] shadow-[0_0_12px_hsl(var(--neon-cyan))]" />
                  </div>
                </div>
                <div className="space-y-3">
                  {EXECUTIVES.map((agent, index) => (
                    <motion.div key={agent.name} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + index * 0.1 }} className="flex items-center gap-4 rounded border border-white/5 bg-black/20 p-4">
                      <div className="grid h-10 w-10 place-items-center rounded border border-white/10 bg-white/5" style={{ color: agent.color }}><Bot className="h-5 w-5" /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="font-black tracking-widest text-white">{agent.name}</span>
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{agent.role}</span>
                        </div>
                        <p className="mt-1 truncate text-xs" style={{ color: agent.color }}>{agent.status}</p>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-[hsl(var(--neon-green))] shadow-[0_0_8px_hsl(var(--neon-green))]" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-28 grid border-y border-white/10 sm:grid-cols-2 xl:grid-cols-4" aria-label="Company performance">
          {METRICS.map((metric) => (
            <div key={metric.label} className="border-white/10 px-6 py-7 sm:border-r">
              <div className="mb-2 text-3xl font-black text-white">{metric.value}</div>
              <div className="mb-1 text-[10px] font-black uppercase tracking-[0.24em] text-[hsl(var(--neon-cyan))]">{metric.label}</div>
              <div className="text-xs text-muted-foreground">{metric.detail}</div>
            </div>
          ))}
        </motion.section>

        <section className="mb-28" aria-labelledby="organization-title">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2 text-[hsl(var(--neon-magenta))]">
                <Building2 className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">The agent organization</span>
              </div>
              <h2 id="organization-title" className="text-4xl font-black tracking-tight text-white sm:text-5xl">Every function has an owner.</h2>
            </div>
            <p className="max-w-xl leading-relaxed text-muted-foreground">Departments operate independently inside shared goals, budgets, memory, and governance. Agents hand work to one another instead of waiting for meetings.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {DEPARTMENTS.map((department, index) => {
              const Icon = department.icon;
              return (
                <motion.div key={department.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
                  <Link href={department.href} className="group block h-full rounded-md border bg-[hsl(var(--card)/0.6)] p-7 backdrop-blur-md transition-all hover:bg-[hsl(var(--card)/0.85)]" style={{ borderColor: department.color }}>
                    <div className="mb-8 flex items-start justify-between gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded border border-white/10 bg-black/20" style={{ color: department.color }}><Icon className="h-6 w-6" /></div>
                      <span className="rounded border border-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{department.agents}</span>
                    </div>
                    <h3 className="mb-3 text-xl font-black uppercase tracking-wider text-white">{department.name}</h3>
                    <p className="mb-8 text-sm leading-relaxed text-muted-foreground">{department.mandate}</p>
                    <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                      <span className="text-xs font-bold" style={{ color: department.color }}>{department.output}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-white" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mb-24 grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16" aria-labelledby="operating-model-title">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="panel-glow-magenta rounded-md border border-[hsl(var(--neon-purple)/0.35)] bg-[hsl(var(--card)/0.65)] p-8 lg:p-10">
            <Workflow className="mb-8 h-10 w-10 text-[hsl(var(--neon-purple))]" />
            <div className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--neon-purple))]">Operating model</div>
            <h2 id="operating-model-title" className="mb-6 text-4xl font-black leading-tight text-white">Autonomous by default. Human-governed by design.</h2>
            <p className="mb-8 leading-relaxed text-muted-foreground">Agents can act quickly inside explicit limits. Material spend, policy exceptions, strategic pivots, and sensitive decisions always escalate to a person.</p>
            <Link href="/?s=ai-control" className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-[hsl(var(--neon-purple))] transition-colors hover:text-white">Open governance console <ArrowRight className="h-4 w-4" /></Link>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2">
            {OPERATING_LOOP.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-md border border-white/10 bg-black/20 p-6">
                  <div className="mb-6 flex items-center justify-between"><span className="text-3xl font-black text-white/10">{item.step}</span><Icon className="h-5 w-5 text-[hsl(var(--neon-cyan))]" /></div>
                  <h3 className="mb-3 font-black uppercase tracking-widest text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <footer className="flex flex-col gap-5 border-t border-white/10 pt-8 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-8 gap-y-2"><span>CYBEREMPIRE COMPANY OS</span><span className="text-[hsl(var(--neon-green))]">● ALL SYSTEMS OPERATIONAL</span></div>
          <span>Human-governed autonomy // © 2026</span>
        </footer>
      </div>
    </div>
  );
}
