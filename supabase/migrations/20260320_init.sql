-- Initial Schema for AI Resume Screening System

-- 1. Profiles (Recruiters)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Jobs
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- 3. Candidates
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Applications (Resume Submissions)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  resume_url TEXT NOT NULL, -- Path in Supabase Storage
  raw_text TEXT,             -- Extracted text from PDF
  parsed_json JSONB,         -- Structured data from AI
  score INTEGER CHECK (score >= 0 AND score <= 100),
  ai_summary TEXT,           -- Summary of the candidate
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Recruiters can only see their own profile
CREATE POLICY "Recruiters can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Recruiters can see all jobs, but only manage their own
CREATE POLICY "Recruiters can view all jobs" ON public.jobs
  FOR SELECT USING (true);

CREATE POLICY "Recruiters can manage own jobs" ON public.jobs
  FOR ALL USING (auth.uid() = created_by);

-- Applications are visible to recruiters
CREATE POLICY "Recruiters can view applications" ON public.applications
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.jobs j WHERE j.id = application.job_id AND j.created_by = auth.uid()
  ));
