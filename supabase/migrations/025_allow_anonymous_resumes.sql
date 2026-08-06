-- Phase D.7.1: Allow anonymous users to upload resumes
-- Run after 024

-- 1. Allow anon users to upload to storage 'resumes' bucket
DROP POLICY IF EXISTS "resumes_insert_own" ON storage.objects;
CREATE POLICY "resumes_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes'
  );

-- 2. Allow anon users to insert into resume_files table
DROP POLICY IF EXISTS "resume_files_insert_applicant" ON resume_files;
CREATE POLICY "resume_files_insert_applicant" ON resume_files
  FOR INSERT WITH CHECK (
    -- Allow authenticated users to upload for their email, or anonymous users to upload (since application_id is unguessable)
    EXISTS (SELECT 1 FROM applications WHERE id = application_id AND (auth.email() IS NULL OR email = auth.email()))
  );
