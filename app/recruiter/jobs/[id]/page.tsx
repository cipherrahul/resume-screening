import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { JobDetailsClient } from '@/components/dashboard/JobDetailsClient';

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (!job) notFound();

  const { data: applications } = await supabase
    .from('matches')
    .select(`
      *,
      resume:resumes (*)
    `)
    .eq('job_id', id)
    .order('final_score', { ascending: false });

  return (
    <JobDetailsClient 
      job={job} 
      applications={applications || []} 
      id={id} 
    />
  );
}
