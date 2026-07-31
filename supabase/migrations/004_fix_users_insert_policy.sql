-- Fix: Add missing INSERT policy for users table
-- Without this, new signups fail with RLS violation

DROP POLICY IF EXISTS "users_insert_own" ON users;
CREATE POLICY "users_insert_own" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
