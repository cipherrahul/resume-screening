'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { UserPlus, Sparkles, ShieldCheck, Mail, Building, Key } from 'lucide-react';
import { createRecruiterAction } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

export function CreateRecruiterForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await createRecruiterAction(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Recruiter account provisioned successfully.' });
        (e.target as HTMLFormElement).reset();
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create account.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'A system error occurred.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-zinc-950/50 border-zinc-900 h-fit lg:sticky lg:top-8 overflow-hidden rounded-[32px] shadow-2xl backdrop-blur-md">
      <CardHeader className="border-b border-zinc-900 bg-zinc-900/20 p-8">
        <div className="flex items-center gap-3 mb-1">
          <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Secure Provisioning</span>
        </div>
        <CardTitle className="text-2xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
           Provision <span className="text-emerald-500">Agent</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
              <UserPlus className="h-3 w-3" /> Identity Alias
            </label>
            <input 
              name="fullName" 
              required 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
              placeholder="e.g. Sarah Connor"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
              <Building className="h-3 w-3" /> Unit/Organization
            </label>
            <input 
              name="company" 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
              placeholder="e.g. Cyberdyne Systems"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
              <Mail className="h-3 w-3" /> Communication Pipe
            </label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-geist-mono"
              placeholder="name@company.com"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
              <Key className="h-3 w-3" /> Access Cipher
            </label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-geist-mono"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div className={`p-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border animate-in fade-in slide-in-from-top-4 duration-300 ${
              message.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-400'
            }`}>
              <div className="flex items-center gap-3">
                 <ShieldCheck className="h-4 w-4" />
                 {message.text}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black hover:bg-emerald-500 transition-all duration-500 font-black rounded-2xl py-8 mt-4 shadow-2xl shadow-emerald-500/10 uppercase tracking-[0.3em] text-[10px]"
          >
            {loading ? 'Processing Protocol...' : 'Generate Agent Access'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

