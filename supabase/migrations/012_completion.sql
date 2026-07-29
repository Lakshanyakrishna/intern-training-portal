-- Phase D.8: Certificates, Completion & Internship Outcomes
-- Run after 011_storage_resumes.sql

-- ─── 1. Training Certificates ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS training_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  certificate_number TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  generated_pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_training_certs_user ON training_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_training_certs_opportunity ON training_certificates(opportunity_id);

-- ─── 2. Internship Certificates ───────────────────────────────────
CREATE TABLE IF NOT EXISTS internship_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  project_id UUID REFERENCES project_allocations(id) ON DELETE SET NULL,
  mentor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  certificate_number TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  generated_pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_internship_certs_user ON internship_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_internship_certs_project ON internship_certificates(project_id);

-- ─── 3. Internship Outcomes ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS internship_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  training_completed BOOLEAN NOT NULL DEFAULT FALSE,
  readiness_score NUMERIC(5,2),
  project_completed BOOLEAN NOT NULL DEFAULT FALSE,
  mentor_approved BOOLEAN NOT NULL DEFAULT FALSE,
  internship_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  mentor_notes TEXT,
  final_rating NUMERIC(3,1) CHECK (final_rating BETWEEN 1.0 AND 5.0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

CREATE INDEX IF NOT EXISTS idx_outcomes_user ON internship_outcomes(user_id);
CREATE INDEX IF NOT EXISTS idx_outcomes_completed ON internship_outcomes(internship_completed);

-- ─── 4. Add outcome fields to project_allocations ─────────────────
ALTER TABLE project_allocations ADD COLUMN IF NOT EXISTS outcome TEXT
  CHECK (outcome IN ('successful', 'partially_successful', 'unsuccessful'));
ALTER TABLE project_allocations ADD COLUMN IF NOT EXISTS mentor_notes TEXT;
ALTER TABLE project_allocations ADD COLUMN IF NOT EXISTS lessons_learned TEXT;
ALTER TABLE project_allocations ADD COLUMN IF NOT EXISTS skills_demonstrated TEXT[];
ALTER TABLE project_allocations ADD COLUMN IF NOT EXISTS completed_date DATE;
ALTER TABLE project_allocations ADD COLUMN IF NOT EXISTS mentor_approved BOOLEAN DEFAULT FALSE;

-- ─── 5. Add completion fields to mentor_assignments ───────────────
ALTER TABLE mentor_assignments ADD COLUMN IF NOT EXISTS completion_status TEXT
  DEFAULT 'pending' CHECK (completion_status IN ('pending', 'approved', 'additional_work', 'rejected'));
ALTER TABLE mentor_assignments ADD COLUMN IF NOT EXISTS completion_reviewed_at TIMESTAMPTZ;
ALTER TABLE mentor_assignments ADD COLUMN IF NOT EXISTS completion_review_notes TEXT;

-- ─── RLS ───────────────────────────────────────────────────────────
ALTER TABLE training_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_outcomes ENABLE ROW LEVEL SECURITY;

-- Training certificates: user reads own, admin all
CREATE POLICY "training_certificates_read_own" ON training_certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "training_certificates_admin_all" ON training_certificates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Internship certificates: user reads own, admin all
CREATE POLICY "internship_certificates_read_own" ON internship_certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "internship_certificates_admin_all" ON internship_certificates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Internship outcomes: user reads own, admin/mentor read/update all
CREATE POLICY "internship_outcomes_read_own" ON internship_outcomes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "internship_outcomes_admin_all" ON internship_outcomes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'mentor'))
  );

-- ─── Grants ────────────────────────────────────────────────────────
GRANT ALL ON TABLE training_certificates TO authenticated;
GRANT ALL ON TABLE internship_certificates TO authenticated;
GRANT ALL ON TABLE internship_outcomes TO authenticated;

-- ─── Triggers ──────────────────────────────────────────────────────
CREATE TRIGGER internship_outcomes_updated_at
  BEFORE UPDATE ON internship_outcomes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
