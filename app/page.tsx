import Link from 'next/link';
import { Server, Shield, Brain, Zap, GitBranch, Activity } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
      {/* Animated Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Gradient Orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-3xl w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Server className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-black text-white tracking-tight mb-4">
          AI Infrastructure
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
            Control Center
          </span>
        </h1>
        
        <p className="text-slate-400 mb-10 text-lg max-w-lg mx-auto leading-relaxed">
          Zero-point-of-failure infrastructure managed by AI operators. 
          Real-time monitoring, automatic failover, and intelligent decision-making powered by Grok.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Link href="/infrastructure">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-bold text-lg text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-105">
              View Infrastructure
            </button>
          </Link>
          <Link href="/ai-control">
            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-bold text-lg text-white transition-all hover:scale-105">
              AI Control Center
            </button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { 
              icon: GitBranch, 
              label: 'Zero Downtime',
              desc: 'Primary/Replica pairs',
              color: 'from-blue-500 to-cyan-500'
            },
            { 
              icon: Brain, 
              label: 'AI Operators',
              desc: '5 Grok-powered agents',
              color: 'from-violet-500 to-purple-500'
            },
            { 
              icon: Shield, 
              label: '30+ Nodes',
              desc: '5 enterprise zones',
              color: 'from-emerald-500 to-teal-500'
            },
          ].map((item) => (
            <div 
              key={item.label} 
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 mx-auto`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-white font-semibold mb-1">{item.label}</div>
              <div className="text-slate-500 text-sm">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Status Bar */}
        <div className="mt-12 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">All Systems Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-mono">97% Health</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">5/5 AI Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
