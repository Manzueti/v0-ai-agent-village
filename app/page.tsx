'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Shield, Brain, Zap, GitBranch, Activity, 
  ArrowRight, Radio, Database, Lock, Terminal, 
  ChevronRight, Sparkles, Globe, Layers, Clock,
  Server, Wifi, Command, Target, Trees
} from 'lucide-react';

export default function Landing() {
  const [time, setTime] = useState('');
  const [bootSequence, setBootSequence] = useState(true);
  const [scanLine, setScanLine] = useState(0);
  
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

  useEffect(() => {
    const scan = setInterval(() => {
      setScanLine((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(scan);
  }, []);

  if (bootSequence) {
    return <BootSequence />;
  }

  return (
    <div className="min-h-screen bg-[#020408] relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-40" />
      <div className="fixed inset-0 hex-cyber opacity-20" />
      <div className="fixed inset-0 circuit-bg" />
      
      {/* Scanning Line */}
      <motion.div 
        className="fixed left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent z-50 pointer-events-none"
        style={{ top: `${scanLine}%` }}
      />
      
      {/* Ambient Orbs */}
      <div className="fixed top-1/4 left-1/4 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[200px] animate-float-ultra" />
      <div className="fixed bottom-1/4 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px] animate-float-ultra" style={{ animationDelay: '3s' }} />
      
      {/* Top status bar */}
      <div className="fixed top-0 left-0 right-0 h-12 bg-[#020408]/90 backdrop-blur-xl border-b border-cyan-500/20 flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-mono text-sm tracking-wider">ULTRONOS</span>
            <span className="text-slate-600 font-mono text-sm">//</span>
            <span className="text-slate-400 font-mono text-xs">ACADEMY v2.4.1</span>
          </div>
          <div className="h-4 w-px bg-cyan-500/20" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-mono text-xs tracking-wider">SYSTEM OPERATIONAL</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="text-slate-400 font-mono text-xs">NEURAL NET: ACTIVE</span>
          </div>
          <div className="font-mono text-cyan-400 text-lg tracking-wider">
            {time}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 pt-32 pb-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/40 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />
                <Cpu className="w-16 h-16 text-cyan-400 relative z-10" />
                <div className="absolute inset-0 animate-pulse bg-cyan-500/5" />
              </div>
              {/* Orbiting rings */}
              <div className="absolute inset-0 rounded-2xl border border-cyan-500/20 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute -inset-4 rounded-3xl border border-cyan-500/10" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-4 text-xs font-mono text-cyan-400 tracking-[0.4em] uppercase">
              [ NEURAL INFRASTRUCTURE MATRIX ]
            </div>
            
            <h1 className="text-7xl font-black text-white tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
                ULTRONOS
              </span>
              <br />
              <span className="text-slate-400">ACADEMY</span>
            </h1>
            
            <p className="text-slate-400 mb-10 text-lg max-w-2xl mx-auto leading-relaxed font-light">
              Zero-point-of-failure infrastructure managed by autonomous AI operators. 
              <br />
              <span className="text-cyan-400">Real-time monitoring. Automatic failover. Neural decision-making.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-6">
              <Link href="/infrastructure">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 rounded-xl font-bold text-lg text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-3 border border-cyan-400/30"
                >
                  <Server className="w-5 h-5" />
                  <span>ENTER MATRIX</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/ai-control">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 glass-ultron rounded-xl font-bold text-lg text-white transition-all flex items-center gap-3 hover:border-cyan-500/40"
                >
                  <Brain className="w-5 h-5 text-violet-400" />
                  <span>AI CONTROL</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-4 gap-6 mb-12"
        >
          {[
            { icon: Server, value: '30+', label: 'NEURAL NODES', color: 'cyan', sub: '5 zones' },
            { icon: Shield, value: '100%', label: 'UPTIME', color: 'violet', sub: 'Zero failure' },
            { icon: Brain, value: '5', label: 'AI OPERATORS', color: 'blue', sub: 'Autonomous' },
            { icon: Activity, value: '97%', label: 'HEALTH', color: 'emerald', sub: 'Optimal' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="glass-ultron rounded-xl p-6 hover:border-cyan-500/30 transition-all group cursor-default"
            >
              <stat.icon className={`w-8 h-8 text-${stat.color}-400 mb-4 group-hover:animate-pulse`} />
              <div className="text-3xl font-bold text-white font-mono mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mb-1">{stat.label}</div>
              <div className={`text-xs text-${stat.color}-400 font-mono`}>{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-3 gap-6 mb-12"
        >
          {[
            { 
              icon: Database, 
              title: 'PRIMARY/REPLICA',
              desc: 'Every node has automatic failover pairs with real-time sync',
              gradient: 'from-cyan-500 to-blue-500'
            },
            { 
              icon: Brain, 
              title: 'NEURAL ENGINE',
              desc: 'Gemini AI-powered intelligent decisions in real-time',
              gradient: 'from-violet-500 to-purple-500'
            },
            { 
              icon: Lock, 
              title: 'QUANTUM SECURITY',
              desc: 'Multi-zone isolation with enterprise-grade encryption',
              gradient: 'from-emerald-500 to-teal-500'
            },
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="glass-ultron rounded-xl p-8 hover:border-cyan-500/30 transition-all group relative overflow-hidden"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`} />
              
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-3 tracking-wider">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </motion.div>

        {/* Live Status Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="glass-ultron rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span className="text-sm text-slate-300 font-mono">ALL SYSTEMS OPERATIONAL</span>
              </div>
              <div className="h-6 w-px bg-cyan-500/20" />
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-mono text-white">97%</span>
                <span className="text-sm text-slate-500">NETWORK HEALTH</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-slate-400 font-mono">5/5 AI ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-400 font-mono">0 FAILOVERS</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Navigation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-12 flex items-center justify-center gap-8"
        >
          {[
            { label: 'VILLAGE', href: '/village', icon: Trees },
            { label: 'AGENTS', href: '/agent-management', icon: Brain },
            { label: 'INFRASTRUCTURE', href: '/infrastructure', icon: Server },
            { label: 'AI CONTROL', href: '/ai-control', icon: Command },
            { label: 'COE', href: '/coe', icon: Target },
          ].map((link) => (
            <Link key={link.label} href={link.href}>
              <motion.div 
                whileHover={{ y: -2 }}
                className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors font-mono text-sm tracking-wider"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
                <ChevronRight className="w-3 h-3" />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Bottom decoration */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[10px] font-mono text-slate-600">
        <span>ULTRONOS ACADEMY</span>
        <span className="text-cyan-500/50">//</span>
        <span>NEURAL INFRASTRUCTURE v2.4.1</span>
        <span className="text-violet-500/50">//</span>
        <span>ZERO DOWNTIME ARCHITECTURE</span>
      </div>
    </div>
  );
}

function BootSequence() {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');
  
  const bootText = `
> INITIALIZING ULTRONOS KERNEL...
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
    <div className="min-h-screen bg-[#020408] flex items-center justify-center">
      <div className="w-full max-w-2xl p-8">
        <div className="mb-8 flex items-center gap-4">
          <Terminal className="w-8 h-8 text-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-mono text-xl tracking-wider">ULTRONOS BOOT SEQUENCE</span>
        </div>
        
        <div className="bg-slate-900/50 rounded-lg p-6 border border-cyan-500/20 font-mono text-sm">
          <pre className="text-cyan-400/80 whitespace-pre-wrap">
            {text}
            <span className="animate-pulse">_</span>
          </pre>
        </div>
        
        <div className="mt-6">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-right text-xs text-slate-500 font-mono">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
}
