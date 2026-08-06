-- Create a debug function to test foldername
CREATE OR REPLACE FUNCTION public.debug_foldername(filepath TEXT)
RETURNS TEXT[] AS $$
BEGIN
  RETURN storage.foldername(filepath);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
