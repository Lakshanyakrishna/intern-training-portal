-- Real bug found while reproducing a user report of "An unexpected error
-- occurred" on signup: `user_settings` has a working `user_settings_update_own`
-- RLS policy (001_phase_a.sql), but `authenticated` was never granted UPDATE
-- on the table at the base privilege level -- the same class of bug already
-- fixed for `users` in 018_fix_users_role_escalation.sql, just on a
-- different table that wasn't touched then.
--
-- AuthContext.tsx's signUp() calls upsertUserSettings() unguarded (no
-- try/catch, unlike every other call in that function), and upsert compiles
-- to INSERT ... ON CONFLICT DO UPDATE, which requires the UPDATE privilege
-- even on a brand-new row. Every new signup has been hitting this and
-- failing with "permission denied for table user_settings" -- surfaced to
-- the user as a generic "An unexpected error occurred."
--
-- Verified directly against the hosted project: this was the only table in
-- the entire public schema with an UPDATE/INSERT/SELECT/DELETE policy whose
-- matching base grant was missing.

GRANT UPDATE ON TABLE user_settings TO authenticated;
