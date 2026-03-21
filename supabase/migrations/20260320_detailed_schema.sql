-- AI Resume Screening System: Phase 1 & 2 (Schema & Vector)

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Profiles (RBAC: Admin, Recruiter, Applicant)
CREATE TYPE user_role AS ENUM ('admin', 'recruiter', 'applicant');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'applicant',
  full_name TEXT,
  company_name TEXT, -- Only for recruiters/admins
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Jobs
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT[] DEFAULT '{}',
  experience_required TEXT,
  job_type TEXT, -- Full-time, Remote, etc.
  embedding VECTOR(1536), -- OpenAI text-embedding-3-small
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- 3. Resumes
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  raw_text TEXT,
  parsed_data JSONB, -- skills, experience, education, summary
  embedding VECTOR(1536), -- OpenAI text-embedding-3-small
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Matches (Scoring Breakdown)
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  keyword_score INTEGER DEFAULT 0, -- 40% weight
  semantic_score INTEGER DEFAULT 0, -- 60% weight
  final_score INTEGER GENERATED ALWAYS AS (
    (keyword_score * 0.4) + (semantic_score * 0.6)
  ) STORED,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'shortlisted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, resume_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_embedding ON public.jobs USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_resumes_embedding ON public.resumes USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_matches_final_score ON public.matches (final_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
