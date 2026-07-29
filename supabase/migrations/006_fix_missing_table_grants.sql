-- Phase D.2: Add missing GRANT statements for all Phase B & C tables
-- RLS policies exist but are unreachable without base table privileges.
-- See: https://postgrest.org/en/stable/references/auth.html#row-level-security

-- ─── Phase B tables (002_phase_b.sql) ──────────────────────────────
GRANT ALL ON TABLE progress              TO authenticated;
GRANT ALL ON TABLE completed_items       TO authenticated;
GRANT ALL ON TABLE passed_quizzes        TO authenticated;
GRANT ALL ON TABLE module_progress       TO authenticated;
GRANT ALL ON TABLE xp_history            TO authenticated;
GRANT ALL ON TABLE weekly_goals          TO authenticated;
GRANT ALL ON TABLE mentor_checklist      TO authenticated;
GRANT ALL ON TABLE practice_submissions  TO authenticated;
GRANT ALL ON TABLE challenge_workspaces  TO authenticated;
GRANT ALL ON TABLE mentor_feedback       TO authenticated;
GRANT ALL ON TABLE migration_status      TO authenticated;

-- ─── Phase C tables (003_phase_c.sql) ──────────────────────────────
GRANT ALL ON TABLE interviews                TO authenticated;
GRANT ALL ON TABLE interview_evaluations      TO authenticated;
GRANT ALL ON TABLE mentor_assignments         TO authenticated;
GRANT ALL ON TABLE readiness_evaluations      TO authenticated;
GRANT ALL ON TABLE project_allocations        TO authenticated;

-- applications needs special handling:
--   anon: INSERT only (public sign-up via /apply)
--   authenticated: read own + admin/mentor read/write
GRANT INSERT ON TABLE applications TO anon;
GRANT ALL ON TABLE applications TO authenticated;
