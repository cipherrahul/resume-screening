'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { askRecruiterAssistant } from '@/app/actions/chat';
import { cn } from '@/lib/utils';

export function RecruiterChat({ jobId }: { jobId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user' as const, content: query }];
    setMessages(newMessages);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await askRecruiterAssistant(jobId, query, messages);
      setMessages([...newMessages, { role: 'assistant' as const, content: response || 'I am sorry, I could not process that.' }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant' as const, content: 'Error: Failed to connect to assistant.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-white text-black shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 border border-zinc-200"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm">Recruiter Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center py-20 px-6">
                <Bot className="h-10 w-10 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm">Ask me about the candidates for this job.</p>
                <p className="text-xs text-zinc-600 mt-2 italic">"Who is the best match for React?"</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-3", m.role === 'user' ? "flex-row-reverse" : "")}>
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                  m.role === 'user' ? "bg-zinc-800" : "bg-white/10"
                )}>
                  {m.role === 'user' ? <User className="h-4 w-4 text-zinc-400" /> : <Bot className="h-4 w-4 text-white" />}
                </div>
                <div className={cn(
                  "rounded-2xl px-4 py-2 text-sm max-w-[80%]",
                  m.role === 'user' ? "bg-white text-black" : "bg-zinc-900 text-zinc-300 border border-zinc-800"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-zinc-800">
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask assistant..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white"
              />
              <Button onClick={handleSend} size="sm" className="w-10 p-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
