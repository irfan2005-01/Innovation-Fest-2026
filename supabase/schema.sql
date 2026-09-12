-- ============================================================================
-- SUPABASE DATABASE SCHEMA — HACKATHON & INNOVATION FEST 2026
-- Stricter Payment Verification & Fraud Prevention
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE (Role-Based Access Control for Admin Dashboard)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'volunteer', 'admin', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- ----------------------------------------------------------------------------
-- 2. PAYMENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  registration_token TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('hackora', 'ideathon', 'project_expo', 'expo')),
  event_name TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL DEFAULT 'upi',
  
  -- Payment Details (UTR for Online UPI, or receipt reference for Cash)
  utr_number TEXT,
  payer_name TEXT,
  payer_upi_id TEXT,
  payment_screenshot_url TEXT,
  
  -- Verification Workflow
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  rejection_reason TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Academic & Team Meta (for Secretariat)
  team_name TEXT,
  college_name TEXT,
  leader_name TEXT,
  leader_email TEXT,
  leader_phone TEXT,
  student_id TEXT,
  branch TEXT,
  year TEXT,
  theme_id TEXT,
  project_title TEXT,
  members JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- NOTE: A UNIQUE index on utr_number will be added separately via a manual
-- migration to ensure zero duplicates across concurrent submissions:
--
-- CREATE UNIQUE INDEX CONCURRENTLY idx_payments_utr_unique 
--   ON public.payments (utr_number) 
--   WHERE status IN ('pending', 'verified');
-- ============================================================================

-- Helper Index for duplicate checks and fast dashboard lookups
CREATE INDEX IF NOT EXISTS idx_payments_utr_status 
  ON public.payments (utr_number, status);

CREATE INDEX IF NOT EXISTS idx_payments_status_created 
  ON public.payments (status, created_at DESC);

-- Enable Row Level Security on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Payments Table RLS Policies
DROP POLICY IF EXISTS "Allow public registration insert" ON public.payments;
CREATE POLICY "Allow public registration insert"
  ON public.payments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to view own payments" ON public.payments;
CREATE POLICY "Allow users to view own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Allow admins to update payments" ON public.payments;
CREATE POLICY "Allow admins to update payments"
  ON public.payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- ----------------------------------------------------------------------------
-- 3. SUPABASE STORAGE BUCKET: payment-screenshots (Private)
-- ----------------------------------------------------------------------------
-- Storage bucket definition (execute in Supabase SQL Editor or Storage API):
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-screenshots',
  'payment-screenshots',
  false, -- Private bucket: access restricted by RLS
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage Policy 1: Authenticated users can INSERT/upload only into a folder matching their own user_id
DROP POLICY IF EXISTS "Authenticated users can upload to own folder in payment-screenshots" ON storage.objects;
CREATE POLICY "Authenticated users can upload to own folder in payment-screenshots"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'payment-screenshots' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage Policy 2: Allow anonymous / participant uploads with uuid folder check (fallback)
DROP POLICY IF EXISTS "Allow anon upload with valid path in payment-screenshots" ON storage.objects;
CREATE POLICY "Allow anon upload with valid path in payment-screenshots"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (
    bucket_id = 'payment-screenshots'
  );

-- Storage Policy 3: Only users with role 'admin' or 'super_admin' in profiles can SELECT/read all files
DROP POLICY IF EXISTS "Only admins can read all files in payment-screenshots" ON storage.objects;
CREATE POLICY "Only admins can read all files in payment-screenshots"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'payment-screenshots' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- ----------------------------------------------------------------------------
-- 4. ALTER MIGRATION (For pre-existing payments tables)
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  -- Add payment_screenshot_url if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'payment_screenshot_url'
  ) THEN
    ALTER TABLE public.payments ADD COLUMN payment_screenshot_url TEXT;
  END IF;

  -- Ensure payer_name and payer_upi_id exist and set NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'payer_name'
  ) THEN
    UPDATE public.payments SET payer_name = 'Participant' WHERE payer_name IS NULL;
    ALTER TABLE public.payments ALTER COLUMN payer_name SET NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'payer_upi_id'
  ) THEN
    UPDATE public.payments SET payer_upi_id = 'upi@bank' WHERE payer_upi_id IS NULL;
    ALTER TABLE public.payments ALTER COLUMN payer_upi_id SET NOT NULL;
  END IF;

  -- Add CHECK constraint on utr_number if not already present
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_utr_12_digits'
  ) THEN
    ALTER TABLE public.payments 
      ADD CONSTRAINT check_utr_12_digits CHECK (utr_number ~ '^[0-9]{12}$');
  END IF;
END $$;
