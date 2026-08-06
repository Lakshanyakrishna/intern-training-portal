-- Phase D.7.4: Bulletproof RLS for anonymous resume uploads

-- Create a robust SECURITY DEFINER function to handle the validation logic
-- This entirely bypasses RLS issues on the applications and resume_files tables
-- for anonymous users while enforcing the user's strict business rules.
CREATE OR REPLACE FUNCTION public.can_insert_resume(app_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- 1. Verify the application_id actually exists
  IF NOT EXISTS (SELECT 1 FROM public.applications WHERE id = app_id) THEN
    RETURN FALSE;
  END IF;

  -- 2. Verify no resume file already exists for this application
  -- (Prevents spamming multiple resumes onto one application)
  IF EXISTS (SELECT 1 FROM public.resume_files WHERE application_id = app_id) THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Tighten resume_files insert policy
DROP POLICY IF EXISTS "resume_files_insert_applicant" ON resume_files;
CREATE POLICY "resume_files_insert_applicant" ON resume_files
  FOR INSERT WITH CHECK (
    public.can_insert_resume(application_id)
  );

-- Helper function for storage existence check (just existence, doesn't check duplicates)
CREATE OR REPLACE FUNCTION public.check_application_exists(app_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.applications WHERE id = app_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Tighten resumes storage bucket policy
DROP POLICY IF EXISTS "resumes_insert_own" ON storage.objects;
CREATE POLICY "resumes_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes'
    -- Safe text check before UUID cast to prevent ugly cast errors
    AND (storage.foldername(name))[1] IN (COALESCE(auth.uid()::text, ''), 'anonymous')
    AND public.check_application_exists(NULLIF((storage.foldername(name))[2], '')::UUID)
  );
