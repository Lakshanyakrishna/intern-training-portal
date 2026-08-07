-- Self-service "Begin Training" -- lets an applicant who has already
-- confirmed their offer (offer_accepted_at, see 022_offer_acceptance.sql)
-- promote their own account to intern, instead of waiting on an admin to
-- run AdminConversion.tsx. A direct client-side `UPDATE users SET role =
-- 'intern'` would be rejected by trg_guard_user_role_field (018) -- that
-- guard deliberately blocks any non-admin role change issued at trigger
-- depth <= 1. promote_linked_applicant (018) gets past it by being a
-- trigger itself, which pushes the nested UPDATE to depth 2; this function
-- isn't a trigger, so it needs its own narrow, explicit bypass instead.
--
-- Session-local app.bypass_role_guard flag scopes that bypass to exactly
-- this UPDATE -- it's set with is_local=true (resets automatically at the
-- end of the transaction), so it can never leak into some other statement
-- on the same connection.

CREATE OR REPLACE FUNCTION public.guard_user_role_field()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role
     AND NOT public.is_admin()
     AND pg_trigger_depth() <= 1
     AND current_setting('app.bypass_role_guard', true) IS DISTINCT FROM 'on' THEN
    RAISE EXCEPTION 'Not allowed to change role';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.begin_training()
RETURNS VOID AS $$
DECLARE
  v_role TEXT;
  v_eligible BOOLEAN;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid();

  IF v_role IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  IF v_role <> 'applicant' THEN
    RETURN; -- already promoted (or not eligible) -- idempotent no-op
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.applications
    WHERE user_id = auth.uid() AND status = 'accepted' AND offer_accepted_at IS NOT NULL
  ) INTO v_eligible;

  IF NOT v_eligible THEN
    RAISE EXCEPTION 'No accepted offer found for this account';
  END IF;

  PERFORM set_config('app.bypass_role_guard', 'on', true);
  UPDATE public.users SET role = 'intern', onboarding_complete = false WHERE id = auth.uid();
  PERFORM set_config('app.bypass_role_guard', 'off', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.begin_training() TO authenticated;
