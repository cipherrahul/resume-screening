'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addEvaluation(matchId: string, rating: number, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('comments')
    .insert({
      match_id: matchId,
      author_id: user.id,
      content,
      rating: rating, // Assuming we add a 'rating' column to the comments table for simplicity/velocity
    });

  if (error) {
    console.error('Error adding evaluation:', error);
    throw new Error(error.message);
  }

  // Also update the match status if it's a high rating?
  // No, let's keep it separate for recruiter choice.

  revalidatePath('/recruiter/jobs/[id]', 'page');
  return { success: true };
}

export async function getEvaluations(matchId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles (full_name)
    `)
    .eq('match_id', matchId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
