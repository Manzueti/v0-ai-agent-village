'use client';

import Link from 'next/link';
import { Server, Shield, Brain, Zap, GitBranch, Activity, Hexagon, ArrowRight, Radio, Cpu, Database, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Landing() {
  const [time, setTime] = useState('');
  const [systemLoad, setSystemLoad] = useState(97);
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 futuristic-grid pointer-events-none" />
      <div className="fixed inset-0 hex-pattern pointer-events-none" />
      
      {/* Gradient Orbs */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-float" />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />
      
      {/* Scanlines */}
      <div className="fixed inset-0 scanlines pointer-events-none opacity-20" />

      {/* Top status bar */}
      <div className="fixed top-0 left-0 right-0 h-10 bg-card/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 text-xs font-mono z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Hexagon className="w-4 h-4 text-cyan-400" />
            <span className="text-foreground font-semibold tracking-wider">NEXUS</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <span className="text-muted-foreground">INFRASTRUCTURE CONTROL v2.4.1</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400">ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">SYS_TIME:</span>
            <span className="text-cyan-400">{time}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center mt-10">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30 animate-border-glow">
              <Server className="w-12 h-12 text-white" />
            </div>
            {/* Orbiting ring */}
            <div className="absolute inset-0 rounded-2xl border border-cyan-500/30 animate-pulse-ring" />
          </div>
        </div>

        {/* Title */}
        <div className="mb-2 text-sm font-mono text-cyan-400 tracking-[0.3em] uppercase">
          [ AI-POWERED INFRASTRUCTURE ]
        </div>
        
        <h1 className="text-6xl font-black text-foreground tracking-tight mb-4">
          Zero-Point
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 animate-hologram">
            Failure System
          </span>
        </h1>
        
        <p className="text-muted-foreground mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
          Enterprise infrastructure managed by autonomous AI operators. 
          Real-time monitoring, automatic failover, and intelligent decision-making powered by Grok.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <Link href="/infrastructure">
            <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-bold text-lg text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 hover:shadow-cyan-500/40 flex items-center gap-2 cyber-button">
              <span>View Infrastructure</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/ai-control">
            <button className="px-8 py-4 bg-card hover:bg-secondary border border-border hover:border-cyan-500/50 rounded-xl font-bold text-lg text-foreground transition-all hover:scale-105 glass">
              AI Control Center
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {[
            { icon: Server, value: '30+', label: 'Active Nodes', color: 'cyan' },
            { icon: Shield, value: '5', label: 'Secure Zones', color: 'violet' },
            { icon: Brain, value: '5', label: 'AI Operators', color: 'blue' },
            { icon: GitBranch, value: '100%', label: 'Redundancy', color: 'emerald' },
          ].map((stat, i) => (
            <div 
              key={stat.label}
              className="glass rounded-xl p-5 hover:border-cyan-500/30 transition-all group"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-3 text-${stat.color}-400 group-hover:animate-glow`} />
              <div className="text-2xl font-bold text-foreground font-mono">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { 
              icon: Database, 
              title: 'Primary/Replica',
              desc: 'Every node has an automatic failover pair',
              gradient: 'from-blue-500 to-cyan-500'
            },
            { 
              icon: Cpu, 
              title: 'Grok AI Engine',
              desc: 'Intelligent decisions in real-time',
              gradient: 'from-violet-500 to-purple-500'
            },
            { 
              icon: Lock, 
              title: 'Enterprise Security',
              desc: 'Multi-zone isolation and encryption',
              gradient: 'from-emerald-500 to-teal-500'
            },
          ].map((item) => (
            <div 
              key={item.title} 
              className="glass rounded-xl p-6 text-left hover:border-cyan-500/30 transition-all group relative overflow-hidden"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`} />
              
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-foreground font-semibold mb-2">{item.title}</div>
              <div className="text-muted-foreground text-sm">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Live Status Bar */}
        <div className="glass rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="text-sm text-muted-foreground">All Systems Operational</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-mono text-foreground">{systemLoad}%</span>
              <span className="text-sm text-muted-foreground">Health</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-muted-foreground">5/5 AI Active</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-muted-foreground">0 Failovers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-mono text-muted-foreground/50">
        <span>NEXUS INFRASTRUCTURE CONTROL</span>
        <span className="text-cyan-500/50">//</span>
        <span>ZERO DOWNTIME ARCHITECTURE</span>
      </div>
    </div>
  );
}
