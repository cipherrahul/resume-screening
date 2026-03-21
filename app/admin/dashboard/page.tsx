import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/Card';
import { AdminCharts } from '@/components/dashboard/AdminCharts';
import { BrainCircuit, Users, CheckCircle, TrendingUp, ArrowLeft, LogOut } from 'lucide-react';
import Link from 'next/link';
import { signOut } from '@/app/actions/auth';

export default async function AdminPage() {
  const supabase = await createClient();

  // 1. Fetch System Metrics
  const { count: totalApplications } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true });

  const { data: allMatches } = await supabase
    .from('matches')
    .select('final_score, status');

  const { data: allJobs } = await supabase
    .from('jobs')
    .select('job_type');

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

  const stats = [
    { label: 'Total Applications', value: totalApplications || 0, icon: Users, color: 'text-blue-400' },
    { label: 'Avg Match Score', value: `${avgScore}%`, icon: BrainCircuit, color: 'text-emerald-400' },
    { label: 'Shortlist Rate', value: `${shortlistRate}%`, icon: CheckCircle, color: 'text-purple-400' },
    { label: 'Active Campaigns', value: allJobs?.length || 0, icon: TrendingUp, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-white font-geist-sans uppercase italic">Global Intelligence</h1>
        <p className="text-zinc-500 font-medium max-w-lg">Monitoring system performance, neural matching accuracy, and platform growth.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-zinc-950/50 border-zinc-900 overflow-hidden relative group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black text-white mt-2">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-xl bg-zinc-900 border border-zinc-800 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AdminCharts scoreData={buckets} trendData={trendData} />
    </div>
  );
}
