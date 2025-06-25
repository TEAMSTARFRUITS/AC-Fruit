/*
  # Create Storage Buckets

  1. Storage Buckets
    - `images` - For storing uploaded images
    - `videos` - For storing uploaded videos  
    - `documents` - For storing PDF files

  2. Security
    - Enable public access for reading files
    - Allow authenticated users to upload files
    - Allow public users to upload files (needed for the application)
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('videos', 'videos', true, 52428800, ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/avi', 'video/mov']),
  ('documents', 'documents', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for images bucket
CREATE POLICY "Public Access for Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow uploads to images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow updates to images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images');

CREATE POLICY "Allow deletes from images" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');

-- Create storage policies for videos bucket
CREATE POLICY "Public Access for Videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Allow uploads to videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Allow updates to videos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'videos');

CREATE POLICY "Allow deletes from videos" ON storage.objects
  FOR DELETE USING (bucket_id = 'videos');

-- Create storage policies for documents bucket
CREATE POLICY "Public Access for Documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Allow uploads to documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow updates to documents" ON storage.objects
  FOR UPDATE USING (bucket_id = 'documents');

CREATE POLICY "Allow deletes from documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents');