-- Require authentication for all application submissions
--
-- Anonymous applications are being removed entirely: every applicant must
-- create an account before applying (Apply clicks on the Opportunities page
-- are gated through a "Create Your Account" step first). This migration
-- tightens the RLS policies that previously allowed anonymous inserts
-- (applications, resume_files, and the resumes storage bucket) so every row
-- is tied to the authenticated user who owns it.
--
-- This is a fresh, additive migration -- nothing here edits an already
-- applied migration file.

-- ─── 1. applications: INSERT requires an authenticated user ────────
-- The inserted row's identity must match the caller: user_id must be the
-- caller's auth.uid() and email must be their auth.email(). The original
-- freshness checks (status='pending', no reviewer fields) are preserved.
DROP POLICY IF EXISTS "applications_insert_public" ON applications;
CREATE POLICY "applications_insert_public" ON applications
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
    AND email = auth.email()
    AND status = 'pending'
    AND reviewer_id IS NULL
    AND reviewed_at IS NULL
    AND reviewer_notes IS NULL
    AND (screening_status IS NULL OR screening_status = 'pending')
  );

-- Anonymous users no longer have any path onto applications (the RLS policy
-- already rejects auth.uid() IS NULL; revoke the table-level grant as well).
REVOKE INSERT ON TABLE applications FROM anon;

-- ─── 2. resume_files: INSERT scoped to the caller's application ────
-- application_id must reference an application owned by the caller
-- (a.user_id = auth.uid() -- enforced by the policy above -- or a matching
-- email). The profile-level resume path (023_applicant_profile.sql, keyed on
-- user_id with application_id IS NULL) is covered by its own separate
-- resume_files_insert_profile policy and is untouched. The one-resume-per-
-- application rule from 026 is preserved.
DROP POLICY IF EXISTS "resume_files_insert_applicant" ON resume_files;
CREATE POLICY "resume_files_insert_applicant" ON resume_files
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = resume_files.application_id
        AND (a.user_id = auth.uid() OR a.email = auth.email())
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.resume_files rf
      WHERE rf.application_id = resume_files.application_id
    )
  );

-- ─── 3. resumes storage bucket: INSERT scoped to the caller's path ─
-- File paths are {userId}/{applicationId}/{timestamp}.{ext} for application
-- resumes and {userId}/profile/{timestamp}.{ext} for profile-level resumes
-- (see uploadResumeFile/uploadProfileResume in src/lib/db.ts). The first
-- path segment must be the caller's own uid; the second must be either an
-- application id they own or the literal 'profile' folder. Ownership is
-- compared as text (a.id::text) so non-UUID segments like 'profile'
-- short-circuit cleanly instead of throwing a cast error.
DROP POLICY IF EXISTS "resumes_insert_own" ON storage.objects;
CREATE POLICY "resumes_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND (
      (storage.foldername(name))[2] = 'profile'
      OR EXISTS (
        SELECT 1 FROM public.applications a
        WHERE a.id::text = (storage.foldername(name))[2]
          AND a.user_id = auth.uid()
      )
    )
  );

-- The SELECT-on-users grant added in 030_fix_anon_users_grant.sql existed
-- only so an anonymous resume_files INSERT could pass its RI-trigger
-- privilege check (FK user_id -> users(id)). Anonymous inserts are gone, so
-- the grant is revoked. RLS stays enabled on users, so no data becomes
-- visible as a result.
REVOKE SELECT ON TABLE public.users FROM anon;
