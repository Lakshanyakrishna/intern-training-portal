-- Phase D.7.5: Fix foreign key privilege check for anon user on resume_files
--
-- The resume_files table has a foreign key to users(id). When an anon user
-- inserts into resume_files (even with user_id = null), PostgreSQL checks
-- for the SELECT privilege on the referenced table to evaluate the RI trigger.
-- Without this, the insert fails with "permission denied for table users".
-- RLS remains enabled on users, so anon still cannot actually read any rows.
GRANT SELECT ON public.users TO anon;
