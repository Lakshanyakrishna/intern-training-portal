-- PRD §12.1 launch scope: multi-tenancy *data structure* only (single
-- organisation), and an audit log scoped to application status changes only.
-- Enforcement across every policy (CR-001-006) and full audit coverage are
-- explicitly deferred to post-launch (§12.2) -- not built here.

-- ─── Organizations (structure only, single row) ───────────────────

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO organizations (name, slug)
VALUES ('Fraylon Technologies LLP', 'fraylon')
ON CONFLICT (slug) DO NOTHING;

-- Nullable on the three anchor entities the Backend Schema document names
-- first ("Users, Opportunities, Applications"). Left nullable, not backfilled
-- to NOT NULL, and with no RLS scoping added -- adding the enforcement pass
-- now would mean every existing policy needs an org check under deadline
-- pressure, which is exactly the risk the PRD (R5) says to avoid.
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

UPDATE users SET organization_id = (SELECT id FROM organizations WHERE slug = 'fraylon') WHERE organization_id IS NULL;
UPDATE opportunities SET organization_id = (SELECT id FROM organizations WHERE slug = 'fraylon') WHERE organization_id IS NULL;
UPDATE applications SET organization_id = (SELECT id FROM organizations WHERE slug = 'fraylon') WHERE organization_id IS NULL;

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "organizations_read_auth" ON organizations
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "organizations_admin_all" ON organizations
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
GRANT ALL ON TABLE organizations TO authenticated;

-- ─── Audit events (application status changes only) ───────────────
-- Filled exclusively by a SECURITY DEFINER trigger. No INSERT/UPDATE/DELETE
-- grant to authenticated or anon at all -- if the browser can write to it,
-- it is not an audit log.

CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  before JSONB,
  after JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_events_admin_read" ON audit_events
  FOR SELECT USING (public.is_admin());

GRANT SELECT ON TABLE audit_events TO authenticated;

CREATE OR REPLACE FUNCTION public.log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.audit_events (actor_id, action, entity_type, entity_id, before, after)
    VALUES (
      auth.uid(),
      'application_status_changed',
      'application',
      NEW.id,
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_log_application_status_change
  AFTER UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION public.log_application_status_change();
