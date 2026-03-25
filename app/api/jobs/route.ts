import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const API_KEY = 'RK_INSTITUTION_API_KEY_2026';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get('api_key') || request.headers.get('x-api-key');

  if (apiKey !== API_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing API Key' },
      { status: 401 }
    );
  }

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
