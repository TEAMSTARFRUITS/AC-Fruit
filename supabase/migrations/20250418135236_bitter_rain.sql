/*
  # Create events table

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text) - Event title
      - `description` (text) - Event description
      - `start_date` (date) - Event start date
      - `end_date` (date) - Event end date
      - `image` (text) - Event image URL
      - `location` (text) - Event location
      - `published` (boolean) - Publication status
      - Timestamps for created_at and updated_at

  2. Security
    - Enable RLS
    - Add policies for public read access to published events
    - Add policies for authenticated users to manage events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  image text,
  location text NOT NULL,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to published events"
  ON events
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Allow authenticated users full access"
  ON events
  TO authenticated
  USING (true)
  WITH CHECK (true);