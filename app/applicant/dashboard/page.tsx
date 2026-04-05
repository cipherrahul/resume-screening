import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Briefcase, FileText, CheckCircle, Target, Activity,
  Clock, Sparkles, TrendingUp, ArrowRight, Star,
  AlertCircle, CircleCheck, Timer, Zap, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from '@/app/actions/auth';

function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const r = 20, c = 2 * Math.PI * r;
  const fill = (score / 100) * c;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="flex-shrink-0">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#27272a" strokeWidth="5" />
      <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${fill} ${c - fill}`}
        strokeLinecap="round"
        transform="rotate(-90 28 28)" />
      <text x="28" y="33" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
        {score}%
      </text>
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    shortlisted: { label: 'Shortlisted', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    rejected:    { label: 'Rejected',    cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
    pending:     { label: 'Under Review', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    hired:       { label: 'Hired 🎉',    cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  };
  const s = map[status] ?? { label: 'Submitted', cls: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default async function ApplicantPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: applications } = await supabase
    .from('matches')
    .select(`*, job:jobs (title, job_type, required_skills, description), resume:resumes (*)`)
    .order('created_at', { ascending: false });

  const { data: allJobs } = await supabase
    .from('jobs')
    .select('id, title, job_type, required_skills, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4);

  const totalApps     = applications?.length ?? 0;
  const shortlisted   = applications?.filter(a => a.status === 'shortlisted').length ?? 0;
  const pending       = applications?.filter(a => a.status === 'pending' || !a.status).length ?? 0;
  const hired         = applications?.filter(a => a.status === 'hired').length ?? 0;
  const avgScore      = totalApps > 0
    ? Math.round((applications?.reduce((s, a) => s + (a.final_score ?? 0), 0) ?? 0) / totalApps)
    : 0;

  const appliedJobIds = new Set(applications?.map(a => a.job_id));
  const suggestedJobs = allJobs?.filter(j => !appliedJobIds.has(j.id)) ?? [];

  const userName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Student';

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Session</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-blue-400">{userName}</span> 👋
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              {totalApps === 0
                ? "You haven't applied to any roles yet. Start exploring!"
                : `You have ${pending} application${pending !== 1 ? 's' : ''} under review.`}
            </p>
          </div>
          <Link href="/applicant/jobs">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20">
              <Briefcase className="h-4 w-4" />
              Browse Jobs
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>

        {/* ── Stat Cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Applications', value: totalApps, icon: FileText,    color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
            { label: 'Avg AI Score', value: `${avgScore}%`, icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
            { label: 'Shortlisted',  value: shortlisted, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { label: 'Pending Review', value: pending, icon: Clock,       color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border ${s.border} ${s.bg} p-5 flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Grid ────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Application Pipeline */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                Application Pipeline
              </h2>
              {totalApps > 0 && (
                <span className="text-xs text-zinc-500">{totalApps} total</span>
              )}
            </div>

            {totalApps === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-16 text-center space-y-4">
                <FileText className="h-10 w-10 text-zinc-700 mx-auto" />
                <p className="text-zinc-500 font-medium">No applications yet</p>
                <Link href="/applicant/jobs">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-2 rounded-xl transition-all">
                    Find Your First Role →
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications?.map(app => {
                  let ai: any = {};
                  try { ai = JSON.parse(app.reasoning); } catch {}
                  return (
                    <div key={app.id}
                      className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 p-5 transition-all">
                      <div className="flex items-center gap-4">
                        <ScoreRing score={app.final_score ?? 0} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap mb-1">
                            <h3 className="font-bold text-white text-sm truncate">
                              {(app.job as any)?.title ?? 'Unknown Role'}
                            </h3>
                            <StatusBadge status={app.status ?? 'pending'} />
                          </div>
                          <div className="flex items-center gap-4 text-[11px] text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Timer className="h-3 w-3" />
                              {new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                            {(app.job as any)?.job_type && (
                              <span className="capitalize">{(app.job as any).job_type}</span>
                            )}
                          </div>
                        </div>
                        <Link href={`/applicant/jobs/${app.job_id}`}>
                          <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-blue-400 transition-colors" />
                        </Link>
                      </div>

                      {/* AI insight strip */}
                      {ai?.strengths?.[0] && (
                        <div className="mt-3 pt-3 border-t border-zinc-800 flex items-start gap-2">
                          <Sparkles className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-zinc-400 line-clamp-1">{ai.strengths[0]}</p>
                        </div>
                      )}
                      {ai?.gaps?.[0] && (
                        <div className="mt-1.5 flex items-start gap-2">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-zinc-500 line-clamp-1">{ai.gaps[0]}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-5">

            {/* Career strength meter */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-400" />
                Career Strength
              </h3>
              {[
                { label: 'Profile Completeness', pct: 75 },
                { label: 'Avg AI Match Score',   pct: avgScore },
                { label: 'Response Rate',        pct: totalApps > 0 ? Math.round((shortlisted / totalApps) * 100) : 0 },
              ].map(m => (
                <div key={m.label} className="mb-3">
                  <div className="flex justify-between text-[11px] font-semibold mb-1.5">
                    <span className="text-zinc-400">{m.label}</span>
                    <span className="text-zinc-300">{m.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Recommended jobs */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  Recommended Roles
                </h3>
                <Link href="/applicant/jobs" className="text-[11px] text-blue-400 hover:underline font-bold">
                  See all →
                </Link>
              </div>
              {suggestedJobs.length === 0 ? (
                <p className="text-xs text-zinc-600 italic text-center py-4">
                  You've applied to all available roles! 🎉
                </p>
              ) : (
                <div className="space-y-2.5">
                  {suggestedJobs.map((job: any) => (
                    <Link key={job.id} href={`/applicant/jobs/${job.id}`}>
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 transition-all group cursor-pointer">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                            {job.title}
                          </p>
                          <p className="text-[10px] text-zinc-500 capitalize">{job.job_type ?? 'Full-time'}</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick tips */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <h3 className="font-bold text-sm text-emerald-400 mb-3 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Quick Tips
              </h3>
              <ul className="space-y-2">
                {[
                  'Keep your resume updated for better AI matching',
                  'Apply early — recruiters shortlist within 48h',
                  'Tailor your profile skills to job requirements',
                ].map(tip => (
                  <li key={tip} className="flex items-start gap-2 text-[11px] text-zinc-400">
                    <CircleCheck className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
