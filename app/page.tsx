'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Shield, Brain, Zap, GitBranch, Activity, 
  ArrowRight, Radio, Database, Lock, Terminal, 
  ChevronRight, Sparkles, Globe, Layers, Clock,
  Server, Wifi, Command, Target, Trees, Factory
} from 'lucide-react';

export default function Landing() {
  const [time, setTime] = useState('');
  const [bootSequence, setBootSequence] = useState(true);
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    // Boot sequence
    const bootTimer = setTimeout(() => setBootSequence(false), 2500);
    
    return () => {
      clearInterval(interval);
      clearTimeout(bootTimer);
    };
  }, []);

  if (bootSequence) {
    return <BootSequence />;
  }

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden scanlines">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
      
      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[hsl(var(--neon-cyan)/0.15)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[hsl(var(--neon-magenta)/0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-6 py-24 relative z-10">
        {/* Header section */}
        <header className="flex justify-between items-start mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="h-14 w-14 rounded bg-gradient-to-br from-[hsl(var(--neon-magenta))] to-[hsl(var(--neon-purple))] grid place-items-center shadow-[0_0_25px_hsl(var(--neon-magenta)/0.5)]">
              <Factory className="h-7 w-7 text-background" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-[0.4em] uppercase text-white">VYBE<span className="text-[hsl(var(--neon-magenta))]">CORP</span></h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase font-bold">Autonomous Enterprise Hub // v2.5.0</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-right"
          >
            <div className="text-3xl font-black tracking-tighter tabular-nums text-[hsl(var(--neon-cyan))] text-glow">{time}</div>
            <div className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">System Time // UTC-0</div>
          </motion.div>
        </header>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-block px-4 py-1.5 rounded bg-[hsl(var(--neon-cyan)/0.1)] border border-[hsl(var(--neon-cyan)/0.4)] text-[11px] text-[hsl(var(--neon-cyan))] font-bold tracking-[0.3em] uppercase mb-8 panel-glow-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--neon-cyan))] inline-block mr-2 animate-pulse" />
              Neural Network Online
            </div>
            <h2 className="text-6xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
              MANAGE THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--neon-purple))] to-[hsl(var(--neon-magenta))]">FUTURE</span> <br />
              OF WORK.
            </h2>
            <p className="text-muted-foreground text-xl mb-12 max-w-xl leading-relaxed">
              Coordinate autonomous AI workforces through a high-fidelity neuro-interface. Monitor production lines, infrastructure health, and revenue generation in real-time.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <Link href="/vybecorp" className="px-10 py-5 bg-[hsl(var(--neon-purple))] text-background font-black tracking-widest uppercase rounded hover:bg-[hsl(var(--neon-purple)/0.9)] transition-all shadow-[0_0_30px_hsl(var(--neon-purple)/0.5)] transform hover:scale-105 active:scale-95">
                Initialize Console
              </Link>
              <Link href="/village" className="px-10 py-5 bg-transparent border border-[hsl(var(--neon-cyan)/0.5)] text-[hsl(var(--neon-cyan))] font-black tracking-widest uppercase rounded hover:bg-[hsl(var(--neon-cyan)/0.1)] transition-all transform hover:scale-105 active:scale-95">
                Access Village
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square relative rounded-md overflow-hidden border border-[hsl(var(--neon-cyan)/0.3)] bg-[hsl(var(--card)/0.6)] backdrop-blur-md p-10 panel-glow-cyan scanlines">
              <div className="grid grid-cols-2 gap-8 h-full">
                <div className="flex flex-col gap-8">
                  <StatusCard label="CPU LOAD" value="42.8%" color="hsl(var(--neon-cyan))" icon={Cpu} />
                  <StatusCard label="NET SPEED" value="12.4 GB/S" color="hsl(var(--neon-green))" icon={Radio} />
                </div>
                <div className="flex flex-col gap-8 pt-16">
                  <StatusCard label="UPTIME" value="99.99%" color="hsl(var(--neon-yellow))" icon={Activity} />
                  <StatusCard label="SECURITY" value="OPTIMAL" color="hsl(var(--neon-magenta))" icon={Shield} />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute bottom-6 right-6 flex gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[hsl(var(--neon-cyan))] animate-pulse shadow-[0_0_8px_hsl(var(--neon-cyan))]" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              
              {/* Radar Blip */}
              <div className="absolute top-6 right-6 h-12 w-12 rounded-full border border-[hsl(var(--neon-cyan)/0.3)] grid place-items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--neon-cyan))] blip shadow-[0_0_10px_hsl(var(--neon-cyan))]" />
                <div className="absolute inset-0 rounded-full border-t-2 border-[hsl(var(--neon-cyan))] spin-slow" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureItem 
            title="VYBECORP DASHBOARD" 
            desc="High-density factory operations console for monitoring revenue and production lines."
            icon={Factory}
            color="hsl(var(--neon-magenta))"
            href="/vybecorp"
            glow="panel-glow-magenta"
          />
          <FeatureItem 
            title="AGENT VILLAGE" 
            desc="Visual management of AI units in their specialized habitats. Monitor work/life cycles."
            icon={Trees}
            color="hsl(var(--neon-green))"
            href="/village"
            glow="panel-glow-yellow"
          />
          <FeatureItem 
            title="INFRASTRUCTURE" 
            desc="Real-time mapping of nodes, zones, and data pathways across the global network."
            icon={Server}
            color="hsl(var(--neon-cyan))"
            href="/infrastructure"
            glow="panel-glow-cyan"
          />
        </div>
      </div>

      {/* Footer decoration */}
      <footer className="absolute bottom-0 left-0 right-0 h-10 border-t border-[hsl(var(--border))] bg-[hsl(var(--background)/0.8)] backdrop-blur-md flex items-center justify-between px-8">
        <div className="flex gap-8 text-[10px] font-bold tracking-[0.3em] text-muted-foreground/60 uppercase">
          <span>VYBECORP NEURAL OS</span>
          <span className="text-[hsl(var(--neon-cyan))]">● READY</span>
        </div>
        <div className="flex gap-8 text-[10px] font-bold tracking-[0.3em] text-muted-foreground/60 uppercase">
          <span>ZERO DOWNTIME ARCHITECTURE</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}

