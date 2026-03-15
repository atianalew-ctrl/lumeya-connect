import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Lightbulb,
  Users,
  Sparkles,
  MapPin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { creators } from "@/lib/data";
import { useCommunityPosts, type PostType } from "@/hooks/use-community-posts";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

const trendingTopics = [
  { label: "Sustainable Content", count: 142 },
  { label: "Bali Creator Scene", count: 98 },
  { label: "Cross-Border Collabs", count: 87 },
  { label: "UGC Pricing 2026", count: 76 },
  { label: "AI in Content Creation", count: 64 },
];

const typeConfig = {
  discussion: { label: "Discussion", color: "bg-primary/10 text-primary" },
  tip: { label: "Creator Tip", color: "bg-emerald-500/10 text-emerald-600" },
  showcase: { label: "Showcase", color: "bg-violet-500/10 text-violet-600" },
  collab: { label: "Open Collab", color: "bg-amber-500/10 text-amber-600" },
};

const Community = () => {
  const { user } = useAuth();
  const { posts, loading, createPost, toggleLike, toggleSave } = useCommunityPosts();
  const [newPost, setNewPost] = useState("");
  const [selectedType, setSelectedType] = useState<PostType>("discussion");
  const [activeTab, setActiveTab] = useState("all");
  const [submitting, setSubmitting] = useState(false);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setSubmitting(true);
    const ok = await createPost(newPost.trim(), selectedType, []);
    if (ok) setNewPost("");
    setSubmitting(false);
  };

  const filteredPosts =
    activeTab === "all" ? posts : posts.filter((p) => p.type === activeTab);

  return (
    <div className="container py-16">
      {/* Header */}
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Connect</p>
        <h1 className="mt-2 text-4xl">Community</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Share knowledge, discover collaborators, and grow together.
          A space built on openness, trust, and creative exchange.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Main feed */}
        <div className="space-y-6">
          {/* Compose */}
          <div className="rounded-lg border border-border bg-card p-6">
            {!user && (
              <p className="text-xs text-muted-foreground mb-3">
                <Link to="/creator-signup" className="text-primary hover:underline">Sign in</Link> to post in the community
              </p>
            )}
            <Textarea
              placeholder="Share an insight, ask a question, or find a collaborator..."
              className="min-h-[80px] resize-none border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              disabled={!user}
            />
            <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-1.5 flex-wrap">
                {(["discussion", "tip", "showcase", "collab"] as const).map((type) => (
                  <span
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium cursor-pointer transition-opacity ${typeConfig[type].color} ${
                      selectedType === type ? "opacity-100 ring-1 ring-current" : "opacity-50 hover:opacity-80"
                    }`}
                  >
                    {typeConfig[type].label}
                  </span>
                ))}
              </div>
              <Button size="sm" disabled={!newPost.trim() || !user || submitting} onClick={handlePost}>
                {submitting ? <Loader2 size={14} className="animate-spin" /> : "Post"}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start gap-0 h-auto p-0">
              {[
                { value: "all", label: "All" },
                { value: "discussion", label: "Discussions" },
                { value: "tip", label: "Tips" },
                { value: "showcase", label: "Showcases" },
                { value: "collab", label: "Collabs" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-xs font-medium"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-4 space-y-4">
              {loading && (
                <div className="flex items-center justify-center py-16 text-muted-foreground">
                  <Loader2 size={20} className="animate-spin mr-2" /> Loading posts…
                </div>
              )}

              {!loading && filteredPosts.length === 0 && (
                <div className="py-16 text-center text-muted-foreground">
                  <p className="text-sm">No posts yet. Be the first! 🚀</p>
                </div>
              )}

              {!loading && filteredPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/20"
                >
                  {/* Author */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={post.author_avatar || undefined} />
                        <AvatarFallback>{post.author_name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{post.author_name}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeConfig[post.type].color}`}>
                            {typeConfig[post.type].label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{post.author_role}</span>
                          {post.author_location && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-0.5">
                                <MapPin size={9} />{post.author_location}
                              </span>
                            </>
                          )}
                          <span>·</span>
                          <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="mt-4 text-sm leading-relaxed text-foreground/85">{post.content}</p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] text-accent-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
                        post.liked ? "text-rose-500" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Heart size={14} className={post.liked ? "fill-current" : ""} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <MessageCircle size={14} />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 size={14} />
                      Share
                    </button>
                    <button
                      onClick={() => toggleSave(post.id)}
                      className={`ml-auto flex items-center gap-1.5 text-xs transition-colors ${
                        post.saved ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Bookmark size={14} className={post.saved ? "fill-current" : ""} />
                    </button>
                  </div>
                </motion.article>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Trending */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" />
              Trending Topics
            </h3>
            <div className="mt-4 space-y-3">
              {trendingTopics.map((topic) => (
                <div key={topic.label} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/80 hover:text-foreground cursor-pointer transition-colors">
                    {topic.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{topic.count} posts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active creators */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Users size={14} className="text-primary" />
              Active Members
            </h3>
            <div className="mt-4 space-y-3">
              {creators.slice(0, 5).map((creator) => (
                <Link key={creator.id} to={`/creators/${creator.id}`} className="flex items-center gap-2.5 group">
                  <img src={creator.avatar} alt={creator.name} className="h-7 w-7 rounded-full bg-accent object-cover" />
                  <div>
                    <p className="text-xs font-medium group-hover:text-primary transition-colors">{creator.name}</p>
                    <p className="text-[10px] text-muted-foreground">{creator.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Guidelines */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Lightbulb size={14} className="text-primary" />
              Community Values
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <Sparkles size={11} className="mt-0.5 text-primary shrink-0" />
                Share knowledge openly and generously
              </li>
              <li className="flex items-start gap-2">
                <Sparkles size={11} className="mt-0.5 text-primary shrink-0" />
                Respect diverse perspectives and cultures
              </li>
              <li className="flex items-start gap-2">
                <Sparkles size={11} className="mt-0.5 text-primary shrink-0" />
                Collaborate with transparency and trust
              </li>
              <li className="flex items-start gap-2">
                <Sparkles size={11} className="mt-0.5 text-primary shrink-0" />
                Support sustainable and ethical practices
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Community;
