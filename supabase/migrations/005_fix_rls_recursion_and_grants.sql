-- Fix 1: Grant necessary table privileges to authenticated/anonymous roles
-- RLS policies alone are not enough; the role must have base privileges too.
GRANT INSERT ON TABLE users TO authenticated;
GRANT SELECT ON TABLE users TO authenticated;
GRANT INSERT ON TABLE user_settings TO authenticated;
GRANT SELECT ON TABLE user_settings TO authenticated;

-- Fix 2: Replace recursive RLS policies with security-definer helper functions
-- The old policies queried `users` inside a policy ON `users`, causing infinite recursion.

-- Helper: check if current user is admin or mentor (bypasses RLS via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin_or_mentor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'mentor')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Drop old recursive policies
DROP POLICY IF EXISTS "users_admin_read_all" ON users;
DROP POLICY IF EXISTS "applications_admin_all" ON applications;

-- Recreate users_admin_read_all using non-recursive helper
CREATE POLICY "users_admin_read_all" ON users
  FOR SELECT USING (public.is_admin_or_mentor());

-- Recreate applications_admin_all using non-recursive helper
CREATE POLICY "applications_admin_all" ON applications
  FOR ALL USING (public.is_admin_or_mentor());
