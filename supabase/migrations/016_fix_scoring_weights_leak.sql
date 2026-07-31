-- Fix: opportunity_scoring_weights is readable by anon and by any authenticated
-- user (010_ai_screening.sql:164,173) -- the internal AI scoring rubric per
-- opportunity category is visible to anyone visiting the site, logged in or
-- not. This mirrors the resume_files anon-grant bug already fixed in 013;
-- this table was missed at the time.

REVOKE SELECT ON TABLE opportunity_scoring_weights FROM anon;

DROP POLICY IF EXISTS "opportunity_scoring_weights_read_auth" ON opportunity_scoring_weights;

CREATE POLICY "opportunity_scoring_weights_read_admin_mentor" ON opportunity_scoring_weights
  FOR SELECT USING (public.is_admin_or_mentor());
