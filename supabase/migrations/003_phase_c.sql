-- Phase C: Recruitment & Intern Lifecycle
-- Run after 002_phase_b.sql

-- ─── 1. Enhance applications table ────────────────────────────────
ALTER TABLE applications ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS major TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS why_join TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS heard_from TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS reviewer_id UUID REFERENCES users(id);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS reviewer_notes TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Replace old status check with new statuses
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;
ALTER TABLE applications ADD CONSTRAINT applications_status_check
  CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'));

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_reviewer_id ON applications(reviewer_id);

-- ─── 2. Interviews ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES users(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 45,
  interviewers TEXT[] NOT NULL DEFAULT '{}',
  meet_link TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interviews_applicant ON interviews(applicant_id);
CREATE INDEX IF NOT EXISTS idx_interviews_application ON interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);

-- ─── 3. Interview Evaluations ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS interview_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  evaluator_id UUID NOT NULL REFERENCES users(id),
  technical_score INTEGER CHECK (technical_score BETWEEN 1 AND 10),
  communication_score INTEGER CHECK (communication_score BETWEEN 1 AND 10),
  problem_solving_score INTEGER CHECK (problem_solving_score BETWEEN 1 AND 10),
  overall_score INTEGER CHECK (overall_score BETWEEN 1 AND 10),
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  notes TEXT,
  recommendation TEXT CHECK (recommendation IN ('strong_accept', 'accept', 'maybe', 'reject')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(interview_id, evaluator_id)
);

CREATE INDEX IF NOT EXISTS idx_interview_eval_interview ON interview_evaluations(interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_eval_evaluator ON interview_evaluations(evaluator_id);

-- ─── 4. Mentor Assignments ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mentor_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  UNIQUE(intern_id)
);

CREATE INDEX IF NOT EXISTS idx_mentor_assignments_mentor ON mentor_assignments(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_assignments_intern ON mentor_assignments(intern_id);
CREATE INDEX IF NOT EXISTS idx_mentor_assignments_status ON mentor_assignments(status);

-- ─── 5. Readiness Evaluations ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS readiness_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  evaluator_id UUID NOT NULL REFERENCES users(id),
  technical_readiness INTEGER CHECK (technical_readiness BETWEEN 1 AND 5),
  communication_readiness INTEGER CHECK (communication_readiness BETWEEN 1 AND 5),
  problem_solving_readiness INTEGER CHECK (problem_solving_readiness BETWEEN 1 AND 5),
  overall_readiness INTEGER CHECK (overall_readiness BETWEEN 1 AND 5),
  strengths TEXT[] DEFAULT '{}',
  areas_for_improvement TEXT[] DEFAULT '{}',
  recommendation TEXT CHECK (recommendation IN ('ready', 'needs_improvement', 'not_ready')),
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_readiness_eval_intern ON readiness_evaluations(intern_id);
CREATE INDEX IF NOT EXISTS idx_readiness_eval_recommendation ON readiness_evaluations(recommendation);

-- ─── 6. Project Allocations ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'allocated' CHECK (status IN ('allocated', 'in-progress', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_allocations_intern ON project_allocations(intern_id);
CREATE INDEX IF NOT EXISTS idx_project_allocations_status ON project_allocations(status);

-- ─── Grants ────────────────────────────────────────────────────────
GRANT ALL ON TABLE interviews TO authenticated;
GRANT ALL ON TABLE interview_evaluations TO authenticated;
GRANT ALL ON TABLE mentor_assignments TO authenticated;
GRANT ALL ON TABLE readiness_evaluations TO authenticated;
GRANT ALL ON TABLE project_allocations TO authenticated;
GRANT INSERT ON TABLE applications TO anon;
GRANT ALL ON TABLE applications TO authenticated;

-- ─── RLS Policies ─────────────────────────────────────────────────
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE readiness_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_allocations ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies on applications to replace them
DROP POLICY IF EXISTS "applications_admin_all" ON applications;
DROP POLICY IF EXISTS "applications_insert_public" ON applications;

-- Applications: public can insert, users can read own, admin/mentor can read all
CREATE POLICY "applications_insert_public" ON applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "applications_read_own" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "applications_admin_all" ON applications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'mentor'))
  );

-- Interviews: applicants + admin/mentor
CREATE POLICY "interviews_read_applicant" ON interviews
  FOR SELECT USING (auth.uid() = applicant_id);

CREATE POLICY "interviews_admin_all" ON interviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'mentor'))
  );

-- Interview evaluations: admin/mentor only
CREATE POLICY "interview_evaluations_admin_all" ON interview_evaluations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'mentor'))
  );

-- Mentor assignments: interns read own, mentors read their mentees, admin all
CREATE POLICY "mentor_assignments_read_intern" ON mentor_assignments
  FOR SELECT USING (auth.uid() = intern_id);

CREATE POLICY "mentor_assignments_read_mentor" ON mentor_assignments
  FOR SELECT USING (auth.uid() = mentor_id);

CREATE POLICY "mentor_assignments_admin_all" ON mentor_assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Readiness evaluations: intern read own, mentor/mentor read assigned, admin all
CREATE POLICY "readiness_evaluations_read_intern" ON readiness_evaluations
  FOR SELECT USING (auth.uid() = intern_id);

CREATE POLICY "readiness_evaluations_mentor_all" ON readiness_evaluations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'mentor'))
  );

-- Project allocations: intern read own, admin all
CREATE POLICY "project_allocations_read_intern" ON project_allocations
  FOR SELECT USING (auth.uid() = intern_id);

CREATE POLICY "project_allocations_admin_all" ON project_allocations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Triggers for updated_at
CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER project_allocations_updated_at
  BEFORE UPDATE ON project_allocations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
