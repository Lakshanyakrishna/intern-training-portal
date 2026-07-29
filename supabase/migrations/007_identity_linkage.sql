-- Phase D.3: Identity Linkage
-- Allows authenticated users to link their account to an existing application
-- Run after 006_fix_missing_table_grants.sql

-- Policy: users can link their account to an unlinked application matching their email
-- USING clause ensures only unlinked applications for their email
-- WITH CHECK prevents setting user_id to anything other than their own uid
CREATE POLICY "applications_link_to_user" ON applications
  FOR UPDATE USING (
    user_id IS NULL AND email = auth.email()
  )
  WITH CHECK (
    user_id = auth.uid() AND email = auth.email()
  );

-- Grant UPDATE on applications to authenticated (needed for the policy to apply)
GRANT UPDATE ON TABLE applications TO authenticated;
