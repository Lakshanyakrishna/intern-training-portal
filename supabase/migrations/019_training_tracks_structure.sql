-- Structural skeleton for opportunity-forte-based training tracks. No track
-- content/copy is decided yet -- this only adds the shape so tracks can be
-- slotted in later and mapped to one or more fortes without another schema
-- change. Deliberately many-to-many: a forte may end up with zero, one, or
-- several tracks, and a track (e.g. a shared "Git Fundamentals" one) may
-- apply to more than one forte -- not decided yet, per the product owner.

CREATE TABLE IF NOT EXISTS training_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS track_fortes (
  track_id UUID NOT NULL REFERENCES training_tracks(id) ON DELETE CASCADE,
  forte TEXT NOT NULL CHECK (forte IN ('Frontend', 'Backend', 'Agentic AI', 'Mobile Development', 'UI / UX Design')),
  PRIMARY KEY (track_id, forte)
);

-- One row per intern: which track they've been assigned (once tracks exist)
-- and the training deadline, per the pass/fail branching described by the
-- product owner (finish in time -> project placement; run out of time ->
-- training-certificate-only). Left unset until that policy is decided --
-- structure now, no automatic enforcement of the deadline yet.
CREATE TABLE IF NOT EXISTS intern_track_assignments (
  intern_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES training_tracks(id),
  training_deadline TIMESTAMPTZ,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE training_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_fortes ENABLE ROW LEVEL SECURITY;
ALTER TABLE intern_track_assignments ENABLE ROW LEVEL SECURITY;

-- Track catalog/mapping: any authenticated user can read (an intern needs to
-- see their own track's name), admin manages the catalog.
CREATE POLICY "training_tracks_read_auth" ON training_tracks
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "training_tracks_admin_all" ON training_tracks
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "track_fortes_read_auth" ON track_fortes
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "track_fortes_admin_all" ON track_fortes
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Per-intern assignment: the intern reads their own row; admin/mentor manage it.
CREATE POLICY "intern_track_assignments_read_own" ON intern_track_assignments
  FOR SELECT USING (auth.uid() = intern_id);
CREATE POLICY "intern_track_assignments_admin_mentor_all" ON intern_track_assignments
  FOR ALL USING (public.is_admin_or_mentor()) WITH CHECK (public.is_admin_or_mentor());

GRANT ALL ON TABLE training_tracks TO authenticated;
GRANT ALL ON TABLE track_fortes TO authenticated;
GRANT ALL ON TABLE intern_track_assignments TO authenticated;
