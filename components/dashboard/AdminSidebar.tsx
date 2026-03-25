'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, LogOut, ShieldCheck, Activity, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from '@/app/actions/auth';

const adminNavItems = [
  { label: 'Intelligence', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Recruiters', icon: ShieldCheck, href: '/admin/recruiters' },
  { label: 'Applicants', icon: Users, href: '/admin/applicants' },
  { label: 'System Logs', icon: Activity, href: '/admin/logs' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-zinc-800 bg-black p-4 sticky top-0">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <GraduationCap className="h-5 w-5 text-black" />
        </div>
        <span className="text-xl font-black text-white font-geist-sans uppercase italic tracking-tighter">
          RK <span className="text-zinc-500 font-medium lowercase italic tracking-normal">Admin</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="px-3 mb-4">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Management</p>
        </div>
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-widest transition-all group',
                isActive
                  ? 'bg-white text-black shadow-xl shadow-white/5'
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
              )}
            >
              <item.icon className={cn('h-4 w-4 transition-transform group-hover:scale-110', isActive ? 'text-black' : 'text-zinc-500')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-zinc-900 pt-4">
        <button 
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:bg-red-500/10 hover:text-red-500 transition-all group"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Terminate Session
        </button>
      </div>
    </div>
  );
}
