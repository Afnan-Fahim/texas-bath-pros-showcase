CREATE TABLE public.quiz_content (
  id text PRIMARY KEY DEFAULT 'default',
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.quiz_content TO anon;
GRANT SELECT, INSERT, UPDATE ON public.quiz_content TO authenticated;
GRANT ALL ON public.quiz_content TO service_role;

ALTER TABLE public.quiz_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz content"
ON public.quiz_content FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can insert quiz content"
ON public.quiz_content FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quiz content"
ON public.quiz_content FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_quiz_content_updated_at
BEFORE UPDATE ON public.quiz_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.quiz_content (id, config) VALUES ('default', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;