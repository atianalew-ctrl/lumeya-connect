-- Drop all restrictive policies
DROP POLICY IF EXISTS "Anyone can delete videos" ON public.creator_videos;
DROP POLICY IF EXISTS "Anyone can insert videos" ON public.creator_videos;
DROP POLICY IF EXISTS "Anyone can update videos" ON public.creator_videos;
DROP POLICY IF EXISTS "Anyone can view creator videos" ON public.creator_videos;

-- Recreate as PERMISSIVE (default)
CREATE POLICY "Anyone can view creator videos"
ON public.creator_videos FOR SELECT TO public
USING (true);

CREATE POLICY "Anyone can insert videos"
ON public.creator_videos FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Anyone can update videos"
ON public.creator_videos FOR UPDATE TO public
USING (true);

CREATE POLICY "Anyone can delete videos"
ON public.creator_videos FOR DELETE TO public
USING (true);

-- Fix storage policies too
DROP POLICY IF EXISTS "Creator videos are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete videos" ON storage.objects;

CREATE POLICY "Creator videos are publicly accessible"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'creator-videos');

CREATE POLICY "Anyone can upload videos"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'creator-videos');

CREATE POLICY "Anyone can update videos"
ON storage.objects FOR UPDATE TO public
USING (bucket_id = 'creator-videos');

CREATE POLICY "Anyone can delete videos"
ON storage.objects FOR DELETE TO public
USING (bucket_id = 'creator-videos');