function StatusCard({ label, value, color, icon: Icon }: any) {
  return (
    <div className="flex-1 bg-[hsl(var(--background)/0.7)] border border-white/5 p-6 rounded relative overflow-hidden group hover:border-[currentColor]/40 transition-colors" style={{ color }}>
      <Icon className="w-9 h-9 mb-5 opacity-40 group-hover:opacity-100 transition-opacity" />
      <div className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-1.5">{label}</div>
      <div className="text-3xl font-black tracking-tight tabular-nums text-white group-hover:text-[currentColor] transition-colors">{value}</div>
      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
        <div className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" />
      </div>
    </div>
  );
}

function FeatureItem({ title, desc, icon: Icon, color, href, glow }: any) {
  return (
    <Link href={href} className="block group h-full">
      <div className={`h-full bg-[hsl(var(--card)/0.5)] backdrop-blur-md border border-white/5 p-10 rounded-md transition-all hover:bg-[hsl(var(--card)/0.8)] hover:border-[currentColor]/40 ${glow} relative overflow-hidden h-full flex flex-col`} style={{ borderColor: `${color}44` }}>
        <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
        <Icon className="w-12 h-12 mb-8 transition-transform group-hover:scale-110 duration-500" style={{ color }} />
        <h3 className="text-xl font-black tracking-widest uppercase mb-4 text-white" style={{ color: groupHoverColor(color) }}>{title}</h3>
        <p className="text-muted-foreground text-base leading-relaxed mb-8 flex-1">
          {desc}
        </p>
        <div className="flex items-center gap-3 text-[11px] font-black tracking-[0.4em] uppercase" style={{ color }}>
          Initialize Access <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
        </div>
      </div>
    </Link>
  );
}

function groupHoverColor(color: string) {
  return color;
}

function BootSequence() {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');
  
  const bootText = `
> INITIALIZING VYBECORP KERNEL...
> LOADING NEURAL NETWORK MODULES...
> MOUNTING INFRASTRUCTURE MATRIX...
> CONNECTING AI OPERATORS...
> SYSTEM READY.
`;

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < bootText.length) {
        setText(bootText.slice(0, i + 1));
        setProgress((i / bootText.length) * 100);
        i++;
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center scanlines font-mono">
      <div className="w-full max-w-2xl p-10 relative">
        <div className="absolute inset-0 starfield opacity-20 pointer-events-none" />
        <div className="mb-10 flex items-center gap-5 relative z-10">
          <div className="h-10 w-10 rounded bg-[hsl(var(--neon-cyan))] grid place-items-center">
            <Terminal className="w-6 h-6 text-background" />
          </div>
          <span className="text-[hsl(var(--neon-cyan))] font-black text-2xl tracking-[0.3em] uppercase">BOOT SEQUENCE</span>
        </div>
        
        <div className="bg-[hsl(var(--card)/0.8)] backdrop-blur-md rounded-md p-8 border border-[hsl(var(--neon-cyan)/0.3)] font-mono text-sm relative z-10 panel-glow-cyan shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <pre className="text-[hsl(var(--neon-cyan))] opacity-90 whitespace-pre-wrap leading-loose">
            {text}
            <span className="animate-pulse">█</span>
          </pre>
        </div>
        
        <div className="mt-10 relative z-10">
          <div className="h-1.5 bg-[hsl(var(--secondary))] rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="h-full bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{ boxShadow: '0 0 15px hsl(var(--neon-cyan))' }}
            />
          </div>
          <div className="mt-3 text-right text-xs text-muted-foreground font-black tracking-widest">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
}
