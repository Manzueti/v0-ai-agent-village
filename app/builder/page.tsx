'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Send, Plus, Trash2, Loader2, Sparkles, Target, Users, DollarSign,
  Megaphone, AlertTriangle, ListChecks, CheckCircle2, RefreshCw, ArrowRight,
} from 'lucide-react';
import { useBusinessBuilder } from '@/hooks/use-business-builder';
import { employees } from '@/lib/data';
import { ADVISOR_IDS, type BusinessPlan, type Milestone } from '@/lib/builder/types';
import { findBestAgent, createCustomTask } from '@/lib/tasks/engine';

const STARTERS = [
  'I want to start an online business but I don’t have an idea yet. Help me find one that fits my skills.',
  'I run a small IT support company. Help me grow it with a recurring managed-services offer.',
  'Turn my AI agent village into a business: what could I sell, and to whom?',
  'I have an idea for a mobile car-wash app in my city. Is it viable?',
];

const advisors = ADVISOR_IDS.map((id) => employees.find((e) => e.id === id)!).filter(Boolean);

export default function BusinessBuilderPage() {
  const b = useBusinessBuilder();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => b.active?.messages ?? [], [b.active?.messages]);
  const advisor = advisors.find((a) => a.id === b.active?.advisorId) ?? advisors[0];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const submit = (text = input) => {
    if (!text.trim() || b.streaming) return;
    setInput('');
    void b.send(text);
  };

  if (!b.loaded || !b.active) {
    return <div className="h-screen grid place-items-center text-muted-foreground text-xs tracking-[0.3em] uppercase">Loading builder…</div>;
  }

  return (
    <div className="h-screen flex flex-col p-6 gap-4 font-mono">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded grid place-items-center bg-cyan-500/10 glow-box">
            <Rocket className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase leading-none">Business Builder</h1>
            <p className="text-[10px] text-muted-foreground tracking-[0.25em] uppercase mt-1">Start or grow a company by chatting with AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={b.active.id}
            onChange={(e) => b.select(e.target.value)}
            className="bg-black/40 border border-cyan-500/25 rounded px-3 py-2 text-[11px] text-white max-w-[240px]"
            aria-label="Select business"
          >
            {b.businesses.map((biz) => (
              <option key={biz.id} value={biz.id}>
                {biz.plan.name || (biz.messages[0]?.content.slice(0, 32) ?? 'Untitled') || 'Untitled'}
              </option>
            ))}
          </select>
          <HeaderBtn onClick={b.create}><Plus className="w-4 h-4" />New</HeaderBtn>
          <HeaderBtn onClick={() => { if (confirm('Delete this business and its chat?')) b.remove(b.active!.id); }}>
            <Trash2 className="w-4 h-4" />
          </HeaderBtn>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex gap-4">
        {/* Chat */}
        <section className="flex-1 min-w-0 flex flex-col rounded-md bg-[#020408]/85 backdrop-blur-md glow-box overflow-hidden">
          <div className="flex items-center gap-2 p-3 border-b border-cyan-500/15 overflow-x-auto">
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest shrink-0 mr-1">Co-founder</span>
            {advisors.map((a) => (
              <button
                key={a.id}
                onClick={() => b.setAdvisor(a.id)}
                disabled={b.streaming}
                className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded border text-[10px] transition-colors ${
                  a.id === advisor.id ? 'glow-box-active bg-cyan-500/10 text-cyan-300' : 'border-white/10 text-white/60 hover:text-white hover:border-white/30'
                }`}
              >
                <span>{a.avatar}</span>
                <span className="font-bold">{a.name}</span>
                <span className="text-[8px] uppercase tracking-wider opacity-60">{a.role.replace('Chief ', 'C-').replace(' Officer', '')}</span>
              </button>
            ))}
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-6 max-w-2xl mx-auto">
                <div className="text-4xl">{advisor.avatar}</div>
                <div>
                  <h2 className="text-xl font-black text-white">What are we building?</h2>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Describe an idea, a skill, or a business you already run. {advisor.name} will ask questions,
                    shape a plan on the right, and your village agents can take on the first milestones.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 w-full">
                  {STARTERS.map((s) => (
                    <button key={s} onClick={() => submit(s)}
                      className="text-left text-[11px] text-white/80 leading-relaxed p-3 rounded border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
                  {m.role === 'assistant' && <div className="text-xl shrink-0 mt-1">{advisor.avatar}</div>}
                  <div className={`max-w-[80%] rounded-md px-4 py-3 text-[12.5px] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-cyan-500/15 border border-cyan-500/30 text-white'
                      : m.error
                        ? 'bg-red-500/10 border border-red-500/40 text-red-200'
                        : 'bg-white/[0.04] border border-white/10 text-white/90'
                  }`}>
                    {m.content ? <RichText text={m.content} /> : <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />}
                  </div>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); submit(); }}
            className="p-3 border-t border-cyan-500/15 flex gap-2 items-end"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
              placeholder={`Message ${advisor.name}…  (Enter to send, Shift+Enter for a new line)`}
              rows={2}
              className="flex-1 resize-none bg-black/50 border border-white/10 focus:border-cyan-500/60 outline-none rounded px-3 py-2 text-[12.5px] text-white placeholder:text-muted-foreground/60"
            />
            <button
              type="submit"
              disabled={!input.trim() || b.streaming}
              className="h-10 px-4 rounded bg-cyan-500 text-black font-black text-[11px] uppercase tracking-widest flex items-center gap-2 disabled:opacity-30 hover:bg-cyan-400 transition-colors"
            >
              {b.streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send
            </button>
          </form>
        </section>

        {/* Plan */}
        <PlanPanel
          plan={b.active.plan}
          planning={b.planning}
          planError={b.planError}
          hasChat={messages.length > 0}
          launched={b.active.launchedMilestones}
          onRefresh={() => b.refreshPlan()}
          onLaunch={b.launchMilestone}
        />
      </div>
    </div>
  );
}

function PlanPanel({
  plan, planning, planError, hasChat, launched, onRefresh, onLaunch,
}: {
  plan: BusinessPlan;
  planning: boolean;
  planError: string | null;
  hasChat: boolean;
  launched: string[];
  onRefresh: () => void;
  onLaunch: (m: Milestone) => Promise<unknown>;
}) {
  const empty = !plan.name && !plan.problem && !plan.customer && plan.milestones.length === 0;
  const pending = plan.milestones.filter((m) => !launched.includes(m.title));
  const [launchingAll, setLaunchingAll] = useState(false);

  return (
    <aside className="w-[440px] shrink-0 flex flex-col rounded-md bg-[#020408]/85 backdrop-blur-md glow-box overflow-hidden">
      <div className="p-4 border-b border-cyan-500/15 flex items-center justify-between">
        <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Business Plan
        </span>
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest">
          {planning ? (
            <span className="flex items-center gap-1 text-cyan-400"><Loader2 className="w-3 h-3 animate-spin" />Updating</span>
          ) : hasChat ? (
            <button onClick={onRefresh} className="flex items-center gap-1 text-muted-foreground hover:text-cyan-300">
              <RefreshCw className="w-3 h-3" />Refresh
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {planError && (
          <div className="text-[10px] text-red-300 bg-red-500/10 border border-red-500/30 rounded p-2">{planError}</div>
        )}

        {empty ? (
          <div className="text-center text-[11px] text-muted-foreground py-16 leading-relaxed">
            Your plan builds itself as you chat:<br />name, customer, offer, pricing, channels, risks and next steps.
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-300 bg-emerald-500/10">
                  {plan.stage}
                </span>
              </div>
              <h2 className="text-xl font-black text-white leading-tight">{plan.name || 'Unnamed business'}</h2>
              {plan.tagline && <p className="text-[12px] text-cyan-200/80 mt-1">{plan.tagline}</p>}
              <div className="mt-3">
                <div className="flex justify-between text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
                  <span>Readiness</span><span className="text-white tabular-nums">{Math.round(plan.readiness)}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                    animate={{ width: `${Math.max(2, Math.min(100, plan.readiness))}%` }} />
                </div>
              </div>
            </div>

            <Field icon={Target} label="Problem" value={plan.problem} />
            <Field icon={Users} label="Customer" value={plan.customer} />
            <Field icon={Rocket} label="Solution" value={plan.solution} />
            <Field icon={DollarSign} label="Revenue model" value={plan.revenueModel} />

            {plan.pricing.length > 0 && (
              <Section icon={DollarSign} label="Pricing">
                <div className="grid grid-cols-2 gap-2">
                  {plan.pricing.map((p, i) => (
                    <div key={i} className="rounded border border-white/10 bg-white/[0.03] p-2">
                      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{p.tier}</div>
                      <div className="text-sm font-black text-emerald-300">{p.price}</div>
                      <div className="text-[10px] text-white/70 leading-snug mt-1">{p.includes}</div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {plan.channels.length > 0 && (
              <Section icon={Megaphone} label="Channels">
                <div className="flex flex-wrap gap-1.5">
                  {plan.channels.map((c, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 rounded border border-cyan-500/25 text-cyan-200 bg-cyan-500/5">{c}</span>
                  ))}
                </div>
              </Section>
            )}

            {plan.risks.length > 0 && (
              <Section icon={AlertTriangle} label="Risks & open questions">
                <ul className="space-y-1">
                  {plan.risks.map((r, i) => (
                    <li key={i} className="text-[11px] text-amber-100/80 leading-snug pl-3 border-l border-amber-500/40">{r}</li>
                  ))}
                </ul>
              </Section>
            )}

            {plan.milestones.length > 0 && (
              <Section icon={ListChecks} label="Next milestones">
                <div className="space-y-2">
                  {plan.milestones.map((m, i) => (
                    <MilestoneRow key={`${m.title}-${i}`} m={m} done={launched.includes(m.title)} onLaunch={onLaunch} />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 gap-2">
                  <button
                    disabled={pending.length === 0 || launchingAll}
                    onClick={async () => {
                      setLaunchingAll(true);
                      try { for (const m of pending) await onLaunch(m); } finally { setLaunchingAll(false); }
                    }}
                    className="flex-1 py-2 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-emerald-500/25 flex items-center justify-center gap-2"
                  >
                    {launchingAll ? <Loader2 className="w-3 h-3 animate-spin" /> : <Rocket className="w-3 h-3" />}
                    Launch all to agents
                  </button>
                  <Link href="/?s=tasks" className="text-[10px] text-cyan-300 hover:underline flex items-center gap-1 uppercase tracking-widest">
                    Task board <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </Section>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

function MilestoneRow({ m, done, onLaunch }: { m: Milestone; done: boolean; onLaunch: (m: Milestone) => Promise<unknown> }) {
  const [state, setState] = useState<'idle' | 'busy' | 'error'>('idle');
  // Preview which village agent the Task board will assign this to.
  const agent = useMemo(
    () => findBestAgent(createCustomTask({ title: m.title, description: m.description, department: m.department, priority: m.priority })),
    [m],
  );
  return (
    <div className="rounded border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[11.5px] font-bold text-white leading-snug">{m.title}</div>
          <div className="text-[10px] text-white/60 leading-snug mt-0.5">{m.description}</div>
        </div>
        <span className={`shrink-0 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${
          m.priority === 'critical' || m.priority === 'high' ? 'border-amber-500/40 text-amber-300' : 'border-white/15 text-white/50'
        }`}>{m.priority}</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[9px] text-muted-foreground uppercase tracking-wider truncate">
          {m.department}{agent ? ` · ${agent.avatar} ${agent.name}` : ''}
        </span>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.span key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] text-emerald-400 flex items-center gap-1 uppercase tracking-widest">
              <CheckCircle2 className="w-3 h-3" />On board
            </motion.span>
          ) : (
            <button
              key="go"
              disabled={state === 'busy'}
              onClick={async () => {
                setState('busy');
                try { await onLaunch(m); setState('idle'); } catch { setState('error'); }
              }}
              className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${state === 'error' ? 'text-red-400' : 'text-cyan-300 hover:text-cyan-200'}`}
            >
              {state === 'busy' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Rocket className="w-3 h-3" />}
              {state === 'error' ? 'Retry' : 'Assign'}
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Section({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-2">
        <Icon className="w-3 h-3 text-cyan-400" />{label}
      </div>
      {children}
    </div>
  );
}

function Field({ icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  if (!value) return null;
  return (
    <Section icon={icon} label={label}>
      <p className="text-[11.5px] text-white/85 leading-relaxed">{value}</p>
    </Section>
  );
}

function HeaderBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 rounded border border-white/10 text-white/70 hover:text-white hover:border-cyan-500/50 text-[10px] font-black uppercase tracking-widest">
      {children}
    </button>
  );
}

/** Minimal markdown: paragraphs, "-"/"*"/"1." lists, **bold**. */
function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter((l) => l.trim());
        const isList = lines.length > 0 && lines.every((l) => /^\s*([-*•]|\d+[.)])\s+/.test(l));
        if (isList) {
          return (
            <ul key={i} className="space-y-1">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-2">
                  <span className="text-cyan-400 shrink-0">›</span>
                  <span><Inline text={l.replace(/^\s*([-*•]|\d+[.)])\s+/, '')} /></span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            <Inline text={block.replace(/^#{1,6}\s+/gm, '')} />
          </p>
        );
      })}
    </div>
  );
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="text-white font-bold">{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>,
      )}
    </>
  );
}
