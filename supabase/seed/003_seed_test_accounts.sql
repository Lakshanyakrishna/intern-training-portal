-- Phase B.5: Test Accounts Seed Data
--
-- Prerequisites:
-- 1. Run 001_phase_a.sql and 002_phase_b.sql first
-- 2. Create auth users via Supabase Dashboard or Auth API:
--    - applicant@test.com   (password: Test1234!)
--    - intern@test.com      (password: Test1234!)
--    - mentor@test.com      (password: Test1234!)
--    - admin@test.com       (password: Test1234!)
-- 3. Replace placeholder UUIDs below with actual auth.user IDs:
--    SELECT id, email FROM auth.users;
--
-- Run after replacing UUIDs: psql or Supabase SQL Editor

-- ─── Applicant (pending application, no auth user) ─────────────────
INSERT INTO applications (name, email, college, year_of_study, status, applied_at)
VALUES ('Alice Applicant', 'applicant@test.com', 'MIT', '3rd Year', 'pending', NOW());

INSERT INTO applications (name, email, college, year_of_study, status, applied_at)
VALUES ('Bob Applicant', 'bob@test.com', 'Stanford', '2nd Year', 'reviewed', NOW() - INTERVAL '3 days');

-- ─── Intern ────────────────────────────────────────────────────────
-- Replace 'INTERN_UUID' with actual auth.users id for intern@test.com
INSERT INTO users (id, email, name, role, college, year_of_study, batch, joined_date, onboarding_complete)
VALUES ('INTERN_UUID', 'intern@test.com', 'Charlie Intern', 'intern', 'UC Berkeley', '4th Year', '2026A', '2026-01-15', true);

INSERT INTO user_settings (user_id, theme, display_name)
VALUES ('INTERN_UUID', 'light', 'Charlie');

INSERT INTO progress (user_id, xp, level, streak, last_active, training_start_date)
VALUES ('INTERN_UUID', 1250, 4, 7, CURRENT_DATE, '2026-01-15');

INSERT INTO completed_items (user_id, item_type, item_id, completed_at)
VALUES
  ('INTERN_UUID', 'lesson', 'module-01-lesson-01', NOW() - INTERVAL '30 days'),
  ('INTERN_UUID', 'lesson', 'module-01-lesson-02', NOW() - INTERVAL '28 days'),
  ('INTERN_UUID', 'lesson', 'module-02-lesson-01', NOW() - INTERVAL '20 days'),
  ('INTERN_UUID', 'lesson', 'module-02-lesson-02', NOW() - INTERVAL '18 days'),
  ('INTERN_UUID', 'practice', 'module-01-practice-01', NOW() - INTERVAL '25 days'),
  ('INTERN_UUID', 'challenge', 'module-01-challenge-01', NOW() - INTERVAL '22 days'),
  ('INTERN_UUID', 'challenge', 'module-02-challenge-01', NOW() - INTERVAL '15 days');

INSERT INTO passed_quizzes (user_id, module_id, passed_at)
VALUES
  ('INTERN_UUID', 'module-01', NOW() - INTERVAL '24 days'),
  ('INTERN_UUID', 'module-02', NOW() - INTERVAL '14 days');

INSERT INTO module_progress (user_id, module_id, quiz_passed, xp_earned, checkpoints, assessment_attempts)
VALUES
  ('INTERN_UUID', 'module-01', true, 500, '{"checkpoint-01": true, "checkpoint-02": true}', '[{"score": 85, "date": "2026-01-20"}, {"score": 92, "date": "2026-01-22"}]'),
  ('INTERN_UUID', 'module-02', true, 400, '{"checkpoint-01": true}', '[{"score": 78, "date": "2026-02-01"}]'),
  ('INTERN_UUID', 'module-03', false, 150, '{}', '[]');

