-- Blueprint Task 2.3: "any admin or mentor query can jump an application to
-- any status in any order." A policy can't compare OLD vs NEW (Blueprint
-- Part 5, Rule 5), so this has to be a trigger, not a check constraint.
--
-- Real workflow (confirmed against AdminApplications.tsx, AdminInterviews.tsx,
-- AdminConversion.tsx) doesn't force every application through all five
-- statuses -- admins routinely decide straight from 'pending' without a
-- separate 'reviewed'/'shortlisted' step first, and AdminInterviews.tsx sets
-- 'accepted'/'rejected' directly off a completed interview. Blocking that
-- would break real, already-used behavior, not just theoretical abuse. So
-- the guard enforces the two things that actually matter:
--   1. Once a final decision is made (accepted/rejected), it's final --
--      no further status change, ever.
--   2. Among the non-final stages (pending/reviewed/shortlisted), status
--      can only move forward, never backward.
-- A decision (accepted/rejected) can still be reached directly from any
-- non-final stage -- that's not a "jump," it's a normal early decision.

CREATE OR REPLACE FUNCTION public.guard_application_status_transition()
RETURNS TRIGGER AS $$
DECLARE
  v_old_rank INT;
  v_new_rank INT;
BEGIN
  IF NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;

  IF OLD.status IN ('accepted', 'rejected') THEN
    RAISE EXCEPTION 'Application % is already %, and cannot change status again', OLD.id, OLD.status;
  END IF;

  IF NEW.status IN ('accepted', 'rejected') THEN
    RETURN NEW;
  END IF;

  v_old_rank := CASE OLD.status WHEN 'pending' THEN 1 WHEN 'reviewed' THEN 2 WHEN 'shortlisted' THEN 3 END;
  v_new_rank := CASE NEW.status WHEN 'pending' THEN 1 WHEN 'reviewed' THEN 2 WHEN 'shortlisted' THEN 3 END;

  IF v_new_rank <= v_old_rank THEN
    RAISE EXCEPTION 'Invalid status transition: % -> % is backward, not allowed', OLD.status, NEW.status;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- BEFORE, not AFTER: must reject the row before it's written and before
-- 020's audit trigger fires on it. If this raises, that AFTER trigger never
-- runs and nothing gets logged for a transition that never happened.
CREATE TRIGGER trg_guard_application_status_transition
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION public.guard_application_status_transition();
