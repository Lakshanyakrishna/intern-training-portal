-- Fix a real correctness bug introduced in 037_require_auth_applications.sql:
-- resumes_insert_own's WITH CHECK contained
--
--   EXISTS (SELECT 1 FROM public.applications a
--           WHERE a.id::text = (storage.foldername(name))[2] AND a.user_id = auth.uid())
--
-- The bare `name` inside that correlated subquery does NOT resolve to
-- storage.objects.name (the file path being inserted, which is what the
-- policy author intended) -- applications has its own `name` column (the
-- applicant's full name), and Postgres resolves an unqualified column to
-- the innermost matching scope, so it silently bound to a.name instead.
-- pg_policies confirms this: the stored policy body literally reads
-- storage.foldername(a.name).
--
-- A plain name string has no '/', so storage.foldername() on it returns a
-- single-element array -- index [2] is always NULL, and NULL = anything is
-- never true. Every non-profile resume upload has been silently rejected
-- by RLS since 037 went live (profile uploads were unaffected -- that
-- branch short-circuits on `[2] = 'profile'` before reaching this EXISTS).
--
-- Fix: qualify every foldername(...) call with the target table's own name
-- (storage.objects.name) so it can never be shadowed by a column in a
-- correlated subquery, no matter what else that subquery joins against.

DROP POLICY IF EXISTS "resumes_insert_own" ON storage.objects;
CREATE POLICY "resumes_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(storage.objects.name))[1] = auth.uid()::text
    AND (
      (storage.foldername(storage.objects.name))[2] = 'profile'
      OR EXISTS (
        SELECT 1 FROM public.applications a
        WHERE a.id::text = (storage.foldername(storage.objects.name))[2]
          AND a.user_id = auth.uid()
      )
    )
  );
