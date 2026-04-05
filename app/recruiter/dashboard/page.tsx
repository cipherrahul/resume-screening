import { createClient } from '@/lib/supabase/server';
import {
  Briefcase, Users, FileText, CheckCircle, Sparkles,
  Plus, ArrowRight, TrendingUp, Clock, BarChart3,
  CircleDot, Zap, ChevronRight, Target, Star, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

function StatCard({ label, value, icon: Icon, color, bg, border, trend }: any) {
  return (
    <div className={`rounded-2xl border ${border} ${bg} p-5`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center`}>
          <Icon className={`h-4.5 w-4.5 ${color}`} />
        </div>
        {trend !== undefined && (
          <span className={`text-[10px] font-bold ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] font-semibold mb-1.5">
        <span className="text-zinc-400">{label}</span>
        <span className="text-zinc-300">{value}</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

export default async function RecruiterDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('created_by', user?.id)
    .order('created_at', { ascending: false });

  const jobIds = jobs?.map(j => j.id) ?? [];

  const [
    { count: activeJobs },
    { count: totalCandidates },
    { count: shortlisted },
    { count: pending },
  ] = await Promise.all([
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('created_by', user?.id).eq('is_active', true),
    supabase.from('matches').select('*', { count: 'exact', head: true }).in('job_id', jobIds),
    supabase.from('matches').select('*', { count: 'exact', head: true }).in('job_id', jobIds).eq('status', 'shortlisted'),
    supabase.from('matches').select('*', { count: 'exact', head: true }).in('job_id', jobIds).eq('status', 'pending'),
  ]);

  const { data: recentMatches } = await supabase
    .from('matches')
    .select(`*, job:jobs(title), resume:resumes(parsed_data)`)
    .in('job_id', jobIds)
    .order('created_at', { ascending: false })
    .limit(6);

  const { data: topCandidates } = await supabase
    .from('matches')
    .select(`*, job:jobs(title), resume:resumes(parsed_data)`)
    .in('job_id', jobIds)
    .gte('final_score', 70)
    .order('final_score', { ascending: false })
    .limit(5);

  const shortlistRate = totalCandidates
    ? Math.round(((shortlisted ?? 0) / totalCandidates) * 100)
    : 0;

  const recruiterName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Recruiter';

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Recruiter Console</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Hello, <span className="text-emerald-400">{recruiterName}</span> 👋
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              {activeJobs ?? 0} active {activeJobs === 1 ? 'campaign' : 'campaigns'} · {pending ?? 0} candidates awaiting review
            </p>
          </div>
          <Link href="/recruiter/jobs/new">
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 whitespace-nowrap">
              <Plus className="h-4 w-4" />
              Post New Job
            </button>
          </Link>
        </div>

        {/* ── Stat Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Jobs"      value={activeJobs ?? 0}      icon={Briefcase}   color="text-blue-400"    bg="bg-blue-500/10"    border="border-blue-500/20" />
          <StatCard label="Total Candidates" value={totalCandidates ?? 0} icon={Users}       color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" />
          <StatCard label="Shortlisted"      value={shortlisted ?? 0}     icon={CheckCircle} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
          <StatCard label="Pending Review"   value={pending ?? 0}         icon={Clock}       color="text-amber-400"  bg="bg-amber-500/10"  border="border-amber-500/20" />
        </div>

        {/* ── Main Grid ──────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Job Campaigns */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-400" />
                Job Campaigns
              </h2>
              <Link href="/recruiter/jobs">
                <span className="text-xs text-emerald-400 hover:underline font-bold">View all →</span>
              </Link>
            </div>

            {!jobs || jobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-16 text-center space-y-4">
                <Briefcase className="h-10 w-10 text-zinc-700 mx-auto" />
                <p className="text-zinc-500 font-medium">No jobs posted yet</p>
                <Link href="/recruiter/jobs/new">
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-6 py-2 rounded-xl transition-all">
                    Post Your First Job →
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 5).map(job => (
                  <div key={job.id}
                    className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 p-5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="font-bold text-white text-sm">{job.title}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                            job.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                          }`}>
                            {job.is_active ? 'Live' : 'Closed'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                          <span>{job.job_type ?? 'Full-time'}</span>
                          <span>·</span>
                          <span>{new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          {job.required_skills?.length > 0 && (
                            <>
                              <span>·</span>
                              <span>{job.required_skills.length} skills required</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Link href={`/recruiter/jobs/${job.id}`}>
                        <button className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-all border border-emerald-500/20">
                          Analytics <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent AI Activity */}
            <div className="mt-6">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-amber-400" />
                Live AI Activity
              </h2>
              {!recentMatches || recentMatches.length === 0 ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
                  <p className="text-xs text-zinc-600 italic">No activity yet. Resume screening results will appear here.</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                  {recentMatches.map((m, i) => {
                    const name = (m.resume as any)?.parsed_data?.personalInfo?.fullName ?? 'Candidate';
                    return (
                      <div key={m.id} className={`flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-all ${i < recentMatches.length - 1 ? 'border-b border-zinc-800' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 flex-shrink-0">
                          {name[0]?.toUpperCase() ?? 'C'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{name}</p>
                          <p className="text-[11px] text-zinc-500 truncate">Applied to: {(m.job as any)?.title}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-sm font-extrabold ${(m.final_score ?? 0) >= 70 ? 'text-emerald-400' : (m.final_score ?? 0) >= 50 ? 'text-amber-400' : 'text-zinc-500'}`}>
                            {m.final_score ?? 0}%
                          </span>
                          <CircleDot className="h-3.5 w-3.5 text-zinc-700" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 space-y-5">

            {/* Funnel metrics */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-400" />
                Hiring Funnel
              </h3>
              <div className="space-y-3">
                <ScoreBar label="Applied"    value={totalCandidates ?? 0} color="bg-blue-500" />
                <ScoreBar label="Shortlisted" value={shortlisted ?? 0}    color="bg-emerald-500" />
                <ScoreBar label="Pending"    value={pending ?? 0}         color="bg-amber-500" />
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Shortlist Rate</span>
                  <span className="text-sm font-bold text-emerald-400">{shortlistRate}%</span>
                </div>
              </div>
            </div>

            {/* Top candidates */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400" />
                  Top Candidates
                </h3>
                <Link href="/recruiter/candidates">
                  <span className="text-[11px] text-emerald-400 hover:underline font-bold">See all →</span>
                </Link>
              </div>
              {!topCandidates || topCandidates.length === 0 ? (
                <p className="text-xs text-zinc-600 italic text-center py-4">
                  No high-match candidates yet. Run AI screening to find them.
                </p>
              ) : (
                <div className="space-y-2">
                  {topCandidates.map((c, i) => {
                    const name = (c.resume as any)?.parsed_data?.personalInfo?.fullName ?? 'Candidate';
                    return (
                      <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-800 transition-all">
                        <span className="text-[10px] font-bold text-zinc-600 w-4">#{i + 1}</span>
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                          {name[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{(c.job as any)?.title}</p>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-400 flex-shrink-0">
                          {c.final_score}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AI insights panel */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <h3 className="font-bold text-sm text-emerald-400 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                AI Screening Tips
              </h3>
              <ul className="space-y-2">
                {[
                  'Post jobs with specific skills to improve match accuracy',
                  'Review candidates with 70%+ scores first for faster hiring',
                  'Add detailed job descriptions to reduce unqualified applications',
                ].map(tip => (
                  <li key={tip} className="flex items-start gap-2 text-[11px] text-zinc-400">
                    <Target className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
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
