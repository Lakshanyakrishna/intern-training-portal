-- Phase D.7: Storage bucket for resume files
-- Run after 010_ai_screening.sql

-- ─── Create resumes bucket ────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  10485760,
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- ─── RLS for storage.objects ──────────────────────────────────────
CREATE POLICY "resumes_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "resumes_read_admin_mentor" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes'
    AND (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'mentor'))
      OR (auth.role() = 'authenticated')
    )
  );

CREATE POLICY "resumes_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'resumes'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "resumes_delete_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'resumes'
    AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
