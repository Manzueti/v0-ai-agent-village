'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Zap, Terminal, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface HermesChatProps {
  className?: string;
}

export default function HermesChat({ className = '' }: HermesChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Local Matrix Online. I am Hermes, your local Thinking Agent. I have direct access to your system tools and infrastructure. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/hermes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || `Error: ${data.error || 'Unknown error'}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error chatting with Hermes:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Hermes communication link failed. Please check your local server status.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const suggestedQuestions = [
    'System Diagnostic',
    'List Local Files',
    'Network Latency',
    'Execute Failover',
  ];

  return (
    <div className={`flex flex-col h-full bg-[hsl(var(--card)/0.4)] backdrop-blur-xl border border-white/5 rounded-md overflow-hidden scanlines ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-[hsl(var(--background)/0.5)]">
        <div className="w-10 h-10 rounded bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] flex items-center justify-center shadow-[0_0_15px_hsl(var(--neon-cyan)/0.4)]">
          <Terminal className="w-5 h-5 text-background" />
        </div>
        <div>
          <h2 className="text-[11px] font-black text-white tracking-[0.3em] uppercase">Hermes Neural Hub</h2>
          <p className="text-[9px] text-[hsl(var(--neon-cyan))] font-black uppercase tracking-[0.2em]">Neural Processing Node // v2.5.0</p>
        </div>
        <div className="ml-auto flex items-center gap-3 px-3 py-1 bg-[hsl(var(--neon-green)/0.05)] border border-[hsl(var(--neon-green)/0.2)] rounded">
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--neon-green))] pulse-dot shadow-[0_0_8px_currentColor]" />
          <span className="text-[9px] text-[hsl(var(--neon-green))] font-black tracking-widest uppercase">UPLINK_STABLE</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[hsl(var(--background)/0.2)]">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-9 h-9 rounded bg-[hsl(var(--background))] border border-white/10 flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                  <Bot className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] rounded-md px-5 py-4 font-mono text-[11px] leading-relaxed border scanlines ${
                  message.role === 'user'
                    ? 'bg-[hsl(var(--neon-purple)/0.1)] border-[hsl(var(--neon-purple)/0.3)] text-[hsl(var(--neon-purple))]'
                    : 'bg-[hsl(var(--background)/0.8)] border-white/5 text-slate-300 panel-glow-cyan'
                }`}
              >
                <div className="flex items-center gap-3 mb-2 opacity-50 text-[8px] font-black uppercase tracking-[0.3em]">
                  <span>{message.role === 'user' ? 'Local_Terminal' : 'Hermes_Core'}</span>
                  <span className="text-white/10">|</span>
                  <span className="tabular-nums">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 w-9 h-9 rounded bg-[hsl(var(--background))] border border-white/10 flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                  <User className="w-4 h-4 text-[hsl(var(--neon-purple))]" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded bg-[hsl(var(--background))] border border-white/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
            </div>
            <div className="bg-[hsl(var(--background)/0.8)] border border-white/5 rounded-md px-5 py-4 flex items-center gap-4 panel-glow-cyan">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-[hsl(var(--neon-cyan))] rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-[hsl(var(--neon-cyan))] rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-[hsl(var(--neon-cyan))] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-[10px] font-black text-[hsl(var(--neon-cyan)/0.6)] uppercase tracking-[0.3em] animate-pulse">
                Processing Matrix Data...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-6 py-4 bg-[hsl(var(--background)/0.4)] border-t border-white/5">
          <p className="text-[9px] font-black text-muted-foreground/40 mb-3 uppercase tracking-[0.3em]">Operational Presets:</p>
          <div className="flex flex-wrap gap-3">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-[9px] font-black px-4 py-2 bg-white/5 border border-white/10 hover:border-[hsl(var(--neon-cyan)/0.5)] hover:bg-[hsl(var(--neon-cyan)/0.1)] text-muted-foreground hover:text-white rounded transition-all uppercase tracking-widest"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-6 border-t border-white/5 bg-[hsl(var(--background)/0.8)]">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="DISPATCH COMMAND..."
              className="w-full bg-[hsl(var(--background)/0.6)] border border-white/10 rounded-md px-5 py-4 text-xs font-mono text-white placeholder-muted-foreground/20 focus:outline-none focus:border-[hsl(var(--neon-cyan)/0.5)] transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]"
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-muted-foreground/20 pointer-events-none uppercase tracking-widest">
              Matrix_Flow_In
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-8 py-4 bg-[hsl(var(--neon-cyan))] hover:bg-[hsl(var(--neon-cyan)/0.9)] disabled:bg-white/5 disabled:text-muted-foreground/20 text-background rounded-md transition-all shadow-[0_0_20px_hsl(var(--neon-cyan)/0.4)] flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5 shadow-[0_0_10px_currentColor]" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
