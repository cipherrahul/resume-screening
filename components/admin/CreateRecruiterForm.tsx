'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { UserPlus } from 'lucide-react';
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
    <Card className="lg:col-span-1 bg-zinc-950/50 border-zinc-900 h-fit lg:sticky lg:top-8 overflow-hidden">
      <CardHeader className="border-b border-zinc-900 bg-zinc-900/10">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
           <UserPlus className="h-5 w-5 text-emerald-500" />
           Provision Agent
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Full Name</label>
            <input 
              name="fullName" 
              required 
              className="w-full bg-zinc-900 border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="e.g. Sarah Connor"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Company</label>
            <input 
              name="company" 
              className="w-full bg-zinc-900 border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="e.g. Cyberdyne Systems"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full bg-zinc-900 border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-geist-mono"
              placeholder="name@company.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Initial Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full bg-zinc-900 border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-geist-mono"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-widest border ${
              message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-500 text-black hover:bg-emerald-400 font-black rounded-xl py-6 mt-4 shadow-xl shadow-emerald-500/10 transition-all uppercase tracking-widest text-[10px]"
          >
            {loading ? 'Processing...' : 'Generate Credentials'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
