-- Confirmation email for the one real applicant-facing write in the whole
-- offer flow: accept_offer() (022_offer_acceptance.sql) records
-- offer_accepted_at, but nothing ever told the applicant it went through.
INSERT INTO notification_templates (event_type, subject, email_body, in_app_template) VALUES
  ('offer_accepted', 'Offer Accepted — Welcome to the Team',
   '<p>Dear {{name}},</p><p>Thanks for confirming — we''ve recorded your acceptance for {{opportunity}}. Onboarding details will follow shortly.</p>',
   'You accepted your offer for {{opportunity}}')
ON CONFLICT (event_type) DO NOTHING;
