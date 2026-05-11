import Link from 'next/link';
import {
  BadgeDollarSign,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Cpu,
  DatabaseZap,
  Megaphone,
  Palette,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { employees } from '@/lib/data';
import type { Employee } from '@/lib/types';

type DepartmentKey = 'Command Deck' | 'Revenue Hub' | 'Finance Vault' | 'Creative Studio' | 'Tech Nexus';

type DepartmentConfig = {
  name: DepartmentKey;
  purpose: string;
  environment: string;
  color: string;
  border: string;
  icon: typeof Building2;
};

const departmentConfigs: DepartmentConfig[] = [
  {
    name: 'Command Deck',
    purpose: 'Sets the strategy, assigns work, and keeps the 20-agent company moving as one system.',
    environment: 'A central command pod with holographic mission maps, executive dashboards, and live decisions.',
    color: 'text-violet-200',
    border: 'border-violet-400/40 shadow-violet-500/20',
    icon: BrainCircuit,
  },
  {
    name: 'Revenue Hub',
    purpose: 'Finds businesses, researches markets, starts outreach, handles objections, and closes deals.',
    environment: 'A sales war-room pod with radar sweeps, pipeline lanes, lead signals, and deal-closing consoles.',
    color: 'text-emerald-200',
    border: 'border-emerald-400/40 shadow-emerald-500/20',
    icon: Target,
  },
  {
    name: 'Finance Vault',
    purpose: 'Prices offers, manages invoices, watches cash flow, protects margin, and reports profit.',
    environment: 'A secure vault pod with glowing ledgers, market screens, risk locks, and payment rails.',
    color: 'text-amber-200',
    border: 'border-amber-400/40 shadow-amber-500/20',
    icon: BadgeDollarSign,
  },
  {
    name: 'Creative Studio',
    purpose: 'Builds the brand, writes campaigns, designs graphics, makes content, and markets every offer.',
    environment: 'A neon studio pod with design boards, social launch panels, video bays, and campaign engines.',
    color: 'text-pink-200',
    border: 'border-pink-400/40 shadow-pink-500/20',
    icon: Palette,
  },
  {
    name: 'Tech Nexus',
    purpose: 'Runs IT, automations, data, cybersecurity, prompts, tools, and the systems agents use to work.',
    environment: 'A server-core pod with data streams, security shields, automation lines, and AI model routers.',
    color: 'text-cyan-200',
    border: 'border-cyan-400/40 shadow-cyan-500/20',
    icon: Cpu,
  },
];

const operatingLoop = [
  { title: 'Find businesses', description: 'Scout markets, niches, and company lists with buying signals.', icon: Radar },
  { title: 'Market the offer', description: 'Create graphics, copy, posts, emails, and landing-page ideas.', icon: Megaphone },
  { title: 'Close business', description: 'Qualify leads, follow up, overcome objections, and book the deal.', icon: BriefcaseBusiness },
  { title: 'Deliver and improve', description: 'IT, finance, data, and leadership support fulfillment and growth.', icon: CheckCircle2 },
];

const cyberAgents = employees.slice(0, 20);
const groupedAgents = departmentConfigs.map((department) => ({
  ...department,
  agents: cyberAgents.filter((agent) => agent.department === department.name),
}));

const formatMoney = (value?: number) =>
  typeof value === 'number'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
    : '$0';

function getAgentSignal(agent: Employee) {
  const metrics = agent.revenueMetrics ?? {};

  if ('pipeline' in metrics) return `Pipeline ${formatMoney(metrics.pipeline)}`;
  if ('dealsClosed' in metrics) return `${metrics.dealsClosed} deals closed`;
  if ('revenue' in metrics) return `Revenue ${formatMoney(metrics.revenue)}`;
  if ('activeClients' in metrics) return `${metrics.activeClients} active clients`;
  if ('projectedAnnualImpact' in metrics) return `Impact ${formatMoney(metrics.projectedAnnualImpact)}`;
  if ('invoicesSent' in metrics) return `${metrics.invoicesSent} invoices sent`;
  if ('campaignsLaunched' in metrics) return `${metrics.campaignsLaunched} campaigns launched`;
  if ('designsCreated' in metrics) return `${metrics.designsCreated} designs made`;

  return `${agent.successRate}% success rate`;
}

export default function CyberEmpirePage() {
  const totalRevenue = cyberAgents.reduce((sum, agent) => sum + (agent.revenueMetrics?.revenue ?? 0), 0);
  const activeAgents = cyberAgents.filter((agent) => agent.status === 'running').length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03020a] text-white starfield">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(124,58,237,0.34),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_50%_85%,rgba(244,114,182,0.18),transparent_35%)]" />
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div className="absolute left-1/2 top-36 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-cyan-300/10 bg-cyan-300/5 blur-3xl" />

      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-8 sm:px-8 lg:px-10">
        <nav className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/40 bg-cyan-300/10 text-cyan-200 shadow-lg shadow-cyan-500/20">
              <Rocket className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-black uppercase tracking-[0.45em] text-cyan-100">CyberEmpire</span>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">20 AI Employee Company</span>
            </span>
          </Link>
          <div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-300">
            <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-emerald-200">{activeAgents}/20 online</span>
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-amber-200">{formatMoney(totalRevenue)} tracked</span>
          </div>
        </nav>

        <header className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-violet-100">
              <Sparkles className="h-4 w-4" /> Simple mission control
            </div>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
                Build a company run by AI agents.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                CyberEmpire is organized as floating space pods: each department looks like the work it owns, and every AI employee has one clear job in the business loop.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <KpiCard label="AI employees" value="20" detail="Across 5 pods" />
              <KpiCard label="Main goal" value="Close" detail="Find, market, sell" />
              <KpiCard label="Layout" value="Space pods" detail="Department themed" />
            </div>
          </div>

          <div className="relative min-h-[420px] rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
            <div className="absolute inset-6 rounded-full border border-dashed border-cyan-200/20" />
            <div className="absolute inset-16 rounded-full border border-dashed border-violet-200/20" />
            <div className="absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-center shadow-2xl shadow-violet-500/30 backdrop-blur-xl">
              <div>
                <Building2 className="mx-auto mb-2 h-8 w-8 text-cyan-200" />
                <div className="text-xs font-black uppercase tracking-[0.3em] text-white">HQ Core</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">CyberEmpire</div>
              </div>
            </div>
            {groupedAgents.map((department, index) => (
              <FloatingPod key={department.name} department={department} index={index} />
            ))}
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {operatingLoop.map((step, index) => (
            <div key={step.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">Step {index + 1}</span>
                <step.icon className="h-5 w-5 text-cyan-200" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{step.description}</p>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-200">Department pods</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">Each pod looks like its responsibility.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">
              The design stays simple: five departments, twenty AI employees, and one clear company workflow from discovery to closed business.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {groupedAgents.map((department) => (
              <DepartmentPod key={department.name} department={department} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function KpiCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-black text-white">{value}</div>
      <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">{detail}</div>
    </div>
  );
}

function FloatingPod({ department, index }: { department: DepartmentConfig & { agents: Employee[] }; index: number }) {
  const positions = [
    'left-[6%] top-[10%]',
    'right-[4%] top-[16%]',
    'left-[8%] bottom-[12%]',
    'right-[8%] bottom-[10%]',
    'left-1/2 top-[3%] -translate-x-1/2',
  ];
  const Icon = department.icon;

  return (
    <div className={`absolute ${positions[index]} w-36 rounded-3xl border bg-black/45 p-4 shadow-2xl backdrop-blur-xl ${department.border} animate-float-ultra`} style={{ animationDelay: `${index * 0.35}s` }}>
      <Icon className={`mb-3 h-6 w-6 ${department.color}`} />
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white">{department.name}</div>
      <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">{department.agents.length} agents</div>
    </div>
  );
}

function DepartmentPod({ department }: { department: DepartmentConfig & { agents: Employee[] } }) {
  const Icon = department.icon;

  return (
    <article className={`relative overflow-hidden rounded-[2rem] border bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl ${department.border}`}>
      <div className="absolute right-4 top-4 opacity-10">
        <Icon className="h-28 w-28" />
      </div>
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/10 ${department.color}`}>
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">{department.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{department.purpose}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            <DatabaseZap className="h-4 w-4" /> Pod visual direction
          </div>
          <p className="text-sm leading-6 text-slate-300">{department.environment}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {department.agents.map((agent) => (
            <AgentMiniCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </article>
  );
}

function AgentMiniCard({ agent }: { agent: Employee }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-xl">{agent.avatar}</div>
        <div className="min-w-0">
          <div className="truncate text-sm font-black uppercase tracking-wide text-white">{agent.name}</div>
          <div className="truncate text-xs text-slate-400">{agent.role}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em]">
        <span className="inline-flex items-center gap-1 text-emerald-200"><ShieldCheck className="h-3 w-3" /> {agent.status}</span>
        <span className="text-slate-500">LV {agent.level}</span>
      </div>
      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] leading-5 text-cyan-100">
        {getAgentSignal(agent)}
      </div>
    </div>
  );
}
