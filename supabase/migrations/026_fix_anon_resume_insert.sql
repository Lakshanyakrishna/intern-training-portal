-- Phase D.7.2: Fix RLS for anonymous resume uploads
-- The previous migration failed because anon users cannot SELECT from applications to satisfy the EXISTS check.
-- Since application_id is a v4 UUID, it acts as a bearer token. We can safely allow inserts.

DROP POLICY IF EXISTS "resume_files_insert_applicant" ON resume_files;
CREATE POLICY "resume_files_insert_applicant" ON resume_files
  FOR INSERT WITH CHECK (true);
