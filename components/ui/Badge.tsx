import * as React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ 
  children, 
  variant = 'default', 
  className 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'error' | 'secondary' | 'outline'; 
  className?: string 
}) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
    secondary: 'bg-zinc-900 text-zinc-400 border-zinc-800',
    outline: 'bg-transparent text-zinc-500 border-zinc-800',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors whitespace-nowrap', variants[variant], className)}>
      {children}
    </span>
  );
}
