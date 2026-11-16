'use client';

import Link from 'next/link';
import { MotionConfig, motion } from 'framer-motion';
import {
  ArrowRight, Brain, Eye, Factory, Gauge, Network, RefreshCw,
  Server, Sparkles, Target, Trees, Zap,
} from 'lucide-react';
import { employees } from '@/lib/data';
import type { Employee } from '@/lib/types';

// ── Compute tiers ─────────────────────────────────────────────────────────────
// Each agent runs on a token budget. Remaining budget decides how it operates.

type Tier = 'normal' | 'low' | 'critical';

const TIERS: Record<Tier, { label: string; color: string; rule: string; behavior: string }> = {
  normal: {
    label: 'Normal',
    color: 'var(--neon-green)',
    rule: 'Over 50% budget left',
    behavior: 'Full capability. Frontier models and full concurrency.',
  },
  low: {
    label: 'Low compute',
    color: 'var(--neon-yellow)',
    rule: '25–50% budget left',
    behavior: 'Routes to cheaper models and sheds non-essential work.',
  },
  critical: {
    label: 'Critical',
    color: 'var(--destructive)',
    rule: 'Under 25% budget left',
    behavior: 'Minimal inference. Focuses only on work that earns budget back.',
  },
};

const budgetLeft = (e: Employee) => 1 - e.tokenUsage.used / e.tokenUsage.limit;
const tierOf = (e: Employee): Tier => {
  const left = budgetLeft(e);
  return left > 0.5 ? 'normal' : left >= 0.25 ? 'low' : 'critical';
};

// ── Derived roster stats (from lib/data, not live telemetry) ─────────────────

const DEPARTMENTS = Array.from(new Set(employees.map((e) => e.department)));
const active = employees.filter((e) => e.status === 'running').length;
const tasksDone = employees.reduce((n, e) => n + e.tasksCompleted, 0);
const avgSuccess = employees.reduce((n, e) => n + e.successRate, 0) / employees.length;
const revenue = employees.reduce((n, e) => n + (e.revenueMetrics?.revenue ?? 0), 0);
const tierCounts = employees.reduce<Record<Tier, number>>(
  (acc, e) => ({ ...acc, [tierOf(e)]: acc[tierOf(e)] + 1 }),
  { normal: 0, low: 0, critical: 0 },
);

