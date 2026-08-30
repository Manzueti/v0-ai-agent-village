'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity, ArrowUpRight, Bot, BrainCircuit, Check, ChevronRight,
  CircleDollarSign, Code2, Command, Factory, Gauge, MessageSquare,
  Palette, Radio, Scale, ShieldCheck, Sparkles, Target,
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

const TOP_METRICS = [
  { label: 'Revenue', value: '$82.4K', delta: '+12.8%' },
  { label: 'Active work', value: '38', delta: '14 priority' },
  { label: 'Agent fleet', value: '20/20', delta: 'All online' },
] as const;

const DIRECTIVES = [
  { title: 'Launch enterprise pilot', owner: 'ATLAS · GROWTH', progress: 76, due: '4h 12m', color: 'hsl(var(--neon-cyan))' },
  { title: 'Reduce inference cost', owner: 'ORBIT · SYSTEMS', progress: 58, due: '8h 40m', color: 'hsl(var(--neon-purple))' },
  { title: 'Close Q3 forecast', owner: 'NOVA · FINANCE', progress: 89, due: '1h 05m', color: 'hsl(var(--neon-green))' },
] as const;

const SIGNALS = [
  { time: '22:41', text: 'Lead scoring model promoted', agent: 'MIRA', color: 'hsl(var(--neon-green))' },
  { time: '22:38', text: 'Policy exception escalated', agent: 'SENTRY', color: 'hsl(var(--neon-yellow))' },
  { time: '22:35', text: 'Production deploy verified', agent: 'ORBIT', color: 'hsl(var(--neon-cyan))' },
  { time: '22:31', text: 'Campaign creative approved', agent: 'LUMA', color: 'hsl(var(--neon-magenta))' },
] as const;

const DEPARTMENTS = [
  {
    name: 'Growth',
    kicker: 'Revenue engine',
    metric: '$31.8K',
    metricLabel: 'qualified pipeline',
    task: 'Mapping enterprise accounts',
    agents: ['MIRA', 'NOA', 'HUNT'],
    icon: CircleDollarSign,
    color: 'hsl(var(--neon-green))',
    href: '/?s=cyberempire',
  },
  {
    name: 'Product',
    kicker: 'Market intelligence',
    metric: '3',
    metricLabel: 'experiments live',
    task: 'Synthesizing user signals',
    agents: ['LUMA', 'MAYA', 'RILEY'],
    icon: Palette,
    color: 'hsl(var(--neon-magenta))',
    href: '/?s=village',
  },
  {
    name: 'Finance',
    kicker: 'Capital control',
    metric: '12.4',
    metricLabel: 'months runway',
    task: 'Closing rolling forecast',
    agents: ['NOVA', 'KAI', 'ARIA'],
    icon: BrainCircuit,
    color: 'hsl(var(--neon-yellow))',
    href: '/?s=cyberempire',
  },
  {
    name: 'Systems',
    kicker: 'Build & reliability',
    metric: '99.99%',
    metricLabel: 'service health',
    task: 'Optimizing model routing',
    agents: ['ORBIT', 'BYTE', 'SAGE'],
    icon: Code2,
    color: 'hsl(var(--neon-cyan))',
    href: '/?s=infrastructure',
  },
] as const;

const APPROVALS = [
  { title: 'Increase campaign budget', owner: 'MIRA', amount: '$4,800', type: 'Spend' },
  { title: 'Publish pricing experiment', owner: 'LUMA', amount: 'Tier 2', type: 'Policy' },
  { title: 'Enable new model provider', owner: 'ORBIT', amount: 'Global', type: 'Access' },
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
        transition={{ duration: 0.16 }}
      >
        {Section ? <Section /> : <HomeSection />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="grid h-screen place-items-center font-mono text-xs tracking-[0.3em] text-muted-foreground">BOOTING COMPANY OS...</div>}>
      <ActiveSection />
    </Suspense>
  );
}

