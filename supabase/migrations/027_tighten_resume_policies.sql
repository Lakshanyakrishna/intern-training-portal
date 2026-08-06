-- Phase D.7.3: Tighten RLS for anonymous resume uploads

-- Create a SECURITY DEFINER function to securely check application existence
-- without granting SELECT on the applications table to the anon role.
CREATE OR REPLACE FUNCTION public.check_application_exists(app_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.applications WHERE id = app_id
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 1. Tighten resume_files insert policy
DROP POLICY IF EXISTS "resume_files_insert_applicant" ON resume_files;
CREATE POLICY "resume_files_insert_applicant" ON resume_files
  FOR INSERT WITH CHECK (
    public.check_application_exists(application_id)
    AND NOT EXISTS (
      SELECT 1 FROM resume_files AS rf WHERE rf.application_id = resume_files.application_id
    )
  );

-- 2. Tighten resumes storage bucket policy
DROP POLICY IF EXISTS "resumes_insert_own" ON storage.objects;
CREATE POLICY "resumes_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes'
    -- The file path is structured as userId/applicationId/timestamp.ext
    -- For anon users, it's 'anonymous'/applicationId/timestamp.ext
    AND (storage.foldername(name))[1] IN (auth.uid()::text, 'anonymous')
    AND public.check_application_exists((storage.foldername(name))[2]::UUID)
  );
