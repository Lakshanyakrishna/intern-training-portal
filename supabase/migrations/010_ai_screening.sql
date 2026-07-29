-- Phase D.7: AI Resume Screening
-- Run after 009_notifications.sql

-- ─── 1. Resume Files ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resume_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  extracted_text TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resume_files_application ON resume_files(application_id);

-- ─── 2. Resume Analyses ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resume_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,

  -- Scores (0-100)
  technical_score NUMERIC(5,2),
  projects_score NUMERIC(5,2),
  github_score NUMERIC(5,2),
  portfolio_score NUMERIC(5,2),
  education_score NUMERIC(5,2),
  experience_score NUMERIC(5,2),
  communication_score NUMERIC(5,2),
  learning_potential_score NUMERIC(5,2),
  motivation_score NUMERIC(5,2),
  resume_quality_score NUMERIC(5,2),
  overall_score NUMERIC(5,2),

  recommendation TEXT CHECK (recommendation IN ('strongly_recommend', 'recommend', 'neutral', 'weak', 'reject')),
  confidence_score NUMERIC(5,2),

  strengths JSONB DEFAULT '[]',
  weaknesses JSONB DEFAULT '[]',
  missing_skills TEXT[] DEFAULT '{}',
  risk_indicators JSONB DEFAULT '[]',
  positive_findings TEXT[] DEFAULT '{}',

  top_reasons TEXT[] DEFAULT '{}',
  raw_response JSONB DEFAULT '{}',
  model_used TEXT,
  analysis_version INTEGER NOT NULL DEFAULT 1,
  processing_time_ms INTEGER,
  analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resume_analyses_application ON resume_analyses(application_id);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_opportunity ON resume_analyses(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_recommendation ON resume_analyses(recommendation);

-- ─── 3. Resume Analysis Versions ──────────────────────────────────
CREATE TABLE IF NOT EXISTS resume_analysis_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  analysis_id UUID NOT NULL REFERENCES resume_analyses(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  trigger_reason TEXT NOT NULL DEFAULT 'initial',
  scores JSONB NOT NULL DEFAULT '{}',
  recommendation TEXT,
  strengths JSONB DEFAULT '[]',
  weaknesses JSONB DEFAULT '[]',
  missing_skills TEXT[] DEFAULT '{}',
  risk_indicators JSONB DEFAULT '[]',
  raw_response JSONB DEFAULT '{}',
  model_used TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resume_analysis_versions_app ON resume_analysis_versions(application_id);
CREATE INDEX IF NOT EXISTS idx_resume_analysis_versions_analysis ON resume_analysis_versions(analysis_id);

-- ─── 4. Opportunity Scoring Weights ───────────────────────────────
CREATE TABLE IF NOT EXISTS opportunity_scoring_weights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_category TEXT NOT NULL UNIQUE CHECK (opportunity_category IN ('frontend', 'backend', 'ai', 'qa', 'design', 'general')),
  technical_weight NUMERIC(5,2) NOT NULL DEFAULT 25.00,
  projects_weight NUMERIC(5,2) NOT NULL DEFAULT 20.00,
  github_weight NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  portfolio_weight NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  education_weight NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  experience_weight NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  communication_weight NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  learning_potential_weight NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  motivation_weight NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default weights for each category
INSERT INTO opportunity_scoring_weights (opportunity_category, technical_weight, projects_weight, github_weight, portfolio_weight, education_weight, experience_weight, communication_weight, learning_potential_weight, motivation_weight) VALUES
  ('frontend', 25.00, 20.00, 10.00, 15.00, 5.00, 10.00, 5.00, 10.00, 5.00),
  ('backend',  28.00, 18.00, 12.00, 5.00,  5.00, 12.00, 5.00, 10.00, 5.00),
  ('ai',       30.00, 15.00, 10.00, 5.00,  10.00, 10.00, 5.00, 12.00, 3.00),
  ('qa',       20.00, 15.00, 8.00,  5.00,  5.00, 15.00, 10.00, 12.00, 10.00),
  ('design',   15.00, 15.00, 5.00,  25.00, 5.00, 10.00, 10.00, 10.00, 5.00),
  ('general',  20.00, 20.00, 10.00, 10.00, 5.00, 10.00, 5.00, 10.00, 10.00)
ON CONFLICT (opportunity_category) DO NOTHING;

-- ─── Add screening_status to applications ─────────────────────────
ALTER TABLE applications ADD COLUMN IF NOT EXISTS screening_status TEXT
  DEFAULT 'pending' CHECK (screening_status IN ('pending', 'processing', 'analyzed', 'failed'));

UPDATE applications SET screening_status = 'pending' WHERE screening_status IS NULL;

-- ─── RLS ───────────────────────────────────────────────────────────
ALTER TABLE resume_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analysis_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_scoring_weights ENABLE ROW LEVEL SECURITY;

-- Resume files: applicants insert own, admin/mentor read all
CREATE POLICY "resume_files_insert_applicant" ON resume_files
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM applications WHERE id = application_id AND email = auth.email())
  );

CREATE POLICY "resume_files_read_own" ON resume_files
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM applications WHERE id = application_id AND (user_id = auth.uid() OR email = auth.email()))
  );

CREATE POLICY "resume_files_admin_all" ON resume_files
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'mentor'))
  );

-- Resume analyses: admin/mentor read all, applicant read own
CREATE POLICY "resume_analyses_read_applicant" ON resume_analyses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM applications WHERE id = application_id AND (user_id = auth.uid() OR email = auth.email()))
  );

CREATE POLICY "resume_analyses_admin_all" ON resume_analyses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'mentor'))
  );

-- Analysis versions: same as analyses
CREATE POLICY "resume_analysis_versions_read_applicant" ON resume_analysis_versions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM applications WHERE id = application_id AND (user_id = auth.uid() OR email = auth.email()))
  );

CREATE POLICY "resume_analysis_versions_admin_all" ON resume_analysis_versions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'mentor'))
  );

-- Scoring weights: admin only
CREATE POLICY "opportunity_scoring_weights_admin_all" ON opportunity_scoring_weights
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "opportunity_scoring_weights_read_auth" ON opportunity_scoring_weights
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─── Grants ────────────────────────────────────────────────────────
GRANT ALL ON TABLE resume_files TO authenticated;
GRANT SELECT ON TABLE resume_files TO anon;
GRANT ALL ON TABLE resume_analyses TO authenticated;
GRANT ALL ON TABLE resume_analysis_versions TO authenticated;
GRANT ALL ON TABLE opportunity_scoring_weights TO authenticated;
GRANT SELECT ON TABLE opportunity_scoring_weights TO anon;

-- ─── Triggers ──────────────────────────────────────────────────────
CREATE TRIGGER opportunity_scoring_weights_updated_at
  BEFORE UPDATE ON opportunity_scoring_weights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