function HomeSection() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070c] font-mono text-white">
      <div className="pointer-events-none fixed inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(72,229,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(72,229,255,0.025) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="pointer-events-none fixed left-[24%] top-[-18%] h-[460px] w-[560px] rounded-full bg-[hsl(var(--neon-purple)/0.08)] blur-[140px]" />
      <div className="pointer-events-none fixed bottom-[-20%] right-[-8%] h-[520px] w-[520px] rounded-full bg-[hsl(var(--neon-cyan)/0.07)] blur-[150px]" />

      <header className="relative z-20 flex min-h-16 flex-col border-b border-white/[0.08] bg-[#080a10]/90 px-5 backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-h-16 items-center gap-4">
          <div className="grid h-9 w-9 place-items-center rounded-lg border border-[hsl(var(--neon-cyan)/0.35)] bg-[hsl(var(--neon-cyan)/0.08)] shadow-[inset_0_0_20px_hsl(var(--neon-cyan)/0.08)]">
            <Factory className="h-4 w-4 text-[hsl(var(--neon-cyan))]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-black tracking-[0.25em]">CYBEREMPIRE</h1>
              <span className="rounded border border-[hsl(var(--neon-green)/0.25)] bg-[hsl(var(--neon-green)/0.07)] px-2 py-0.5 text-[8px] font-black tracking-[0.18em] text-[hsl(var(--neon-green))]">LIVE</span>
            </div>
            <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-white/35">Autonomous company operating system</p>
          </div>
        </div>

        <div className="hidden items-center self-stretch lg:flex">
          {TOP_METRICS.map((metric) => (
            <div key={metric.label} className="flex h-full min-w-36 flex-col justify-center border-l border-white/[0.07] px-5">
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/35">{metric.label}</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-sm font-black tabular-nums">{metric.value}</span>
                <span className="text-[8px] font-bold text-[hsl(var(--neon-green))]">{metric.delta}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex min-h-12 items-center justify-between gap-5 border-t border-white/[0.07] lg:min-h-0 lg:border-0 lg:pl-5">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
            <Radio className="h-3.5 w-3.5 animate-pulse text-[hsl(var(--neon-green))]" />
            Network stable
          </div>
          <div className="text-right">
            <div className="text-sm font-black tabular-nums tracking-wider text-[hsl(var(--neon-cyan))]">{time}</div>
            <div className="text-[8px] uppercase tracking-[0.2em] text-white/30">UTC · Cycle 214</div>
          </div>
        </div>
      </header>

      <main className="relative z-10 grid gap-4 p-4 xl:grid-cols-[248px_minmax(560px,1fr)_286px]">
        <aside className="space-y-4">
          <Panel title="Mission queue" eyebrow="3 active" icon={Target}>
            <div className="space-y-2.5">
              {DIRECTIVES.map((directive) => (
                <Link key={directive.title} href="/?s=tasks" className="group block rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition hover:border-white/15 hover:bg-white/[0.045]">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[11px] font-bold leading-snug text-white/90">{directive.title}</h3>
                      <p className="mt-1 text-[8px] tracking-[0.12em] text-white/35">{directive.owner}</p>
                    </div>
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 text-white/20 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
                  </div>
                  <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full" style={{ width: directive.progress + '%', background: directive.color, boxShadow: '0 0 10px ' + directive.color }} />
                  </div>
                  <div className="flex justify-between text-[8px] font-bold text-white/30">
                    <span>{directive.progress}% COMPLETE</span>
                    <span>{directive.due}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/?s=tasks" className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] py-2.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/45 transition hover:bg-white/[0.04] hover:text-white">
              View all work <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Panel>

          <Panel title="Live signals" eyebrow="Streaming" icon={Activity}>
            <div className="space-y-4">
              {SIGNALS.map((signal) => (
                <div key={signal.time} className="flex gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: signal.color, boxShadow: '0 0 8px ' + signal.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] leading-relaxed text-white/65">{signal.text}</p>
                    <div className="mt-1 flex justify-between text-[8px] font-bold text-white/25"><span>{signal.agent}</span><span>{signal.time}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </aside>

        <section className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0a0d14]/80 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 border-b border-white/[0.08] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--neon-cyan))]"><Gauge className="h-3.5 w-3.5" /> Operating floor</div>
              <h2 className="mt-1.5 text-lg font-black tracking-tight">Autonomous organization map</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white/40">5 units</span>
              <span className="rounded-full border border-[hsl(var(--neon-green)/0.2)] bg-[hsl(var(--neon-green)/0.06)] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-[hsl(var(--neon-green))]">20 agents online</span>
            </div>
          </div>

          <div className="relative p-4">
            <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(120,100,255,0.16), transparent 55%)' }} />
            <div className="relative grid gap-3 lg:grid-cols-3">
              <DepartmentCard department={DEPARTMENTS[0]} />
              <CommandCore />
              <DepartmentCard department={DEPARTMENTS[1]} />
              <DepartmentCard department={DEPARTMENTS[2]} />
              <DepartmentCard department={DEPARTMENTS[3]} />
              <GovernanceCard />
            </div>
          </div>

          <div className="border-t border-white/[0.08] bg-black/15 px-5 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg border border-[hsl(var(--neon-purple)/0.25)] bg-[hsl(var(--neon-purple)/0.07)]"><MessageSquare className="h-3.5 w-3.5 text-[hsl(var(--neon-purple))]" /></div>
                <div><p className="text-[9px] font-bold text-white/75"><span className="text-[hsl(var(--neon-purple))]">ATLAS:</span> Growth and Product are aligned. Advancing pilot launch to validation.</p><p className="mt-1 text-[8px] text-white/25">Executive channel · just now</p></div>
              </div>
              <Link href="/?s=village" className="whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.18em] text-white/35 hover:text-white">Open agent network →</Link>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <Panel title="Company objective" eyebrow="Q3 · O1" icon={Sparkles}>
            <h3 className="text-sm font-black leading-snug">Become the operating layer for autonomous business.</h3>
            <div className="my-5 flex items-center gap-5">
              <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full" style={{ background: 'conic-gradient(hsl(var(--neon-cyan)) 0 68%, rgba(255,255,255,0.06) 68% 100%)' }}>
                <div className="grid h-[78px] w-[78px] place-items-center rounded-full bg-[#0c1018]"><div className="text-center"><div className="text-xl font-black">68%</div><div className="text-[7px] uppercase tracking-[0.14em] text-white/30">complete</div></div></div>
              </div>
              <div className="space-y-3 text-[9px]">
                <Stat label="Key results" value="3 / 5" />
                <Stat label="Cycle health" value="On track" accent />
                <Stat label="Next review" value="12h 20m" />
              </div>
            </div>
            <Link href="/?s=cyberempire" className="flex items-center justify-between rounded-lg border border-[hsl(var(--neon-cyan)/0.2)] bg-[hsl(var(--neon-cyan)/0.05)] px-3.5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-[hsl(var(--neon-cyan))] transition hover:bg-[hsl(var(--neon-cyan)/0.1)]">Open company plan <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </Panel>

          <Panel title="Human review" eyebrow="3 pending" icon={ShieldCheck}>
            <div className="space-y-2">
              {APPROVALS.map((approval) => (
                <Link key={approval.title} href="/?s=ai-control" className="group block rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition hover:border-[hsl(var(--neon-yellow)/0.25)] hover:bg-white/[0.045]">
                  <div className="mb-2 flex items-center justify-between"><span className="rounded bg-white/[0.05] px-2 py-1 text-[7px] font-bold uppercase tracking-[0.14em] text-white/35">{approval.type}</span><span className="text-[9px] font-black text-[hsl(var(--neon-yellow))]">{approval.amount}</span></div>
                  <h3 className="text-[10px] font-bold leading-snug text-white/75 group-hover:text-white">{approval.title}</h3>
                  <div className="mt-2 flex items-center justify-between text-[8px] text-white/25"><span>Requested by {approval.owner}</span><ChevronRight className="h-3 w-3" /></div>
                </Link>
              ))}
            </div>
          </Panel>

          <div className="rounded-2xl border border-[hsl(var(--neon-green)/0.15)] bg-[hsl(var(--neon-green)/0.035)] p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full border border-[hsl(var(--neon-green)/0.2)] bg-[hsl(var(--neon-green)/0.07)]"><Check className="h-4 w-4 text-[hsl(var(--neon-green))]" /></div>
              <div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[hsl(var(--neon-green))]">Governance healthy</p><p className="mt-1 text-[8px] text-white/30">0 breaches · 100% audit coverage</p></div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Panel({ title, eyebrow, icon: Icon, children }: { title: string; eyebrow: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0a0d14]/80 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.07] pb-3">
        <div className="flex items-center gap-2"><Icon className="h-3.5 w-3.5 text-white/40" /><h2 className="text-[10px] font-black uppercase tracking-[0.16em] text-white/70">{title}</h2></div>
        <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-[hsl(var(--neon-cyan))]">{eyebrow}</span>
      </div>
      {children}
    </section>
  );
}

function DepartmentCard({ department }: { department: (typeof DEPARTMENTS)[number] }) {
  const Icon = department.icon;
  return (
    <Link href={department.href} className="group relative min-h-44 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d111a] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#101620]">
      <div className="absolute inset-x-0 top-0 h-px opacity-80" style={{ background: 'linear-gradient(90deg, transparent, ' + department.color + ', transparent)' }} />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5"><div className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03]" style={{ color: department.color }}><Icon className="h-4 w-4" /></div><div><h3 className="text-[11px] font-black uppercase tracking-[0.12em]">{department.name}</h3><p className="mt-1 text-[7px] uppercase tracking-[0.16em] text-white/25">{department.kicker}</p></div></div>
        <ArrowUpRight className="h-3.5 w-3.5 text-white/15 transition group-hover:text-white/60" />
      </div>
      <div className="mt-5"><div className="text-xl font-black tabular-nums" style={{ color: department.color }}>{department.metric}</div><div className="mt-1 text-[8px] uppercase tracking-[0.12em] text-white/30">{department.metricLabel}</div></div>
      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3">
        <div><p className="text-[7px] uppercase tracking-[0.12em] text-white/25">Current action</p><p className="mt-1 text-[8px] text-white/55">{department.task}</p></div>
        <div className="flex -space-x-1.5">{department.agents.map((agent) => <span key={agent} title={agent} className="grid h-6 w-6 place-items-center rounded-full border border-[#0d111a] bg-white/[0.08] text-[6px] font-black text-white/55">{agent.slice(0, 1)}</span>)}</div>
      </div>
    </Link>
  );
}

function CommandCore() {
  return (
    <Link href="/?s=village" className="group relative min-h-44 overflow-hidden rounded-xl border border-[hsl(var(--neon-purple)/0.28)] bg-[radial-gradient(circle_at_50%_15%,hsl(var(--neon-purple)/0.14),transparent_55%),#0d1019] p-4 shadow-[inset_0_0_50px_hsl(var(--neon-purple)/0.05)] lg:row-span-2">
      <div className="absolute inset-2 rounded-lg border border-[hsl(var(--neon-purple)/0.08)]" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5"><div className="grid h-9 w-9 place-items-center rounded-lg border border-[hsl(var(--neon-purple)/0.25)] bg-[hsl(var(--neon-purple)/0.09)] shadow-[0_0_24px_hsl(var(--neon-purple)/0.12)]"><Command className="h-4 w-4 text-[hsl(var(--neon-purple))]" /></div><div><h3 className="text-[11px] font-black uppercase tracking-[0.12em]">Executive core</h3><p className="mt-1 text-[7px] uppercase tracking-[0.16em] text-[hsl(var(--neon-purple))]">Strategy & orchestration</p></div></div>
          <span className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--neon-green)/0.18)] bg-[hsl(var(--neon-green)/0.05)] px-2 py-1 text-[7px] font-bold text-[hsl(var(--neon-green))]"><span className="h-1 w-1 animate-pulse rounded-full bg-current" /> ACTIVE</span>
        </div>
        <div className="my-6 grid place-items-center">
          <div className="relative grid h-24 w-24 place-items-center rounded-full border border-[hsl(var(--neon-purple)/0.2)]">
            <div className="absolute inset-2 animate-[spin_14s_linear_infinite] rounded-full border border-dashed border-[hsl(var(--neon-cyan)/0.25)]" />
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[hsl(var(--neon-purple)/0.12)] shadow-[0_0_32px_hsl(var(--neon-purple)/0.18)]"><Bot className="h-6 w-6 text-[hsl(var(--neon-cyan))]" /></div>
          </div>
        </div>
        <div className="space-y-2">
          {[['ATLAS', 'Chief Executive', 'Setting priorities'], ['ORBIT', 'Chief Operating', 'Routing execution'], ['SENTRY', 'Chief Governance', 'Auditing decisions']].map(([name, role, task]) => (
            <div key={name} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-black/15 px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--neon-green))] shadow-[0_0_7px_hsl(var(--neon-green))]" />
              <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="text-[8px] font-black tracking-[0.1em]">{name}</span><span className="text-[7px] text-white/25">{role}</span></div><p className="mt-1 text-[7px] text-white/40">{task}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-4 text-center text-[7px] font-bold uppercase tracking-[0.16em] text-white/25 group-hover:text-[hsl(var(--neon-cyan))]">Enter command core →</div>
      </div>
    </Link>
  );
}

