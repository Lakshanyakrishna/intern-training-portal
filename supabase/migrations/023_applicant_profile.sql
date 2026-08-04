-- Reusable applicant profile: fill in once, apply fast everywhere after.
-- Extends `users` with the fields Apply.tsx currently asks for on every
-- submission (phone, major -- college/year_of_study already existed),
-- plus career links that never had a home anywhere in the schema.

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS major TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS portfolio_url TEXT;

-- Work/project experience is one-to-many, so it can't live on `users`.
CREATE TABLE IF NOT EXISTS applicant_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applicant_experiences_user ON applicant_experiences(user_id);

ALTER TABLE applicant_experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "applicant_experiences_own_all" ON applicant_experiences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "applicant_experiences_admin_mentor_read" ON applicant_experiences
  FOR SELECT USING (public.is_admin_or_mentor());

GRANT ALL ON TABLE applicant_experiences TO authenticated;

-- resume_files was built assuming a resume only ever gets uploaded *after*
-- an application exists (application_id NOT NULL). For a profile-level
-- resume uploaded before any application, both application_id and a new
-- user_id need to coexist: application_id stays null until/unless the
-- resume is later attached to a real application.
ALTER TABLE resume_files ALTER COLUMN application_id DROP NOT NULL;
ALTER TABLE resume_files ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- A profile resume has no application row to check ownership against, so
-- it needs its own insert/read policies keyed directly on user_id. The
-- existing application-scoped policies (010_ai_screening.sql) are
-- untouched and still apply once application_id is set.
CREATE POLICY "resume_files_insert_profile" ON resume_files
  FOR INSERT WITH CHECK (user_id = auth.uid() AND application_id IS NULL);

CREATE POLICY "resume_files_read_own_by_user" ON resume_files
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "resume_files_delete_own_profile" ON resume_files
  FOR DELETE USING (user_id = auth.uid() AND application_id IS NULL);
