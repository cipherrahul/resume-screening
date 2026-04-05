-- 5. Selection Dossiers (Phase 4: Persistence)
CREATE TABLE IF NOT EXISTS public.dossiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  match_ids UUID[] NOT NULL,
  share_token TEXT UNIQUE NOT NULL DEFAULT substring(md5(random()::text), 0, 12),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- RLS Policies for Dossiers
ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;

-- Recruiters can create and view their own dossiers
CREATE POLICY "Recruiters can manage their own dossiers"
ON public.dossiers
FOR ALL
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Public can view dossiers by share_token
CREATE POLICY "Public can view dossiers by token"
ON public.dossiers
FOR SELECT
USING (TRUE);