function GovernanceCard() {
  return (
    <Link href="/?s=ai-control" className="group relative overflow-hidden rounded-xl border border-[hsl(var(--neon-purple)/0.18)] bg-[#0d111a] p-4 transition hover:border-[hsl(var(--neon-purple)/0.35)] lg:col-span-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg border border-[hsl(var(--neon-purple)/0.2)] bg-[hsl(var(--neon-purple)/0.06)]"><Scale className="h-4 w-4 text-[hsl(var(--neon-purple))]" /></div><div><h3 className="text-[10px] font-black uppercase tracking-[0.14em]">Governance layer</h3><p className="mt-1 text-[8px] text-white/30">Every decision is policy-checked, logged, and reversible.</p></div></div>
        <div className="flex gap-6">
          <div><p className="text-[7px] uppercase tracking-[0.14em] text-white/25">Decisions today</p><p className="mt-1 text-sm font-black">1,284</p></div>
          <div><p className="text-[7px] uppercase tracking-[0.14em] text-white/25">Audit coverage</p><p className="mt-1 text-sm font-black text-[hsl(var(--neon-green))]">100%</p></div>
          <ChevronRight className="h-4 w-4 self-center text-white/15 transition group-hover:translate-x-0.5 group-hover:text-white/60" />
        </div>
      </div>
    </Link>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div><p className="text-[7px] uppercase tracking-[0.14em] text-white/25">{label}</p><p className={accent ? 'mt-1 font-black text-[hsl(var(--neon-green))]' : 'mt-1 font-black text-white/75'}>{value}</p></div>;
}
