import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Users, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

import { signOut } from '@/app/actions/auth';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/recruiter/dashboard' },
  { label: 'Jobs', icon: Briefcase, href: '/recruiter/dashboard' },
  { label: 'Candidates', icon: Users, href: '/recruiter/candidates' },
  { label: 'Settings', icon: Settings, href: '/recruiter/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
          <span className="text-black font-bold">RS</span>
        </div>
        <span className="text-xl font-bold text-white">Screener AI</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-zinc-800 pt-4">
        <button 
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
