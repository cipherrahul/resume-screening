'use server';

import { createClient } from '@/lib/supabase/server';
import { generateOutreachAI } from '@/services/ai-evaluator';

export async function generateOutreach(
  matchId: string, 
  tone: 'professional' | 'casual' | 'high_intensity' = 'professional'
) {
  const supabase = await createClient();
  const { data: match } = await supabase
    .from('matches')
    .select(`*, job:jobs(title, required_skills), resume:resumes(parsed_data)`)
    .eq('id', matchId)
    .single();

  if (!match) throw new Error('Match not found');

  const name = match.resume.parsed_data?.personalInfo?.fullName || 'Candidate';
  const role = match.job.title;
  let reasoning: any = {};
  try {
    reasoning = typeof match.reasoning === 'string' ? JSON.parse(match.reasoning) : match.reasoning;
  } catch {
    reasoning = { strengths: [] };
  }

  const strengths = reasoning.strengths || [];
  
  // Call AI for personalized outreach
  const aiGenerated = await generateOutreachAI(name, strengths, role, tone);

  return {
    id: Date.now().toString(),
    subject: aiGenerated.subject,
    body: aiGenerated.body,
    tone: tone
  };
}
