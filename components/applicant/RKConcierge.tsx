'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Sparkles, 
  Bot, User, Zap, ChevronRight, 
  MapPin, HelpCircle, TrendingUp 
} from 'lucide-react';
import { askConcierge } from '@/app/actions/concierge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function RKConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { id: '1', role: 'assistant', content: "Hello, I am RK Concierge. How can I assist your career elevation today?", timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await askConcierge(input);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        id: 'error', 
        role: 'assistant', 
        content: "My neural link is currently unstable. Please try again in a moment.", 
        timestamp: new Date().toISOString() 
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "pointer-events-auto h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl shadow-blue-600/40 transition-all duration-500 hover:scale-110 group relative overflow-hidden",
          isOpen ? "rotate-90 scale-90" : "animate-bounce"
        )}
        style={{ animationDuration: '3s' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X className="h-6 w-6 z-10" /> : <Sparkles className="h-6 w-6 z-10" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-zinc-950/90 border border-zinc-900 rounded-[32px] shadow-[0_0_80px_rgba(37,99,235,0.2)] backdrop-blur-2xl flex flex-col pointer-events-auto overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500">
           
           {/* Header */}
           <div className="p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Bot className="h-5 w-5 text-white" />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-white uppercase italic tracking-tighter">RK <span className="text-blue-500">Concierge</span></h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Neural Link Active</span>
                    </div>
                 </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
                 <X className="h-4 w-4" />
              </Button>
           </div>

           {/* Messages */}
           <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex items-start gap-4", m.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                   <div className={cn(
                     "h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 border",
                     m.role === 'user' ? "bg-zinc-900 border-zinc-800" : "bg-blue-600/10 border-blue-500/20"
                   )}>
                      {m.role === 'user' ? <User className="h-4 w-4 text-zinc-400" /> : <Zap className="h-4 w-4 text-blue-500" />}
                   </div>
                   <div className={cn(
                     "max-w-[80%] rounded-2xl p-4 text-[13px] leading-relaxed shadow-sm",
                     m.role === 'user' 
                      ? "bg-zinc-900 text-zinc-300 font-medium italic border border-zinc-800/50" 
                      : "bg-gradient-to-br from-zinc-900/50 to-zinc-950 text-white font-bold tracking-tight border border-zinc-800/50"
                   )}>
                      {m.content}
                   </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-3 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] animate-pulse">
                   <Zap className="h-3 w-3 text-blue-500" /> Neural processing...
                </div>
              )}
           </div>

           {/* Footer Input */}
           <div className="p-6 bg-zinc-950/50 border-t border-zinc-900">
              <div className="flex items-center gap-1.5 mb-4">
                 {[
                   { label: 'Status?', icon: HelpCircle },
                   { label: 'Roadmap?', icon: TrendingUp },
                   { label: 'Salary?', icon: Zap },
                 ].map(s => (
                   <button 
                     key={s.label}
                     onClick={() => setInput(s.label)}
                     className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center gap-1.5"
                   >
                     <s.icon className="h-3 w-3" /> {s.label}
                   </button>
                 ))}
              </div>
              <div className="relative group/input">
                 <input 
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSend()}
                   placeholder="Engage neural link..."
                   className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-5 pr-12 py-4 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
                 />
                 <button 
                   onClick={handleSend}
                   className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-all group-hover/input:scale-105"
                 >
                   <Send className="h-3.5 w-3.5" />
                 </button>
              </div>
              <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] text-center mt-4">Powered by RK Intelligence Engine</p>
           </div>
        </div>
      )}
    </div>
  );
}
