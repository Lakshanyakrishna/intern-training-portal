-- Phase D.7.6: Force schema cache reload
--
-- PostgREST caches grants, and PostgreSQL event triggers do not fire
-- on GRANT/REVOKE commands. This dummy DDL command forces the pgrst
-- schema cache to reload so the previous GRANT SELECT on users is recognized.
COMMENT ON FUNCTION public.can_insert_resume(UUID) IS 'Forces schema reload';
