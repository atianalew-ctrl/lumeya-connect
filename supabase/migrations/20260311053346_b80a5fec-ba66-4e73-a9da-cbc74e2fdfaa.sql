-- Create storage bucket for creator videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('creator-videos', 'creator-videos', true);

-- Allow anyone to view videos
CREATE POLICY "Creator videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'creator-videos');

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'creator-videos' AND auth.role() = 'authenticated');

-- Allow users to update their own videos
CREATE POLICY "Users can update their own videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'creator-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own videos
CREATE POLICY "Users can delete their own videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'creator-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table to track creator videos
CREATE TABLE public.creator_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id INTEGER NOT NULL,
  video_url TEXT NOT NULL,
  title TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.creator_videos ENABLE ROW LEVEL SECURITY;

-- Everyone can view creator videos
CREATE POLICY "Anyone can view creator videos"
ON public.creator_videos FOR SELECT
USING (true);

-- Authenticated users can insert videos
CREATE POLICY "Authenticated users can insert videos"
ON public.creator_videos FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update their videos
CREATE POLICY "Authenticated users can update their videos"
ON public.creator_videos FOR UPDATE
USING (auth.role() = 'authenticated');

-- Authenticated users can delete their videos
CREATE POLICY "Authenticated users can delete their videos"
ON public.creator_videos FOR DELETE
USING (auth.role() = 'authenticated');