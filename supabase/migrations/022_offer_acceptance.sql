-- Applicant consent gate for the intern conversion flow. Today an admin
-- marking an application 'accepted' is the entire story -- the applicant
-- has no say and is silently promoted the moment an admin also clicks
-- "Convert" in AdminConversion. This adds a real acceptance step: the
-- applicant must confirm before they show up as ready to convert.
--
-- offer_accepted_at is written through a narrow SECURITY DEFINER function
-- rather than a general UPDATE policy, matching the pattern already used
-- for promote_linked_applicant/guard_user_role_field (018) -- a normal
-- UPDATE policy would need a trigger to stop applicants from touching any
-- other column on their row; a single-purpose function is simpler to audit
-- and doesn't touch the existing applications_link_to_user policy at all.

ALTER TABLE applications ADD COLUMN IF NOT EXISTS offer_accepted_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.accept_offer(p_application_id UUID)
RETURNS VOID AS $$
DECLARE
  v_status TEXT;
  v_user_id UUID;
  v_already_accepted TIMESTAMPTZ;
BEGIN
  SELECT status, user_id, offer_accepted_at
    INTO v_status, v_user_id, v_already_accepted
    FROM public.applications
    WHERE id = p_application_id;

  IF v_user_id IS NULL OR v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Not authorized to accept this offer';
  END IF;

  IF v_status != 'accepted' THEN
    RAISE EXCEPTION 'This application has not been offered yet';
  END IF;

  IF v_already_accepted IS NOT NULL THEN
    RETURN; -- already confirmed, idempotent no-op rather than an error
  END IF;

  UPDATE public.applications SET offer_accepted_at = NOW() WHERE id = p_application_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.accept_offer(UUID) TO authenticated;
