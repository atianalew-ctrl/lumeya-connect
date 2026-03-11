import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCreatorVideos = (creatorId?: number) => {
  return useQuery({
    queryKey: ["creator-videos", creatorId],
    queryFn: async () => {
      let query = supabase
        .from("creator_videos")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (creatorId !== undefined) {
        query = query.eq("creator_id", creatorId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useAllCreatorVideos = () => {
  return useQuery({
    queryKey: ["creator-videos-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creator_videos")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};
