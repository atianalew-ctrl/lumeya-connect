DROP POLICY "Anyone can view creator videos" ON public.creator_videos;
DROP POLICY "Anyone can insert videos" ON public.creator_videos;
DROP POLICY "Anyone can update videos" ON public.creator_videos;
DROP POLICY "Anyone can delete videos" ON public.creator_videos;

CREATE POLICY "Anyone can view creator videos" ON public.creator_videos FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert videos" ON public.creator_videos FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update videos" ON public.creator_videos FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete videos" ON public.creator_videos FOR DELETE TO public USING (true);