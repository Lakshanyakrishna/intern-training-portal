-- Phase D.6: Notification & Email System
-- Run after 008_opportunities.sql

-- ─── 1. Notification Templates ────────────────────────────────────
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  email_body TEXT NOT NULL,
  in_app_template TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_templates_event ON notification_templates(event_type);

-- ─── 2. Notifications ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread ON notifications(recipient_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_event_type ON notifications(event_type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ─── 3. Notification Preferences ──────────────────────────────────
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  application_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  interview_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  training_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  project_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  certificate_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 4. Email Logs ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  event_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  provider_message_id TEXT,
  failure_reason TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_event ON email_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);

-- ─── RLS ───────────────────────────────────────────────────────────
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Notifications: users read own, admin read all
CREATE POLICY "notifications_read_own" ON notifications
  FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = recipient_id);

CREATE POLICY "notifications_admin_all" ON notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Notification preferences: users read/update own, admin read all
CREATE POLICY "notification_preferences_read_own" ON notification_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notification_preferences_upsert_own" ON notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notification_preferences_update_own" ON notification_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notification_preferences_admin_all" ON notification_preferences
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Templates: admin only
CREATE POLICY "notification_templates_admin_all" ON notification_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "notification_templates_read_auth" ON notification_templates
  FOR SELECT USING (auth.role() = 'authenticated');

-- Email logs: admin only
CREATE POLICY "email_logs_admin_all" ON email_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Grants ────────────────────────────────────────────────────────
GRANT ALL ON TABLE notifications TO authenticated;
GRANT ALL ON TABLE notification_preferences TO authenticated;
GRANT ALL ON TABLE notification_templates TO authenticated;
GRANT ALL ON TABLE email_logs TO authenticated;

-- ─── Triggers ──────────────────────────────────────────────────────
CREATE TRIGGER notification_templates_updated_at
  BEFORE UPDATE ON notification_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Seed default notification templates ──────────────────────────
INSERT INTO notification_templates (event_type, subject, email_body, in_app_template) VALUES
  ('application_submitted', 'Application Received',
   '<p>Dear {{name}},</p><p>We have received your application for {{opportunity}}. We will review it shortly.</p>',
   'Your application has been received'),
  ('application_shortlisted', 'Application Shortlisted',
   '<p>Dear {{name}},</p><p>Congratulations! You have been shortlisted for {{opportunity}}. We will contact you to schedule an interview.</p>',
   'You have been shortlisted!'),
  ('application_rejected', 'Application Update',
   '<p>Dear {{name}},</p><p>Thank you for your interest in {{opportunity}}. After careful review, we have decided to move forward with other candidates.</p>',
   'Your application status has been updated'),
  ('interview_scheduled', 'Interview Scheduled',
   '<p>Dear {{name}},</p><p>Your interview has been scheduled for {{date}} at {{time}}. {{meet_link}}</p>',
   'Interview scheduled: {{date}}'),
  ('interview_rescheduled', 'Interview Rescheduled',
   '<p>Dear {{name}},</p><p>Your interview has been rescheduled to {{date}} at {{time}}. {{meet_link}}</p>',
   'Interview rescheduled to {{date}}'),
  ('interview_passed', 'Interview Passed',
   '<p>Dear {{name}},</p><p>Great news! You have passed the interview for {{opportunity}}. We will be in touch with next steps.</p>',
   'You passed the interview!'),
  ('interview_rejected', 'Interview Update',
   '<p>Dear {{name}},</p><p>Thank you for your time. Unfortunately, we have decided to move forward with other candidates after the interview.</p>',
   'Interview result updated'),
  ('training_started', 'Training Started',
   '<p>Dear {{name}},</p><p>Welcome! Your training program has started. Log in to access your modules.</p>',
   'Training started — access your modules now'),
  ('mentor_alert', 'Mentor Action Needed',
   '<p>Hi {{name}},</p><p>Your mentee {{mentee_name}} requires attention. Please check your dashboard.</p>',
   'Action needed for {{mentee_name}}'),
  ('inactivity_warning', 'Inactivity Warning',
   '<p>Dear {{name}},</p><p>You haven''t been active in {{days}} days. Log in to continue your progress.</p>',
   'You haven''t been active in {{days}} days'),
  ('inactivity_escalation', 'Inactivity Escalation',
   '<p>Dear {{name}},</p><p>This is a reminder that you haven''t logged in for {{days}} days. Please contact your mentor if you need support.</p>',
   'Inactive for {{days}} days — please check in'),
  ('ready_for_projects', 'Ready for Projects',
   '<p>Dear {{name}},</p><p>Congratulations! You have been marked as ready for client projects.</p>',
   'You are ready for projects!'),
  ('additional_training_required', 'Additional Training Required',
   '<p>Dear {{name}},</p><p>Your mentor has recommended additional training before project assignment. Please review their feedback.</p>',
   'Additional training recommended'),
  ('project_assigned', 'Project Assigned',
   '<p>Dear {{name}},</p><p>You have been assigned to {{project_name}} for {{client_name}}. Start date: {{start_date}}.</p>',
   'Assigned to {{project_name}}'),
  ('project_completed', 'Project Completed',
   '<p>Dear {{name}},</p><p>Congratulations on completing {{project_name}}! Great work.</p>',
   '{{project_name}} completed!'),
  ('certificate_issued', 'Certificate Issued',
   '<p>Dear {{name}},</p><p>Your {{certificate_type}} certificate is now available. Download it from your profile.</p>',
   '{{certificate_type}} certificate available'),
  ('account_created', 'Welcome to the Program',
   '<p>Dear {{name}},</p><p>Welcome! Your account has been created. Complete your profile to get started.</p>',
   'Welcome to the program!')
ON CONFLICT (event_type) DO NOTHING;

-- ─── RPC: Email Logs Summary ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_email_logs_summary()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT jsonb_build_object(
    'total', COUNT(*),
    'sent', COUNT(*) FILTER (WHERE status = 'sent'),
    'failed', COUNT(*) FILTER (WHERE status = 'failed'),
    'pending', COUNT(*) FILTER (WHERE status = 'pending')
  ) FROM public.email_logs;
$$;

GRANT EXECUTE ON FUNCTION public.get_email_logs_summary() TO authenticated;
