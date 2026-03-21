'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { generateEmbedding } from '@/services/ai-evaluator';
import { revalidatePath } from 'next/cache';

const jobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  requiredSkills: z.array(z.string()).min(1),
  experienceRequired: z.string(),
  jobType: z.string(),
});

export async function createJob(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const rawSkills = formData.get('requiredSkills') as string;
  const skillsArray = rawSkills.split(',').map(s => s.trim()).filter(Boolean);

  const validatedData = jobSchema.parse({
    title: formData.get('title'),
    description: formData.get('description'),
    requiredSkills: skillsArray,
    experienceRequired: formData.get('experienceRequired'),
    jobType: formData.get('jobType'),
  });

  try {
    // Step 9: Generate Embeddings
    const embeddingText = `${validatedData.title} ${validatedData.description} ${validatedData.requiredSkills.join(' ')}`;
    const embedding = await generateEmbedding(embeddingText);

    const { error } = await supabase
      .from('jobs')
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        required_skills: validatedData.requiredSkills,
        experience_required: validatedData.experienceRequired,
        job_type: validatedData.jobType,
        embedding: embedding,
        created_by: user.id,
      });

    if (error) throw new Error(error.message);

    revalidatePath('/recruiter/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Create job error:', err);
    return { success: false, error: err.message };
  }
}
