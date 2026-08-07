-- Real withdrawal capability. Before this, the applicant dashboard's
-- "Withdraw Application" button (with its "this can't be undone" warning)
-- only flipped local mock UI state -- a real applicant clicking it would
-- see a scary confirmation, believe it worked, and find their real
-- application completely unchanged on next load. This makes it real.
--
-- withdrawn_at follows the same narrow SECURITY DEFINER pattern as
-- offer_accepted_at (022_offer_acceptance.sql) rather than a general UPDATE
-- policy, for the same reason: an applicant should only ever be able to
-- flip this one column on their own row, never anything else.
--
-- Withdrawal is only allowed before a final decision (pending/reviewed/
-- shortlisted) -- once accepted or rejected, the outcome is already
-- decided and withdrawing no longer makes sense.

ALTER TABLE applications ADD COLUMN IF NOT EXISTS withdrawn_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.withdraw_application(p_application_id UUID)
RETURNS VOID AS $$
DECLARE
  v_status TEXT;
  v_user_id UUID;
  v_already_withdrawn TIMESTAMPTZ;
BEGIN
  SELECT status, user_id, withdrawn_at
    INTO v_status, v_user_id, v_already_withdrawn
    FROM public.applications
    WHERE id = p_application_id;

  IF v_user_id IS NULL OR v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Not authorized to withdraw this application';
  END IF;

  IF v_already_withdrawn IS NOT NULL THEN
    RETURN; -- already withdrawn, idempotent no-op rather than an error
  END IF;

  IF v_status IN ('accepted', 'rejected') THEN
    RAISE EXCEPTION 'This application has already been decided and can no longer be withdrawn';
  END IF;

  UPDATE public.applications SET withdrawn_at = NOW() WHERE id = p_application_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.withdraw_application(UUID) TO authenticated;
