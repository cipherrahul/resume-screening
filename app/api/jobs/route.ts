import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Public endpoint: no API key required
  try {
    const supabase = await createClient();
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('id, title, description, required_skills, job_type, experience_required, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      count: jobs.length,
      jobs: jobs
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
