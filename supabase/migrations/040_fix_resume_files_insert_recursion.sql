-- Fix a real, currently-live bug in 037_require_auth_applications.sql:
-- resume_files_insert_applicant's WITH CHECK embeds
--
--   NOT EXISTS (SELECT 1 FROM public.resume_files rf WHERE rf.application_id = resume_files.application_id)
--
-- -- a subquery against resume_files itself, inside a policy ON resume_files.
-- Postgres refuses this outright: evaluating the INSERT policy requires
-- evaluating RLS for the inner SELECT against the same table, which
-- Postgres treats as unbounded recursion regardless of whether the actual
-- rows would ever loop. Every insert into resume_files with an
-- application_id has been failing with "42P17: infinite recursion detected
-- in policy for relation resume_files" since 037 went live -- both the
-- manual Apply form's resume upload and (via the same insert path) the
-- one-resume-per-application check it was meant to enforce.
--
-- Fix: move the same-table check into a SECURITY DEFINER function, the
-- same pattern already used throughout this schema (is_admin(),
-- is_admin_or_mentor()) specifically because a SECURITY DEFINER function's
-- own queries run with row_security off, so they don't re-trigger RLS on
-- the table being inserted into and can't recurse.

CREATE OR REPLACE FUNCTION public.application_has_resume(p_application_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.resume_files WHERE application_id = p_application_id);
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

DROP POLICY IF EXISTS "resume_files_insert_applicant" ON resume_files;
CREATE POLICY "resume_files_insert_applicant" ON resume_files
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = resume_files.application_id
        AND (a.user_id = auth.uid() OR a.email = auth.email())
    )
    AND NOT public.application_has_resume(resume_files.application_id)
  );
