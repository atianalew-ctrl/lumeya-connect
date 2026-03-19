import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Star, ArrowLeft, MessageCircle, Send, DollarSign,
  Play, Building2, Languages, Globe, Wifi, Video, Users,
  TrendingUp, Clock, CheckCircle, RefreshCw, Instagram,
  ChevronLeft, ChevronRight, X, Heart, Bookmark, Sparkles, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { creators } from "@/lib/data";
import { useCreatorVideos } from "@/hooks/use-creator-videos";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const fmtFollowers = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

// Check if string looks like a UUID (DB creator)
const isUUID = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

const CreatorProfile = () => {
  const { id } = useParams();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showRevision, setShowRevision] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");
  const [revisionSent, setRevisionSent] = useState(false);
  const [activeTab, setActiveTab] = useState<"portfolio" | "videos" | "reviews">("portfolio");
  const [dbCreator, setDbCreator] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Try static first, then DB
  const staticCreator = creators.find((c) => c.id === Number(id));

  useEffect(() => {
    if (!staticCreator && id && isUUID(id)) {
      setLoading(true);
      supabase.functions.invoke("admin-creators", { body: { action: "list" } })
        .then(({ data }) => {
          const found = data?.data?.find((c: any) => c.id === id);
          if (found) setDbCreator(found);
        })
        .finally(() => setLoading(false));
    }
  }, [id, staticCreator]);

  const { data: uploadedVideos } = useCreatorVideos(staticCreator ? Number(id) : undefined);

  if (loading) {
    return (
      <div className="container py-24 text-center">
        <p className="text-muted-foreground">Loading creator…</p>
      </div>
    );
  }

  if (!staticCreator && !dbCreator) {
    return (
      <div className="container py-24 text-center">
        <p className="text-muted-foreground">Creator not found.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/creators">Back to Creators</Link>
        </Button>
      </div>
    );
  }

  // Map DB creator into the same shape as static creator so we use one layout
  const creator = staticCreator ?? (() => {
    const c = dbCreator;
    return {
      id: c.id,
      name: c.display_name,
      role: c.tagline || "UGC Creator",
      location: c.location || "",
      bio: c.bio || "",
      avatar: c.avatar_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80`,
      tags: c.tags || [],
      skills: [],
      rates: c.rates || "",
      rating: c.rating || 5.0,
      followers: 10000,
      engagementRate: 5.0,
      completedCampaigns: 0,
      responseTime: "Same day",
      availableForRemote: true,
      color: "from-violet-200 to-pink-100",
      region: "Europe",
      languages: ["English"],
      contentTypes: [],
      ugcContentTypes: [],
      instagram: c.instagram || "",
      portfolioImages: c.portfolio_images || [],
      videoUrl: c.video_url || "",
      videoUrls: c.video_urls || [],
      brands: [],
      portfolio: (c.portfolio_images || []).length,
    };
  })();

  const portfolioImages = creator.portfolioImages || [];
  const lbTotal = portfolioImages.length;

  const sendRevision = () => {
    if (!revisionNote.trim()) return;
    setRevisionSent(true);
    toast.success("Revision request sent to " + creator.name.split(" ")[0] + "!");
    setTimeout(() => { setShowRevision(false); setRevisionSent(false); setRevisionNote(""); }, 2000);
  };

  const REVIEWS = [
    { brand: "GlowCo", rating: 5, text: "Ronja delivered incredibly polished content — exactly what we briefed. The videos went viral on TikTok. Will definitely work together again.", date: "Feb 2026" },
    { brand: "LuxeBeauty", rating: 5, text: "Professional, fast, and creative. She understood our brand immediately and brought ideas we hadn't even thought of.", date: "Jan 2026" },
    { brand: "FreshFace", rating: 4, text: "Great content, very on-brand. Delivery was slightly delayed but she communicated well throughout.", date: "Dec 2025" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <div className={`h-40 bg-gradient-to-br ${creator.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-foreground/10" />
        <div className="container h-full flex items-end pb-0 relative z-10">
          <Link to="/creators" className="absolute top-5 left-4 md:left-6 inline-flex items-center gap-1.5 text-xs text-foreground/70 hover:text-foreground transition-colors bg-background/30 backdrop-blur rounded-full px-3 py-1.5">
            <ArrowLeft size={12} /> Back
          </Link>
        </div>
      </div>

      <div className="container relative">
        {/* Avatar — overlapping hero */}
        <div className="flex items-end justify-between -mt-10 mb-6 flex-wrap gap-4">
          <div className="flex items-end gap-4">
            <div className="relative">
              <img src={creator.avatar} alt={creator.name}
                className="h-20 w-20 rounded-full object-cover border-4 border-background shadow-lg" />
              {creator.availableForRemote && (
                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-display">{creator.name}</h1>
              <p className="text-sm text-muted-foreground">{creator.role} · {creator.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pb-1">
            <button onClick={() => setLiked(!liked)} className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all ${liked ? "border-rose-300 bg-rose-50 text-rose-500" : "border-border hover:bg-accent text-muted-foreground"}`}>
              <Heart size={14} className={liked ? "fill-rose-500" : ""} />
            </button>
            <button onClick={() => { setSaved(!saved); toast.success(saved ? "Removed from saved" : "Saved to your list ✦"); }} className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all ${saved ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent text-muted-foreground"}`}>
              <Bookmark size={14} className={saved ? "fill-primary" : ""} />
            </button>
            {creator.instagram && (
              <a href={`https://instagram.com/${creator.instagram}`} target="_blank" rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                <Instagram size={14} />
              </a>
            )}
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => setShowRevision(true)}>
              <RefreshCw size={12} className="mr-1.5" /> Request Revision
            </Button>
            <Button size="sm" className="rounded-full" asChild>
              <Link to="/messages"><MessageCircle size={12} className="mr-1.5" /> Message</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 pb-16">
          {/* Left sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-5">

            {/* Stats */}
            <div className="rounded-xl border border-border bg-card p-5 grid grid-cols-2 gap-4">
              {[
                { label: "Followers", value: fmtFollowers(creator.followers || 0), icon: Users },
                { label: "Engagement", value: `${creator.engagementRate || 0}%`, icon: TrendingUp },
                { label: "Response", value: creator.responseTime || "—", icon: Clock },
                { label: "Campaigns", value: String(creator.completedCampaigns || 0), icon: CheckCircle },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="text-center">
                  <Icon size={13} className="mx-auto text-primary mb-1" />
                  <p className="text-sm font-medium">{value}</p>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            {/* Rating */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star size={14} className="text-primary" />
                <span className="font-medium text-sm">{creator.rating} / 5.0</span>
                <span className="text-xs text-muted-foreground ml-auto">{creator.completedCampaigns} reviews</span>
              </div>
              <div className="space-y-1.5">
                {[["Quality", 97], ["Communication", 100], ["Delivery", 92], ["Creativity", 98]].map(([label, pct]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-24 shrink-0">{label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-accent overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate */}
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Rate</p>
              <p className="text-sm font-medium">{creator.rates}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Shield size={11} className="text-emerald-500" />
                <p className="text-[10px] text-muted-foreground">Lumeya payment protection</p>
              </div>
            </div>

            {/* Languages */}
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5"><Languages size={11} /> Languages</p>
              <div className="flex flex-wrap gap-1.5">
                {creator.languages.map(l => <span key={l} className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">{l}</span>)}
              </div>
            </div>

            {/* Content types */}
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5"><Video size={11} /> Content Types</p>
              <div className="flex flex-wrap gap-1.5">
                {creator.contentTypes.map(ct => <span key={ct} className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] text-primary">{ct}</span>)}
              </div>
            </div>

            {/* Brands */}
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Worked With</p>
              <div className="space-y-2">
                {creator.brands.map(b => (
                  <div key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 size={11} className="text-primary" /> {b}
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full rounded-full gap-1.5" asChild>
              <Link to="/post-opportunity"><Send size={13} /> Invite to Opportunity</Link>
            </Button>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Bio */}
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-sm leading-relaxed text-foreground/80">{creator.bio}</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {creator.tags.map(t => <span key={t} className="rounded-full bg-accent px-2.5 py-0.5 text-[11px]">{t}</span>)}
                {creator.skills.map(s => <span key={s} className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">{s}</span>)}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border gap-0">
              {(["portfolio", "videos", "reviews"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-xs font-medium capitalize border-b-2 transition-colors ${
                    activeTab === tab ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}>
                  {tab} {tab === "reviews" ? `(${REVIEWS.length})` : ""}
                </button>
              ))}
            </div>

            {/* Portfolio tab */}
            {activeTab === "portfolio" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {portfolioImages.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => setLightbox(i)}>
                    <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <Sparkles size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}
                {/* Placeholder grid if fewer than 6 */}
                {Array.from({ length: Math.max(0, 6 - portfolioImages.length) }).map((_, i) => (
                  <div key={`ph-${i}`} className={`aspect-square rounded-xl bg-gradient-to-br ${creator.color} opacity-30`} />
                ))}
              </div>
            )}

            {/* Videos tab — TikTok-style portrait grid */}
            {activeTab === "videos" && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  ...(creator.videoUrl ? [{ src: creator.videoUrl, label: "Featured" }] : []),
                  ...((creator as any).videoUrls?.map((src: string) => ({ src, label: "Video" })) || []),
                  ...(uploadedVideos?.map(v => ({ src: v.video_url, label: v.title || "Video" })) || []),
                ].map((v, i) => (
                  <VideoTile key={i} src={v.src} label={v.label} />
                ))}
                {/* Empty state */}
                {!creator.videoUrl && (!uploadedVideos || uploadedVideos.length === 0) && (
                  <div className="col-span-3 py-12 text-center text-sm text-muted-foreground">No videos yet</div>
                )}
              </div>
            )}

            {/* Reviews tab */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {REVIEWS.map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">{r.brand[0]}</div>
                        <div>
                          <p className="text-xs font-medium">{r.brand}</p>
                          <p className="text-[10px] text-muted-foreground">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star key={si} size={11} className={si < r.rating ? "text-primary fill-primary" : "text-muted-foreground"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">"{r.text}"</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={portfolioImages[lightbox]}
              alt=""
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
              onClick={e => e.stopPropagation()}
            />
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white"><X size={16} /></button>
            {lightbox > 0 && <button onClick={e => { e.stopPropagation(); setLightbox(lightbox - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white"><ChevronLeft size={18} /></button>}
            {lightbox < lbTotal - 1 && <button onClick={e => { e.stopPropagation(); setLightbox(lightbox + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white"><ChevronRight size={18} /></button>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revision request modal */}
      <AnimatePresence>
        {showRevision && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowRevision(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl border border-border p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}>
              {revisionSent ? (
                <div className="text-center py-6">
                  <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={24} className="text-emerald-500" />
                  </div>
                  <p className="font-medium">Revision Sent!</p>
                  <p className="text-xs text-muted-foreground mt-1">{creator.name.split(" ")[0]} has been notified.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-medium flex items-center gap-2"><RefreshCw size={14} className="text-primary" /> Request Revision</h3>
                    <button onClick={() => setShowRevision(false)}><X size={15} className="text-muted-foreground" /></button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Tell {creator.name.split(" ")[0]} exactly what you'd like changed. Be specific — clear feedback gets better results.</p>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {["Change the music", "Refilm the hook", "Better lighting", "Add product close-up", "Change caption", "Shorter edit"].map(s => (
                        <button key={s} onClick={() => setRevisionNote(n => n ? `${n}, ${s}` : s)}
                          className="text-[10px] rounded-full border border-border px-3 py-1 hover:border-primary/40 hover:bg-primary/5 transition-colors">
                          {s}
                        </button>
                      ))}
                    </div>
                    <Textarea value={revisionNote} onChange={e => setRevisionNote(e.target.value)}
                      placeholder="Describe what needs changing in detail…"
                      className="resize-none text-sm" rows={4} />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1 rounded-full" onClick={() => setShowRevision(false)}>Cancel</Button>
                    <Button className="flex-1 rounded-full" disabled={!revisionNote.trim()} onClick={sendRevision}>Send Request</Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VideoPlayer = ({ src, label }: { src: string; label?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const togglePlay = () => {
    if (!videoRef.current) return;
    playing ? videoRef.current.pause() : videoRef.current.play();
    setPlaying(!playing);
  };
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {label && <p className="text-xs font-medium text-muted-foreground mb-3">{label}</p>}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-accent cursor-pointer" onClick={togglePlay}>
        <video ref={videoRef} src={src} muted loop playsInline preload="metadata"
          className="absolute inset-0 h-full w-full object-cover" />
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
            <div className="h-14 w-14 rounded-full bg-card/90 shadow-lg flex items-center justify-center">
              <Play size={20} className="text-foreground ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// TikTok-style portrait grid tile — hover to play
const VideoTile = ({ src, label }: { src: string; label?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const handleMouseEnter = () => { videoRef.current?.play(); setPlaying(true); };
  const handleMouseLeave = () => { videoRef.current?.pause(); videoRef.current && (videoRef.current.currentTime = 0); setPlaying(false); };
  const handleClick = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); } else { videoRef.current.play(); setPlaying(true); }
  };
  return (
    <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-accent cursor-pointer group"
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
      <video ref={videoRef} src={src} muted loop playsInline preload="metadata"
        className="absolute inset-0 h-full w-full object-cover" />
      {/* Overlay with play icon when paused */}
      <div className={`absolute inset-0 flex items-end justify-start p-2 bg-gradient-to-t from-black/50 to-transparent transition-opacity ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Play size={16} className="text-white ml-0.5" />
            </div>
          </div>
        )}
        {label && <span className="text-[10px] text-white/80 font-medium relative z-10">{label}</span>}
      </div>
    </div>
  );
};

export default CreatorProfile;
