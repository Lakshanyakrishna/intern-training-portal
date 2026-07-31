-- Real, serious gap found while adding the applicant role: `users_update_own`
-- (001_phase_a.sql) is `FOR UPDATE USING (auth.uid() = id)` with NO
-- `WITH CHECK` -- exactly the bug Blueprint Rule 3 warns about, but it was
-- never applied to the users table itself. Any authenticated user can
-- currently set their own role to 'admin' with a direct client-side
-- `.update({ role: 'admin' }).eq('id', auth.uid())`, bypassing every
-- ProtectedRoute check. This violates FR-007 ("Users cannot change their
-- own role", Must-have) at the one layer that actually matters (NFR-001).
--
-- Separately: there has never been an admin UPDATE policy on `users` at
-- all. AdminConversion.tsx's `updateUser(app.userId, { role: 'intern' })`
-- targets a DIFFERENT user's row, which `users_update_own` (auth.uid() = id)
-- does not permit -- so the entire intern-conversion feature has silently
-- been a no-op (0 rows updated, no error thrown) since it was built.
--
-- A third, more basic gap found while verifying the above with `\dp`:
-- `authenticated` was never GRANTed UPDATE on `users` at the table level at
-- all (only INSERT/SELECT -- see 001_phase_a.sql:52-53), so `users_update_own`
-- has never been reachable either. Every self-service profile update
-- (`completeOnboarding`, name/college edits) has always failed with
-- "permission denied for table users" -- masked by AuthContext.tsx's own
-- `catch { /* fallback: continue with local state */ }` around that call.
--
-- Fixes, using the existing trigger pattern (guard_application_fields) since
-- a plain RLS policy cannot compare OLD vs NEW column values (Rule 5):

-- 0. The missing base grant.
GRANT UPDATE ON TABLE users TO authenticated;

-- 1. A user can only ever insert themselves as the lowest-privilege role.
DROP POLICY IF EXISTS "users_insert_own" ON users;
CREATE POLICY "users_insert_own" ON users
  FOR INSERT WITH CHECK (auth.uid() = id AND role = 'applicant');

-- 2. Admin-only helper (is_admin_or_mentor() is too broad for role changes --
-- "Manage users" is admin-only per the role capability matrix).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 3. Admins can update any user's row (role changes, onboarding, etc).
CREATE POLICY "users_admin_update_all" ON users
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. Nobody (including admin's own self-row, and any non-admin caller under
-- users_update_own) can change `role` on an UPDATE except through the admin
-- policy above -- enforced by trigger since RLS itself can't compare
-- OLD.role to NEW.role.
-- pg_trigger_depth() > 1 means this UPDATE was fired from inside another
-- trigger (promote_linked_applicant below), not issued directly by client
-- code -- verified by hand: without this check, promote_linked_applicant's
-- own role change gets blocked by this same guard, because auth.uid() still
-- resolves to the original (non-admin) caller even inside a SECURITY
-- DEFINER function; SECURITY DEFINER changes which grants/RLS apply to the
-- statement, not what auth.uid() returns, and triggers fire regardless of
-- RLS bypass.
CREATE OR REPLACE FUNCTION public.guard_user_role_field()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role
     AND NOT public.is_admin()
     AND pg_trigger_depth() <= 1 THEN
    RAISE EXCEPTION 'Not allowed to change role';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_guard_user_role_field
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION public.guard_user_role_field();

-- 5. Auto-promote applicant -> intern the moment their application is
-- linked (FR-006) if it's already accepted (App Flow: "If accepted, they
-- create an account and their existing application is linked to it").
-- Runs as SECURITY DEFINER so it isn't subject to the trigger/policy above --
-- this is the one legitimate server-controlled path to that promotion.
CREATE OR REPLACE FUNCTION public.promote_linked_applicant()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL AND OLD.user_id IS NULL AND NEW.status = 'accepted' THEN
    UPDATE public.users SET role = 'intern' WHERE id = NEW.user_id AND role = 'applicant';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_promote_linked_applicant
  AFTER UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION public.promote_linked_applicant();

-- 6. Independent bug, found while verifying the above by hand: an UPDATE's
-- USING clause alone isn't enough for a row to be a candidate for that
-- UPDATE -- Postgres also requires the row to pass an applicable SELECT
-- policy (it plans the update as an implicit scan first). applications_
-- read_own (auth.uid() = user_id) does not match an unlinked row
-- (user_id IS NULL), so applications_link_to_user's UPDATE has never
-- actually matched any row in practice -- FR-006 (account linking) has
-- silently never worked. Verified: adding this policy is what made the
-- link UPDATE start returning rows_affected > 0 in manual testing.
CREATE POLICY "applications_read_unlinked_own_email" ON applications
  FOR SELECT USING (user_id IS NULL AND email = auth.email());
