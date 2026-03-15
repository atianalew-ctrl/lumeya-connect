import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type PostType = "discussion" | "tip" | "showcase" | "collab";

export interface CommunityPost {
  id: string;
  content: string;
  type: PostType;
  tags: string[];
  likes: number;
  comments: number;
  created_at: string;
  user_id: string;
  author_name: string;
  author_role: string;
  author_avatar: string | null;
  author_location: string | null;
  liked?: boolean;
  saved?: boolean;
}

export function useCommunityPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("community_posts")
      .select(`
        id, content, type, tags, likes, comments, created_at, user_id,
        profiles:user_id ( full_name, bio, avatar_url )
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Failed to fetch posts", error);
      setLoading(false);
      return;
    }

    const mapped: CommunityPost[] = (data || []).map((p: any) => ({
      id: p.id,
      content: p.content,
      type: p.type,
      tags: p.tags || [],
      likes: p.likes,
      comments: p.comments,
      created_at: p.created_at,
      user_id: p.user_id,
      author_name: p.profiles?.full_name || "Anonymous",
      author_role: p.profiles?.bio || "Creator",
      author_avatar: p.profiles?.avatar_url || null,
      author_location: null,
    }));

    // Load liked/saved from localStorage (simple approach)
    const liked = JSON.parse(localStorage.getItem("lumeya_liked") || "{}");
    const saved = JSON.parse(localStorage.getItem("lumeya_saved") || "{}");
    setPosts(mapped.map((p) => ({ ...p, liked: !!liked[p.id], saved: !!saved[p.id] })));
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (content: string, type: PostType, tags: string[]) => {
    if (!user) {
      toast.error("Sign in to post in the community");
      return false;
    }
    const { error } = await supabase.from("community_posts").insert({
      content,
      type,
      tags,
      user_id: user.id,
    });
    if (error) {
      toast.error("Failed to post. Try again.");
      return false;
    }
    toast.success("Posted!");
    await fetchPosts();
    return true;
  };

  const toggleLike = async (postId: string) => {
    const liked = JSON.parse(localStorage.getItem("lumeya_liked") || "{}");
    const isLiked = !!liked[postId];
    if (isLiked) {
      delete liked[postId];
    } else {
      liked[postId] = true;
    }
    localStorage.setItem("lumeya_liked", JSON.stringify(liked));

    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const newLikes = isLiked ? post.likes - 1 : post.likes + 1;

    await supabase.from("community_posts").update({ likes: newLikes }).eq("id", postId);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, liked: !isLiked, likes: newLikes } : p
      )
    );
  };

  const toggleSave = (postId: string) => {
    const saved = JSON.parse(localStorage.getItem("lumeya_saved") || "{}");
    if (saved[postId]) {
      delete saved[postId];
    } else {
      saved[postId] = true;
    }
    localStorage.setItem("lumeya_saved", JSON.stringify(saved));
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, saved: !!saved[p.id] } : p))
    );
  };

  return { posts, loading, createPost, toggleLike, toggleSave };
}
