/*
  # Create news table

  1. New Tables
    - `news`
      - `id` (uuid, primary key)
      - `title` (text) - Article title
      - `content` (text) - Article content
      - `image` (text) - Featured image URL
      - `published` (boolean) - Publication status
      - Timestamps for created_at and updated_at

  2. Security
    - Enable RLS
    - Add policies for public read access to published articles
    - Add policies for authenticated users to manage articles
*/

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image text NOT NULL,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to published articles"
  ON news
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Allow authenticated users full access"
  ON news
  TO authenticated
  USING (true)
  WITH CHECK (true);