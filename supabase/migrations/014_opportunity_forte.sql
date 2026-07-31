-- Adds a "forte" (track) tag to opportunities so the public opportunities page can
-- filter real, live opportunities by track instead of only using it for pre-launch preview UI.
ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS forte text;

ALTER TABLE public.opportunities
  DROP CONSTRAINT IF EXISTS opportunities_forte_check;

ALTER TABLE public.opportunities
  ADD CONSTRAINT opportunities_forte_check
  CHECK (forte IS NULL OR forte IN ('Frontend', 'Backend', 'Agentic AI', 'Mobile Development', 'UI / UX Design'));
