-- Drop restrictive storage policies
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;

-- Allow anyone to upload to creator-videos bucket
CREATE POLICY "Anyone can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'creator-videos');

CREATE POLICY "Anyone can update videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'creator-videos');

CREATE POLICY "Anyone can delete videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'creator-videos');

-- Drop restrictive DB policies
DROP POLICY IF EXISTS "Authenticated users can insert videos" ON public.creator_videos;
DROP POLICY IF EXISTS "Authenticated users can update their videos" ON public.creator_videos;
DROP POLICY IF EXISTS "Authenticated users can delete their videos" ON public.creator_videos;

-- Allow anyone to insert/update/delete for now
CREATE POLICY "Anyone can insert videos"
ON public.creator_videos FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update videos"
ON public.creator_videos FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete videos"
ON public.creator_videos FOR DELETE
USING (true);