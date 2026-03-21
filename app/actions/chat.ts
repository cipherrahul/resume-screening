'use server';

import { groq } from '@/lib/groq/client';
import { createClient } from '@/lib/supabase/server';

export async function askRecruiterAssistant(jobId: string, query: string, history: any[]) {
  const supabase = await createClient();
  
  // 1. Fetch all candidates and matches for this job to give context to the AI
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      final_score,
      reasoning,
      resumes (
        parsed_data
      )
    `)
    .eq('job_id', jobId)
    .order('final_score', { ascending: false });

  const context = matches?.map(m => ({
    name: (m.resumes as any).parsed_data.personalInfo.fullName,
    score: m.final_score,
    skills: (m.resumes as any).parsed_data.skills,
    summary: (m.resumes as any).parsed_data.summary,
    reasoning: m.reasoning
  }));

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an Agentic Recruiter Assistant. You have access to the following candidates for this job:
        ${JSON.stringify(context)}
        
        Answer the recruiter's questions accurately based on this data. Be concise and professional. 
        If asked for the 'best' candidate, refer to the scores and reasoning.`,
      },
      ...history,
      {
        role: 'user',
        content: query,
      },
    ],
  });

  return response.choices[0].message.content;
}
