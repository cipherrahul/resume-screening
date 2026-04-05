import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Sparkles, Star, TrendingUp, CheckCircle2, 
  AlertCircle, ShieldCheck, Mail, History 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function DossierPage({ params }: { params: { token: string } }) {
  const { token } = await params;
  const supabase = await createClient();

  // Fetch dossier
  const { data: dossier } = await supabase
    .from('dossiers')
    .select(`
      *,
      job:jobs(title, description, required_skills),
      recruiter:profiles!dossiers_created_by_fkey(full_name, company_name)
    `)
    .eq('share_token', token)
    .single();

  if (!dossier) notFound();

  // Fetch matches
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      resume:resumes(parsed_data, file_url)
    `)
    .in('id', dossier.match_ids)
    .order('final_score', { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-20 font-sans selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="space-y-6 border-b border-zinc-900 pb-12">
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Selection Dossier Protocol</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
              {dossier.job.title}
            </h1>
            <p className="text-zinc-500 text-sm font-black uppercase tracking-widest italic">
              Curated for {dossier.recruiter.company_name} by {dossier.recruiter.full_name}
            </p>
          </div>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl font-medium italic">
            "{dossier.job.description.split('.')[0]}."
          </p>
        </div>

        {/* Candidate List */}
        <div className="space-y-12">
           <h2 className="text-xl font-black uppercase italic tracking-[0.2em] flex items-center gap-4 text-zinc-500">
             <Sparkles className="h-5 w-5 text-amber-500" />
             Primary Targets <span className="text-zinc-800">({matches?.length || 0})</span>
           </h2>

           <div className="grid gap-10">
             {matches?.map((match) => {
               const reasoning = typeof match.reasoning === 'string' ? JSON.parse(match.reasoning) : match.reasoning;
               const name = match.resume.parsed_data?.personalInfo?.fullName || 'Anonymous Candidate';
               
               return (
                 <div key={match.id} className="group relative bg-zinc-950/50 border border-zinc-900 rounded-[48px] overflow-hidden hover:border-zinc-700 transition-all duration-500 backdrop-blur-xl">
                    <div className="p-12">
                      <div className="flex flex-col lg:flex-row justify-between gap-10 items-start">
                        <div className="flex items-center gap-8">
                           <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-3xl font-black italic">
                             {name[0]}
                           </div>
                           <div className="space-y-3">
                              <div className="flex items-center gap-4">
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter group-hover:text-blue-500 transition-colors">
                                  {name}
                                </h3>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg">
                                  Top Match
                                </Badge>
                              </div>
                              <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                <span className="flex items-center gap-2"><History className="h-3 w-3" /> {match.resume.parsed_data?.experience?.length || 0} Deployments</span>
                                <span className="flex items-center gap-2"><ShieldCheck className="h-3 w-3" /> AI Validated</span>
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Neural Rank</p>
                           <span className="text-6xl font-black italic tracking-tighter bg-gradient-to-b from-white to-zinc-800 bg-clip-text text-transparent">
                             {match.final_score}
                           </span>
                        </div>
                      </div>

                      <div className="mt-12 grid md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                           <div className="rounded-3xl bg-zinc-900/30 border border-zinc-900 p-8 space-y-4">
                              <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                                <TrendingUp className="h-3 w-3" /> Strategic Analysis
                              </p>
                              <p className="text-zinc-300 text-sm leading-relaxed italic font-medium">
                                "{reasoning.summary || match.reasoning}"
                              </p>
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="grid grid-cols-1 gap-6">
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                  <div className="h-1 w-1 rounded-full bg-emerald-500" /> Core Strengths
                                </h4>
                                <div className="space-y-2">
                                  {reasoning.strengths?.map((s: string, i: number) => (
                                    <div key={i} className="flex gap-2 text-zinc-400 text-xs font-bold italic"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {s}</div>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                  <div className="h-1 w-1 rounded-full bg-red-500" /> Primary Gaps
                                </h4>
                                <div className="space-y-2">
                                  {reasoning.gaps?.map((g: string, i: number) => (
                                    <div key={i} className="flex gap-2 text-zinc-400 text-xs font-bold italic"><AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" /> {g}</div>
                                  ))}
                                </div>
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Skills Grid Decor */}
                    <div className="bg-zinc-900/10 border-t border-zinc-900/50 p-10 flex flex-wrap gap-2">
                       {match.resume.parsed_data?.skills?.slice(0, 8).map((skill: string) => (
                         <div key={skill} className="px-3 py-1.5 rounded-lg border border-zinc-900 bg-zinc-950 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                           {skill}
                         </div>
                       ))}
                    </div>
                 </div>
               );
             })}
           </div>
        </div>

        {/* Footer */}
        <div className="pt-20 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8 opacity-50">
           <div className="flex items-center gap-4">
             <div className="h-6 w-6 rounded bg-white" />
             <span className="text-[10px] font-black uppercase tracking-widest">RK Core Intelligence</span>
           </div>
           <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.3em] overflow-hidden">
             <span>Protocol v4.0.1</span>
             <span>Secure Share Ready</span>
             <span>AI Verified Pipeline</span>
           </div>
        </div>
      </div>
    </div>
  );
}
