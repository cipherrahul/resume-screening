'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Briefcase, Users, Settings,
  LogOut, GraduationCap, BarChart3, Plus,
  MessageSquare, Bell, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from '@/app/actions/auth';

const navGroups = [
  {
    label: 'Recruitment',
    items: [
      { label: 'Dashboard',    icon: LayoutDashboard, href: '/recruiter/dashboard' },
      { label: 'Job Postings', icon: Briefcase,        href: '/recruiter/jobs' },
      { label: 'Candidates',   icon: Users,            href: '/recruiter/candidates' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'AI Analytics',   icon: BarChart3,     href: '/recruiter/dashboard#analytics' },
      { label: 'AI Chat',        icon: MessageSquare, href: '/recruiter/dashboard#chat' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Settings', icon: Settings, href: '/recruiter/settings' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-zinc-900 bg-zinc-950 sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-zinc-900">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-600/30 flex-shrink-0">
            <GraduationCap className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-tight leading-none">RK Institution</p>
            <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest mt-0.5">Recruiter Portal</p>
          </div>
        </div>
      </div>

      {/* Quick action */}
      <div className="px-3 pt-4">
        <Link href="/recruiter/jobs/new">
          <button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-wider">
            <Plus className="h-3.5 w-3.5" />
            Post New Job
          </button>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.25em] px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all group',
                      isActive
                        ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-600/20'
                        : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                    )}
                  >
                    <item.icon className={cn('h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110',
                      isActive ? 'text-emerald-400' : 'text-zinc-600')} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-zinc-900 space-y-1">
        <div className="px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-emerald-500" />
            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">AI Powered</p>
          </div>
          <p className="text-xs font-semibold text-zinc-300 mt-0.5">Recruiter Account</p>
        </div>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
