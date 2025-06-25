/*
  # Create planifruits table

  1. New Tables
    - `planifruits`
      - `id` (uuid, primary key)
      - `category` (text) - Category of fruit (abricots, peches, nectarines)
      - `type` (text) - Type for peaches and nectarines (jaune, blanche, sanguine, plate)
      - `image` (text) - URL of the planifruit image
      - Timestamps for created_at and updated_at

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated users to manage data
*/

CREATE TABLE IF NOT EXISTS planifruits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  type text,
  image text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE planifruits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON planifruits
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users full access"
  ON planifruits
  TO authenticated
  USING (true)
  WITH CHECK (true);