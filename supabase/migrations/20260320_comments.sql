-- Phase 8: Collaborative Features (Notes)

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters and Admins can manage comments on their jobs" ON public.comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.jobs j ON m.job_id = j.id
      WHERE m.id = comments.match_id AND (j.created_by = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
    )
  );

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_comments_match_id ON public.comments (match_id);
