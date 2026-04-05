import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { 
  Users, FileText, CheckCircle, XCircle, 
  Clock, ExternalLink, Search, Filter,
  ArrowUpDown, MoreHorizontal, Mail,
  Calendar, Download, Sparkles, TrendingUp,
  AlertCircle, ChevronRight, UserCheck, Briefcase,
  Target, ShieldCheck, Zap, Activity, Dna
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { MarketInsights } from '@/components/dashboard/MarketInsights';
import { analyzeTalentPool } from '@/app/actions/talent';

export const dynamic = 'force-dynamic';

export default async function CandidatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch Talent Pool matches
  const { data: candidates, error } = await supabase
    .from('matches')
    .select(`
      id,
      status,
      final_score,
      created_at,
      reasoning,
      job:jobs (id, title, required_skills),
      resume:resumes (
        id,
        file_url,
        parsed_data,
        applicant:profiles (full_name)
      )
    `)
    .order('created_at', { ascending: false });

  // Fetch Intelligence Insights
  const poolInsights = await analyzeTalentPool();

  if (error) {
    console.error("Error fetching candidates:", error);
  }

  const total = candidates?.length || 0;
  const shortlistedCount = candidates?.filter(c => c.status === 'shortlisted').length || 0;
  const pendingCount = candidates?.filter(c => !c.status || c.status === 'pending').length || 0;
  const rejectedCount = candidates?.filter(c => c.status === 'rejected').length || 0;

  const tabs = [
    { label: 'Intelligence Roster', count: total, value: 'all' },
    { label: 'Shortlisted', count: shortlistedCount, value: 'shortlisted' },
    { label: 'Neural Gaps', count: pendingCount, value: 'pending' },
    { label: 'Protocol Denied', count: rejectedCount, value: 'rejected' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-12 pb-32 px-6">
      
      {/* ── Intelligence Header ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-zinc-900 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Talent Intelligence Protocol</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
            Global <span className="text-blue-500 underline decoration-blue-500/20 underline-offset-8">Talent DNA</span>
          </h1>
          <p className="text-zinc-500 font-medium max-w-xl text-lg leading-relaxed">
            Neural-mapped candidate registry across all hiring campaigns. High-conviction entities identified through deep-vector architectural analysis.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center min-w-[140px] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-1 w-full bg-blue-500/20 group-hover:bg-blue-500 transition-all duration-700" />
              <span className="text-4xl font-black text-white italic tracking-tighter">{total}</span>
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">Active Candidates</span>
           </div>
           <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6 flex flex-col items-center justify-center min-w-[140px] backdrop-blur-xl shadow-2xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 h-1 w-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-all duration-700" />
              <span className="text-4xl font-black text-emerald-400 italic tracking-tighter">{shortlistedCount}</span>
              <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mt-2 italic font-black">Elite Matches</span>
           </div>
        </div>
      </div>

      {/* ── Visual Talent Benchmark (New Component) ─────────────── */}
      <div className="space-y-6">
         <div className="flex items-center justify-between border-l-4 border-blue-500 pl-6 py-1">
            <h2 className="text-lg font-black text-white uppercase tracking-widest italic flex items-center gap-3">
               <Activity className="h-5 w-5 text-blue-500" />
               Global Talent Benchmarks
            </h2>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Aggregate Neural Vector v4.0</p>
         </div>
         <MarketInsights data={poolInsights} />
      </div>

      {/* ── Search & Filter ───────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-10">
        <div className="flex items-center gap-1 p-1.5 bg-zinc-950 rounded-2xl border border-zinc-900 overflow-x-auto scrollbar-hide">
          {tabs.map((tab, i) => (
            <button 
              key={tab.value}
              className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap italic ${
                i === 0 ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {tab.label}
              <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black ${i === 0 ? 'bg-zinc-200 text-zinc-800' : 'bg-zinc-900 text-zinc-700'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative group w-full lg:max-w-md">
          <Search className="h-5 w-5 text-zinc-600 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-all" />
          <input 
            type="text" 
            placeholder="Search Global Talent Pool..." 
            className="w-full bg-zinc-950 border border-zinc-900 rounded-3xl pl-12 pr-6 py-4 text-xs text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner font-medium italic"
          />
        </div>
      </div>

      {/* ── Intelligence Roster Table ───────────────────────────── */}
      {error ? (
        <div className="p-16 rounded-[48px] bg-red-500/5 border border-red-500/10 text-red-500 text-sm font-black text-center flex flex-col items-center gap-4 italic uppercase">
          <AlertCircle className="h-10 w-10 animate-pulse" />
          Neural Integrity Breach: Error fetching pool data.
          <Button variant="outline" className="mt-4 border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all rounded-xl text-[10px] px-10 h-12 uppercase font-black tracking-widest">Re-Initialize Fetch</Button>
        </div>
      ) : (!candidates || candidates.length === 0) ? (
        <div className="rounded-[40px] border border-dashed border-zinc-900 bg-zinc-950/20 p-32 text-center space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-[100px]" />
          <div className="h-24 w-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800 shadow-inner group-hover:scale-110 transition-transform">
            <Users className="h-12 w-12 text-zinc-700" />
          </div>
          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Pool Extraction Offline</h2>
            <p className="text-zinc-600 max-w-sm mx-auto text-sm font-medium leading-relaxed italic">
              Global registry is currently silent. Synchronize your hiring campaigns to start detecting elite architectural talent.
            </p>
          </div>
          <Link href="/recruiter/dashboard" className="relative z-10 inline-block">
            <Button className="bg-white text-black hover:bg-zinc-200 font-black rounded-2xl px-12 h-14 uppercase tracking-widest text-[10px] shadow-2xl shadow-white/5 transition-all active:scale-95">
              Initialize Campaign
            </Button>
          </Link>
        </div>
      ) : (
        <div className="group relative overflow-hidden bg-zinc-950/40 rounded-[48px] border border-zinc-900 shadow-[0_0_120px_rgba(0,0,0,0.6)] backdrop-blur-md">
          {/* Subtle Ambient Light Overlay */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/5 blur-[120px] pointer-events-none group-hover:bg-blue-600/10 transition-all duration-1000" />
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/40 border-b border-zinc-900 text-[10px] uppercase font-black tracking-[0.3em] text-zinc-600">
                  <th className="px-10 py-6">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                      Candidate Identity <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-8 py-6">Campaign Profile</th>
                  <th className="px-8 py-6">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                      Neural Score <Dna className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                  </th>
                  <th className="px-8 py-6">Intelligence Status</th>
                  <th className="px-8 py-6">Last Engagement</th>
                  <th className="px-10 py-6 text-right">Ops Control</th>
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
                  const scoreColor = score >= 85 ? 'text-emerald-400' : score >= 70 ? 'text-blue-400' : 'text-zinc-600';

                  // Determine Neural Rank (Badge)
                  const neuralRank = score >= 90 ? 'L5 Principal' : score >= 80 ? 'L4 Staff' : score >= 70 ? 'L3 Senior' : 'Candidate';

                  return (
                    <tr key={candidate.id} className="hover:bg-zinc-900/30 transition-all group/row relative">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-2xl transition-all group-hover/row:scale-110 italic ${
                            candidate.status === 'shortlisted' ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 shadow-inner'
                          }`}>
                            {applicantName[0]?.toUpperCase()}
                          </div>
                          <div className="space-y-1">
                            <div className="font-black text-white text-base group-hover/row:text-blue-400 transition-colors uppercase italic tracking-tighter">{applicantName}</div>
                            <div className="flex items-center gap-2">
                               <Badge variant="outline" className="text-[8px] font-black text-zinc-600 border-zinc-800 bg-zinc-900/50 uppercase tracking-widest px-2 h-4">{neuralRank}</Badge>
                               <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">ID-MATCH: {candidate.id.slice(0, 4)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-col gap-1.5">
                           <span className="inline-flex items-center gap-2 py-1 px-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[10px] font-black text-zinc-300 uppercase italic tracking-tight w-fit">
                              <Briefcase className="h-3 w-3 text-blue-500" /> {jobTitle}
                           </span>
                           <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em] ml-1">{new Date(candidate.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="space-y-2 min-w-[140px]">
                           <div className="flex items-center justify-between">
                              <span className={`text-sm font-black italic tracking-tighter ${scoreColor}`}>{score}% Efficiency</span>
                              <TrendingUp className={`h-3 w-3 ${scoreColor} opacity-40`} />
                           </div>
                           <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden shadow-inner p-[1.5px]">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ease-out h-[3px] ${score >= 85 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-blue-500'}`} 
                                style={{ width: `${score}%` }} 
                              />
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <Badge variant="outline" className={`font-black tracking-[0.2em] text-[9px] px-4 py-1.5 rounded-xl uppercase shadow-2xl transition-all ${
                          candidate.status === 'shortlisted' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-500/5' : 
                          candidate.status === 'rejected' ? 'text-red-400 border-red-400/20 bg-red-400/5' : 
                          'text-amber-500 border-amber-500/10 bg-amber-500/5'
                        }`}>
                          <div className={`h-1.5 w-1.5 rounded-full mr-2.5 animate-pulse ${
                            candidate.status === 'shortlisted' ? 'bg-emerald-400' : candidate.status === 'rejected' ? 'bg-red-400' : 'bg-amber-500'
                          }`} />
                          {candidate.status || 'Neural Processing'}
                        </Badge>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-col gap-1">
                           <span className="text-[10px] font-black text-zinc-300 uppercase italic flex items-center gap-2">
                             <Clock className="h-3 w-3 text-zinc-700" />
                             {new Date(candidate.created_at).toLocaleDateString()}
                           </span>
                           <div className="flex items-center gap-1">
                              <div className="h-1 w-1 rounded-full bg-zinc-800" />
                              <span className="text-[8px] font-bold text-zinc-700 tracking-[0.3em] uppercase">Intelligence Extraction v2</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3 translate-x-2 opacity-60 group-hover/row:opacity-100 transition-all">
                           <Button variant="outline" size="sm" className="h-10 w-10 p-0 bg-transparent border-zinc-900 hover:bg-zinc-900 transition-all rounded-xl shadow-xl">
                              <Mail className="h-4 w-4 text-zinc-500" />
                           </Button>
                           <Link href={`/recruiter/jobs/${jobId}`}>
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
                <span className="flex items-center gap-2 text-zinc-500"><Dna className="h-3 w-3" /> Extraction: {candidates.length} Profiles</span>
                <span className="h-px w-8 bg-zinc-900" />
                <span>Synchronized with Neural Core v4.0.1</span>
             </div>
             <div className="flex items-center gap-6">
                <button className="hover:text-white transition-colors disabled:opacity-20" disabled>Decrypt Previous</button>
                <div className="flex items-center gap-2">
                   <div className="h-8 w-8 rounded-lg bg-white text-black flex items-center justify-center font-black shadow-2xl">01</div>
                </div>
                <button className="hover:text-white transition-colors disabled:opacity-20" disabled>Next Sequence</button>
             </div>
          </div>
        </div>
      )}

      {/* ── Background Decal ──────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent pointer-events-none" />
      <div className="fixed top-0 right-0 p-32 opacity-[0.02] pointer-events-none rotate-12">
         <Dna className="h-[600px] w-[600px] text-white" />
      </div>

    </div>
  );
}
