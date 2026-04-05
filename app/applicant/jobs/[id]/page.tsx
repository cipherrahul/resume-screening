import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft, Building2, MapPin, Clock, 
  Briefcase, FileText, CheckCircle, 
  ChevronRight, Sparkles, Zap, ShieldCheck,
  Target, LayoutDashboard, Globe2, AlertCircle,
  Timer, Users, Star
} from 'lucide-react';
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

  const timelineSteps = [
    { label: 'Application', status: hasMatch ? 'complete' : 'current', icon: FileText, desc: 'Submit your AI-ready resume' },
    { label: 'AI Screening', status: hasMatch ? 'current' : 'pending', icon: Zap, desc: 'Matching profiles with job requirements' },
    { label: 'Recruiter Review', status: 'pending', icon: UserCheck, desc: 'Human assessment and shortlisting' },
    { label: 'Interview', status: 'pending', icon: Users, desc: 'Connect with the hiring team' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pb-24 relative overflow-hidden">
      
      {/* ── Ambient Background ────────────────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-10">
        
        {/* ── Navbar ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/applicant/jobs" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Opportunities
          </Link>
          <div className="flex items-center gap-4">
             <Badge variant="outline" className="bg-zinc-950 border-zinc-800 text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
               {job.job_type || 'Full-time'}
             </Badge>
          </div>
        </div>

        {/* ── Main Layout (Grid) ──────────────────────────────────── */}
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Column: Job Description */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                   <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                   <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Live Opening</span>
                </div>
                <h1 className="text-5xl font-black tracking-tight text-white font-geist-sans uppercase italic leading-[0.9]">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-6 pt-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                   <span className="flex items-center gap-2"><Building2 className="h-4 w-4 text-zinc-700" /> Corporate Partner</span>
                   <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-zinc-700" /> Global Remote</span>
                   <span className="flex items-center gap-2"><Timer className="h-4 w-4 text-zinc-700" /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-400 leading-[1.8] text-base">
                  {job.description}
                </p>
              </div>

              {job.required_skills && job.required_skills.length > 0 && (
                <div className="pt-8 border-t border-zinc-900 flex flex-col gap-6">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2 italic">
                       <Target className="h-4 w-4 text-zinc-600" />
                       Experience Profile
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills.map((skill: string) => (
                        <Badge key={skill} variant="outline" className="bg-zinc-900/50 border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 transition-all hover:border-zinc-500 hover:text-white cursor-default">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                     <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Industry</span>
                        <span className="text-xs font-bold text-zinc-300">Technology & SaaS</span>
                     </div>
                     <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Salary Range</span>
                        <span className="text-xs font-bold text-zinc-300">Competitive (Market Rate)</span>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Application Process */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Recruitment Roadmap */}
            <Card className="bg-zinc-950 border-zinc-900 overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <LayoutDashboard className="h-32 w-32 -rotate-12" />
              </div>
              <CardHeader className="border-b border-zinc-900 p-6">
                <CardTitle className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Hiring Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="relative space-y-8">
                   {/* Vertical Line */}
                   <div className="absolute left-[15px] top-2 bottom-2 w-px bg-zinc-800" />
                   
                   {timelineSteps.map((step, idx) => (
                     <div key={idx} className="relative flex items-start gap-6 group">
                        <div className={`mt-1 h-8 w-8 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500 ${
                          step.status === 'complete' ? 'bg-blue-600 border-blue-600 text-white' :
                          step.status === 'current' ? 'bg-zinc-950 border-blue-600 text-blue-500 animate-pulse ring-4 ring-blue-600/10' :
                          'bg-zinc-950 border-zinc-800 text-zinc-700'
                        }`}>
                           {step.status === 'complete' ? <CheckCircle className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                        </div>
                        <div className="space-y-1">
                           <h4 className={`text-xs font-bold uppercase tracking-widest ${
                             step.status === 'pending' ? 'text-zinc-700' : 'text-zinc-200'
                           }`}>{step.label}</h4>
                           <p className="text-[10px] font-medium text-zinc-600 leading-relaxed max-w-[200px]">
                             {step.desc}
                           </p>
                        </div>
                     </div>
                   ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Fit Logic / Submit Bar */}
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-blue-600/5 border border-blue-600/10 flex items-start gap-4 shadow-xl shadow-blue-600/5 transition-all hover:bg-blue-600/10">
                 <Sparkles className="h-6 w-6 text-blue-500 shrink-0 mt-1" />
                 <div>
                    <h3 className="text-sm font-bold text-white uppercase italic mb-1">AI Recommendation</h3>
                    <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                      Our system analyzes your core competencies across 50+ data points to ensure you meet the institutional quality standards for this role.
                    </p>
                 </div>
              </div>

              <div className="pt-4 mt-8">
                {hasMatch ? (
                   <div className="rounded-[32px] bg-emerald-500/5 border border-emerald-500/10 p-8 text-center space-y-4 shadow-2xl backdrop-blur-md">
                     <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2 shadow-inner">
                       <CheckCircle className="h-8 w-8 text-emerald-400" />
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Applied Successfully</h3>
                        <p className="text-emerald-500/60 text-xs font-bold uppercase tracking-widest leading-none">Awaiting AI Match Result</p>
                     </div>
                     <Link href="/applicant/dashboard" className="block pt-4">
                       <Button className="w-full bg-white text-black hover:bg-zinc-200 font-black rounded-2xl py-6 uppercase tracking-widest text-[10px] shadow-xl">
                         Return to Dashboard
                       </Button>
                     </Link>
                   </div>
                ) : job.is_active ? (
                  <div className="space-y-6">
                    <h2 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                       <FileText className="h-5 w-5 text-blue-500" />
                       Submit AI Resume
                    </h2>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-1 overflow-hidden transition-all hover:border-zinc-700 shadow-2xl">
                      <ResumeUpload jobId={job.id} />
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center rounded-[32px] bg-red-500/5 border border-red-500/10 text-red-500 flex flex-col items-center gap-3">
                    <AlertCircle className="h-10 w-10 opacity-50" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Application Window Closed</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile Only (Conditional) */}
      {!hasMatch && job.is_active && (
        <div className="fixed bottom-0 left-0 right-0 p-4 pt-0 bg-gradient-to-t from-zinc-950 to-transparent lg:hidden z-50">
           <Button className="w-full bg-white text-black font-black py-4 rounded-xl shadow-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-2">
             Start Application <ChevronRight className="h-4 w-4" />
           </Button>
        </div>
      )}
    </div>
  );
}

// Support for legacy icons or custom icons if needed 
function UserCheck({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}
