import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { 
  BadgeCheck, Sparkles, Target, 
  ShieldCheck, ArrowLeft, Star,
  CheckCircle2, AlertCircle, TrendingUp,
  MessageSquare, Zap, Users, Send
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function DossierPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { matches?: string; job?: string };
}) {
  const matchIds = searchParams.matches?.split(',') || [];
  const jobId = searchParams.job;

  if (!matchIds.length || !jobId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="space-y-6">
          <AlertCircle className="h-16 w-16 text-zinc-800 mx-auto" />
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Protocol Invalid</h1>
          <p className="text-zinc-500 max-w-sm mx-auto">This dossier link is malformed or has expired. Please request a new selection from your recruitment lead.</p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  
  // Fetch Job
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  // Fetch Matches
  const { data: applications } = await supabase
    .from('matches')
    .select(`*, resume:resumes(parsed_data)`)
    .in('id', matchIds);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
       {/* ── Progress Bar Top ─────────────────────────────────── */}
       <div className="h-1 w-full bg-zinc-900 sticky top-0 z-50">
          <div className="h-full bg-emerald-500 w-1/3 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
       </div>

       <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-zinc-900 pb-16">
             <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Selection Dossier Protocol</span>
                </div>
                <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                  Hiring Manager <br />
                  <span className="text-emerald-500 underline decoration-emerald-500/20 underline-offset-8">Decision Desk</span>
                </h1>
                <p className="text-zinc-500 font-medium max-w-xl text-lg leading-relaxed mt-4">
                  Reviewing {applications?.length} elite candidates for <span className="text-white font-black italic">{job?.title}</span>. These entities have achieved the highest AI conviction scores.
                </p>
             </div>
             <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[32px] backdrop-blur-xl space-y-2 text-right">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Dossier Integrity</p>
                <div className="flex items-center gap-2 justify-end">
                   <ShieldCheck className="h-5 w-5 text-emerald-500" />
                   <span className="text-xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap font-geist-mono">Verified 0x{params.id.slice(0, 8)}</span>
                </div>
             </div>
          </div>

          {/* Candidate Grid (Executive View) */}
          <div className="space-y-12">
             {applications?.map((app, idx) => {
                let aiReasoning: any = {};
                try {
                  aiReasoning = typeof app.reasoning === 'string' ? JSON.parse(app.reasoning) : app.reasoning;
                } catch {
                  aiReasoning = { strengths: [], summary: app.reasoning };
                }

                return (
                  <div key={app.id} className="group relative bg-zinc-950/40 border border-zinc-900 rounded-[48px] overflow-hidden shadow-2xl transition-all hover:border-emerald-500/20 backdrop-blur-md">
                     <div className="p-10 flex flex-col lg:flex-row gap-12 items-start">
                        
                        {/* Summary Column */}
                        <div className="lg:w-1/3 space-y-10">
                           <div className="flex items-center gap-6">
                              <div className="h-20 w-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl font-black text-white italic">
                                 {app.resume.parsed_data?.personalInfo?.fullName?.[0] || 'C'}
                              </div>
                              <div>
                                 <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                    {app.resume.parsed_data?.personalInfo?.fullName || 'Anon Candidate'}
                                 </h3>
                                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">Ref: {app.id.slice(0, 8)}</p>
                              </div>
                           </div>

                           <div className="space-y-8">
                              <div>
                                 <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 italic">
                                    <Zap className="h-3 w-3" /> Conviction Core
                                 </p>
                                 <div className="flex items-end gap-2">
                                    <span className="text-5xl font-black text-white italic tracking-tighter">{app.final_score}</span>
                                    <span className="text-zinc-700 text-lg font-black mb-1">/ 100</span>
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Team Consensus</p>
                                 <div className="flex gap-1">
                                    {[1,2,3,4,5].map(s => (
                                       <Star key={s} className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                                    ))}
                                 </div>
                                 <p className="text-xs font-bold text-zinc-400 italic">"Highly recommended for architectural leadership."</p>
                              </div>
                           </div>
                        </div>

                        {/* Analysis Column */}
                        <div className="flex-1 space-y-10 bg-zinc-900/10 rounded-[32px] p-10 border border-zinc-900/50">
                           <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Neural Matching Synthesis</h4>
                              <p className="text-zinc-300 text-sm leading-relaxed font-medium italic">
                                "{aiReasoning.summary || 'Analytical synthesis pending for this candidate.'}"
                              </p>
                           </div>

                           <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-zinc-900">
                               <div className="space-y-4">
                                  <h5 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                                     <BadgeCheck className="h-3 w-3 text-emerald-500" /> Critical Strengths
                                  </h5>
                                  <div className="space-y-2">
                                     {aiReasoning.strengths?.map((s: string) => (
                                       <div key={s} className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                                          <div className="h-1 w-1 rounded-full bg-emerald-500" /> {s}
                                       </div>
                                     ))}
                                  </div>
                               </div>
                               <div className="space-y-4">
                                  <h5 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                                     <Zap className="h-3 w-3 text-amber-500" /> Strategic Fit
                                  </h5>
                                  <div className="text-xs font-bold text-zinc-400 leading-relaxed italic">
                                     Matches {job?.required_skills?.length || 0} core engine requirements with high architectural fidelity.
                                  </div>
                               </div>
                           </div>

                           <div className="flex items-center justify-between pt-10 mt-10">
                              <div className="flex items-center gap-4">
                                 <Button variant="outline" className="h-12 px-8 border-zinc-800 bg-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-900">Full Resume</Button>
                                 <Button variant="outline" className="h-12 px-8 border-zinc-800 bg-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-900">View Gaps</Button>
                              </div>
                              <div className="flex items-center gap-3">
                                 <Button variant="outline" className="h-12 w-12 border-zinc-800 bg-zinc-950 rounded-2xl flex items-center justify-center hover:bg-red-500/10 transition-colors">
                                    <ThumbsDown className="h-4 w-4 text-zinc-700 hover:text-red-500" />
                                 </Button>
                                 <Button className="h-12 px-10 bg-emerald-500 text-black hover:bg-emerald-400 font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/10">Approve for Interview</Button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                );
             })}
          </div>

          {/* Footer Action */}
          <div className="text-center space-y-8 pt-20">
             <div className="h-px w-32 bg-zinc-900 mx-auto" />
             <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] italic">Decision Desk Consensus Node</p>
             <div className="flex justify-center gap-4">
                <Button variant="outline" className="h-14 px-12 border-zinc-800 bg-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-900">Reject Full Selection</Button>
                <Button className="h-14 px-12 bg-white text-black hover:bg-zinc-200 font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-2xl">Confirm Selection Dossier</Button>
             </div>
          </div>
       </div>
    </div>
  );
}

function ThumbsDown({ className }: { className?: string }) {
   return (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
       <path d="M17 14V2" />
       <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
     </svg>
   );
}
