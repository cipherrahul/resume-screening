import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { 
  Briefcase, Plus, Search, Filter, 
  ArrowUpDown, ChevronRight, Target, 
  Zap, Activity, Users, CheckCircle,
  Clock, AlertCircle, TrendingUp, MoreHorizontal
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RecruiterJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch all jobs created by this recruiter
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select(`
      *,
      matches:matches (
        id,
        status,
        final_score
      )
    `)
    .eq('created_by', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching recruiter jobs:", error);
  }

  const totalJobs = jobs?.length || 0;
  const activeJobs = jobs?.filter(j => j.is_active).length || 0;
  
  // Aggregate stats across all jobs
  let totalCandidates = 0;
  let totalShortlisted = 0;
  let avgScore = 0;
  let scoreCount = 0;

  jobs?.forEach(job => {
    const jobMatches = job.matches || [];
    totalCandidates += jobMatches.length;
    totalShortlisted += jobMatches.filter((m: any) => m.status === 'shortlisted').length;
    jobMatches.forEach((m: any) => {
      if (m.final_score) {
        avgScore += m.final_score;
        scoreCount++;
      }
    });
  });

  const finalAvgScore = scoreCount > 0 ? Math.round(avgScore / scoreCount) : 0;
  const shortlistRate = totalCandidates > 0 ? Math.round((totalShortlisted / totalCandidates) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-12 pb-32 px-6">
      
      {/* ── Intelligence Header ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-zinc-900 pb-12 pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Campaign Management Protocol</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
            Hiring <span className="text-emerald-500 underline decoration-emerald-500/20 underline-offset-8">Campaigns</span>
          </h1>
          <p className="text-zinc-500 font-medium max-w-xl text-lg leading-relaxed">
            Neural tracking of all active and legacy job deployments. Orchestrate architectural talent acquisition through real-time vector analysis.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/recruiter/jobs/new">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl px-10 h-16 uppercase tracking-widest text-xs shadow-2xl shadow-emerald-600/10 transition-all active:scale-95 flex items-center gap-3">
              <Plus className="h-5 w-5" /> Initialize Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Global Metrics ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[32px] p-8 space-y-4 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-1 w-full bg-blue-500/10 group-hover:bg-blue-500 transition-all duration-700" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">Total Deployments</span>
            <Briefcase className="h-4 w-4 text-zinc-700" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white italic tracking-tighter leading-none">{totalJobs}</span>
            <span className="text-[10px] font-bold text-zinc-500 mb-1">UNITS</span>
          </div>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[32px] p-8 space-y-4 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-1 w-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-all duration-700" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Neural Live</span>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-emerald-400 italic tracking-tighter leading-none">{activeJobs}</span>
            <span className="text-[10px] font-bold text-emerald-500/60 mb-1 uppercase tracking-widest italic font-black">Active</span>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[32px] p-8 space-y-4 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-1 w-full bg-purple-500/10 group-hover:bg-purple-500 transition-all duration-700" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">Match Efficiency</span>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white italic tracking-tighter leading-none">{finalAvgScore}%</span>
            <span className="text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-widest italic font-black">Avg Match</span>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[32px] p-8 space-y-4 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-1 w-full bg-amber-500/10 group-hover:bg-amber-500 transition-all duration-700" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">Shortlist Delta</span>
            <CheckCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white italic tracking-tighter leading-none">{shortlistRate}%</span>
            <span className="text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-widest italic font-black">Conviction</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter ───────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-10">
        <div className="flex items-center gap-1 p-1.5 bg-zinc-950 rounded-2xl border border-zinc-900 overflow-x-auto scrollbar-hide">
          <button className="flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap italic bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            All Campaigns
            <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black bg-zinc-200 text-zinc-800">{totalJobs}</span>
          </button>
          <button className="flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap italic text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900">
            Active Protocols
            <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black bg-zinc-900 text-zinc-700">{activeJobs}</span>
          </button>
          <button className="flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap italic text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900">
            Archived Files
            <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black bg-zinc-900 text-zinc-700">{totalJobs - activeJobs}</span>
          </button>
        </div>

        <div className="relative group w-full lg:max-w-md">
          <Search className="h-5 w-5 text-zinc-600 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-all" />
          <input 
            type="text" 
            placeholder="Search Intelligence Ledger..." 
            className="w-full bg-zinc-950 border border-zinc-900 rounded-3xl pl-12 pr-6 py-4 text-xs text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-inner font-medium italic"
          />
        </div>
      </div>

      {/* ── Campaigns Table ───────────────────────────── */}
      {!jobs || jobs.length === 0 ? (
        <div className="rounded-[40px] border border-dashed border-zinc-900 bg-zinc-950/20 p-32 text-center space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-[100px]" />
          <div className="h-24 w-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800 shadow-inner group-hover:scale-110 transition-transform">
            <Briefcase className="h-12 w-12 text-zinc-700" />
          </div>
          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">No Campaigns Detected</h2>
            <p className="text-zinc-600 max-w-sm mx-auto text-sm font-medium leading-relaxed italic">
              The intelligence ledger is currently silent. Initialize your first hiring campaign to begin the talent extraction protocol.
            </p>
          </div>
          <Link href="/recruiter/jobs/new" className="relative z-10 inline-block">
            <Button className="bg-white text-black hover:bg-zinc-200 font-black rounded-2xl px-12 h-14 uppercase tracking-widest text-[10px] shadow-2xl shadow-white/5 transition-all active:scale-95">
              Initialize First Campaign
            </Button>
          </Link>
        </div>
      ) : (
        <div className="group relative overflow-hidden bg-zinc-950/40 rounded-[48px] border border-zinc-900 shadow-[0_0_120px_rgba(0,0,0,0.6)] backdrop-blur-md">
          {/* Subtle Ambient Light Overlay */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-600/5 blur-[120px] pointer-events-none group-hover:bg-emerald-600/10 transition-all duration-1000" />
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/40 border-b border-zinc-900 text-[10px] uppercase font-black tracking-[0.3em] text-zinc-600">
                  <th className="px-10 py-6">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                      Campaign Ledger <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-8 py-6">Protocol Type</th>
                  <th className="px-8 py-6">Applicants Detail</th>
                  <th className="px-8 py-6">Neural Score</th>
                  <th className="px-8 py-6">Engagement Status</th>
                  <th className="px-10 py-6 text-right">Operational Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {jobs.map((job: any) => {
                  const matches = job.matches || [];
                  const jobCandidates = matches.length;
                  const jobShortlisted = matches.filter((m: any) => m.status === 'shortlisted').length;
                  
                  let jobAvgScore = 0;
                  let jobScoreCount = 0;
                  matches.forEach((m: any) => {
                    if (m.final_score) {
                      jobAvgScore += m.final_score;
                      jobScoreCount++;
                    }
                  });
                  const finalJobAvgScore = jobScoreCount > 0 ? Math.round(jobAvgScore / jobScoreCount) : 0;
                  const scoreColor = finalJobAvgScore >= 80 ? 'text-emerald-400' : finalJobAvgScore >= 60 ? 'text-blue-400' : 'text-zinc-600';

                  return (
                    <tr key={job.id} className="hover:bg-zinc-900/30 transition-all group/row relative">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-2xl transition-all group-hover/row:scale-110 italic ${
                            job.is_active ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 shadow-inner'
                          }`}>
                            {job.title[0]?.toUpperCase()}
                          </div>
                          <div className="space-y-1">
                            <div className="font-black text-white text-base group-hover/row:text-emerald-400 transition-colors uppercase italic tracking-tighter">{job.title}</div>
                            <div className="flex items-center gap-2">
                               <Badge variant="outline" className="text-[8px] font-black text-zinc-600 border-zinc-800 bg-zinc-900/50 uppercase tracking-widest px-2 h-4">ID: {job.id.slice(0, 8)}</Badge>
                               <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">DEPLOYED: {new Date(job.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-col gap-1.5">
                           <span className="inline-flex items-center gap-2 py-1 px-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[10px] font-black text-zinc-300 uppercase italic tracking-tight w-fit">
                              <Target className="h-3 w-3 text-emerald-500" /> {job.job_type || 'Full-Time'}
                           </span>
                           <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em] ml-1">{job.experience_required || 'Seniors Accepted'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-col gap-2">
                           <div className="flex items-center gap-4">
                              <div className="flex flex-col">
                                 <span className="text-xl font-black text-white italic leading-none">{jobCandidates}</span>
                                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">Found</span>
                              </div>
                              <div className="h-6 w-px bg-zinc-900" />
                              <div className="flex flex-col">
                                 <span className="text-xl font-black text-emerald-400 italic leading-none">{jobShortlisted}</span>
                                 <span className="text-[8px] font-black text-emerald-900 uppercase tracking-widest mt-1">Elite</span>
                              </div>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="space-y-2 min-w-[140px]">
                           <div className="flex items-center justify-between">
                              <span className={`text-sm font-black italic tracking-tighter ${scoreColor}`}>{finalJobAvgScore}% AGGREGATE</span>
                              <Activity className={`h-3 w-3 ${scoreColor} opacity-40 animate-pulse`} />
                           </div>
                           <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden shadow-inner p-[1.5px]">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ease-out h-[3px] ${finalJobAvgScore >= 80 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-blue-500'}`} 
                                style={{ width: `${finalJobAvgScore}%` }} 
                              />
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <Badge variant="outline" className={`font-black tracking-[0.2em] text-[9px] px-4 py-1.5 rounded-xl uppercase shadow-2xl transition-all ${
                          job.is_active ? 'text-emerald-400 border-emerald-400/20 bg-emerald-500/5' : 
                          'text-zinc-600 border-zinc-800 bg-zinc-900/50'
                        }`}>
                          <div className={`h-1.5 w-1.5 rounded-full mr-2.5 ${
                            job.is_active ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-zinc-800'
                          }`} />
                          {job.is_active ? 'Active Ledger' : 'Archived'}
                        </Badge>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3 translate-x-2 opacity-60 group-hover/row:opacity-100 transition-all">
                           <Button variant="outline" size="sm" className="h-10 w-10 p-0 bg-transparent border-zinc-900 hover:bg-zinc-900 transition-all rounded-xl shadow-xl">
                              <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                           </Button>
                           <Link href={`/recruiter/jobs/${job.id}`}>
                              <Button className="h-10 px-6 gap-3 bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-widest rounded-xl shadow-2xl italic">
                                Analyze <ChevronRight className="h-3.5 w-3.5" />
                              </Button>
                           </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Intelligence Command Footer */}
          <div className="bg-zinc-900/30 border-t border-zinc-900 px-10 py-6 flex items-center justify-between text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] italic leading-none">
             <div className="flex items-center gap-8">
                <span className="flex items-center gap-2 text-zinc-500"><Zap className="h-3 w-3" /> Campaigns: {totalJobs} Total Units</span>
                <span className="h-px w-8 bg-zinc-900" />
                <span>Synchronized with Neural Core v4.0.1</span>
             </div>
             <div className="flex items-center gap-6">
                <button className="hover:text-white transition-colors disabled:opacity-20" disabled>Previous Block</button>
                <div className="flex items-center gap-2">
                   <div className="h-8 w-8 rounded-lg bg-white text-black flex items-center justify-center font-black shadow-2xl">01</div>
                </div>
                <button className="hover:text-white transition-colors disabled:opacity-20" disabled>Next Block</button>
             </div>
          </div>
        </div>
      )}

      {/* ── Background Decal ──────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent pointer-events-none" />
      <div className="fixed top-0 right-0 p-32 opacity-[0.02] pointer-events-none rotate-12">
         <Briefcase className="h-[600px] w-[600px] text-white" />
      </div>

    </div>
  );
}
