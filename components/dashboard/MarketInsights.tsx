'use client';

import React from 'react';
import { 
  TrendingUp, Activity, Target, 
  Sparkles, Zap, ShieldCheck 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TalentMetric {
  skill: string;
  density: number;
}

export function MarketInsights({ data }: { data: any }) {
  const metrics: TalentMetric[] = data?.skillDensity || [
    { skill: 'Cloud Architecture', density: 85 },
    { skill: 'React/Next.js', density: 92 },
    { skill: 'Scalable Systems', density: 78 },
    { skill: 'Neural Engines', density: 45 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, idx) => (
        <div key={metric.skill} className="group relative bg-zinc-950/40 border border-zinc-900 rounded-[32px] p-8 overflow-hidden shadow-2xl transition-all hover:border-blue-500/20 backdrop-blur-md">
           {/* Visual Pulse */}
           <div className="absolute -top-12 -right-12 h-32 w-32 bg-blue-500/5 blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-all duration-700" />
           
           <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                 <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
                    {idx === 0 ? <ShieldCheck className="h-5 w-5" /> : idx === 1 ? <Zap className="h-5 w-5" /> : idx === 2 ? <Activity className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                 </div>
                 <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">+12%</span>
                 </div>
              </div>

              <div className="space-y-1">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">{metric.skill}</h4>
                 <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-white italic tracking-tighter leading-none">{metric.density}%</span>
                    <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-1">Density</span>
                 </div>
              </div>

              {/* Progress Line */}
              <div className="space-y-2">
                 <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                      style={{ width: `${metric.density}%` }}
                    />
                 </div>
                 <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em] italic">Exceeding market benchmark by {metric.density - 40}%</p>
              </div>
           </div>
        </div>
      ))}
    </div>
  );
}
