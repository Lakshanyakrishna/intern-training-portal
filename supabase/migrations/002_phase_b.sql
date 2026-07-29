-- Phase B: Normalized Progress, XP, Submissions, Mentor Feedback
-- Run this in the Supabase SQL Editor after Phase A migration (001_phase_a.sql)

-- 1. Core progress metrics (1 row per user)
CREATE TABLE IF NOT EXISTS progress (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak INTEGER NOT NULL DEFAULT 0,
  last_active DATE NOT NULL DEFAULT CURRENT_DATE,
  training_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Completed items (polymorphic: lessons, practices, challenges, debug scenarios, etc.)
CREATE TABLE IF NOT EXISTS completed_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN (
    'lesson', 'practice', 'challenge',
    'debug_scenario', 'client_project_day',
    'review_request', 'journey_stage'
  )),
  item_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- 3. Passed quizzes (assessments per module)
CREATE TABLE IF NOT EXISTS passed_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  passed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- 4. Module progress (per-module state, checkpoints/assessment as JSONB for flexibility)
CREATE TABLE IF NOT EXISTS module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  quiz_passed BOOLEAN NOT NULL DEFAULT FALSE,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  checkpoints JSONB NOT NULL DEFAULT '{}',
  assessment_attempts JSONB NOT NULL DEFAULT '[]',
  UNIQUE(user_id, module_id)
);

-- 5. XP history
CREATE TABLE IF NOT EXISTS xp_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount INTEGER NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Weekly goals
CREATE TABLE IF NOT EXISTS weekly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  labs INTEGER NOT NULL DEFAULT 3,
  labs_completed INTEGER NOT NULL DEFAULT 0,
  assessments INTEGER NOT NULL DEFAULT 1,
  assessments_completed INTEGER NOT NULL DEFAULT 0,
  weekly_xp INTEGER NOT NULL DEFAULT 0,
  weekly_xp_target INTEGER NOT NULL DEFAULT 300,
  UNIQUE(user_id, week_start)
);

-- 7. Mentor checklist
CREATE TABLE IF NOT EXISTS mentor_checklist (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  github_profile TEXT NOT NULL DEFAULT '',
  deployed_project_link TEXT NOT NULL DEFAULT '',
  repository_link TEXT NOT NULL DEFAULT '',
  challenges_completed TEXT[] NOT NULL DEFAULT '{}',
  submitted BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Practice submissions
CREATE TABLE IF NOT EXISTS practice_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  submission TEXT NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- 9. Challenge workspaces
CREATE TABLE IF NOT EXISTS challenge_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  submission TEXT NOT NULL DEFAULT '',
  hints_revealed INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'submitted')),
  UNIQUE(user_id, challenge_id)
);

-- 10. Mentor feedback
CREATE TABLE IF NOT EXISTS mentor_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  score INTEGER NOT NULL,
  note TEXT,
  module TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Migration status (tracks which entities have been migrated per user)
CREATE TABLE IF NOT EXISTS migration_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity TEXT NOT NULL CHECK (entity IN (
    'progress', 'completed_items', 'passed_quizzes',
    'module_progress', 'xp_history', 'weekly_goals',
    'mentor_checklist', 'practice_submissions',
    'challenge_workspaces', 'mentor_feedback'
  )),
  migrated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, entity)
);

-- Grant base privileges to authenticated users (RLS policies filter within these)
GRANT ALL ON TABLE progress TO authenticated;
GRANT ALL ON TABLE completed_items TO authenticated;
GRANT ALL ON TABLE passed_quizzes TO authenticated;
GRANT ALL ON TABLE module_progress TO authenticated;
GRANT ALL ON TABLE xp_history TO authenticated;
GRANT ALL ON TABLE weekly_goals TO authenticated;
GRANT ALL ON TABLE mentor_checklist TO authenticated;
GRANT ALL ON TABLE practice_submissions TO authenticated;
GRANT ALL ON TABLE challenge_workspaces TO authenticated;
GRANT ALL ON TABLE mentor_feedback TO authenticated;
GRANT ALL ON TABLE migration_status TO authenticated;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_completed_items_user ON completed_items(user_id);
CREATE INDEX IF NOT EXISTS idx_completed_items_type ON completed_items(user_id, item_type);
CREATE INDEX IF NOT EXISTS idx_module_progress_user ON module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_history_user ON xp_history(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_history_date ON xp_history(user_id, date);
CREATE INDEX IF NOT EXISTS idx_weekly_goals_user ON weekly_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_submissions_user ON practice_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_workspaces_user ON challenge_workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_feedback_user ON mentor_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_passed_quizzes_user ON passed_quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_migration_status_user ON migration_status(user_id);

-- RLS: Users can only access their own data
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE passed_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_status ENABLE ROW LEVEL SECURITY;

-- Apply RLS policies (select/insert/update/delete own data)
CREATE POLICY "progress_own" ON progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "completed_items_own" ON completed_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "passed_quizzes_own" ON passed_quizzes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "module_progress_own" ON module_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "xp_history_own" ON xp_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "weekly_goals_own" ON weekly_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "mentor_checklist_own" ON mentor_checklist FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "practice_submissions_own" ON practice_submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "challenge_workspaces_own" ON challenge_workspaces FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "mentor_feedback_own" ON mentor_feedback FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "migration_status_own" ON migration_status FOR ALL USING (auth.uid() = user_id);

-- Admins/mentors can read all progress for leaderboard
CREATE POLICY "progress_admin_read" ON progress
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'mentor'))
  );
CREATE POLICY "completed_items_admin_read" ON completed_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'mentor'))
  );

-- Leaderboard: authenticated users can read aggregated progress for ranking
CREATE POLICY "progress_read_for_leaderboard" ON progress
  FOR SELECT USING (auth.role() = 'authenticated');

-- Leaderboard RPC (aggregated data, read-only for all authenticated users)
CREATE OR REPLACE FUNCTION get_leaderboard()
RETURNS TABLE(
  user_id UUID,
  name TEXT,
  level INTEGER,
  xp INTEGER,
  completed_lessons BIGINT,
  completed_challenges BIGINT,
  passed_quizzes BIGINT,
  assessment_score INTEGER
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.name,
    COALESCE(p.level, 1)::INTEGER,
    COALESCE(p.xp, 0)::INTEGER,
    (SELECT COUNT(*) FROM completed_items ci WHERE ci.user_id = u.id AND ci.item_type = 'lesson')::BIGINT,
    (SELECT COUNT(*) FROM completed_items ci WHERE ci.user_id = u.id AND ci.item_type = 'challenge')::BIGINT,
    (SELECT COUNT(*) FROM passed_quizzes pq WHERE pq.user_id = u.id)::BIGINT,
    COALESCE((
      SELECT SUM(
        COALESCE((mp.assessment_attempts #>> '{bestScore}')::INTEGER, 0)
      ) FROM module_progress mp WHERE mp.user_id = u.id
    ), 0)::INTEGER
  FROM users u
  LEFT JOIN progress p ON p.user_id = u.id
  ORDER BY COALESCE(p.xp, 0) DESC;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER progress_updated_at
  BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER mentor_checklist_updated_at
  BEFORE UPDATE ON mentor_checklist
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
