-- Run this once in the Supabase SQL Editor after deploying the Vercel API
-- functions. Registrations and admin operations then run server-side with the
-- service-role key, rather than granting database access to every visitor.

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public registration insert" ON public.payments;
DROP POLICY IF EXISTS "Allow public registrations insert" ON public.payments;
DROP POLICY IF EXISTS "Allow users to view own payments" ON public.payments;
DROP POLICY IF EXISTS "Allow public registrations read" ON public.payments;
DROP POLICY IF EXISTS "Allow admins to update payments" ON public.payments;
DROP POLICY IF EXISTS "Allow public registrations update" ON public.payments;

-- No anonymous or authenticated browser roles receive direct access. The
-- service-role key used only in Vercel bypasses RLS for approved API routes.
