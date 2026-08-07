-- Real module content skeleton, sitting on top of the track/forte structure
-- from 019_training_tracks_structure.sql. That migration deliberately left
-- curriculum content undecided -- this adds the shape a module needs to
-- exist (title/description/order), scoped to a single track. Since a track
-- can already be tagged to one or more fortes via track_fortes, a module
-- automatically only ever shows up for the fortes its track applies to --
-- no separate forte column needed here.
--
-- No content/copy is seeded. This is intentionally the same "structure now,
-- real content later" pattern as 019 itself.

CREATE TABLE IF NOT EXISTS training_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES training_tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  estimated_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One row per intern per module they've marked done. Real, not the old
-- localStorage-only mock progress -- an intern can only ever write their
-- own rows (auth.uid() = intern_id), same ownership pattern used
-- throughout this schema (applications, intern_track_assignments, etc).
CREATE TABLE IF NOT EXISTS intern_module_completions (
  intern_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (intern_id, module_id)
);

ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE intern_module_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "training_modules_read_auth" ON training_modules
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "training_modules_admin_all" ON training_modules
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "intern_module_completions_own" ON intern_module_completions
  FOR ALL USING (auth.uid() = intern_id) WITH CHECK (auth.uid() = intern_id);
CREATE POLICY "intern_module_completions_admin_mentor_read" ON intern_module_completions
  FOR SELECT USING (public.is_admin_or_mentor());

GRANT ALL ON TABLE training_modules TO authenticated;
GRANT ALL ON TABLE intern_module_completions TO authenticated;
