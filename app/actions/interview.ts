'use server';

import { generateInterviewGuidanceAI } from '@/services/ai-evaluator';
import { createClient } from '@/lib/supabase/server';

export async function getInterviewGuidance(matchId: string) {
  const supabase = await createClient();
  const { data: match } = await supabase
    .from('matches')
    .select(`*, job:jobs(description)`)
    .eq('id', matchId)
    .single();

  if (!match) throw new Error('Match not found');

  let reasoning: any = {};
  try {
    reasoning = typeof match.reasoning === 'string' ? JSON.parse(match.reasoning) : match.reasoning;
  } catch {
    reasoning = { gaps: [] };
  }

  const gaps = reasoning.gaps || [];
  if (gaps.length === 0) return [];

  return await generateInterviewGuidanceAI(gaps, match.job.description);
}
