'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Circle, Clock, Loader2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Application = {
  id: string;
  status: string | null;
  job: { title: string };
  created_at: string;
};

const STEPS = [
  { id: 'submitted', label: 'Submitted', status: 'pending' },
  { id: 'screening', label: 'AI Screening', status: 'screening' },
  { id: 'review', label: 'Review', status: 'review' },
  { id: 'final', label: 'Decision', status: ['shortlisted', 'rejected'] },
];

export function ApplicationTracker({ initialApplications }: { initialApplications: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [applications, setApplications] = useState<any[]>(initialApplications);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
        },
        (payload) => {
          setApplications((current) =>
            current.map((app) =>
              app.id === payload.new.id ? { ...app, ...payload.new } : app
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStepStatus = (appStatus: string | null, stepIndex: number) => {
    const currentStepIndex = appStatus === 'shortlisted' || appStatus === 'rejected' ? 3 :
                             appStatus === 'review' ? 2 :
                             appStatus === 'screening' ? 1 : 0;

    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) {
      if (appStatus === 'rejected') return 'failed';
      if (appStatus === 'shortlisted') return 'completed';
      return 'active';
    }
    return 'upcoming';
  };

  return (
    <div id="applications" className="space-y-6">
      {applications.map((app) => (
        <div key={app.id} className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-6 transition-all hover:bg-zinc-900/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{app.job?.title || 'System Role'}</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                Reference ID: {app.id.slice(0, 8)} • Applied: {mounted ? new Date(app.created_at).toLocaleDateString() : 'Loading...'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={cn(
                "font-bold tracking-widest text-[9px] px-3 py-1 uppercase",
                app.status === 'shortlisted' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                app.status === 'rejected' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                'text-amber-400 border-amber-500/30 bg-amber-500/10'
              )}>
                {app.status ? app.status : 'UNDER REVIEW'}
              </Badge>
            </div>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-4 left-0 w-full h-0.5 bg-zinc-800 -z-10" />
            
            <div className="grid grid-cols-4 gap-2">
              {STEPS.map((step, index) => {
                const status = getStepStatus(app.status, index);
                
                return (
                  <div key={step.id} className="flex flex-col items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500",
                      status === 'completed' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" :
                      status === 'active' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 animate-pulse" :
                      status === 'failed' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" :
                      "bg-zinc-800 text-zinc-500"
                    )}>
                      {status === 'completed' && <CheckCircle2 className="h-5 w-5" />}
                      {status === 'active' && <Loader2 className="h-5 w-5 animate-spin" />}
                      {status === 'failed' && <XCircle className="h-5 w-5" />}
                      {status === 'upcoming' && <Circle className="h-4 w-4" />}
                    </div>
                    <div className="text-center">
                      <p className={cn(
                        "text-[9px] font-black uppercase tracking-[0.15em]",
                        status === 'upcoming' ? "text-zinc-600" : "text-zinc-300"
                      )}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
