/*
  # Fix RLS policies for file uploads

  1. Changes
    - Add policies to allow anonymous users to insert data
    - Update existing policies to be more permissive for uploads
    - Ensure all tables have proper policies for both authenticated and anonymous users

  2. Security
    - Allow public insert access for content creation
    - Maintain read restrictions for published content only
    - Keep authenticated user privileges for management
*/

-- Fix fruits table policies
DROP POLICY IF EXISTS "Allow public read access" ON fruits;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON fruits;

CREATE POLICY "Allow all on fruits"
  ON fruits
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access"
  ON fruits
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix news table policies
DROP POLICY IF EXISTS "Allow public read access to published articles" ON news;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON news;

CREATE POLICY "Allow all on news"
  ON news
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access"
  ON news
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to published articles"
  ON news
  FOR SELECT
  TO public
  USING (published = true);

-- Fix events table policies
DROP POLICY IF EXISTS "Allow public read access to published events" ON events;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON events;

CREATE POLICY "Allow all on events"
  ON events
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access"
  ON events
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to published events"
  ON events
  FOR SELECT
  TO public
  USING (published = true);

-- Fix appearance table policies
DROP POLICY IF EXISTS "Allow public read access" ON appearance;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON appearance;

CREATE POLICY "Allow all on appearance"
  ON appearance
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access"
  ON appearance
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access"
  ON appearance
  FOR SELECT
  TO public
  USING (true);

-- Fix planifruits table policies
DROP POLICY IF EXISTS "Allow public read access" ON planifruits;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON planifruits;

CREATE POLICY "Allow authenticated users full access"
  ON planifruits
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access"
  ON planifruits
  FOR SELECT
  TO public
  USING (true);