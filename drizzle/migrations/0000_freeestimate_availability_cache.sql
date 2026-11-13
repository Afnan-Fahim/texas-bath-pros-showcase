CREATE TABLE public.freeestimate_availability (id int PRIMARY KEY DEFAULT 1, times jsonb NOT NULL DEFAULT '[]', updated_at timestamptz NOT NULL DEFAULT now(), CONSTRAINT single_row CHECK (id = 1));
GRANT ALL ON public.freeestimate_availability TO service_role;
ALTER TABLE public.freeestimate_availability ENABLE ROW LEVEL SECURITY;