const nf = new Intl.NumberFormat('en-US');
// Formatted by hand: compact Intl output differs between Node and browsers (hydration mismatch).
const money = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${Math.round(n / 1e3)}K`);

const METRICS = [
  { label: 'Agents active', value: `${active}/${employees.length}` },
  { label: 'Departments', value: String(DEPARTMENTS.length) },
  { label: 'Tasks completed', value: nf.format(tasksDone) },
  { label: 'Avg. success rate', value: `${avgSuccess.toFixed(1)}%` },
  { label: 'Revenue attributed', value: money(revenue) },
];

const LOOP = [
  { icon: Brain, title: 'Think', desc: 'Each agent reads its directive, its budget and recent history, then decides what to do next.' },
  { icon: Zap, title: 'Act', desc: 'It calls tools: outreach, deploys, ledger entries or infrastructure changes.' },
  { icon: Eye, title: 'Observe', desc: 'Results, cost and outcome are logged to the mission log and feed its XP.' },
  { icon: RefreshCw, title: 'Repeat', desc: 'The loop continues, and its tier changes as the budget rises or falls.' },
];

const SECTIONS = [
  { href: '/?s=village', icon: Trees, title: 'Ecosystem', desc: 'See every agent in its department pod, in 2D or a 3D office.' },
  { href: '/?s=tasks', icon: Target, title: 'Tasks', desc: 'Assign work and follow it from queue to completion.' },
  { href: '/?s=cyberempire', icon: Factory, title: 'CyberEmpire', desc: 'The revenue side: factory, assembly, treasury and logistics.' },
  { href: '/?s=infrastructure', icon: Server, title: 'Infrastructure', desc: 'Nodes, zones and failover across the network.' },
  { href: '/?s=ai-control', icon: Network, title: 'AI Control', desc: 'Oversight of AI operators and the decisions they make.' },
  { href: '/?s=coe', icon: Sparkles, title: 'Center of Excellence', desc: 'Global directives that steer the whole workforce.' },
];

// ── Shared bits ───────────────────────────────────────────────────────────────

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--neon-cyan))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]';
const glass = 'rounded-xl border border-white/10 bg-[hsl(var(--card)/0.55)] backdrop-blur-md';

function SectionHeading({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--neon-cyan))]">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-white text-balance">{title}</h2>
      {children && <p className="font-body mt-3 text-base leading-relaxed text-muted-foreground">{children}</p>}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function HomeSection() {
  // MotionConfig "user" drops the movement for prefers-reduced-motion while keeping
  // server and client markup identical (a hook-based branch breaks hydration).
  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <MotionConfig reducedMotion="user">
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-10 pb-24 space-y-24">

        {/* Hero */}
        <section aria-labelledby="hero-title" className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center pt-6">
          <motion.div {...rise()}>
            <p className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--neon-green)/0.35)] bg-[hsl(var(--neon-green)/0.08)] px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-[hsl(var(--neon-green))]">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--neon-green))]" />
              {active} of {employees.length} agents running
            </p>
            <h1 id="hero-title" className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-white text-balance">
              An autonomous workforce that{' '}
              <span className="text-[hsl(var(--neon-cyan))]">earns its own compute.</span>
            </h1>
            <p className="font-body mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {employees.length} AI agents across {DEPARTMENTS.length} departments run a continuous think, act, observe loop.
              Each one works within a token budget, and budget decides how much it can do.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/?s=village"
                className={`inline-flex min-h-11 items-center gap-2 rounded-lg bg-[hsl(var(--neon-cyan))] px-6 py-3 text-sm font-bold text-[hsl(var(--background))] transition-colors duration-200 hover:bg-[hsl(var(--neon-cyan)/0.85)] ${focusRing}`}
              >
                Open the ecosystem <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <Link
                href="/?s=tasks"
                className={`inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-6 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-white/5 ${focusRing}`}
              >
                Assign a task
              </Link>
            </div>
          </motion.div>

          <motion.div {...rise(0.1)}>
            <RosterPanel />
          </motion.div>
        </section>

        {/* Metrics */}
        <section aria-label="Workforce totals">
          <motion.dl {...rise()} className={`${glass} grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px overflow-hidden bg-white/10`}>
            {METRICS.map((m) => (
              <div key={m.label} className="bg-[hsl(var(--card)/0.9)] p-5">
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{m.label}</dt>
                <dd className="mt-2 text-2xl font-bold tabular-nums text-white">{m.value}</dd>
              </div>
            ))}
          </motion.dl>
          <p className="font-body mt-3 text-xs text-muted-foreground">Totals from the current agent roster, not live telemetry.</p>
        </section>

        {/* Loop */}
        <section aria-labelledby="loop-title">
          <SectionHeading id="loop-title" eyebrow="How it works" title="Every agent runs the same loop">
            No operator has to step in between turns. Each pass through the loop costs tokens, so the agents focus on work that earns its keep.
          </SectionHeading>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOOP.map(({ icon: Icon, title, desc }, i) => (
              <motion.li key={title} {...rise(i * 0.06)} className={`${glass} p-6`}>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--neon-cyan)/0.12)] text-[hsl(var(--neon-cyan))]">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-bold tabular-nums text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
                <p className="font-body mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </motion.li>
            ))}
          </ol>
        </section>

        {/* Tiers */}
        <section aria-labelledby="tiers-title">
          <SectionHeading id="tiers-title" eyebrow="Compute tiers" title="Budget decides behavior">
            When an agent burns through its token budget it does not stop at once. It moves down a tier and changes how it works.
          </SectionHeading>
          <div className="grid gap-4 md:grid-cols-3">
            {(Object.keys(TIERS) as Tier[]).map((t, i) => {
              const tier = TIERS[t];
              return (
                <motion.div key={t} {...rise(i * 0.06)} className={`${glass} p-6`} style={{ borderTop: `3px solid hsl(${tier.color})` }}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-lg font-bold text-white">{tier.label}</h3>
                    <span className="text-sm tabular-nums text-muted-foreground">
                      <span className="text-2xl font-bold text-white">{tierCounts[t]}</span> agents
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em]" style={{ color: `hsl(${tier.color})` }}>{tier.rule}</p>
                  <p className="font-body mt-4 text-sm leading-relaxed text-muted-foreground">{tier.behavior}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Sections */}
        <section aria-labelledby="explore-title">
          <SectionHeading id="explore-title" eyebrow="Explore" title="Go to a control surface" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map(({ href, icon: Icon, title, desc }, i) => (
              <motion.li key={href} {...rise(i * 0.05)}>
                <Link
                  href={href}
                  className={`${glass} group flex h-full flex-col p-6 transition-colors duration-200 hover:border-[hsl(var(--neon-cyan)/0.5)] hover:bg-[hsl(var(--card)/0.8)] ${focusRing}`}
                >
                  <Icon aria-hidden className="h-6 w-6 text-[hsl(var(--neon-cyan))]" />
                  <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
                  <p className="font-body mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[hsl(var(--neon-cyan))]">
                    Open <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </section>
      </div>
    </div>
    </MotionConfig>
  );
}

// ── Roster panel: department budgets ─────────────────────────────────────────

function RosterPanel() {
  const rows = DEPARTMENTS.map((dept) => {
    const team = employees.filter((e) => e.department === dept);
    const used = team.reduce((n, e) => n + e.tokenUsage.used, 0);
    const limit = team.reduce((n, e) => n + e.tokenUsage.limit, 0);
    return { dept, team, left: 1 - used / limit };
  });

  return (
    <div className={`${glass} p-6`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-white">
          <Gauge aria-hidden className="h-4 w-4 text-[hsl(var(--neon-cyan))]" /> Budget by department
        </h2>
        <span className="text-xs text-muted-foreground">Roster snapshot</span>
      </div>

      <ul className="mt-6 space-y-5">
        {rows.map(({ dept, team, left }) => {
          const pct = Math.round(left * 100);
          const tier = TIERS[left > 0.5 ? 'normal' : left >= 0.25 ? 'low' : 'critical'];
          return (
            <li key={dept}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-bold text-white">{dept}</span>
                <span className="tabular-nums text-muted-foreground">
                  {team.length} agents · <span className="text-white">{pct}%</span> left
                </span>
              </div>
              <div
                role="meter"
                aria-label={`${dept} budget remaining`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                aria-valuetext={`${pct}% left, ${tier.label} tier`}
                className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"
              >
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `hsl(${tier.color})` }} />
              </div>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`${dept} agents`}>
                {team.map((e) => (
                  <li
                    key={e.id}
                    title={`${e.name}, ${e.role} (${TIERS[tierOf(e)].label})`}
                    className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: e.status === 'running' ? `hsl(${TIERS[tierOf(e)].color})` : 'hsl(var(--muted-foreground))' }}
                    />
                    {e.name.startsWith('The ') ? e.name : e.name.split(' ')[0]}
                    {e.status !== 'running' && <span className="sr-only"> (idle)</span>}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-xs text-muted-foreground">
        {(Object.keys(TIERS) as Tier[]).map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: `hsl(${TIERS[t].color})` }} />
            {TIERS[t].label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="h-2 w-2 rounded-full bg-[hsl(var(--muted-foreground))]" /> Idle
        </span>
      </div>
    </div>
  );
}
