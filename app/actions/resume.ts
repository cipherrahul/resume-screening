'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { extractTextFromPdf, extractTextFromDocx } from '@/services/resume-parser';
import { parseResumeWithAI, generateEmbedding } from '@/services/ai-evaluator';
import { revalidatePath } from 'next/cache';

export async function processResume(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const file = formData.get('resume') as File;
  const jobId = formData.get('jobId') as string;

  if (!file || !jobId) throw new Error('Missing file or job ID');

  const adminClient = await createAdminClient();

  // 1. Upload to Supabase Storage
  // We use a clean path: userId/timestamp-filename
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;
  
  const { data: uploadData, error: uploadError } = await adminClient.storage
    .from('resumes')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Storage Upload Error:', uploadError);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const fileUrl = uploadData.path;

  // 2. Extract Text
  const buffer = Buffer.from(await file.arrayBuffer());
  
  let rawText = '';
  try {
    if (fileExt === 'pdf') {
      rawText = await extractTextFromPdf(buffer);
    } else if (fileExt === 'docx') {
      rawText = await extractTextFromDocx(buffer);
    } else {
      throw new Error('Unsupported file format. Please upload PDF or DOCX.');
    }
  } catch (err: any) {
    throw new Error(`Text extraction failed: ${err.message}`);
  }

  // 3. AI Data Extraction & Embedding
  // We run these in parallel for performance
  const [parsedData, embedding] = await Promise.all([
    parseResumeWithAI(rawText),
    generateEmbedding(rawText)
  ]);

  // 4. Save to Database
  const { data: resume, error: resumeError } = await adminClient
    .from('resumes')
    .insert({
      applicant_id: user.id,
      file_url: fileUrl,
      raw_text: rawText,
      parsed_data: parsedData,
      embedding: embedding,
    })
    .select()
    .single();

  if (resumeError) {
    console.error('Database Error (Resumes):', resumeError);
    throw new Error('Failed to save resume data');
  }

  // 5. Scoring Engine & Logic
  const { data: job } = await supabase
    .from('jobs')
    .select('title, description, required_skills, embedding')
    .eq('id', jobId)
    .single();

  if (job) {
    const { calculateKeywordScore, cosineSimilarity } = await import('@/services/scoring');
    const { evaluateApplication } = await import('@/services/ai-evaluator');
    
    // Run evaluation in parallel with semantic scoring
    const [keywordScore, semanticSimilarity, aiEvaluation] = await Promise.all([
      calculateKeywordScore(parsedData.skills, job.required_skills || []),
      Promise.resolve(cosineSimilarity(embedding, job.embedding)),
      evaluateApplication(parsedData, `${job.title}\n${job.description}`)
    ]);
    
    // Save Match with AI Reasoning
    const { error: matchError } = await adminClient
      .from('matches')
      .upsert({
        job_id: jobId,
        resume_id: resume.id,
        keyword_score: aiEvaluation.score || keywordScore,
        semantic_score: aiEvaluation.score || Math.max(0, Math.round(semanticSimilarity * 100)),
        reasoning: JSON.stringify(aiEvaluation),
      });
      
    if (matchError) {
      console.error('Database Error (Matches):', matchError);
      throw new Error(`Failed to save AI matchmaking results: ${matchError.message}`);
    }
  }

  revalidatePath(`/dashboard/jobs/${jobId}`);
  
  return { success: true, resumeId: resume.id };
}
