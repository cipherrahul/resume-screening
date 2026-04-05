import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/Card';
import { AdminCharts } from '@/components/dashboard/AdminCharts';
import { 
  BrainCircuit, Users, CheckCircle, TrendingUp, 
  ExternalLink, Sparkles, Activity, Shield,
  ArrowUpRight, Target, Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();

  // 1. Fetch System Metrics
  const { count: totalApplications } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true });

  const { data: allMatches } = await supabase
    .from('matches')
    .select('final_score, status, created_at, job:jobs(title), resume:resumes(applicant:profiles(full_name))')
    .order('created_at', { ascending: false });

  const { data: allJobs } = await supabase
    .from('jobs')
    .select('job_type');

  const { count: totalRecruiters } = await supabase
    .from('user_roles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'recruiter');

  // 2. Calculate Avg Score
  const scores = allMatches?.map(m => m.final_score) || [];
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  // 3. Shortlist Rate
  const shortlisted = allMatches?.filter(m => m.status === 'shortlisted').length || 0;
  const shortlistRate = totalApplications ? Math.round((shortlisted / totalApplications) * 100) : 0;

  // 4. Prepare Score Distribution for Charts
  const buckets = [
    { name: '0-20', count: 0 },
    { name: '21-40', count: 0 },
    { name: '41-60', count: 0 },
    { name: '61-80', count: 0 },
    { name: '81-100', count: 0 },
  ];

  scores.forEach(s => {
    if (s <= 20) buckets[0].count++;
    else if (s <= 40) buckets[1].count++;
    else if (s <= 60) buckets[2].count++;
    else if (s <= 80) buckets[3].count++;
    else buckets[4].count++;
  });

  // 5. Prepare Job Type Distribution
  const typeCounts: Record<string, number> = {};
  allJobs?.forEach(j => {
    const type = j.job_type || 'Other';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const trendData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

  const recentActivity = allMatches?.slice(0, 5) || [];

  return (
    <div className="mx-auto max-w-7xl space-y-12 pb-20 px-6 relative">
      
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">System Overseer</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
            Global <span className="text-blue-500 underline decoration-blue-500/20 underline-offset-8">Intelligence</span>
          </h1>
          <p className="text-zinc-500 font-medium max-w-lg leading-relaxed">
            Real-time monitoring of RK AI neural matching, platform throughput, and recruiter engagement metrics.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl rounded-2xl p-5 flex flex-col items-center justify-center min-w-[140px] group transition-all hover:border-blue-500/30">
              <span className="text-3xl font-black text-white tracking-tighter">{totalRecruiters || 0}</span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1 group-hover:text-blue-400 transition-colors">Agents Active</span>
           </div>
           <Link href="/admin/logs">
             <button className="h-14 px-8 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-2xl shadow-blue-500/10">
               System Logs <Activity className="h-4 w-4" />
             </button>
           </Link>
        </div>
      </div>

      {/* ── Metric Bento Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Applications', value: totalApplications || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/5', desc: 'Total across all campaigns' },
          { label: 'Neural Match Avg', value: `${avgScore}%`, icon: BrainCircuit, color: 'text-emerald-400', bg: 'bg-emerald-400/5', desc: 'AI confidence score' },
          { label: 'Shortlist Rate', value: `${shortlistRate}%`, icon: Target, color: 'text-purple-400', bg: 'bg-purple-400/5', desc: 'Conversion from pool' },
          { label: 'Active Pipeline', value: allJobs?.length || 0, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/5', desc: 'Open job campaigns' },
        ].map((stat) => (
          <div key={stat.label} className="group relative overflow-hidden bg-zinc-950 border border-zinc-900 rounded-[32px] p-7 transition-all hover:border-zinc-800 hover:shadow-2xl">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="flex flex-col gap-5">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} border border-white/5 transition-transform group-hover:scale-110`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</p>
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                </div>
                <p className="text-[10px] font-medium text-zinc-600 mt-2">{stat.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Performance Analytics</h3>
             </div>
             <Badge variant="outline" className="border-zinc-800 text-[9px] uppercase tracking-widest bg-zinc-900/50">Real-time Data</Badge>
           </div>
           <div className="p-8 rounded-[40px] bg-zinc-950/40 border border-zinc-900 backdrop-blur-md shadow-inner">
             <AdminCharts scoreData={buckets} trendData={trendData} />
           </div>
        </div>

        {/* Live Activity Stream */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Intelligence Feed</h3>
          </div>
          <div className="rounded-[40px] bg-zinc-950/40 border border-zinc-900 overflow-hidden divide-y divide-zinc-900 shadow-2xl backdrop-blur-sm">
             {recentActivity.length > 0 ? recentActivity.map((activity: any, i) => {
               const applicantName = activity.resume?.applicant?.full_name || 'Anonymous';
               const jobTitle = activity.job?.title || 'Unknown Role';
               return (
                <div key={i} className="p-6 hover:bg-zinc-900/30 transition-all group/item">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-[10px] ${
                        activity.final_score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-900 text-zinc-500'
                      } ring-1 ring-white/5`}>
                        {applicantName[0]}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-extrabold text-white group-hover/item:text-blue-400 transition-colors uppercase italic tracking-tight">{applicantName}</p>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Matched to: <span className="text-zinc-400">{jobTitle}</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <span className={`text-xs font-black italic ${activity.final_score >= 80 ? 'text-emerald-400' : 'text-blue-400'}`}>{activity.final_score}%</span>
                       <span className="text-[9px] font-medium text-zinc-700 tracking-tighter"> {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
               );
             }) : (
               <div className="p-12 text-center text-zinc-700 font-bold uppercase tracking-widest text-[10px] italic">
                 No recent signals detected
               </div>
             )}
             <Link href="/admin/applicants" className="block p-4 text-center bg-zinc-900/20 hover:bg-zinc-900/50 transition-colors group/link">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] group-hover/link:text-white transition-colors flex items-center justify-center gap-2">
                  View Full Registry <ArrowUpRight className="h-3 w-3" />
                </span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

