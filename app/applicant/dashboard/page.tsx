import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Briefcase, FileText, CheckCircle, ArrowLeft, LogOut, Target, Activity, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { signOut } from '@/app/actions/auth';
import { OverviewCards } from '@/components/dashboard/OverviewCards';

export default async function ApplicantPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: applications, error: queryError } = await supabase
    .from('matches')
    .select(`
      *,
      job:jobs (title, job_type),
      resume:resumes (*)
    `)
    .order('created_at', { ascending: false });

  const totalApps = applications?.length || 0;
  const shortlistedApps = applications?.filter(a => a.status === 'shortlisted').length || 0;
  const pendingApps = applications?.filter(a => a.status === 'pending' || !a.status).length || 0;
  
  const avgScore = totalApps > 0 
    ? Math.round((applications?.reduce((acc, a) => acc + (a.final_score || 0), 0) || 0) / totalApps)
    : 0;

  const stats = [
    { label: 'Total Applications', value: totalApps, icon: Briefcase, color: 'text-blue-500' },
    { label: 'Avg Match Score', value: `${avgScore}%`, icon: Target, color: 'text-purple-500' },
    { label: 'Shortlisted', value: shortlistedApps, icon: CheckCircle, color: 'text-emerald-500' },
    { label: 'Pending Reviews', value: pendingApps, icon: Clock, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group/link">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
        Back to Home
      </Link>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white font-geist-sans uppercase italic">Overview</h1>
          <p className="text-zinc-500 font-medium tracking-wide">Tracking {totalApps} total applications.</p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="outline" className="gap-2 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-all font-bold text-xs uppercase tracking-widest text-zinc-400 hover:text-white">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>

      <OverviewCards stats={stats} />

      {queryError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest text-center">
          Failed to load applications: {queryError.message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
         {/* Applications List */}
         <Card className="col-span-4 bg-zinc-950/50 border-zinc-900 overflow-hidden">
          <CardHeader className="border-b border-zinc-900 bg-zinc-900/20">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
               <Briefcase className="h-5 w-5 text-zinc-500" />
               Your Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-900">
               {(!applications || applications.length === 0) ? (
                 <div className="p-12 text-center">
                   <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-800">
                     <FileText className="h-5 w-5 text-zinc-600" />
                   </div>
                   <p className="text-sm text-zinc-500">No applications yet.</p>
                   <Link href="/applicant/jobs">
                     <Button variant="outline" className="mt-6 rounded-xl border-zinc-800 text-xs tracking-wide">Browse Jobs</Button>
                   </Link>
                 </div>
               ) : (
                 applications.map(app => (
                   <div key={app.id} className="flex items-center justify-between p-6 hover:bg-zinc-900/30 transition-colors group">
                     <div>
                       <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{app.job?.title || 'Unknown Job'}</h4>
                       <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                         <span>{app.job?.job_type || 'Role'}</span>
                         <span className="text-zinc-800">•</span>
                         <span>Applied {new Date(app.created_at).toLocaleDateString()}</span>
                       </p>
                     </div>
                     <div className="flex items-center gap-6">
                       <Badge variant="outline" className={`bg-zinc-900 border-zinc-800 font-bold tracking-widest text-[10px] px-3 py-1 ${
                         app.status === 'shortlisted' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 
                         app.status === 'rejected' ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                       }`}>
                         {app.status ? app.status.toUpperCase() : 'UNDER REVIEW'}
                       </Badge>
                       <div className="text-right">
                         <div className="text-2xl font-black bg-gradient-to-br from-white to-zinc-600 bg-clip-text text-transparent">{app.final_score}%</div>
                       </div>
                     </div>
                   </div>
                 ))
               )}
            </div>
          </CardContent>
         </Card>

         {/* AI Activity / Insights side panel */}
         <Card className="col-span-3 bg-zinc-950/50 border-zinc-900 overflow-hidden">
          <CardHeader className="border-b border-zinc-900 bg-zinc-900/20">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
               <Activity className="h-5 w-5 text-amber-500" />
               AI Match Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-900">
              {(!applications || applications.length === 0) ? (
                <div className="p-12 text-center">
                  <p className="text-sm text-zinc-500 italic">Apply to a job to see detailed AI insights here.</p>
                </div>
              ) : (
                applications.slice(0, 5).map(app => {
                  let aiReasoning: any = {};
                  try { aiReasoning = JSON.parse(app.reasoning); } catch {}
                  return (
                    <div key={app.id} className="p-6 space-y-3 hover:bg-zinc-900/10 transition-colors">
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-white truncate pr-4">
                           {app.job?.title || 'Role'}
                         </span>
                         {aiReasoning?.recommendation && (
                           <Badge variant="outline" className="shrink-0 text-[10px] bg-zinc-900 border-zinc-800 font-bold uppercase tracking-widest text-emerald-400">
                             {aiReasoning.recommendation}
                           </Badge>
                         )}
                      </div>
                      {(aiReasoning?.strengths?.length > 0) && (
                         <div>
                           <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1 tracking-widest">Core Strength</div>
                           <p className="text-xs text-zinc-300 flex items-start gap-1.5 line-clamp-2">
                             <Sparkles className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                             {aiReasoning.strengths[0]}
                           </p>
                         </div>
                      )}
                      {(aiReasoning?.gaps?.length > 0) && (
                         <div className="mt-3 text-xs text-zinc-500 border-t border-zinc-800/50 pt-3 flex gap-2">
                           <span className="text-[10px] uppercase font-bold tracking-widest shrink-0 text-red-500/70">Gap:</span>
                           <span className="line-clamp-1 italic">{aiReasoning.gaps[0]}</span>
                         </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
         </Card>
      </div>
    </div>
  );
}
