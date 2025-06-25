/*
  # Create appearance table

  1. New Tables
    - `appearance`
      - `id` (uuid, primary key)
      - `header_image` (text) - Header background image URL
      - `header_video` (text) - Header background video URL
      - `use_video` (boolean) - Whether to use video instead of image
      - `header_title` (text) - Header title text
      - `header_subtitle` (text) - Header subtitle text
      - `logo` (text) - Logo image URL
      - `category_images` (jsonb) - Category background images
      - `category_icons` (jsonb) - Category icons
      - `homepage_banner` (text) - Homepage banner image URL
      - `company_name` (text) - Company name
      - `address` (text) - Company address
      - `phone` (text) - Contact phone number
      - `email` (text) - Contact email
      - `website` (text) - Company website URL
      - `social_media` (jsonb) - Social media links
      - `maps_embed_url` (text) - Google Maps embed URL
      - Timestamps for created_at and updated_at

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated users to manage settings
*/

CREATE TABLE IF NOT EXISTS appearance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  header_image text NOT NULL,
  header_video text,
  use_video boolean DEFAULT false,
  header_title text NOT NULL,
  header_subtitle text NOT NULL,
  logo text,
  category_images jsonb DEFAULT '{}'::jsonb,
  category_icons jsonb DEFAULT '{}'::jsonb,
  homepage_banner text,
  company_name text,
  address text,
  phone text,
  email text,
  website text,
  social_media jsonb DEFAULT '{"instagram": "", "linkedin": "", "youtube": "", "facebook": ""}'::jsonb,
  maps_embed_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default row
INSERT INTO appearance (
  header_image,
  header_title,
  header_subtitle,
  category_images,
  category_icons
) VALUES (
  'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80',
  'Bienvenue chez AC Fruit',
  'Découvrez nos fruits d''exception',
  '{"abricots": "", "peches": "", "nectarines": ""}'::jsonb,
  '{"abricots": "", "peches": "", "nectarines": ""}'::jsonb
);

ALTER TABLE appearance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON appearance
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users full access"
  ON appearance
  TO authenticated
  USING (true)
  WITH CHECK (true);