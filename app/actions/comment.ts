'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addComment(matchId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('comments')
    .insert({
      match_id: matchId,
      author_id: user.id,
      content,
    });

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard/jobs');
  return { success: true };
}

export async function getComments(matchId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles (full_name)
    `)
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}
