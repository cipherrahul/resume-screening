'use server';

import { createClient } from '@/lib/supabase/server';


export async function createDossier(matchIds: string[], jobId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Unauthorized');

  // Insert into the new dossiers table
  const { data: dossier, error } = await supabase
    .from('dossiers')
    .insert({
      job_id: jobId,
      match_ids: matchIds,
      created_by: user.id
    })
    .select('share_token')
    .single();

  if (error) {
    console.error('Dossier Persistence Error:', error);
    throw new Error(`Failed to initialize Dossier Protocol: ${error.message}`);
  }

  return {
    id: dossier.share_token,
    url: `/dossier/${dossier.share_token}`
  };
}
