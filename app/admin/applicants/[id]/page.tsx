import { createAdminClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {  ArrowLeft, Mail, Calendar, FileText, CheckCircle, Clock, BarChart3, TrendingUp, Brain } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

export default async function ApplicantHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: applicantId } = await params;
  const adminClient = await createAdminClient();
  
  // 1. Fetch Applicant Auth Data
  const { data: { user: authUser }, error: authError } = await adminClient.auth.admin.getUserById(applicantId);
  
  if (authError || !authUser) {
    return (
      <div className="p-8 text-center text-zinc-500">Applicant not found.</div>
    );
  }

  // 2. Fetch Resume Data
  const { data: resume } = await adminClient
    .from('resumes')
    .select('*')
    .eq('user_id', applicantId)
    .single();

  // 3. Fetch Match History
  const { data: matches } = await adminClient
    .from('matches')
    .select(`
      *,
      jobs (
        title,
        company,
        location
      )
    `)
    .eq('user_id', applicantId)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-10 pb-20 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/applicants" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4 text-[10px] font-bold uppercase tracking-widest group">
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
            Back to Registry
          </Link>
          <h1 className="text-4xl font-black tracking-tight text-white font-geist-sans uppercase italic">Applicant Dossier</h1>
          <p className="text-zinc-500 font-medium">Detailed screening history and neural profile analysis.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Profile Card */}
        <div className="space-y-8 lg:col-span-1">
          <Card className="bg-zinc-950/50 border-zinc-900 border-t-4 border-t-blue-500 overflow-hidden">
             <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                   <div className="h-24 w-24 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl font-black text-white uppercase italic shadow-2xl mb-6">
                      {authUser.user_metadata.full_name?.substring(0, 2) || authUser.email?.substring(0, 2)}
                   </div>
                   <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">{authUser.user_metadata.full_name || 'Anonymous Agent'}</h2>
                   <p className="text-zinc-500 font-medium mt-1 flex items-center gap-2">
                     <Mail className="h-4 w-4" /> {authUser.email}
                   </p>
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-900 space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Platform Status</span>
                      <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">Verified</Badge>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Enrollment Date</span>
                      <span className="text-xs text-white font-bold">{new Date(authUser.created_at).toLocaleDateString()}</span>
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card className="bg-zinc-950/20 border-zinc-900 overflow-hidden">
             <CardHeader className="p-6 border-b border-zinc-900 bg-zinc-900/10">
                <CardTitle className="text-sm font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-widest">
                   <Brain className="h-4 w-4 text-purple-500" />
                   Neural Skills
                </CardTitle>
             </CardHeader>
             <CardContent className="p-6">
                 {resume ? (
                   <div className="flex flex-wrap gap-2">
                      {resume.skills?.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white transition-colors cursor-default">
                          {skill}
                        </Badge>
                      )) || <p className="text-xs text-zinc-600 italic">No skills extracted.</p>}
                   </div>
                 ) : (
                   <p className="text-xs text-zinc-600 italic">Resume not yet uploaded.</p>
                 )}
             </CardContent>
          </Card>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="bg-zinc-950/20 border-zinc-900 overflow-hidden">
             <CardHeader className="p-6 border-b border-zinc-900 bg-zinc-900/10 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                   <Clock className="h-5 w-5 text-zinc-500" />
                   Application Timeline
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Success Rate</p>
                    <p className="text-lg font-black text-white">
                      {matches?.length ? Math.round((matches.filter(m => m.status === 'shortlisted').length / matches.length) * 100) : 0}%
                    </p>
                  </div>
                </div>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-zinc-900">
                   {!matches || matches.length === 0 ? (
                      <div className="p-12 text-center text-zinc-600 italic text-sm font-medium">No application records found.</div>
                   ) : (
                      matches.map((match) => (
                        <div key={match.id} className="p-8 flex items-start justify-between hover:bg-zinc-900/30 transition-all group">
                           <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-[10px] font-bold uppercase tracking-widest">
                                   Match ID: {match.id.substring(0, 8)}
                                </Badge>
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">•</span>
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                                   <Calendar className="h-3 w-3" /> {new Date(match.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div>
                                 <h3 className="text-xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors uppercase italic">{match.jobs?.title}</h3>
                                 <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 mt-1">
                                    <TrendingUp className="h-3 w-3" /> {match.jobs?.company} • {match.jobs?.location}
                                 </p>
                              </div>
                              <div className="flex gap-2 mt-4">
                                 <Badge className={match.status === 'shortlisted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}>
                                    {match.status?.toUpperCase() || 'EVALUATING'}
                                 </Badge>
                              </div>
                           </div>
                           <div className="flex flex-col items-end gap-2">
                              <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:border-zinc-700">
                                 <span className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Score</span>
                                 <span className="text-xl font-black text-white">{match.final_score}%</span>
                              </div>
                              <div className={`text-[10px] font-black uppercase tracking-[0.2em] mt-2 ${match.final_score >= 80 ? 'text-emerald-500' : match.final_score >= 60 ? 'text-amber-500' : 'text-zinc-600'}`}>
                                 {match.final_score >= 80 ? 'Elite Match' : match.final_score >= 60 ? 'Strong Potential' : 'Low Relevance'}
                              </div>
                           </div>
                        </div>
                      ))
                   )}
                </div>
             </CardContent>
           </Card>

           <Card className="bg-zinc-950/10 border-zinc-900 border-dashed border-2">
              <CardContent className="p-8 text-center space-y-2">
                 <BarChart3 className="h-10 w-10 text-zinc-800 mx-auto" />
                 <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Predictive Stability</h4>
                 <p className="text-xs text-zinc-700 max-w-sm mx-auto font-medium">
                    This applicant displays consistent accuracy in {matches?.length ? Math.round((matches.reduce((acc, m) => acc + (m.final_score || 0), 0) / matches.length)) : 0}% of neural screenings.
                 </p>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
