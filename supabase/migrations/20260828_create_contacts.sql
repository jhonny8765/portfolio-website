CREATE TABLE IF NOT EXISTS public.contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  service text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Secure it: Only allow inserts via authenticated/service_role
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.contacts FROM anon, authenticated, public;
GRANT ALL ON TABLE public.contacts TO service_role;
