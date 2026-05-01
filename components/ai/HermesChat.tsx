'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Zap, Terminal } from 'lucide-react';

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
    'Run system diagnostic',
    'List active files',
    'Check network latency',
    'Execute local failover',
  ];

  return (
    <div className={`flex flex-col h-full bg-[#020408] border border-cyan-500/20 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Terminal className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wider">HERMES NEURAL HUB</h2>
          <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest">Local Thinking Agent</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-mono">ENCRYPTED_LINK_STABLE</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-cyber-grid bg-[length:20px_20px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-800 border border-cyan-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
            )}
            
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 font-mono text-xs border ${
                message.role === 'user'
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-50 text-[8px] uppercase tracking-tighter">
                <span>{message.role === 'user' ? 'USER_PROMPT' : 'HERMES_CORE'}</span>
                <span>•</span>
                <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-800 border border-cyan-500/30 flex items-center justify-center">
                <User className="w-4 h-4 text-cyan-400" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-800 border border-cyan-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest animate-pulse">
                Accessing Local Matrix...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 bg-slate-950/50">
          <p className="text-[10px] text-slate-500 mb-2 font-mono uppercase tracking-widest">Neural Directives:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-[10px] font-mono px-3 py-1.5 bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 rounded-lg transition-all"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-cyan-500/20 bg-slate-900/50">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ENTER NEURAL DIRECTIVE..."
              className="w-full bg-[#020408] border border-cyan-500/30 rounded-lg px-4 py-3 text-xs font-mono text-white placeholder-slate-700 focus:outline-none focus:border-cyan-400/60 transition-all"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-700 pointer-events-none uppercase">
              // Matrix_In
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 disabled:from-slate-800 disabled:to-slate-800 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-lg shadow-cyan-500/10 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
