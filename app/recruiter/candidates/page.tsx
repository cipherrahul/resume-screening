import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { 
  Users, FileText, CheckCircle, XCircle, 
  Clock, ExternalLink, Search, Filter,
  ArrowUpDown, MoreHorizontal, Mail,
  Calendar, Download, Sparkles, TrendingUp,
  AlertCircle, ChevronRight, UserCheck, Briefcase
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CandidatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // The RLS policy for 'matches' already filters to jobs owned by auth.uid()
  const { data: candidates, error } = await supabase
    .from('matches')
    .select(`
      id,
      status,
      final_score,
      created_at,
      reasoning,
      job:jobs (id, title),
      resume:resumes (
        id,
        file_url,
        applicant:profiles (full_name)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching candidates:", error);
  }

  // Derived stats
  const total = candidates?.length || 0;
  const shortlistedCount = candidates?.filter(c => c.status === 'shortlisted').length || 0;
  const pendingCount = candidates?.filter(c => !c.status || c.status === 'pending').length || 0;
  const rejectedCount = candidates?.filter(c => c.status === 'rejected').length || 0;

  const tabs = [
    { label: 'All Candidates', count: total, value: 'all' },
    { label: 'Shortlisted', count: shortlistedCount, value: 'shortlisted' },
    { label: 'Pending', count: pendingCount, value: 'pending' },
    { label: 'Rejected', count: rejectedCount, value: 'rejected' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-10 pb-20 px-6">
      
      {/* ── Header & Stats ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Recruitment Hub</span>
          </div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            Candidate <span className="text-blue-500">Roster</span>
          </h1>
          <p className="text-zinc-500 font-medium max-w-lg">
            Intelligent candidate management powered by RK AI. Review, shortlist, and track talent across all your active job campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-2xl font-black text-white">{total}</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Total Talent</span>
           </div>
           <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-2xl font-black text-emerald-400">{shortlistedCount}</span>
              <span className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest mt-1">Shortlisted</span>
           </div>
        </div>
      </div>

      {/* ── Tabs & Search Bar ──────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-2xl border border-zinc-900 overflow-x-auto scrollbar-hide">
          {tabs.map((tab, i) => (
            <button 
              key={tab.value}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                i === 0 ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${i === 0 ? 'bg-zinc-100 text-zinc-600' : 'bg-zinc-900 text-zinc-600'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative group w-full lg:max-w-md">
          <Search className="h-4 w-4 text-zinc-600 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search candidates by name, job, or score..." 
            className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* ── Main Candidates Table ─────────────────────────────────── */}
      {error ? (
        <div className="p-12 rounded-3xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm font-bold text-center flex flex-col items-center gap-3">
          <AlertCircle className="h-8 w-8" />
          System encountered an error while fetching candidate data.
          <Button variant="outline" className="mt-2 border-red-500/20 text-red-400 hover:bg-red-500/10">Retry Fetch</Button>
        </div>
      ) : (!candidates || candidates.length === 0) ? (
        <div className="rounded-[40px] border border-dashed border-zinc-800 bg-zinc-950/50 p-24 text-center space-y-6 shadow-2xl">
          <div className="h-20 w-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-zinc-700" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white italic uppercase">Roster Empty</h2>
            <p className="text-zinc-500 max-w-sm mx-auto text-sm font-medium">
              We haven't detected any incoming applications. Ensure your job postings are "Live" to start receiving AI-matched talent.
            </p>
          </div>
          <Link href="/recruiter/dashboard">
            <Button className="bg-white text-black hover:bg-zinc-200 font-black rounded-xl px-10 py-6 uppercase tracking-widest text-[10px]">
              Post New Job
            </Button>
          </Link>
        </div>
      ) : (
        <div className="group relative overflow-hidden bg-zinc-950/40 rounded-[32px] border border-zinc-900 shadow-2xl backdrop-blur-sm">
          {/* Subtle Ambient Light */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none" />
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/30 border-b border-zinc-800/80 text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                  <th className="px-8 py-5 font-black">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                      Candidate Identity <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-5 font-black">Campaign</th>
                  <th className="px-6 py-5 font-black">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                      AI Integrity <Sparkles className="h-3 w-3 text-amber-500" />
                    </div>
                  </th>
                  <th className="px-6 py-5 font-black">Current Status</th>
                  <th className="px-6 py-5 font-black">Timeline</th>
                  <th className="px-8 py-5 font-black text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {candidates.map((candidate: any) => {
                  const applicantName = Array.isArray(candidate.resume?.applicant) 
                    ? candidate.resume.applicant[0]?.full_name 
                    : candidate.resume?.applicant?.full_name || 'Anonymous Applicant';
                  
                  const jobTitle = Array.isArray(candidate.job) 
                    ? candidate.job[0]?.title 
                    : candidate.job?.title || 'Unknown Job';

                  const jobId = Array.isArray(candidate.job) 
                    ? candidate.job[0]?.id 
                    : candidate.job?.id;

                  const score = candidate.final_score || 0;
                  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-blue-400' : 'text-zinc-500';

                  return (
                    <tr key={candidate.id} className="hover:bg-zinc-900/20 transition-all group/row">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-xs shadow-xl transition-all group-hover/row:scale-110 ${
                            candidate.status === 'shortlisted' ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/20' : 'bg-zinc-900 text-zinc-500'
                          }`}>
                            {applicantName[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-extrabold text-white text-sm group-hover/row:text-blue-400 transition-colors uppercase italic tracking-tight">{applicantName}</div>
                            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">Verified Profile</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                           <Briefcase className="h-3 w-3" /> {jobTitle}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1.5 min-w-[100px]">
                           <div className="flex items-center justify-between">
                              <span className={`text-xs font-black italic ${scoreColor}`}>{score}%</span>
                              <TrendingUp className={`h-3 w-3 ${scoreColor} opacity-50`} />
                           </div>
                           <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-700 ${score >= 80 ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-blue-500'}`} 
                                style={{ width: `${score}%` }} 
                              />
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-bold">
                        <Badge variant="outline" className={`font-black tracking-[0.1em] text-[9px] px-3 py-1 rounded-lg uppercase shadow-sm ${
                          candidate.status === 'shortlisted' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5 font-black' : 
                          candidate.status === 'rejected' ? 'text-red-400 border-red-400/20 bg-red-400/5' : 
                          'text-amber-400 border-amber-400/20 bg-amber-400/5'
                        }`}>
                          <div className={`h-1 w-1 rounded-full mr-2 hidden sm:block ${
                            candidate.status === 'shortlisted' ? 'bg-emerald-400' : candidate.status === 'rejected' ? 'bg-red-400' : 'bg-amber-400'
                          }`} />
                          {candidate.status || 'PENDING'}
                        </Badge>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-bold text-zinc-300 uppercase italic">{new Date(candidate.created_at).toLocaleDateString()}</span>
                           <span className="text-[9px] font-medium text-zinc-700 tracking-wide mt-0.5">Applied on Portal</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all">
                              <Mail className="h-3.5 w-3.5 text-zinc-500" />
                           </Button>
                           <Link href={`/recruiter/jobs/${jobId}`}>
                              <Button className="h-9 px-4 gap-2 bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-widest shadow-xl">
                                Manage <ChevronRight className="h-3 w-3" />
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

          {/* Table Footer */}
          <div className="bg-zinc-900/10 border-t border-zinc-900 px-8 py-5 flex items-center justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
             <div className="flex items-center gap-4">
                <span>Showing {candidates.length} Applicants</span>
                <span className="text-zinc-800">|</span>
                <span>Sorted by Recency</span>
             </div>
             <div className="flex items-center gap-2">
                <button className="hover:text-white transition-colors disabled:opacity-30" disabled>Previous</button>
                <div className="flex items-center gap-1.5">
                   <div className="h-6 w-6 rounded bg-zinc-900 flex items-center justify-center text-white border border-zinc-800">1</div>
                </div>
                <button className="hover:text-white transition-colors disabled:opacity-30" disabled>Next</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
