-- Fix: notifications and email_logs have no INSERT policy for non-admin callers.
--
-- notifyEvent() is called from mentor-only screens (ReadinessEvaluation,
-- MentorCompletionReview via certificates.ts) and from a user's own session
-- (AuthContext account_created, Apply.tsx application_submitted) -- none of
-- which are 'admin'. Today those inserts are silently rejected by RLS and
-- swallowed by the caller's .catch(() => {}), so no in-app notification or
-- email log has ever actually been created for a mentor- or self-triggered
-- event. Only admin-triggered notifyEvent calls have ever worked.

-- notifications: allow admin/mentor to notify anyone, and anyone to notify themselves
CREATE POLICY "notifications_insert_permitted" ON notifications
  FOR INSERT WITH CHECK (
    public.is_admin_or_mentor() OR auth.uid() = recipient_id
  );

-- email_logs: same shape, and widen the existing all-purpose policy from
-- admin-only to admin/mentor so mentor-triggered sends can also be read/updated
DROP POLICY IF EXISTS "email_logs_admin_all" ON email_logs;

CREATE POLICY "email_logs_admin_mentor_all" ON email_logs
  FOR ALL USING (public.is_admin_or_mentor());

CREATE POLICY "email_logs_insert_permitted" ON email_logs
  FOR INSERT WITH CHECK (
    public.is_admin_or_mentor() OR recipient_id = auth.uid()
  );
