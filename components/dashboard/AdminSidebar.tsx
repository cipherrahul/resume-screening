'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Settings, LogOut, 
  ShieldCheck, Activity, GraduationCap, 
  Cpu, Zap, Shield, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from '@/app/actions/auth';

const adminNavItems = [
  { label: 'Intelligence', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Personnel', icon: ShieldCheck, href: '/admin/recruiters' },
  { label: 'Registries', icon: Users, href: '/admin/applicants' },
  { label: 'System Logs', icon: Activity, href: '/admin/logs' },
  { label: 'Protocols', icon: Settings, href: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-72 flex-col border-r border-zinc-900 bg-black p-6 sticky top-0 shadow-2xl relative overflow-hidden group/sidebar">
      
      {/* Subtle Ambient Light */}
      <div className="absolute top-0 left-0 w-full h-32 bg-emerald-500/5 blur-[80px] pointer-events-none" />

      {/* Branding */}
      <div className="mb-12 flex items-center gap-4 px-2">
        <div className="relative group/logo">
          <div className="absolute -inset-1 bg-emerald-500/20 rounded-xl blur opacity-0 group-hover/logo:opacity-100 transition-opacity" />
          <div className="relative h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl group-hover/logo:scale-110 transition-transform">
            <Cpu className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
        <div className="flex flex-col -space-y-1">
          <span className="text-xl font-black text-white uppercase italic tracking-tighter">
            RK <span className="text-emerald-500">Core</span>
          </span>
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">System Overseer</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-8">
        <div>
          <p className="px-4 mb-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2">
             <Shield className="h-3 w-3" /> Control Path
          </p>
          <div className="space-y-1.5">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-4 rounded-2xl px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all group/item relative overflow-hidden',
                    isActive
                      ? 'bg-white text-black shadow-2xl shadow-emerald-500/10'
                      : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                  )}
                >
                  <item.icon className={cn('h-4 w-4 transition-transform group-hover/item:scale-125 z-10', isActive ? 'text-black' : 'text-zinc-600 group-hover/item:text-emerald-500')} />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-0 top-0 h-full w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Global Stats/Status Indicator */}
        <div className="px-2 pt-4">
           <div className="rounded-2xl bg-zinc-900/40 border border-zinc-900 p-4 space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Protocol Health</span>
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-center text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                    <span>AI Latency</span>
                    <span className="text-zinc-400">0.4ms</span>
                 </div>
                 <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-emerald-500/50 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000" />
                 </div>
              </div>
           </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-zinc-900">
        <button 
          onClick={() => signOut()}
          className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:bg-rose-500/5 hover:text-rose-500 transition-all group/logout"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover/logout:-translate-x-1" />
          Terminate Session
        </button>
      </div>
    </div>
  );
}

