/*
  # Fix Planifruit RLS Policies

  1. Security Updates
    - Add policy to allow anonymous users to insert planifruits
    - Add policy to allow anonymous users to update planifruits
    - Add policy to allow anonymous users to delete planifruits
    
  2. Notes
    - This allows the admin dashboard to work with anonymous access
    - For production, consider implementing proper authentication
*/

-- Allow anonymous users to insert planifruits
CREATE POLICY "Allow anon insert on planifruits"
  ON planifruits
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update planifruits
CREATE POLICY "Allow anon update on planifruits"
  ON planifruits
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to delete planifruits
CREATE POLICY "Allow anon delete on planifruits"
  ON planifruits
  FOR DELETE
  TO anon
  USING (true);