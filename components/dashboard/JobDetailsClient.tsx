'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ResumeUpload } from '@/components/dashboard/ResumeUpload';
import { RecruiterChat } from '@/components/dashboard/RecruiterChat';
import { updateApplicationStatus } from '@/app/actions/application';
import { addEvaluation, getEvaluations } from '@/app/actions/evaluation';
import { generateOutreach } from '@/app/actions/outreach';
import { createDossier } from '@/app/actions/dossier';
import { getInterviewGuidance } from '@/app/actions/interview';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  Star, MessageSquare, ListChecks, ThumbsUp, 
  ThumbsDown, TrendingUp, Info, Send,
  Mail, History, CheckCircle2, AlertCircle,
  ArrowUpRight, ArrowLeft, Sparkles, Eye,
  EyeOff, Zap, Users, Copy, Check,
  Target, ShieldCheck, FileJson, MapPin,
  Square, CheckSquare
} from 'lucide-react';

export function JobDetailsClient({ 
  job, 
  applications,
  id 
}: { 
  job: any; 
  applications: any[];
  id: string;
}) {
  const [isBlind, setIsBlind] = useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [evals, setEvals] = useState<Record<string, any[]>>({});
  const [activeTabs, setActiveTabs] = useState<Record<string, 'details' | 'interview' | 'team' | 'outreach'>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [newRating, setNewRating] = useState<Record<string, number>>({});
  const [outreachData, setOutreachData] = useState<Record<string, any>>({});
  const [outreachTone, setOutreachTone] = useState<Record<string, string>>({});
  const [interviewGuidance, setInterviewGuidance] = useState<Record<string, any[]>>({});
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();

  // Load evaluations locally for real-time feel
  useEffect(() => {
    async function loadEvals() {
      const data: Record<string, any[]> = {};
      for (const app of applications) {
        try {
          const e = await getEvaluations(app.id);
          data[app.id] = e;
        } catch (err) {
          console.error('Error fetching evals for', app.id, err);
        }
      }
      setEvals(data);
    }
    loadEvals();
  }, [applications]);

  const handleStatusUpdate = async (matchId: string, status: 'shortlisted' | 'rejected') => {
    startTransition(async () => {
      try {
        await updateApplicationStatus(matchId, status);
        router.refresh();
      } catch (error) {
        console.error('Failed to update status:', error);
      }
    });
  };

  const handleEvaluation = async (matchId: string) => {
    const rating = newRating[matchId] || 0;
    const content = newComment[matchId] || '';
    if (rating === 0) return;

    startTransition(async () => {
      try {
        await addEvaluation(matchId, rating, content);
        setNewComment({ ...newComment, [matchId]: '' });
        setNewRating({ ...newRating, [matchId]: 0 });
        const updatedEvals = await getEvaluations(matchId);
        setEvals({ ...evals, [matchId]: updatedEvals });
      } catch (error) {
        console.error('Evaluation failed:', error);
      }
    });
  };

  const handleGenerateOutreach = async (matchId: string) => {
    const tone = (outreachTone[matchId] || 'professional') as any;
    startTransition(async () => {
      try {
        const data = await generateOutreach(matchId, tone);
        setOutreachData({ ...outreachData, [matchId]: data });
      } catch (error) {
        console.error('Outreach generation failed:', error);
      }
    });
  };

  const handleShareDossier = async () => {
    if (selectedCandidates.size === 0) return;
    startTransition(async () => {
      try {
        const data = await createDossier(Array.from(selectedCandidates), id);
        copyToClipboard(`${window.location.origin}${data.url}`, 'dossier');
        alert(`Dossier Protocol Initialized!\n\nSelection Link copied to clipboard.\nPath: ${data.url}`);
      } catch (error) {
        console.error('Dossier creation failed:', error);
      }
    });
  };

  const handleFetchInterviewGuidance = async (matchId: string) => {
    startTransition(async () => {
      try {
        const guidance = await getInterviewGuidance(matchId);
        setInterviewGuidance({ ...interviewGuidance, [matchId]: guidance });
      } catch (error) {
        console.error('Failed to fetch interview guidance:', error);
      }
    });
  };

  const toggleCandidateSelection = (matchId: string) => {
    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(matchId)) {
      newSelected.delete(matchId);
    } else {
      newSelected.add(matchId);
    }
    setSelectedCandidates(newSelected);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-12 pb-20 px-4 max-w-7xl mx-auto">
      <Link href="/recruiter/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] group/link">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
        Force Return to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Hiring Campaign Analysis</span>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">
              {job.title} <span className="text-zinc-600 block text-sm not-italic mt-2 font-black tracking-widest">{id.slice(0, 8)} REGISTRY</span>
            </h1>
          </div>
          <p className="text-zinc-500 italic max-w-2xl leading-relaxed text-sm">
            {job.description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsBlind(!isBlind)}
            className="h-12 gap-2 border-zinc-900 bg-zinc-950 hover:bg-white hover:text-black transition-all rounded-2xl text-[10px] uppercase font-black tracking-widest"
          >
            {isBlind ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {isBlind ? 'Show Identities' : 'Blind Evaluation'}
          </Button>
          <Button variant="outline" className="h-12 border-zinc-900 bg-zinc-950 text-[10px] uppercase font-black tracking-widest rounded-2xl hover:bg-zinc-900">Manage Pipeline</Button>
        </div>
      </div>

      <div className="rounded-[40px] bg-zinc-950/20 border border-dashed border-zinc-900 p-2 overflow-hidden shadow-2xl">
        <ResumeUpload jobId={id} />
      </div>

      <div className="space-y-10">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-black text-white uppercase italic flex items-center gap-3 tracking-widest">
             <Sparkles className="h-4 w-4 text-amber-500" />
             Qualified Candidates <span className="text-zinc-700 not-italic">({applications?.length || 0})</span>
           </h2>
           <div className="flex items-center gap-4">
              <Button 
                size="sm" 
                variant="outline" 
                disabled={selectedCandidates.size === 0}
                onClick={handleShareDossier}
                className="h-10 border-zinc-800 bg-zinc-900/50 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 hover:text-black transition-all gap-2 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
              >
                 {copied === 'dossier' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <ShieldCheck className="h-3.5 w-3.5 text-zinc-500 group-hover/btn:text-black" />}
                 {selectedCandidates.size > 0 ? `Share Selection Dossier (${selectedCandidates.size})` : 'Share Selection Dossier'}
              </Button>
              <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
                <button className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-white bg-zinc-800 rounded-lg">Match Rank</button>
                <button className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors">Team Consensus</button>
              </div>
           </div>
        </div>
        
        <div className="space-y-12">
          {applications?.length === 0 ? (
            <div className="rounded-[40px] border border-dashed border-zinc-900 p-32 text-center bg-zinc-950/50 shadow-inner">
               <div className="h-20 w-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                 <History className="h-10 w-10 text-zinc-700" />
               </div>
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic">No entities have engaged with this campaign yet</p>
            </div>
          ) : (
            applications?.map((app) => {
              const tab = activeTabs[app.id] || 'details';
              const candidateEvals = evals[app.id] || [];
              const isSelected = selectedCandidates.has(app.id);
              const avgTeamRating = candidateEvals.length > 0 
                ? (candidateEvals.reduce((a, b) => a + (b.rating || 0), 0) / candidateEvals.length).toFixed(1)
                : 'PND';

              let aiReasoning: any = {};
              try {
                aiReasoning = typeof app.reasoning === 'string' ? JSON.parse(app.reasoning) : app.reasoning;
              } catch {
                aiReasoning = { recommendation: 'In Review', summary: app.reasoning };
              }

              return (
                <div key={app.id} className={cn(
                  "group relative bg-zinc-950/40 border rounded-[48px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] transition-all hover:border-zinc-800 backdrop-blur-md",
                  isSelected ? "border-emerald-500/30 bg-emerald-500/5" : "border-zinc-900"
                )}>
                  {/* Selection Checkbox (Absolute) */}
                  <button 
                    onClick={() => toggleCandidateSelection(app.id)}
                    className="absolute top-8 left-8 z-20 group/select transition-transform active:scale-95"
                  >
                     {isSelected ? (
                       <CheckSquare className="h-6 w-6 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                     ) : (
                       <Square className="h-6 w-6 text-zinc-800 group-hover/select:text-zinc-600 transition-colors" />
                     )}
                  </button>

                  {/* High Impact Summary Top Section */}
                  <div className="p-10 border-b border-zinc-900/50 ml-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-8 items-start">
                      <div className="flex items-center gap-8 flex-1">
                        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-3xl font-black text-white shadow-2xl transition-transform group-hover:scale-105 italic">
                          {isBlind ? 'Z-' + app.id.slice(0, 3).toUpperCase() : (app.resume.parsed_data?.personalInfo?.fullName?.[0] || 'C')}
                        </div>
                        <div className="space-y-2">
                           <div className="flex items-center gap-3">
                             <h3 className="font-black text-white text-3xl uppercase italic tracking-tighter decoration-emerald-500/20 group-hover:text-blue-500 transition-colors">
                               {isBlind ? 'ANON CANDIDATE - ' + app.id.slice(0, 4).toUpperCase() : (app.resume.parsed_data?.personalInfo?.fullName || 'ANON APPLICANT')}
                             </h3>
                             <Badge variant={app.final_score > 80 ? 'success' : 'warning'} className="rounded-xl px-4 font-black uppercase text-[9px] tracking-widest h-6 border-zinc-800 bg-zinc-950">
                                {app.final_score > 80 ? 'Elite' : 'Target'}
                             </Badge>
                           </div>
                           <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                              {!isBlind && (
                                <>
                                  <span className="flex items-center gap-2 bg-white/5 py-1.5 px-3 rounded-xl border border-white/5"><Mail className="h-3 w-3" /> {app.resume.parsed_data?.personalInfo?.email}</span>
                                  <span className="flex items-center gap-2 bg-white/5 py-1.5 px-3 rounded-xl border border-white/5"><History className="h-3 w-3" /> {app.resume.parsed_data?.experience?.length || 0} DEPLOYMENTS</span>
                                </>
                              )}
                              <span className={`flex items-center gap-2 py-1.5 px-3 rounded-xl border ${avgTeamRating != 'PND' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-zinc-900/50 border-zinc-800'}`}>
                                <Star className="h-3 w-3" /> TEAM RATIO: {avgTeamRating}/5
                              </span>
                           </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 lg:text-right">
                        <div>
                          <div className="text-6xl font-black text-white tracking-tighter italic bg-gradient-to-b from-white via-white to-zinc-700 bg-clip-text text-transparent">
                            {app.final_score}
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mt-1">AI CONVICTION</p>
                        </div>
                      </div>
                    </div>

                    {/* Dashboard Tabs for Candidate */}
                    <div className="flex flex-wrap items-center gap-1 mt-10 p-1 bg-zinc-900/40 rounded-2xl border border-zinc-900 w-fit">
                       {[
                         { id: 'details', label: 'Match Synthesis', icon: ListChecks },
                         { id: 'interview', label: 'Interview Guide', icon: Zap },
                         { id: 'team', label: 'Team Consensus', icon: Users },
                         { id: 'outreach', label: 'AI Outreach', icon: Send },
                       ].map((t) => (
                         <button 
                           key={t.id}
                           onClick={() => setActiveTabs({...activeTabs, [app.id]: t.id as any})}
                           className={cn(
                             "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                             tab === t.id ? "bg-white text-black shadow-xl" : "text-zinc-600 hover:text-white"
                           )}
                         >
                           <t.icon className="h-3.5 w-3.5" />
                           {t.label}
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Tab Content Section */}
                  <div className="p-10 min-h-[350px]">
                    {tab === 'details' && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                         <div className="space-y-8">
                           <div className="rounded-3xl bg-zinc-900/30 border border-zinc-900 p-8">
                              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 italic">
                                <TrendingUp className="h-3 w-3" /> Synthesis Summary
                              </p>
                              <p className="text-zinc-300 text-sm leading-relaxed italic font-medium">
                                "{aiReasoning.summary || app.reasoning}"
                              </p>
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Key Strengths
                                </h4>
                                <div className="space-y-2">
                                  {aiReasoning.strengths?.map((s: string, idx: number) => (
                                    <div key={idx} className="flex gap-2 text-zinc-400 text-xs font-bold transition-all hover:text-emerald-400"><CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" /> {s}</div>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" /> Neural Gaps
                                </h4>
                                <div className="space-y-2">
                                  {aiReasoning.gaps?.map((g: string, idx: number) => (
                                    <div key={idx} className="flex gap-2 text-zinc-400 text-xs font-bold transition-all hover:text-red-400"><AlertCircle className="h-3 w-3 text-red-500 shrink-0" /> {g}</div>
                                  ))}
                                </div>
                              </div>
                           </div>
                         </div>
                         <div className="rounded-[32px] bg-zinc-950/50 border border-zinc-900 p-8 flex flex-col justify-center text-center space-y-6">
                            <Info className="h-8 w-8 text-zinc-800 mx-auto" />
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
                              Matched against {job.required_skills?.length || 0} core engine requirements
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                               {job.required_skills?.slice(0, 5).map((s: string) => (
                                 <Badge key={s} variant="outline" className="text-[8px] font-black border-zinc-800 bg-zinc-900/50 text-zinc-600 uppercase tracking-widest">
                                   {s}
                                 </Badge>
                               ))}
                            </div>
                         </div>
                      </div>
                    )}

                    {tab === 'interview' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
                         <div className="flex flex-col md:flex-row gap-10 items-start">
                            <div className="w-full md:w-1/3 space-y-6">
                               <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-8 space-y-4 relative overflow-hidden">
                                  <Sparkles className="absolute -top-4 -right-4 h-24 w-24 text-blue-500/10" />
                                  <h4 className="text-lg font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                    Strategic <span className="text-blue-500">Prep</span>
                                  </h4>
                                  <p className="text-xs font-medium text-zinc-500 leading-relaxed">
                                    Targeting the core skill gaps identified by the Neural Engine. This guidance uses LLM-generated Success Vectors.
                                  </p>
                                  {!interviewGuidance[app.id] && (
                                    <Button 
                                      onClick={() => handleFetchInterviewGuidance(app.id)}
                                      disabled={isPending}
                                      className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl uppercase tracking-widest text-[9px] mt-4 shadow-xl shadow-blue-500/20"
                                    >
                                      {isPending ? 'Analyzing Vectors...' : 'Synthesize Success Vectors'}
                                    </Button>
                                  )}
                               </div>
                               <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
                                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 italic">
                                     <FileJson className="h-3 w-3" /> Intelligence Dossier
                                  </span>
                                  <p className="text-[10px] text-zinc-400 leading-relaxed">Download a comprehensive interview brief including architectural deep-dives for this candidate.</p>
                                  <Button variant="outline" className="w-full h-10 border-zinc-800 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-800">Generate PDF Brief</Button>
                               </div>
                            </div>
                            <div className="flex-1 space-y-8">
                               {interviewGuidance[app.id] ? (
                                 interviewGuidance[app.id].map((item: any, idx: number) => (
                                   <div key={idx} className="group/q space-y-4">
                                     <div className="rounded-2xl bg-zinc-900/20 border border-zinc-900/50 p-6 transition-all hover:bg-zinc-900/40 hover:border-blue-500/20">
                                       <div className="flex items-start gap-4">
                                          <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-[10px] text-zinc-500 group-hover/q:text-blue-400 group-hover/q:border-blue-500/20 transition-all italic">Q.{idx+1}</div>
                                          <div className="space-y-1.5 flex-1">
                                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Focusing on: <span className="text-blue-500 uppercase">{item.gap}</span></p>
                                            <p className="text-sm font-bold text-white italic tracking-tight underline decoration-blue-500/20 decoration-2 underline-offset-4">"{item.question}"</p>
                                          </div>
                                       </div>
                                     </div>
                                     <div className="ml-12 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 relative group/vec">
                                        <div className="absolute top-0 right-0 p-3">
                                           <Target className="h-4 w-4 text-emerald-500/20 group-hover/vec:text-emerald-500 transition-colors" />
                                        </div>
                                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3 italic">Success Vector (Perfect Resonance)</p>
                                        <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                                          {item.successVector}
                                        </p>
                                     </div>
                                   </div>
                                 ))
                               ) : (
                                 aiReasoning.gaps?.length > 0 ? (
                                   <div className="p-12 border border-zinc-900/50 border-dashed rounded-3xl text-center space-y-4">
                                      <Zap className="h-8 w-8 text-amber-500/20 mx-auto animate-pulse" />
                                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                        Found {aiReasoning.gaps.length} critical gaps. Initialize Success Vectors for strategic interviewing.
                                      </p>
                                      <Button 
                                        variant="outline" 
                                        onClick={() => handleFetchInterviewGuidance(app.id)}
                                        className="h-10 border-zinc-800 text-[9px] font-black uppercase tracking-widest"
                                      >
                                        Synthesize Now
                                      </Button>
                                   </div>
                                 ) : (
                                   <div className="p-12 border border-zinc-900/50 border-dashed rounded-3xl text-center space-y-3">
                                      <ThumbsUp className="h-8 w-8 text-emerald-500/20 mx-auto" />
                                      <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Candidate exceeds architectural requirements. Recommend cultural fit interview.</p>
                                   </div>
                                 )
                               )}
                            </div>
                         </div>
                      </div>
                    )}

                    {tab === 'outreach' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 grid md:grid-cols-12 gap-10">
                         <div className="md:col-span-4 space-y-6">
                            <div className="bg-zinc-900/20 border border-zinc-900 rounded-3xl p-8 space-y-6">
                               <h4 className="text-xs font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                                 <Send className="h-4 w-4 text-blue-500" /> Outreach <span className="text-blue-500">Protocol</span>
                               </h4>
                               <div className="space-y-4">
                                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Select Narrative Tone</p>
                                  <div className="grid grid-cols-1 gap-2">
                                     {[
                                       { id: 'professional', label: 'Enterprise/Pro', icon: ShieldCheck },
                                       { id: 'casual', label: 'Startup/Casual', icon: Users },
                                       { id: 'high_intensity', label: 'High Conviction', icon: Zap }
                                     ].map((t) => (
                                       <button 
                                         key={t.id}
                                         onClick={() => setOutreachTone({...outreachTone, [app.id]: t.id})}
                                         className={cn(
                                           "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                                           (outreachTone[app.id] || 'professional') === t.id 
                                            ? "bg-blue-600 border-blue-500 text-white shadow-xl" 
                                            : "bg-zinc-950 border-zinc-900 text-zinc-500 hover:border-zinc-800"
                                         )}
                                       >
                                          <div className="flex items-center gap-3">
                                             <t.icon className="h-4 w-4" />
                                             <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                                          </div>
                                          {(outreachTone[app.id] || 'professional') === t.id && <Check className="h-3 w-3" />}
                                       </button>
                                     ))}
                                  </div>
                               </div>
                               <Button 
                                 onClick={() => handleGenerateOutreach(app.id)}
                                 disabled={isPending}
                                 className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-2xl"
                               >
                                 {isPending ? 'Neural Processing...' : 'Synthesize Outreach'}
                               </Button>
                            </div>
                         </div>
                         <div className="md:col-span-8">
                            {outreachData[app.id] ? (
                              <div className="bg-zinc-900/10 border border-zinc-800 rounded-3xl p-8 space-y-6 relative overflow-hidden group/mail animate-in fade-in slide-in-from-right-5 duration-500">
                                 <div className="absolute top-0 right-0 p-6 opacity-0 group-hover/mail:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => copyToClipboard(`${outreachData[app.id].subject}\n\n${outreachData[app.id].body}`, app.id)}
                                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all"
                                    >
                                       {copied === app.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                       {copied === app.id ? 'Copied' : 'Copy Payload'}
                                    </button>
                                 </div>
                                 <div className="space-y-4">
                                    <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
                                       <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest w-16">Subject:</span>
                                       <span className="text-xs font-bold text-white italic">{outreachData[app.id].subject}</span>
                                    </div>
                                    <div className="space-y-2">
                                       <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block">Payload Content:</span>
                                       <p className="text-sm font-medium text-zinc-400 leading-relaxed italic border-l-2 border-blue-500/30 pl-6 py-2">
                                          {outreachData[app.id].body.split('\n').map((line: string, i: number) => (
                                            <React.Fragment key={i}>{line}<br /></React.Fragment>
                                          ))}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="pt-6 mt-6 border-t border-zinc-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                       <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Ready for deployment</span>
                                    </div>
                                    <p className="text-[8px] font-bold text-zinc-700 italic">Personalized via AI Conviction Vector v2.0</p>
                                 </div>
                              </div>
                            ) : (
                              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-[40px] p-20 text-center space-y-4 group/box">
                                 <Mail className="h-12 w-12 text-zinc-800 group-hover/box:text-blue-500 transition-all group-hover/box:scale-110" />
                                 <div className="space-y-1">
                                    <p className="text-xs font-black text-zinc-700 uppercase tracking-[0.2em]">Deployment Pipeline Offline</p>
                                    <p className="text-[10px] font-medium text-zinc-600 italic">Select a tone and synthesize to generate a personalized outreach dossier.</p>
                                 </div>
                              </div>
                            )}
                         </div>
                      </div>
                    )}

                    {tab === 'team' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 grid md:grid-cols-12 gap-12">
                         {/* Feed Column */}
                         <div className="md:col-span-8 flex flex-col h-[400px]">
                            <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                               {candidateEvals.length === 0 ? (
                                 <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <MessageSquare className="h-6 w-6 text-zinc-800" />
                                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic">Consensus Channel is currently silent</p>
                                 </div>
                               ) : (
                                 candidateEvals.map((evalItem) => (
                                   <div key={evalItem.id} className="rounded-3xl bg-zinc-900/10 border border-zinc-900 p-6 space-y-3">
                                      <div className="flex justify-between items-center">
                                         <div className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-lg bg-zinc-800 flex items-center justify-center text-[8px] font-black text-white italic uppercase">{evalItem.author?.full_name?.[0] || 'A'}</div>
                                            <span className="text-[10px] font-black text-white uppercase italic tracking-widest">{evalItem.author?.full_name || 'Agent'}</span>
                                            <span className="text-[9px] font-bold text-zinc-700 uppercase"> {new Date(evalItem.created_at).toLocaleDateString()}</span>
                                         </div>
                                         <div className="flex gap-0.5">
                                            {[1,2,3,4,5].map(s => (
                                              <Star key={s} className={cn("h-2.5 w-2.5", s <= evalItem.rating ? "text-amber-500 fill-amber-500" : "text-zinc-800")} />
                                            ))}
                                         </div>
                                      </div>
                                      <p className="text-zinc-400 text-xs font-medium leading-relaxed italic">"{evalItem.content}"</p>
                                   </div>
                                 ))
                               )}
                            </div>
                         </div>

                         {/* Submission Card */}
                         <div className="md:col-span-4 bg-zinc-950 border border-zinc-900 rounded-[32px] p-6 shadow-2xl relative overflow-hidden group/submit">
                            <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/5 blur-3xl" />
                            <h4 className="text-[10px] font-black text-white uppercase italic tracking-widest mb-6 border-b border-zinc-900 pb-4">Submit Evaluation</h4>
                            <div className="space-y-6">
                               <div className="space-y-2">
                                 <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Performance Score</p>
                                 <div className="flex gap-2 p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                   {[1,2,3,4,5].map(s => (
                                      <button 
                                        key={s} 
                                        onClick={() => setNewRating({...newRating, [app.id]: s})}
                                        className="transition-transform hover:scale-125"
                                      >
                                        <Star className={cn("h-5 w-5", s <= (newRating[app.id]||0) ? "text-amber-500 fill-amber-500" : "text-zinc-800 hover:text-zinc-700")} />
                                      </button>
                                   ))}
                                 </div>
                               </div>
                               <div className="space-y-2">
                                 <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Qualitative Critique</p>
                                 <textarea 
                                   value={newComment[app.id] || ''}
                                   onChange={e => setNewComment({...newComment, [app.id]: e.target.value})}
                                   placeholder="Add team insights..."
                                   className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all font-medium italic"
                                 />
                               </div>
                               <Button 
                                 onClick={() => handleEvaluation(app.id)}
                                 disabled={isPending || (newRating[app.id]||0) === 0}
                                 className="w-full bg-white text-black hover:bg-zinc-200 font-black rounded-2xl py-6 uppercase tracking-widest text-[9px] shadow-2xl"
                               >
                                 {isPending ? 'Logging data...' : 'Authorize Evaluation'}
                               </Button>
                            </div>
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Operation Control Footer */}
                  <div className="bg-zinc-900/20 px-10 py-8 flex items-center justify-between border-t border-zinc-900/50">
                     <div className="flex items-center gap-4">
                        <Button 
                          variant="ghost" 
                          className="h-10 px-6 gap-2 text-zinc-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest bg-zinc-900/40 rounded-xl"
                          onClick={() => {
                            const url = createClient().storage.from('resumes').getPublicUrl(app.resume.file_url).data.publicUrl;
                            window.open(url, '_blank');
                          }}
                        >
                          Raw Resume Data <ArrowUpRight className="h-3 w-3" />
                        </Button>
                     </div>
                     <div className="flex items-center gap-3">
                        <Button 
                          size="md" 
                          variant="destructive" 
                          disabled={isPending || app.status === 'rejected'}
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                          className="h-12 px-10 bg-red-500/5 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                        >
                          Reject Agent
                        </Button>
                        <Button 
                          size="md" 
                          variant="success" 
                          disabled={isPending || app.status === 'shortlisted'}
                          onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                          className="h-12 px-10 bg-emerald-500 text-black hover:bg-emerald-400 transition-all duration-300 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/10"
                        >
                          Shortlist for Interview
                        </Button>
                     </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <RecruiterChat jobId={id} />
    </div>
  );
}