INSERT INTO xp_history (user_id, date, amount, source)
VALUES
  ('INTERN_UUID', CURRENT_DATE - INTERVAL '30 days', 100, 'Lesson: Module 1 Lesson 1'),
  ('INTERN_UUID', CURRENT_DATE - INTERVAL '28 days', 100, 'Lesson: Module 1 Lesson 2'),
  ('INTERN_UUID', CURRENT_DATE - INTERVAL '25 days', 50, 'Practice: Module 1 Practice 1'),
  ('INTERN_UUID', CURRENT_DATE - INTERVAL '24 days', 200, 'Quiz: Module 1'),
  ('INTERN_UUID', CURRENT_DATE - INTERVAL '22 days', 150, 'Challenge: Module 1 Challenge 1'),
  ('INTERN_UUID', CURRENT_DATE - INTERVAL '20 days', 100, 'Lesson: Module 2 Lesson 1'),
  ('INTERN_UUID', CURRENT_DATE - INTERVAL '18 days', 100, 'Lesson: Module 2 Lesson 2'),
  ('INTERN_UUID', CURRENT_DATE - INTERVAL '15 days', 150, 'Challenge: Module 2 Challenge 1'),
  ('INTERN_UUID', CURRENT_DATE - INTERVAL '14 days', 200, 'Quiz: Module 2'),
  ('INTERN_UUID', CURRENT_DATE, 50, 'Daily login');

INSERT INTO weekly_goals (user_id, week_start, labs, labs_completed, assessments, assessments_completed, weekly_xp, weekly_xp_target)
VALUES ('INTERN_UUID', date_trunc('week', CURRENT_DATE)::date, 3, 2, 1, 0, 250, 300);

INSERT INTO practice_submissions (user_id, task_id, submission, saved_at)
VALUES ('INTERN_UUID', 'module-01-practice-01', 'function solve() { return 42; }', NOW() - INTERVAL '25 days');

INSERT INTO challenge_workspaces (user_id, challenge_id, notes, submission, hints_revealed, status)
VALUES ('INTERN_UUID', 'module-01-challenge-01', 'Used binary search approach', 'solve(input)', 2, 'submitted');

-- ─── Mentor ────────────────────────────────────────────────────────
-- Replace 'MENTOR_UUID' with actual auth.users id for mentor@test.com
INSERT INTO users (id, email, name, role, college, batch, joined_date, onboarding_complete)
VALUES ('MENTOR_UUID', 'mentor@test.com', 'Diana Mentor', 'mentor', 'Harvard', '2026A', '2025-06-01', true);

INSERT INTO user_settings (user_id, theme, display_name)
VALUES ('MENTOR_UUID', 'dark', 'Diana');

INSERT INTO mentor_feedback (user_id, date, score, note, module)
VALUES
  ('INTERN_UUID', NOW() - INTERVAL '10 days', 85, 'Good progress on Module 1. Keep it up!', 'module-01'),
  ('INTERN_UUID', NOW() - INTERVAL '3 days', 78, 'Module 2 needs more practice on the assessment section.', 'module-02');

-- ─── Admin ─────────────────────────────────────────────────────────
-- Replace 'ADMIN_UUID' with actual auth.users id for admin@test.com
INSERT INTO users (id, email, name, role, college, batch, joined_date, onboarding_complete)
VALUES ('ADMIN_UUID', 'admin@test.com', 'Eve Admin', 'admin', 'CMU', '2026A', '2025-01-01', true);

INSERT INTO user_settings (user_id, theme, display_name)
VALUES ('ADMIN_UUID', 'light', 'Eve');

-- ─── Migration Status (mark all entities as migrated) ──────────────
INSERT INTO migration_status (user_id, entity)
SELECT 'INTERN_UUID', entity FROM (VALUES
  ('progress'), ('completed_items'), ('passed_quizzes'), ('module_progress'),
  ('xp_history'), ('weekly_goals'), ('mentor_checklist'),
  ('practice_submissions'), ('challenge_workspaces'), ('mentor_feedback')
) AS t(entity);
