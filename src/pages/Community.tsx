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
  ArrowRight,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { creators } from "@/lib/data";

interface Post {
  id: number;
  author: {
    name: string;
    role: string;
    avatar: string;
    location: string;
  };
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  timeAgo: string;
  type: "discussion" | "tip" | "showcase" | "collab";
  liked?: boolean;
  saved?: boolean;
}

const communityPosts: Post[] = [
  {
    id: 1,
    author: { name: "Amelia Kozak", role: "Content Creator", avatar: "/lovable-uploads/23b97164-8b1e-40d0-a9c4-fc5686f28068.jpg", location: "Bali, ID" },
    content: "Just wrapped a 3-month collaboration with a sustainable fashion brand here in Bali. The key to making cross-cultural content work? Let the location speak for itself. Minimal edits, natural lighting, authentic moments. Would love to hear how others approach location-driven storytelling.",
    tags: ["Storytelling", "Sustainability", "Bali"],
    likes: 42,
    comments: 12,
    timeAgo: "2h ago",
    type: "discussion",
  },
  {
    id: 2,
    author: { name: "Ronja Aaslund", role: "UGC Creator", avatar: "/lovable-uploads/45d7dcc1-eb95-4a25-b50d-87bc5730e1c5.jpg", location: "Stockholm, SE" },
    content: "Tip for fellow UGC creators: when working with international brands, always establish a shared mood board before production. It bridges language gaps and aligns creative vision faster than any brief. Tools I use: Milanote + Loom for async walkthroughs.",
    tags: ["UGC Tips", "Remote Work", "Workflow"],
    likes: 67,
    comments: 23,
    timeAgo: "5h ago",
    type: "tip",
  },
  {
    id: 3,
    author: { name: "Nella Ryglova", role: "UGC Creator", avatar: "/lovable-uploads/59419297-8971-48c3-a2c5-2b636c4b1db6.png", location: "Canggu, Bali" },
    content: "Sharing my latest brand identity project for an eco-conscious skincare line based in Ubud. The brief was 'Balinese heritage meets modern minimalism.' Loved exploring traditional patterns reimagined through a Scandinavian design lens.",
    tags: ["Brand Design", "Sustainability", "Portfolio"],
    likes: 89,
    comments: 31,
    timeAgo: "8h ago",
    type: "showcase",
  },
  {
    id: 4,
    author: { name: "Daniel Osei", role: "Motion Designer", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Daniel", location: "Berlin, DE" },
    content: "Looking for a photographer in Southeast Asia for a joint pitch to a wellness brand. They need motion + stills for a campaign launching in Q2. Anyone interested in collaborating? Remote-friendly, budget split 50/50.",
    tags: ["Collaboration", "Southeast Asia", "Wellness"],
    likes: 34,
    comments: 18,
    timeAgo: "1d ago",
    type: "collab",
  },
  {
    id: 5,
    author: { name: "Sakura Tanaka", role: "Influencer", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sakura", location: "Tokyo, JP" },
    content: "The creator economy in Asia Pacific is evolving fast. Brands here are shifting from follower counts to engagement quality. I've started including 'community impact' metrics in my media kit — saves, shares, DM conversations. It's changing the conversation with brands completely.",
    tags: ["Industry Insights", "Asia Pacific", "Strategy"],
    likes: 56,
    comments: 27,
    timeAgo: "1d ago",
    type: "discussion",
  },
  {
    id: 6,
    author: { name: "Jordan Blake", role: "Photographer", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan", location: "New York, NY" },
    content: "Quick lighting tip for product photography in tropical climates: embrace the golden hour but watch for humidity haze. A simple polarizing filter + reflector combo gives you that clean Scandinavian look even in Bali's afternoon light.",
    tags: ["Photography Tips", "Lighting", "Tropical"],
    likes: 45,
    comments: 9,
    timeAgo: "2d ago",
    type: "tip",
  },
];

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
  const [posts, setPosts] = useState(communityPosts);
  const [newPost, setNewPost] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const toggleSave = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    );
  };

  const filteredPosts =
    activeTab === "all" ? posts : posts.filter((p) => p.type === activeTab);

  return (
    <div className="container py-16">
      {/* Header */}
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          Connect
        </p>
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
            <Textarea
              placeholder="Share an insight, ask a question, or find a collaborator..."
              className="min-h-[80px] resize-none border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-1.5">
                {(["discussion", "tip", "showcase", "collab"] as const).map((type) => (
                  <span
                    key={type}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${typeConfig[type].color} cursor-pointer opacity-60 hover:opacity-100 transition-opacity`}
                  >
                    {typeConfig[type].label}
                  </span>
                ))}
              </div>
              <Button size="sm" disabled={!newPost.trim()}>
                Post
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
              {filteredPosts.map((post, i) => (
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
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="h-9 w-9 rounded-full bg-accent object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {post.author.name}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeConfig[post.type].color}`}
                          >
                            {typeConfig[post.type].label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{post.author.role}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin size={9} />
                            {post.author.location}
                          </span>
                          <span>·</span>
                          <span>{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                    {post.content}
                  </p>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] text-accent-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
                        post.liked
                          ? "text-rose-500"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Heart
                        size={14}
                        className={post.liked ? "fill-current" : ""}
                      />
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
                        post.saved
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Bookmark
                        size={14}
                        className={post.saved ? "fill-current" : ""}
                      />
                    </button>
                  </div>
                </motion.article>
              ))}

              {filteredPosts.length === 0 && (
                <div className="py-16 text-center text-muted-foreground">
                  <p className="text-sm">No posts in this category yet.</p>
                </div>
              )}
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
              {trendingTopics.map((topic, i) => (
                <div
                  key={topic.label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-foreground/80 hover:text-foreground cursor-pointer transition-colors">
                    {topic.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {topic.count} posts
                  </span>
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
                <Link
                  key={creator.id}
                  to={`/creators/${creator.id}`}
                  className="flex items-center gap-2.5 group"
                >
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="h-7 w-7 rounded-full bg-accent object-cover"
                  />
                  <div>
                    <p className="text-xs font-medium group-hover:text-primary transition-colors">
                      {creator.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {creator.role}
                    </p>
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
