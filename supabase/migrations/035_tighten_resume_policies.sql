-- Phase D.7.5: Tighten RLS for anonymous resume uploads

-- 1. Tighten resume_files insert policy
DROP POLICY IF EXISTS "resume_files_insert_applicant" ON resume_files;
CREATE POLICY "resume_files_insert_applicant" ON resume_files
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.applications WHERE id = application_id)
    AND NOT EXISTS (SELECT 1 FROM public.resume_files WHERE application_id = resume_files.application_id)
  );

-- 2. Tighten resumes storage bucket policy
DROP POLICY IF EXISTS "resumes_insert_own" ON storage.objects;
CREATE POLICY "resumes_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes'
    AND EXISTS (
      SELECT 1 FROM public.applications 
      WHERE id = NULLIF((storage.foldername(name))[2], '')::UUID
    )
  );
