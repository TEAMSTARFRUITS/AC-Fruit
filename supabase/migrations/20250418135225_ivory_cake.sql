/*
  # Create fruits table

  1. New Tables
    - `fruits`
      - `id` (uuid, primary key)
      - `category` (text) - Category of fruit (abricots, peches, nectarines)
      - `type` (text, nullable) - Type for peaches and nectarines (jaune, blanche, sanguine, plate)
      - `name` (text) - Name of the variety
      - `description` (text) - Description of the variety
      - `image` (text) - Main image URL
      - `images` (text[]) - Array of additional image URLs
      - `technical_sheet` (text) - URL to PDF technical sheet
      - `video_url` (text) - URL to video
      - `maturity_start_day` (integer) - Start day of maturity period
      - `maturity_start_month` (integer) - Start month of maturity period
      - `maturity_end_day` (integer) - End day of maturity period
      - `maturity_end_month` (integer) - End month of maturity period
      - Timestamps for created_at and updated_at

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated users to manage data
*/

CREATE TABLE IF NOT EXISTS fruits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  type text,
  name text NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  images text[],
  technical_sheet text,
  video_url text,
  maturity_start_day integer,
  maturity_start_month integer,
  maturity_end_day integer,
  maturity_end_month integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fruits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON fruits
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users full access"
  ON fruits
  TO authenticated
  USING (true)
  WITH CHECK (true);