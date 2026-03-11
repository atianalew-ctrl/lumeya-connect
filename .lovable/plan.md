

## Problem

The RLS policies on the `creator_videos` table are all **RESTRICTIVE** (`Permissive: No`). In PostgreSQL, restrictive policies act as additional filters on top of permissive ones. If there are **no permissive policies**, then **no rows are ever returned** — even if the restrictive policy says `USING (true)`.

This means the SELECT query in `useAllCreatorVideos` returns zero rows, so uploaded videos never appear.

## Fix

Run a migration that:
1. Drops all four existing restrictive policies on `creator_videos`
2. Recreates them as **PERMISSIVE** policies (the default) for the `public` role

```sql
DROP POLICY "Anyone can view creator videos" ON public.creator_videos;
DROP POLICY "Anyone can insert videos" ON public.creator_videos;
DROP POLICY "Anyone can update videos" ON public.creator_videos;
DROP POLICY "Anyone can delete videos" ON public.creator_videos;

CREATE POLICY "Anyone can view creator videos" ON public.creator_videos FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert videos" ON public.creator_videos FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update videos" ON public.creator_videos FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete videos" ON public.creator_videos FOR DELETE TO public USING (true);
```

Similarly, verify and fix the `storage.objects` policies for the `creator-videos` bucket if they are also restrictive.

No code changes needed — the React hooks and components are correct. Once the policies are permissive, the data will flow through.

