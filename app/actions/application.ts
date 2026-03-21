'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateApplicationStatus(
  matchId: string, 
  status: 'pending' | 'shortlisted' | 'rejected'
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('matches')
    .update({ status })
    .eq('id', matchId);

  if (error) {
    console.error('Error updating application status:', error);
    throw new Error('Failed to update status');
  }

  // Find the job_id associated with this match to revalidate correctly
  const { data: match } = await supabase
    .from('matches')
    .select('job_id')
    .eq('id', matchId)
    .single();

  if (match?.job_id) {
    revalidatePath(`/dashboard/jobs/${match.job_id}`);
    revalidatePath('/dashboard');
  }

  return { success: true };
}
