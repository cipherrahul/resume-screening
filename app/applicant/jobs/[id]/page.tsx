import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Building2, MapPin, Clock, Briefcase, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { ResumeUpload } from '@/components/dashboard/ResumeUpload';

export default async function ApplicantJobApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (!job) notFound();

  // Check if they already applied
  const { data: { user } } = await supabase.auth.getUser();
  const { data: existingApp } = await supabase
    .from('resumes')
    .select('id')
    .eq('applicant_id', user?.id)
    .limit(1)
    .single();

  let hasMatch = false;
  if (existingApp?.id) {
    const { count } = await supabase
      .from('matches')
      .select('id', { count: 'exact' })
      .eq('job_id', id)
      .eq('resume_id', existingApp.id);
    
    if (count && count > 0) hasMatch = true;
  }

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto pt-8 px-4">
      <Link href="/applicant/jobs" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest group">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Job Board
      </Link>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white font-geist-sans uppercase italic mb-2">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
             <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> Corporate</span>
             <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Remote</span>
             <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
             <Badge variant={job.is_active ? 'success' : 'default'} className="tracking-widest rounded-lg px-2 text-[10px]">
               {job.is_active ? 'Accepting Applications' : 'Closed'}
             </Badge>
          </div>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-zinc-300 leading-relaxed font-medium">
            {job.description}
          </p>
        </div>

        {job.required_skills && job.required_skills.length > 0 && (
          <div className="pt-4 border-t border-zinc-900">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
               <Briefcase className="h-4 w-4" />
               Required Qualifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.required_skills.map((skill: string) => (
                <Badge key={skill} variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px] lowercase tracking-wide px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 pt-12 border-t border-zinc-900">
        <h2 className="text-2xl font-black text-white uppercase italic mb-6 tracking-tight flex items-center gap-3">
           <FileText className="h-6 w-6 text-blue-500" />
           Submit Application
        </h2>
        
        {hasMatch ? (
           <Card className="bg-emerald-500/10 border-emerald-500/20 max-w-xl">
             <CardContent className="p-8 text-center space-y-3">
               <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                 <CheckCircle className="h-6 w-6 text-emerald-400" />
               </div>
               <h3 className="text-lg font-bold text-emerald-400">Application Received</h3>
               <p className="text-emerald-500/80 text-sm">You have successfully applied to this position. Track your matching status from your dashboard.</p>
               <Link href="/applicant/dashboard">
                 <Button variant="outline" className="mt-4 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20">Return to Dashboard</Button>
               </Link>
             </CardContent>
           </Card>
        ) : job.is_active ? (
          <div className="bg-zinc-950/50 p-1 rounded-2xl border border-zinc-800 backdrop-blur-xl">
            <ResumeUpload jobId={job.id} />
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold uppercase tracking-widest">
            This position is no longer accepting new applications.
          </div>
        )}
      </div>
    </div>
  );
}
