'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Settings, LogOut, GraduationCap, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from '@/app/actions/auth';

const applicantNavItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/applicant/dashboard' },
  { label: 'Browse Jobs', icon: Briefcase, href: '/applicant/jobs' },
  { label: 'Main Website', icon: Globe, href: 'https://www.swagat.space/' },
];

export function ApplicantSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-zinc-900 bg-black p-4 sticky top-0">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-black text-white font-geist-sans uppercase italic tracking-tighter">
          RK <span className="text-zinc-500 font-medium lowercase italic tracking-normal">Institution</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="px-3 mb-4">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Student Portal</p>
        </div>
        {applicantNavItems.map((item) => {
          const isActive = pathname === item.href;
          const isExternal = item.href.startsWith('http');
          
          return (
            <Link
              key={item.label}
              href={item.href}
              target={isExternal ? "_blank" : undefined}
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
          End Session
        </button>
      </div>
    </div>
  );
}
