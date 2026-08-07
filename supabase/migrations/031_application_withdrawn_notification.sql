-- Confirmation for the withdraw_application() RPC (029_application_withdrawal.sql).
-- Every other real write in the applicant flow (submit, offer accept,
-- interview reschedule) fires a confirmation -- withdrawal was the one
-- silent exception, leaving no notification and no activity trail behind.
INSERT INTO notification_templates (event_type, subject, email_body, in_app_template) VALUES
  ('application_withdrawn', 'Application Withdrawn',
   '<p>Dear {{name}},</p><p>We''ve withdrawn your application for {{opportunity}} as requested. You''re welcome to apply again anytime.</p>',
   'Your application has been withdrawn')
ON CONFLICT (event_type) DO NOTHING;
