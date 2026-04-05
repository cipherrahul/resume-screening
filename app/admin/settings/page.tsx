'use client';

import React, { useState } from 'react';
import { 
  Settings, Shield, Lock, Eye, 
  UserRoundCheck, Globe, Zap, 
  CheckCircle2, AlertTriangle, 
  ChevronRight, Fingerprint, Database
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function AdminSettingsPage() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleToggleMFA = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setMfaEnabled(!mfaEnabled);
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-12 pb-20 px-6 relative">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] pointer-events-none opacity-50" />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Kernel Management</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
            Protocol <span className="text-blue-500 underline decoration-blue-500/20 underline-offset-8">Config</span>
          </h1>
          <p className="text-zinc-500 font-medium max-w-lg leading-relaxed mt-2">
            Global system parameters and encryption protocols. Oversight of authorization nodes and secure data conduits.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Security Module (Left) */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* MFA Status Card */}
           <div className={cn(
             "rounded-[40px] border p-10 transition-all duration-700 relative overflow-hidden group",
             mfaEnabled 
              ? "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]" 
              : "bg-zinc-950/40 border-zinc-900 shadow-2xl"
           )}>
              <div className="absolute top-0 right-0 p-8">
                 <Shield className={cn("h-24 w-24 opacity-5 transition-all duration-700", mfaEnabled ? "text-emerald-500 scale-110 rotate-12" : "text-zinc-500 rotate-0")} />
              </div>

              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-6">
                    <div className={cn(
                      "h-16 w-16 rounded-3xl flex items-center justify-center transition-all duration-700 shadow-2xl",
                      mfaEnabled ? "bg-emerald-500 text-black rotate-3" : "bg-zinc-900 text-zinc-500"
                    )}>
                       {mfaEnabled ? <Fingerprint className="h-8 w-8" /> : <Lock className="h-8 w-8" />}
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                          {mfaEnabled ? "Consensus Reached" : "Authorization Pending"}
                       </h2>
                       <div className="flex items-center gap-3 mt-1">
                          <Badge variant={mfaEnabled ? "success" : "warning"} className="text-[9px] font-black uppercase tracking-widest px-3">
                             {mfaEnabled ? "Protocol Encrypted" : "MFA Required"}
                          </Badge>
                          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                             <Globe className="h-3 w-3" /> Global Shield: {mfaEnabled ? "99.9%" : "40.0%"}
                          </span>
                       </div>
                    </div>
                 </div>

                 <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xl">
                   {mfaEnabled 
                     ? "Multi-Factor Authentication is currently enforced across all administrative nodes. System-wide state synchronization is encrypted at the kernel level."
                     : "Your administrative node is currently operating on secondary protocols. Enable MFA to unlock deep system parameters and enforce 'Elite Recruiter' consensus rules."}
                 </p>

                 <Button 
                   onClick={handleToggleMFA}
                   disabled={isSyncing}
                   className={cn(
                     "h-14 px-10 rounded-2xl text-[10px] uppercase font-black tracking-[0.2em] transition-all duration-500 shadow-2xl",
                     mfaEnabled 
                      ? "bg-zinc-900 text-emerald-500 border border-emerald-500/20 hover:bg-zinc-800"
                      : "bg-white text-black hover:bg-zinc-200"
                   )}
                 >
                   {isSyncing ? "Synchronizing Kernels..." : mfaEnabled ? "Disable Secure Protocol" : "Initialize Secure Protocol"}
                 </Button>
              </div>
           </div>

           {/* Advanced Toggles */}
           <div className="grid md:grid-cols-2 gap-6">
              {[
                { id: 'rbac', label: 'RBAC Enforcement', desc: 'Require role consensus for all matches', icon: UserRoundCheck, active: true },
                { id: 'audit', label: 'Deep Audit Logs', desc: 'Log even the most minor metadata changes', icon: Database, active: false },
                { id: 'ai', label: 'AI Transparency', desc: 'Show raw reasoning vectors to recruiters', icon: Eye, active: mfaEnabled },
              ].map(opt => (
                <div key={opt.id} className={cn(
                  "p-8 rounded-[32px] border transition-all duration-500 group/opt",
                  opt.active ? "bg-zinc-900/50 border-zinc-800/50" : "bg-black/20 border-zinc-900 opacity-50 grayscale"
                )}>
                   <div className="flex justify-between items-start mb-6">
                      <opt.icon className={cn("h-6 w-6 transition-colors duration-500", opt.active ? "text-blue-400" : "text-zinc-700")} />
                      <div className={cn("h-3 w-3 rounded-full", opt.active ? "bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-zinc-800")} />
                   </div>
                   <h4 className="text-xs font-black text-white uppercase italic tracking-widest mb-2 group-hover/opt:text-blue-400 transition-colors">{opt.label}</h4>
                   <p className="text-[11px] font-medium text-zinc-600 leading-relaxed">{opt.desc}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Info Column (Right) */}
        <div className="space-y-6">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 space-y-8 shadow-2xl">
              <div className="flex items-center gap-3">
                 <Zap className="h-5 w-5 text-amber-500" />
                 <h4 className="text-xs font-black text-white uppercase italic tracking-widest">System Health</h4>
              </div>
              <div className="space-y-5">
                 {[
                   { label: 'Platform Load', pct: 12 },
                   { label: 'Inference Flux', pct: 45 },
                   { label: 'Disk Integrity', pct: 98 },
                 ].map(stat => (
                   <div key={stat.label} className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                         <span>{stat.label}</span>
                         <span className="text-white italic">{stat.pct}%</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                           style={{ width: `${stat.pct}%` }} 
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-blue-500/5 border border-blue-500/10 rounded-[32px] p-8 space-y-4">
              <div className="flex items-center gap-2">
                 <AlertTriangle className="h-4 w-4 text-blue-400" />
                 <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Kernel Directive</span>
              </div>
              <p className="text-xs font-medium text-zinc-400 leading-relaxed italic">
                Any changes to the Protocol Config will be logged in the 'System Flux' telemetry engine. State consensus is required for persistence.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
