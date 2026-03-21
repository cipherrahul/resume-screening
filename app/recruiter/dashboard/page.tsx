import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Plus, Briefcase, Users, FileText, CheckCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('created_by', user?.id)
    .order('created_at', { ascending: false });

  // Fetch real counts
  const jobIds = jobs?.map(j => j.id) || [];
  
  const { count: activeJobsCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('created_by', user?.id)
    .eq('is_active', true);

  const { count: totalCandidates } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .in('job_id', jobIds);

  const { count: shortlistedCount } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .in('job_id', jobIds)
    .eq('status', 'shortlisted');

  const { count: pendingCount } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .in('job_id', jobIds)
    .eq('status', 'pending');

  const stats = [
    { label: 'Active Jobs', value: activeJobsCount || 0, icon: Briefcase, color: 'text-blue-500' },
    { label: 'Total Candidates', value: totalCandidates || 0, icon: Users, color: 'text-purple-500' },
    { label: 'Shortlisted', value: shortlistedCount || 0, icon: CheckCircle, color: 'text-emerald-500' },
    { label: 'Pending Reviews', value: pendingCount || 0, icon: FileText, color: 'text-amber-500' },
  ];

  const { data: recentActivity } = await supabase
    .from('matches')
    .select(`
      *,
      job:jobs (title),
      resume:resumes (
        parsed_data
      )
    `)
    .in('job_id', jobIds)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8 pb-10">
      <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group/link">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
        Back to Home
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white font-geist-sans uppercase italic">Overview</h1>
          <p className="text-zinc-500 font-medium">Monitoring {jobs?.length || 0} active job campaigns.</p>
        </div>
        <Link href="/recruiter/jobs/new">
          <Button className="gap-2 bg-white text-black hover:bg-zinc-200 px-6 py-6 rounded-2xl font-bold shadow-xl shadow-white/5 transition-all">
            <Plus className="h-5 w-5" />
            Launch New Job
          </Button>
        </Link>
      </div>

      <OverviewCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-zinc-950/50 border-zinc-900 overflow-hidden">
          <CardHeader className="border-b border-zinc-900 bg-zinc-900/20">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
               <Briefcase className="h-5 w-5 text-zinc-500" />
               Your Job Postings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-900">
              {jobs?.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-sm text-zinc-500">No jobs posted yet.</p>
                </div>
              ) : (
                jobs?.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-6 hover:bg-zinc-900/30 transition-colors group">
                    <div>
                      <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{job.title}</h4>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                        {job.job_type || 'Full-time'} • {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/recruiter/jobs/${job.id}`}>
                      <Button variant="outline" size="sm" className="rounded-xl border-zinc-800 bg-zinc-900 group-hover:bg-zinc-800">View Analytics</Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-zinc-950/50 border-zinc-900 overflow-hidden">
          <CardHeader className="border-b border-zinc-900 bg-zinc-900/20">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
               <Sparkles className="h-5 w-5 text-amber-500" />
               Live AI Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-900">
              {!recentActivity || recentActivity.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-sm text-zinc-500 italic">No activity yet. Upload a resume to see AI in action.</p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="p-6 space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-bold text-white">
                         {(activity.resume as any).parsed_data?.personalInfo?.fullName || 'New Candidate'}
                       </span>
                       <Badge variant="outline" className="text-[10px] bg-zinc-900 border-zinc-800 text-emerald-400">
                         {activity.final_score}% Match
                       </Badge>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Processed for <span className="text-zinc-300 font-medium">{(activity.job as any).title}</span>
                    </p>
                    <div className="text-[10px] text-zinc-700 uppercase tracking-widest font-bold">
                      {new Date(activity.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
