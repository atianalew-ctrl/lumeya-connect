import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram, Video, Image, BarChart2, Calendar, Sparkles,
  Filter, ChevronDown, Star, Check, X, ArrowRight, Lock, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { creators } from "@/lib/data";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// ─── Static brand listings ──────────────────────────────────────────────────

const BRAND_LISTINGS = [
  {
    id: 1,
    brand: "GlowCo",
    logo: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=80&q=80",
    niche: "Beauty",
    budget: "€2,000–€4,000/mo",
    platforms: ["Instagram", "TikTok"],
    needs: ["Daily posting", "Reels & Stories", "Community management", "Brand voice"],
    followers: "42K",
    desc: "Skincare brand looking for a creator to fully own our Instagram. You post, you engage, you grow us.",
    deadline: "Hiring now",
    tags: ["Beauty", "Skincare", "UGC"],
  },
  {
    id: 2,
    brand: "WellnessNord",
    logo: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=80&q=80",
    niche: "Wellness",
    budget: "€1,500–€3,000/mo",
    platforms: ["Instagram"],
    needs: ["3x posts/week", "Stories daily", "Hashtag strategy", "Analytics reports"],
    followers: "18K",
    desc: "Scandinavian wellness brand. We want a creator who lives the lifestyle and can authentically represent us.",
    deadline: "April 1, 2026",
    tags: ["Wellness", "Lifestyle", "Scandinavian"],
  },
  {
    id: 3,
    brand: "NA-KD Studio",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80",
    niche: "Fashion",
    budget: "€4,000–€8,000/mo",
    platforms: ["Instagram", "TikTok", "Pinterest"],
    needs: ["Full content calendar", "Campaign shoots", "Trend integration", "Paid ad creatives"],
    followers: "210K",
    desc: "Fashion-forward brand seeking a creative director-level creator to own our entire social presence.",
    deadline: "March 30, 2026",
    tags: ["Fashion", "Luxury", "Editorial"],
  },
  {
    id: 4,
    brand: "Brew & Co.",
    logo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&q=80",
    niche: "Food & Drink",
    budget: "€1,000–€2,000/mo",
    platforms: ["Instagram"],
    needs: ["Product photography", "Recipe content", "Flat lay shoots", "Brand storytelling"],
    followers: "8K",
    desc: "Artisan coffee brand. Looking for a food & lifestyle creator to bring our products to life visually.",
    deadline: "April 15, 2026",
    tags: ["Food", "Coffee", "Lifestyle"],
  },
  {
    id: 5,
    brand: "FitPulse",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&q=80",
    niche: "Fitness",
    budget: "€2,500–€5,000/mo",
    platforms: ["Instagram", "TikTok", "YouTube"],
    needs: ["Workout videos", "Transformation content", "Challenges & trends", "Community building"],
    followers: "55K",
    desc: "Fitness gear brand looking for an athlete-creator to run our channels like it's their own brand.",
    deadline: "Hiring now",
    tags: ["Fitness", "Sport", "Lifestyle"],
  },
  {
    id: 6,
    brand: "EcoLabel",
    logo: "https://images.unsplash.com/photo-1542601906897-d7572b62898f?w=80&q=80",
    niche: "Sustainability",
    budget: "€1,200–€2,500/mo",
    platforms: ["Instagram", "Pinterest"],
    needs: ["Sustainability storytelling", "UGC-style content", "Educational posts", "Aesthetic grid"],
    followers: "24K",
    desc: "Sustainable fashion brand. We need a creator who genuinely cares about the planet to lead our voice.",
    deadline: "April 10, 2026",
    tags: ["Sustainability", "Fashion", "Eco"],
  },
];

const NICHES = ["All", "Beauty", "Fashion", "Wellness", "Food & Drink", "Fitness", "Sustainability"];
const BUDGETS = ["All budgets", "€1,000–€2,000", "€2,000–€4,000", "€4,000+"];
const PLATFORMS = ["All platforms", "Instagram", "TikTok", "YouTube", "Pinterest"];

// Manager creators — top 4 from roster
const MANAGERS = creators.slice(0, 4).map((c) => ({
  ...c,
  managerNiches: c.tags,
  monthlyRate: c.rates,
  managedBrands: Math.floor(c.completedCampaigns! / 3),
  availability: c.responseTime === "Same day" ? "Available now" : "Available April",
}));

// ─── Apply Modal ─────────────────────────────────────────────────────────────

const ApplyModal = ({
  listing,
  onClose,
}: {
  listing: (typeof BRAND_LISTINGS)[0] | null;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [email, setEmail] = useState("");
  const [pitch, setPitch] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  if (!listing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      // Send notification email to brand + confirmation to creator
      await supabase.functions.invoke("send-email", {
        body: {
          type: "creator_application",
          data: {
            creatorName: name,
            creatorInstagram: instagram,
            pitch,
            brandName: listing.brand,
            brandEmail: "hello@lumeya.dev", // centralised inbox — forward to brand
            budget: listing.budget,
            platforms: listing.platforms,
          },
        },
      });

      if (email) {
        await supabase.functions.invoke("send-email", {
          body: {
            type: "creator_confirmation",
            data: {
              creatorName: name,
              creatorEmail: email,
              brandName: listing.brand,
            },
          },
        });
      }
    } catch (err) {
      console.error("Email error (non-blocking):", err);
    } finally {
      setSending(false);
      setSubmitted(true);
      toast.success("Application sent! The brand will review it shortly.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-background rounded-2xl border border-border p-8 shadow-2xl"
      >
        {!submitted ? (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Apply as Manager</p>
                <h2 className="text-xl font-display">{listing.brand}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{listing.budget}</p>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Your name</label>
                <Input required placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Your Instagram handle</label>
                <Input required placeholder="@yourhandle" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Your email <span className="text-muted-foreground/50">(for confirmation)</span></label>
                <Input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">
                  Why are you the right manager for {listing.brand}?
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell them about your style, past work, and how you'd grow their account..."
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? <><Loader2 size={14} className="animate-spin mr-2" />Sending...</> : "Send Application"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Lumeya Black exclusive — only verified creators can apply
              </p>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Check size={22} className="text-primary" />
            </div>
            <h3 className="text-lg font-display mb-2">Application Sent</h3>
            <p className="text-sm text-muted-foreground">
              {listing.brand} will review your profile and reach out within 48 hours.
            </p>
            <Button variant="outline" className="mt-6" onClick={onClose}>Close</Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const BrandManagement = () => {
  const [tab, setTab] = useState<"brands" | "managers">("brands");
  const [niche, setNiche] = useState("All");
  const [budget, setBudget] = useState("All budgets");
  const [platform, setPlatform] = useState("All platforms");
  const [search, setSearch] = useState("");
  const [applyListing, setApplyListing] = useState<(typeof BRAND_LISTINGS)[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = BRAND_LISTINGS.filter((b) => {
    const matchNiche = niche === "All" || b.niche === niche;
    const matchPlatform = platform === "All platforms" || b.platforms.includes(platform);
    const matchSearch =
      !search ||
      b.brand.toLowerCase().includes(search.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchNiche && matchPlatform && matchSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#080808] text-white py-20 px-6">
        <div className="container max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 text-xs tracking-widest uppercase text-white/40 mb-8">
              <Lock size={10} />
              Lumeya Black — Exclusive Feature
            </div>
            <h1 className="text-5xl md:text-6xl font-extralight tracking-tight mb-6">
              Creator-Run<br />
              <span className="italic text-white/30">Brand Management</span>
            </h1>
            <p className="text-white/40 max-w-xl mx-auto text-base leading-relaxed mb-10">
              Hand your Instagram to someone who lives it. Elite creators apply to fully manage your social presence — content, posting, strategy, growth. Everything.
            </p>
            <div className="flex items-center justify-center gap-10 text-center">
              {[
                ["Full management", "Not just posts"],
                ["Vetted creators", "Lumeya Black only"],
                ["Results-focused", "Growth guaranteed"],
              ].map(([a, b]) => (
                <div key={a}>
                  <p className="text-sm font-light text-white/80">{a}</p>
                  <p className="text-xs text-white/30 mt-0.5">{b}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's included strip */}
      <div className="bg-[#111] border-y border-white/5 py-4 px-6">
        <div className="container max-w-4xl flex flex-wrap justify-center gap-6 text-xs text-white/40 tracking-widest uppercase">
          {[
            [<Instagram size={12} />, "Daily Posting"],
            [<Video size={12} />, "Reels & TikToks"],
            [<Image size={12} />, "Photo Content"],
            [<BarChart2 size={12} />, "Analytics"],
            [<Calendar size={12} />, "Content Calendar"],
            [<Sparkles size={12} />, "Brand Strategy"],
          ].map(([icon, label], i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-white/30">{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="container max-w-5xl pt-12 pb-4 px-6">
        <div className="flex gap-1 border border-border rounded-lg p-1 w-fit">
          <button
            onClick={() => setTab("brands")}
            className={`px-5 py-2 rounded-md text-sm transition-all ${
              tab === "brands" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Brands Hiring
          </button>
          <button
            onClick={() => setTab("managers")}
            className={`px-5 py-2 rounded-md text-sm transition-all ${
              tab === "managers" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Available Managers
          </button>
        </div>
      </div>

      {/* Brands Hiring Tab */}
      {tab === "brands" && (
        <div className="container max-w-5xl px-6 pb-20">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-8 mt-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search brands or niches..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-4"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Filter size={14} />
              Filters
              <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="flex flex-wrap gap-4 p-4 border border-border rounded-xl bg-card">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Niche</p>
                    <div className="flex flex-wrap gap-1.5">
                      {NICHES.map((n) => (
                        <button
                          key={n}
                          onClick={() => setNiche(n)}
                          className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                            niche === n ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-foreground/20"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Platform</p>
                    <div className="flex flex-wrap gap-1.5">
                      {PLATFORMS.map((p) => (
                        <button
                          key={p}
                          onClick={() => setPlatform(p)}
                          className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                            platform === p ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-foreground/20"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Listings */}
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group border border-border bg-card rounded-2xl p-6 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={listing.logo}
                    alt={listing.brand}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-base">{listing.brand}</h3>
                      <span className="text-xs text-primary font-medium flex-shrink-0">{listing.budget}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{listing.niche} · {listing.followers} followers</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{listing.desc}</p>

                {/* Platforms */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {listing.platforms.map((p) => (
                    <span key={p} className="text-[10px] border border-border px-2 py-0.5 rounded-full text-muted-foreground">
                      {p}
                    </span>
                  ))}
                </div>

                {/* What they need */}
                <div className="space-y-1 mb-5">
                  {listing.needs.map((need) => (
                    <div key={need} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check size={10} className="text-primary flex-shrink-0" />
                      {need}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{listing.deadline}</span>
                  <Button size="sm" className="text-xs h-8" onClick={() => setApplyListing(listing)}>
                    Apply as Manager <ArrowRight size={12} className="ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground text-sm">
              No listings match your filters. Try adjusting them.
            </div>
          )}
        </div>
      )}

      {/* Available Managers Tab */}
      {tab === "managers" && (
        <div className="container max-w-5xl px-6 pb-20 pt-4">
          <p className="text-sm text-muted-foreground mb-8">
            These Lumeya Black creators are available to fully manage your brand's social accounts.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {MANAGERS.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border border-border bg-card rounded-2xl p-6 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{m.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star size={10} className="text-primary" />
                        {m.rating}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.location}</p>
                    <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full border ${
                      m.availability === "Available now"
                        ? "border-green-500/30 text-green-600 bg-green-500/5"
                        : "border-amber-500/30 text-amber-600 bg-amber-500/5"
                    }`}>
                      {m.availability}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{m.bio}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.managerNiches.map((tag) => (
                    <span key={tag} className="text-[10px] border border-border px-2 py-0.5 rounded-full text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                  <div className="bg-muted/40 rounded-lg py-2">
                    <p className="text-sm font-medium">{m.managedBrands}</p>
                    <p className="text-[10px] text-muted-foreground">Brands managed</p>
                  </div>
                  <div className="bg-muted/40 rounded-lg py-2">
                    <p className="text-sm font-medium">{m.engagementRate}%</p>
                    <p className="text-[10px] text-muted-foreground">Avg engagement</p>
                  </div>
                  <div className="bg-muted/40 rounded-lg py-2">
                    <p className="text-sm font-medium">{m.responseTime}</p>
                    <p className="text-[10px] text-muted-foreground">Response</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">{m.monthlyRate}</span>
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    View Profile <ArrowRight size={12} className="ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      <AnimatePresence>
        {applyListing && (
          <ApplyModal listing={applyListing} onClose={() => setApplyListing(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandManagement;
