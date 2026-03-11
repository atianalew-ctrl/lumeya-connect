
-- Fix creator_videos RLS: drop restrictive policies, recreate as permissive
DROP POLICY IF EXISTS "Anyone can view creator videos" ON public.creator_videos;
DROP POLICY IF EXISTS "Anyone can insert videos" ON public.creator_videos;
DROP POLICY IF EXISTS "Anyone can update videos" ON public.creator_videos;
DROP POLICY IF EXISTS "Anyone can delete videos" ON public.creator_videos;

CREATE POLICY "Anyone can view creator videos" ON public.creator_videos FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert videos" ON public.creator_videos FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update videos" ON public.creator_videos FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete videos" ON public.creator_videos FOR DELETE TO public USING (true);

-- Create image storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('creator-images', 'creator-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for creator-images bucket
CREATE POLICY "Anyone can view creator images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'creator-images');
CREATE POLICY "Anyone can upload creator images" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'creator-images');
CREATE POLICY "Anyone can update creator images" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'creator-images') WITH CHECK (bucket_id = 'creator-images');
CREATE POLICY "Anyone can delete creator images" ON storage.objects FOR DELETE TO public USING (bucket_id = 'creator-images');
