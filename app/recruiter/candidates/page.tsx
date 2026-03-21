import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Users, FileText, CheckCircle, XCircle, Clock, ExternalLink, Search } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CandidatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // The RLS policy for 'matches' already filters to jobs owned by auth.uid()
  const { data: candidates, error } = await supabase
    .from('matches')
    .select(`
      id,
      status,
      final_score,
      created_at,
      job:jobs (id, title),
      resume:resumes (
        id,
        file_url,
        applicant:profiles (full_name)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching candidates:", error);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
            <Users className="h-8 w-8 text-blue-500" />
            Candidates Roster
          </h1>
          <p className="text-zinc-500 font-medium tracking-wide mt-1">Review all recent applicants across your active jobs.</p>
        </div>
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center">
          Failed to load candidates: {error.message}
        </div>
      ) : (!candidates || candidates.length === 0) ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-16 text-center space-y-4 shadow-2xl">
          <FileText className="h-12 w-12 text-zinc-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">No Candidates Yet</h2>
          <p className="text-zinc-500 max-w-md mx-auto">
            You haven't received any applications for your posted jobs. Check back later once candidates start applying.
          </p>
        </div>
      ) : (
        <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/50 border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500">
                  <th className="px-6 py-4 font-bold">Applicant Name</th>
                  <th className="px-6 py-4 font-bold">Applied Job</th>
                  <th className="px-6 py-4 font-bold">AI Match Score</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Applied Date</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {candidates.map((candidate: any) => {
                  const applicantName = Array.isArray(candidate.resume?.applicant) 
                    ? candidate.resume.applicant[0]?.full_name 
                    : candidate.resume?.applicant?.full_name || 'Anonymous Applicant';
                  
                  const jobTitle = Array.isArray(candidate.job) 
                    ? candidate.job[0]?.title 
                    : candidate.job?.title || 'Unknown Job';

                  const jobId = Array.isArray(candidate.job) 
                    ? candidate.job[0]?.id 
                    : candidate.job?.id;

                  return (
                    <tr key={candidate.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="font-bold text-white">{applicantName}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-medium text-zinc-300">{jobTitle}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center justify-center bg-zinc-900 border border-zinc-700 rounded-full h-8 w-12 text-xs font-black text-white shadow-inner">
                          {candidate.final_score}%
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="outline" className={`font-bold tracking-widest text-[10px] px-3 py-1 uppercase ${
                          candidate.status === 'shortlisted' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 
                          candidate.status === 'rejected' ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                        }`}>
                          {candidate.status || 'PENDING'}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-zinc-500 font-medium">{new Date(candidate.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link href={`/recruiter/jobs/${jobId}`}>
                          <Button variant="outline" size="sm" className="h-8 gap-2 bg-zinc-900 border-zinc-700 hover:bg-zinc-800 hover:text-white transition-colors text-xs font-bold tracking-wide">
                            View Details <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
