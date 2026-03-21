'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ResumeUpload } from '@/components/dashboard/ResumeUpload';
import { Mail, MapPin, EyeOff, Eye, AlertCircle, CheckCircle2, History, Sparkles, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RecruiterChat } from '@/components/dashboard/RecruiterChat';
import { updateApplicationStatus } from '@/app/actions/application';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('realtime:matches')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'matches', filter: `job_id=eq.${id}` }, 
        () => {
          router.refresh();
        }
      )
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [id, router]);

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

  return (
    <div className="space-y-8 pb-20">
      <Link href="/recruiter/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group/link">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white font-geist-sans tracking-tight">{job.title}</h1>
            <Badge variant={job.is_active ? 'success' : 'default'}>
              {job.is_active ? 'Active' : 'Closed'}
            </Badge>
          </div>
          <p className="text-zinc-500 italic max-w-2xl line-clamp-2">
            {job.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsBlind(!isBlind)}
            className="gap-2 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm"
          >
            {isBlind ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {isBlind ? 'Show PII' : 'Blind Screening'}
          </Button>
          <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">Edit Job</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-1 backdrop-blur-xl">
        <ResumeUpload jobId={id} />
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Screened Candidates ({applications?.length || 0})
        </h2>
        
        <div className="grid gap-6">
          {applications?.length === 0 ? (
            <Card className="bg-zinc-950/50 border-zinc-900">
              <CardContent className="p-12 text-center">
                 <p className="text-sm text-zinc-500">No candidates have applied yet.</p>
              </CardContent>
            </Card>
          ) : (
            applications?.map((app) => {
              const candidateSkills = app.resume.parsed_data?.skills || [];
              const jobSkills = job.required_skills || [];
              const missingSkills = jobSkills.filter((s: string) => 
                !candidateSkills.map((cs: string) => cs.toLowerCase()).includes(s.toLowerCase())
              );

              let aiReasoning: any = {};
              try {
                aiReasoning = JSON.parse(app.reasoning);
              } catch {
                aiReasoning = {
                  recommendation: app.final_score > 80 ? 'Strong Fit' : app.final_score > 50 ? 'Moderate Fit' : 'Not Fit',
                  strengths: [],
                  gaps: [],
                  summary: app.reasoning || "Analyzing candidate's experience against job requirements..."
                };
              }

              return (
                <Card key={app.id} className="group relative overflow-hidden bg-zinc-950/50 border-zinc-900 hover:border-zinc-700 transition-all duration-300 backdrop-blur-md">
                  <div className="absolute top-0 right-0 p-6">
                    <div className="text-right">
                      <div className="text-4xl font-black bg-gradient-to-br from-white via-white to-zinc-800 bg-clip-text text-transparent">
                        {app.final_score}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold mt-1">AI MATCH SCORE</div>
                    </div>
                  </div>

                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                       <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                          {isBlind ? '?' : (app.resume.parsed_data?.personalInfo?.fullName?.[0] || 'C')}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-white text-xl tracking-tight">
                              {isBlind ? 'Candidate ' + app.id.slice(0, 4) : (app.resume.parsed_data?.personalInfo?.fullName || 'Anonymous Candidate')}
                            </h3>
                            <Badge variant={app.final_score > 80 ? 'success' : app.final_score > 50 ? 'warning' : 'error'} className="rounded-lg px-2">
                              {app.final_score > 80 ? 'Top Tier' : app.final_score > 50 ? 'Potential' : 'Unlikely'}
                            </Badge>
                          </div>
                          
                          {!isBlind && (
                            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                              <span className="flex items-center gap-1.5 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800/50">
                                <Mail className="h-3.5 w-3.5" /> {app.resume.parsed_data?.personalInfo?.email || 'N/A'}
                              </span>
                              <span className="flex items-center gap-1.5 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800/50">
                                <MapPin className="h-3.5 w-3.5" /> {app.resume.parsed_data?.personalInfo?.location || 'Remote'}
                              </span>
                              <span className="flex items-center gap-1.5 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800/50">
                                <History className="h-3.5 w-3.5" /> {app.resume.parsed_data?.experience?.length || 0} roles
                              </span>
                            </div>
                          )}
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/50 p-6 backdrop-blur-sm">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                               <Sparkles className="h-3 w-3 text-amber-500" />
                               AI Recommendation
                            </p>
                            {aiReasoning.recommendation && (
                              <Badge variant={aiReasoning.recommendation === 'Strong Fit' ? 'success' : aiReasoning.recommendation === 'Moderate Fit' ? 'warning' : 'error'}>
                                {aiReasoning.recommendation}
                              </Badge>
                            )}
                          </div>
                          
                          {aiReasoning.summary && (
                            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                              {aiReasoning.summary}
                            </p>
                          )}

                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Key Strengths</h4>
                              <ul className="space-y-2">
                                {aiReasoning.strengths?.length > 0 ? (
                                  aiReasoning.strengths.map((s: string, i: number) => (
                                    <li key={i} className="text-sm text-emerald-400 flex gap-2 items-start leading-snug"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /><span>{s}</span></li>
                                  ))
                                ) : (
                                  <li className="text-sm text-zinc-500 italic">No significant strengths found</li>
                                )}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Key Gaps</h4>
                              <ul className="space-y-2">
                                {aiReasoning.gaps?.length > 0 ? (
                                  aiReasoning.gaps.map((g: string, i: number) => (
                                    <li key={i} className="text-sm text-red-400 flex gap-2 items-start leading-snug"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{g}</span></li>
                                  ))
                                ) : (
                                  <li className="text-sm text-zinc-500 italic">No significant gaps found</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/50 p-6 backdrop-blur-sm">
                          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Candidate Summary</p>
                          <p className="text-sm text-zinc-400 italic leading-relaxed">
                            {app.resume.parsed_data?.summary || 'No summary available.'}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/50 p-6 backdrop-blur-sm">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Skills Gap Analysis</p>
                        <div className="flex flex-wrap gap-2">
                          {jobSkills.map((skill: string) => {
                            const hasSkill = !missingSkills.includes(skill);
                            return (
                              <span 
                                key={skill} 
                                className={cn(
                                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] border transition-all duration-300",
                                  hasSkill 
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                )}
                              >
                                {hasSkill ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-zinc-800 bg-zinc-900/50 rounded-xl px-6"
                        onClick={() => {
                          const url = createClient().storage.from('resumes').getPublicUrl(app.resume.file_url).data.publicUrl;
                          window.open(url, '_blank');
                        }}
                      >
                        View Resume
                      </Button>
                      <div className="flex-1" />
                      <Button 
                        size="md" 
                        variant="success" 
                        disabled={isPending || app.status === 'shortlisted'}
                        onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                        className="bg-emerald-600 border-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 px-8 disabled:opacity-50"
                      >
                        {isPending ? 'Updating...' : app.status === 'shortlisted' ? 'Shortlisted' : 'Shortlist'}
                      </Button>
                      <Button 
                        size="md" 
                        variant="destructive" 
                        disabled={isPending || app.status === 'rejected'}
                        onClick={() => handleStatusUpdate(app.id, 'rejected')}
                        className="bg-red-600/10 text-red-400 border-red-900/50 rounded-xl hover:bg-red-600 hover:text-white px-8 disabled:opacity-50"
                      >
                        {isPending ? '...' : app.status === 'rejected' ? 'Rejected' : 'Reject'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
      <RecruiterChat jobId={id} />
    </div>
  );
}
