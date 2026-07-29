-- Phase D.9: Security fixes
-- Run after 012_completion.sql
--
-- Fixes:
--   1. Resume storage policies grant every signed-in user read/write access to
--      every candidate's resume file (011_storage_resumes.sql).
--   2. (application-layer fix, tracked here only via the screening_status
--      constraint) analyze-resume must never write a fabricated analysis.
--   3. applications_insert_public lets anon insert a row with any status /
--      reviewer fields; applications_link_to_user does not lock status.
--   4. (application-layer fix) resume downloads move to signed URLs.
--
-- All statements are DROP POLICY IF EXISTS ... ; CREATE POLICY ... so this
-- file is safe to re-run.

-- ─── Task 1: Resume storage policies ──────────────────────────────
-- Resume files live at {userId}/{applicationId}/{timestamp}.{ext} (see
-- uploadResumeFile in src/lib/db.ts). The first path segment is the owner.

DROP POLICY IF EXISTS "resumes_insert_own" ON storage.objects;
CREATE POLICY "resumes_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "resumes_read_admin_mentor" ON storage.objects;
CREATE POLICY "resumes_read_admin_mentor" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin_or_mentor()
    )
  );

DROP POLICY IF EXISTS "resumes_update_own" ON storage.objects;
CREATE POLICY "resumes_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'resumes'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'resumes'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- resumes_delete_admin is unchanged (admin only) — not touched here.

-- ─── Task 2: screening_status ─────────────────────────────────────
-- 'failed' is already permitted by the check constraint added in
-- 010_ai_screening.sql (line 109-110):
--   CHECK (screening_status IN ('pending', 'processing', 'analyzed', 'failed'))
-- No constraint change needed.

-- ─── Task 3: Lock down application inserts and account linking ───

-- Allowed statuses per 003_phase_c.sql (line 18-19):
--   'pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'
-- Public inserts may only ever create a fresh, unreviewed application.
DROP POLICY IF EXISTS "applications_insert_public" ON applications;
CREATE POLICY "applications_insert_public" ON applications
  FOR INSERT WITH CHECK (
    status = 'pending'
    AND reviewer_id IS NULL
    AND reviewed_at IS NULL
    AND reviewer_notes IS NULL
    AND (screening_status IS NULL OR screening_status = 'pending')
  );

-- WITH CHECK cannot compare OLD vs NEW values, so the "status/reviewer/
-- screening fields must not change" rule is enforced by a trigger instead.
-- The policy itself is unchanged in effect but is recreated here to keep
-- this migration idempotent end-to-end.
DROP POLICY IF EXISTS "applications_link_to_user" ON applications;
CREATE POLICY "applications_link_to_user" ON applications
  FOR UPDATE USING (
    user_id IS NULL AND email = auth.email()
  )
  WITH CHECK (
    user_id = auth.uid() AND email = auth.email()
  );

CREATE OR REPLACE FUNCTION public.prevent_application_status_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF public.is_admin_or_mentor() THEN
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.reviewer_id IS DISTINCT FROM OLD.reviewer_id
     OR NEW.screening_status IS DISTINCT FROM OLD.screening_status THEN
    RAISE EXCEPTION 'Not authorized to change status, reviewer_id, or screening_status';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS applications_prevent_status_escalation ON applications;
CREATE TRIGGER applications_prevent_status_escalation
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION public.prevent_application_status_escalation();

-- resume_files has no policy granting anon any rows; the SELECT grant from
-- 010_ai_screening.sql (line 169) is a dangling privilege with no purpose.
REVOKE SELECT ON TABLE resume_files FROM anon;
