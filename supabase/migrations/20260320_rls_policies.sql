-- AI Resume Screening System: Phase 1 (Step 3 - RLS Policies)

-- Enable RLS on all tables (already done in migration but for clarity)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Jobs Policies
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs
  FOR SELECT USING (true);

CREATE POLICY "Recruiters and Admins can manage jobs" ON public.jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('recruiter', 'admin')
    )
  );

-- 3. Resumes Policies
CREATE POLICY "Applicants can see only their own resumes" ON public.resumes
  FOR SELECT USING (auth.uid() = applicant_id);

CREATE POLICY "Recruiters can see resumes for their jobs" ON public.resumes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.jobs j ON m.job_id = j.id
      WHERE m.resume_id = resumes.id AND j.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can see everything" ON public.resumes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Applicants can upload resumes" ON public.resumes
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);

-- 4. Matches Policies
CREATE POLICY "Applicants can see matches for their resumes" ON public.matches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.resumes r
      WHERE r.id = matches.resume_id AND r.applicant_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can manage matches for their jobs" ON public.matches
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = matches.job_id AND j.created_by = auth.uid()
    )
  );
