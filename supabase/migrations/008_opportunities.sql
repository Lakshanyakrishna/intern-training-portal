-- Phase D.4: Opportunity Management System
-- Run after 007_identity_linkage.sql

-- ─── 1. Opportunities ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'internship' CHECK (category IN ('internship', 'training', 'fellowship', 'project')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  start_date DATE,
  end_date DATE,
  slots INTEGER CHECK (slots > 0),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category);

-- ─── 2. Opportunity Questions ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS opportunity_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'textarea', 'select')),
  required BOOLEAN NOT NULL DEFAULT true,
  options JSONB,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opp_q_opportunity ON opportunity_questions(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opp_q_sort ON opportunity_questions(opportunity_id, sort_order);

-- ─── 3. Link applications to opportunities ─────────────────────────
ALTER TABLE applications ADD COLUMN IF NOT EXISTS opportunity_id UUID REFERENCES opportunities(id);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS answers JSONB;

CREATE INDEX IF NOT EXISTS idx_applications_opportunity ON applications(opportunity_id);

-- ─── RLS ───────────────────────────────────────────────────────────
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_questions ENABLE ROW LEVEL SECURITY;

-- Opportunities: public can read active, admin all
CREATE POLICY "opportunities_read_active" ON opportunities
  FOR SELECT USING (status = 'active' OR public.is_admin_or_mentor());

CREATE POLICY "opportunities_admin_all" ON opportunities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Questions: public can read for active opportunities, admin all
CREATE POLICY "opportunity_questions_read_active" ON opportunity_questions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM opportunities WHERE id = opportunity_id AND (status = 'active' OR public.is_admin_or_mentor()))
  );

CREATE POLICY "opportunity_questions_admin_all" ON opportunity_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Grants ────────────────────────────────────────────────────────
GRANT ALL ON TABLE opportunities TO authenticated;
GRANT SELECT ON TABLE opportunities TO anon;
GRANT ALL ON TABLE opportunity_questions TO authenticated;
GRANT SELECT ON TABLE opportunity_questions TO anon;

-- ─── Triggers ──────────────────────────────────────────────────────
CREATE TRIGGER opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
