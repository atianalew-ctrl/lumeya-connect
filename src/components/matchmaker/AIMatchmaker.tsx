import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, MapPin, Star, Languages, ArrowRight, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { creators, type Creator } from "@/lib/data";

const SUGGESTIONS = [
  "A Scandinavian creator for a sustainable fashion brand who speaks English and Danish",
  "Someone in Bali or Southeast Asia for a wellness brand, lifestyle content, available remotely",
  "TikTok creator for a food brand, high engagement, based in Europe",
  "Minimalist photographer for a skincare brand, Nordic aesthetic",
];

// Client-side AI matching — scores creators based on the query
function matchCreators(query: string): Array<{ creator: Creator; score: number; reasons: string[] }> {
  const q = query.toLowerCase();
  const words = q.split(/\s+/);

  return creators
    .map((creator) => {
      let score = 0;
      const reasons: string[] = [];

      // Location / region matching
      const locationText = `${creator.location} ${creator.country} ${creator.region}`.toLowerCase();
      if (words.some(w => locationText.includes(w) || w.includes("scand") && creator.region === "Scandinavia")) {
        score += 30;
        reasons.push(`Based in ${creator.location}`);
      }
      if (q.includes("bali") && creator.region === "Bali / Southeast Asia") { score += 35; reasons.push("Based in Bali"); }
      if (q.includes("europe") && ["Europe", "Scandinavia"].includes(creator.region)) { score += 20; reasons.push("European creator"); }
      if (q.includes("remote") && creator.availableForRemote) { score += 15; reasons.push("Available for remote"); }

      // Language matching
      creator.languages.forEach(lang => {
        if (q.includes(lang.toLowerCase())) { score += 20; reasons.push(`Speaks ${lang}`); }
      });

      // Niche / tag matching
      creator.tags.forEach(tag => {
        if (q.includes(tag.toLowerCase())) { score += 25; reasons.push(`Specialises in ${tag}`); }
      });

      // Content type matching
      const contentKeywords: Record<string, string[]> = {
        "Product Review": ["review", "honest", "opinion"],
        "Product Demo": ["demo", "how to", "tutorial"],
        "Testimonial": ["testimonial", "story", "experience"],
        "Unboxing": ["unboxing", "opening", "reveal"],
        "Lifestyle Content": ["lifestyle", "day in the life", "vlog", "daily"],
        "TikTok Trend / Social Trend": ["tiktok", "trend", "viral", "reels"],
        "Voiceover / B-roll": ["voiceover", "b-roll", "narration"],
        "Problem → Solution Ad": ["ad", "conversion", "performance", "paid"],
      };
      creator.contentTypes.forEach(ct => {
        const kws = contentKeywords[ct] || [];
        if (kws.some(kw => q.includes(kw))) { score += 20; reasons.push(`Creates ${ct}`); }
      });

      // Skills matching
      creator.skills.forEach(skill => {
        if (q.includes(skill.toLowerCase())) { score += 15; reasons.push(`Skilled in ${skill}`); }
      });

      // Industry matching
      const industryKeywords: Record<string, string[]> = {
        fashion: ["fashion", "style", "clothing", "apparel", "outfit"],
        beauty: ["beauty", "skincare", "makeup", "cosmetic", "glow"],
        wellness: ["wellness", "health", "yoga", "mindful", "organic"],
        food: ["food", "restaurant", "recipe", "drink", "coffee", "beverage"],
        tech: ["tech", "app", "software", "gadget", "digital"],
        travel: ["travel", "wanderlust", "adventure", "explore"],
        sustainable: ["sustainable", "eco", "green", "organic", "conscious"],
        fitness: ["fitness", "workout", "gym", "sport", "active"],
      };
      Object.entries(industryKeywords).forEach(([industry, kws]) => {
        if (kws.some(kw => q.includes(kw))) {
          const tagMatch = creator.tags.some(t =>
            t.toLowerCase().includes(industry) ||
            ["Lifestyle", "Fashion", "Beauty"].includes(t) && ["fashion", "beauty", "wellness"].includes(industry)
          );
          const brandMatch = creator.brands.some(b =>
            kws.some(kw => b.toLowerCase().includes(kw))
          );
          if (tagMatch || brandMatch) { score += 20; reasons.push(`Experience in ${industry}`); }
        }
      });

      // Rating boost
      if (creator.rating >= 4.9) { score += 10; }

      // Deduplicate reasons
      const uniqueReasons = [...new Set(reasons)].slice(0, 3);

      return { creator, score, reasons: uniqueReasons };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

interface AIMatchmakerProps {
  compact?: boolean;
}

const AIMatchmaker = ({ compact = false }: AIMatchmakerProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof matchCreators>>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(false);
    // Simulate a brief "thinking" moment for UX
    await new Promise(r => setTimeout(r, 900));
    const matched = matchCreators(query);
    setResults(matched);
    setLoading(false);
    setSearched(true);
  };

  const handleSuggestion = (s: string) => {
    setQuery(s);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={compact ? "" : "w-full"}>
      {/* Search box */}
      <div className="relative rounded-xl border border-primary/20 bg-card shadow-sm overflow-hidden">
        <div className="flex items-start gap-3 p-4">
          <Sparkles size={18} className="text-primary mt-1 shrink-0" />
          <Textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your perfect creator in plain English... e.g. 'A Scandinavian lifestyle creator for a sustainable skincare brand who speaks Danish'"
            className="min-h-[60px] resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0 placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="flex items-center justify-between px-4 pb-3 gap-2">
          {query && (
            <button onClick={() => { setQuery(""); setResults([]); setSearched(false); }} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <X size={12} /> Clear
            </button>
          )}
          <Button
            size="sm"
            className="ml-auto rounded-full gap-1.5"
            onClick={handleSearch}
            disabled={!query.trim() || loading}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            {loading ? "Matching…" : "Find Creators"}
          </Button>
        </div>
      </div>

      {/* Suggestions */}
      {!searched && !loading && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(s)}
              className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
            >
              {s.length > 45 ? s.slice(0, 45) + "…" : s}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 space-y-3"
          >
            {results.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                No exact matches found. Try describing the niche, location or content type differently.
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Sparkles size={11} className="text-primary" />
                  {results.length} creator{results.length > 1 ? "s" : ""} matched your brief
                </p>
                {results.map(({ creator, reasons }, i) => (
                  <motion.div
                    key={creator.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all"
                  >
                    {/* Rank badge */}
                    <div className="shrink-0 flex flex-col items-center gap-1">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        i === 0 ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                      }`}>
                        {i + 1}
                      </div>
                    </div>

                    <img src={creator.avatar} alt={creator.name} className="h-12 w-12 rounded-full object-cover shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-semibold">{creator.name}</h4>
                          <p className="text-xs text-muted-foreground">{creator.role}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Star size={11} className="text-primary" /> {creator.rating}
                        </div>
                      </div>

                      <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin size={10} />{creator.location}</span>
                        <span className="flex items-center gap-1"><Languages size={10} />{creator.languages.slice(0, 2).join(", ")}</span>
                      </div>

                      {/* Why matched */}
                      {reasons.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {reasons.map(r => (
                            <span key={r} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                              ✓ {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button size="sm" variant="outline" className="text-xs h-8 shrink-0" asChild>
                      <Link to={`/creators/${creator.id}`}>
                        View <ArrowRight size={11} className="ml-1" />
                      </Link>
                    </Button>
                  </motion.div>
                ))}

                <div className="pt-1 text-center">
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" asChild>
                    <Link to="/creators">Browse all creators</Link>
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIMatchmaker;
