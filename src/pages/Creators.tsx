import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Search, MapPin, Star, Globe, Languages, Filter, X, Wifi, Video, ChevronDown, Check, Heart, XCircle } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { creators as staticCreators, type Region, UGC_CONTENT_TYPES, type UGCContentType } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";

const fmtNum = (n: any) => { const f = Number(n); if (!f || f < 100) return "—"; if (f >= 1000000) return `${(f/1000000).toFixed(1)}M`; return `${(f/1000).toFixed(1)}K`; };

// Photo gallery — single touch handler, no overlapping click zones
const CreatorCardGallery = ({ creator }: { creator: any }) => {
  const photos = [creator.avatar, ...(creator.portfolioImages || [])].filter(Boolean).slice(0, 6);
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const t0x = useRef(0);
  const t0y = useRef(0);
  const t0ms = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    t0x.current = e.touches[0].clientX;
    t0y.current = e.touches[0].clientY;
    t0ms.current = Date.now();
  };

  const touchHandled = useRef(false);

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - t0x.current;
    const dy = Math.abs(e.changedTouches[0].clientY - t0y.current);
    const dt = Date.now() - t0ms.current;
    const tapX = e.changedTouches[0].clientX;
    const w = (e.currentTarget as HTMLElement).offsetWidth;
    const isTap = dt < 250 && Math.abs(dx) < 10 && dy < 10;
    touchHandled.current = true;
    if (!isTap) return;
    if (photos.length > 1 && tapX < w * 0.45 && idx > 0) {
      setIdx(i => i - 1);
    } else if (photos.length > 1 && tapX > w * 0.55 && idx < photos.length - 1) {
      setIdx(i => i + 1);
    } else {
      navigate(`/creators/${creator.id}`);
    }
  };

  const onClickPhoto = () => {
    if (touchHandled.current) { touchHandled.current = false; return; }
    navigate(`/creators/${creator.id}`);
  };

  const prevPhoto = (e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => Math.max(0, i - 1)); };
  const nextPhoto = (e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => Math.min(photos.length - 1, i + 1)); };

  return (
    <div className="relative aspect-[3/4] overflow-hidden bg-accent select-none group/gallery"
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      onClick={onClickPhoto}>

      {/* Images */}
      {photos.map((src, i) => (
        <img key={i} src={src} alt={creator.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${i === idx ? "opacity-100" : "opacity-0"}`}
          draggable={false} />
      ))}

      {/* Desktop arrow buttons */}
      {photos.length > 1 && idx > 0 && (
        <button onClick={prevPhoto}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity text-lg">
          ‹
        </button>
      )}
      {photos.length > 1 && idx < photos.length - 1 && (
        <button onClick={nextPhoto}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity text-lg">
          ›
        </button>
      )}

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none z-20" />

      {/* Dot indicators */}
      {photos.length > 1 && (
        <div className="absolute top-3 left-0 right-0 flex justify-center gap-1 z-30 pointer-events-none">
          {photos.map((_, i) => (
            <span key={i} className={`h-0.5 rounded-full transition-all duration-200 ${i === idx ? "w-4 bg-white" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>
      )}

      {/* Badges */}
      <div className="absolute top-7 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex flex-col gap-1">
          {(creator as any).is_verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/90 backdrop-blur-sm px-2 py-0.5 text-[9px] text-white font-medium">✓ Verified</span>
          )}
          {(creator as any).is_trending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/90 backdrop-blur-sm px-2 py-0.5 text-[9px] text-white font-medium">🔥 Trending</span>
          )}
          {(creator as any).availability === "busy" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/90 backdrop-blur-sm px-2 py-0.5 text-[9px] text-white font-medium">● Busy</span>
          )}
          {(creator as any).availability === "limited" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/90 backdrop-blur-sm px-2 py-0.5 text-[9px] text-white font-medium">● Limited</span>
          )}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 px-2.5 py-1 text-[9px] text-white/80">
          <Star size={8} className="text-yellow-400 fill-yellow-400" /> {creator.rating}
        </span>
      </div>

      {/* Name + location */}
      <div className="absolute bottom-3 left-3 right-3 pointer-events-none z-30">
        <h3 className="text-white font-medium text-sm leading-tight">{creator.name}</h3>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={9} className="text-white/50" />
          <span className="text-[10px] text-white/50">{creator.location}{creator.country && creator.country !== creator.location ? `, ${creator.country}` : ""}</span>
        </div>
      </div>
    </div>
  );
};

const allCountries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil",
  "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
  "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
  "Djibouti", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Estonia", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece",
  "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Liberia",
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saudi Arabia",
  "Senegal", "Serbia", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Somalia",
  "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden",
  "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];
const regions: Region[] = ["Scandinavia", "Europe", "Bali / Southeast Asia", "Global"];
const languages = ["English", "Japanese", "Indonesian", "Spanish", "Danish", "German", "French", "Polish", "Vietnamese"];

// --- localStorage helpers for saved creators ---
const LS_KEY_SAVED = "lumeya_saved_creators";
const LS_KEY_EMAIL = "lumeya_brand_email";

function getSavedData(): { email: string; saved: string[] } {
  try {
    const raw = localStorage.getItem(LS_KEY_SAVED);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { email: "", saved: [] };
}

function setSavedData(data: { email: string; saved: string[] }) {
  try {
    localStorage.setItem(LS_KEY_SAVED, JSON.stringify(data));
  } catch {}
}

function getSavedEmail(): string {
  try {
    return localStorage.getItem(LS_KEY_EMAIL) || getSavedData().email || "";
  } catch {}
  return "";
}

const Creators = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [locationOpen, setLocationOpen] = useState(false);
  const [swipeMode, setSwipeMode] = useState(false);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [swipeSaved, setSwipeSaved] = useState<number[]>([]);
  const isMobile = useIsMobile();

  // Saved/favourite state
  const [savedIds, setSavedIds] = useState<string[]>(() => getSavedData().saved);
  const [savedEmail, setSavedEmail] = useState<string>(() => getSavedEmail());
  const [activeTab, setActiveTab] = useState<"all" | "saved">("all");
  const [creatorType, setCreatorType] = useState<"ugc" | "influencer">("ugc");
  // For inline email prompt: tracks which creatorId is pending heart click
  const [pendingHeartId, setPendingHeartId] = useState<string | null>(null);
  const [emailPromptValue, setEmailPromptValue] = useState("");

  // Load real creators from DB — show alongside static until enough real ones exist
  const [dbCreators, setDbCreators] = useState<typeof staticCreators>([]);
  useEffect(() => {
    supabase.functions.invoke("admin-creators", { body: { action: "list" } }).then(({ data }) => {
      if (!data?.ok || !data.data) return;
      // Only show real creators that have a display_name
      const real = data.data.filter((c: { display_name?: string }) => c.display_name && c.display_name.trim() !== "");
      if (real.length === 0) return;
      const mapped = real.map((c: { id: string; display_name: string; tagline?: string; location?: string; bio?: string; instagram?: string; rates?: string; tags?: string[]; avatar_url?: string; portfolio_images?: string[]; video_url?: string; rating?: number }, i: number) => ({
        id: c.id as any,
        name: c.display_name,
        role: c.tagline || "UGC Creator",
        location: c.location || "",
        country: c.country || c.location || "",
        bio: c.bio || "",
        avatar: c.avatar_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80`,
        tags: c.tags || [],
        rates: c.rates || "",
        rating: c.rating || 5.0,
        followers: c.followers || 10000,
        tiktokFollowers: c.tiktok_followers || 0,
        engagementRate: c.engagement_rate || 5.0,
        completedCampaigns: 0,
        portfolio: (c.portfolio_images || []).length,
        responseTime: "Same day",
        availableForRemote: c.available_for_remote ?? true,
        available_for_remote: c.available_for_remote ?? true,
        is_verified: c.is_verified || false,
        is_trending: c.is_trending || false,
        availability: c.availability || "available",
        creator_type: c.creator_type || "ugc",
        region: (c.region || "Europe") as Region,
        languages: c.languages?.length ? c.languages : ["English"],
        contentTypes: (c.content_types || []) as UGCContentType[],
        ugcContentTypes: c.content_types || [],
        instagram: c.instagram || "",
        portfolioImages: c.portfolio_images || [],
        videoUrl: c.video_url || null,
      }));
      setDbCreators(mapped);
    }).catch(() => null);
  }, []);

  // Show real creators first, then fill with static demos if fewer than 4 real ones
  const creators = dbCreators.length >= 1
    ? [...dbCreators, ...staticCreators.slice(0, Math.max(0, 4 - dbCreators.length))]
    : staticCreators;

  const toggleFilter = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const activeFilterCount = selectedRegions.length + selectedCountries.length + selectedLanguages.length + selectedContentTypes.length + (remoteOnly ? 1 : 0);

  const clearAll = () => {
    setSelectedRegions([]);
    setSelectedCountries([]);
    setSelectedLanguages([]);
    setSelectedContentTypes([]);
    setRemoteOnly(false);
    setSearch("");
    setActiveTab("all");
  };

  // Heart toggle logic
  const handleHeartClick = (creatorId: string) => {
    const email = getSavedEmail();
    if (!email) {
      // Show email prompt for this creator
      setPendingHeartId(creatorId);
      setEmailPromptValue("");
      return;
    }
    toggleSave(creatorId, email);
  };

  const toggleSave = (creatorId: string, email: string) => {
    const data = getSavedData();
    const alreadySaved = data.saved.includes(creatorId);
    const newSaved = alreadySaved
      ? data.saved.filter((id) => id !== creatorId)
      : [...data.saved, creatorId];
    const newData = { email, saved: newSaved };
    setSavedData(newData);
    setSavedIds(newSaved);
    setSavedEmail(email);
    try { localStorage.setItem(LS_KEY_EMAIL, email); } catch {}
  };

  const confirmEmailAndSave = (creatorId: string) => {
    const email = emailPromptValue.trim();
    if (!email) return;
    try { localStorage.setItem(LS_KEY_EMAIL, email); } catch {}
    toggleSave(creatorId, email);
    setPendingHeartId(null);
    setEmailPromptValue("");
  };

  const filtered = useMemo(() => {
    return creators.filter((c) => {
      const lowerSearch = (search || "").toLowerCase();
      const matchesSearch =
        !search ||
        (c.name || "").toLowerCase().includes(lowerSearch) ||
        (c.role || "").toLowerCase().includes(lowerSearch) ||
        c.tags.some((t) => (t || "").toLowerCase().includes(lowerSearch)) ||
        (c.location || "").toLowerCase().includes(lowerSearch) ||
        (c.country || "").toLowerCase().includes(lowerSearch) ||
        (c.bio || "").toLowerCase().includes(lowerSearch);

      const matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(c.region);

      const matchesCountry =
        selectedCountries.length === 0 ||
        selectedCountries.includes(c.country);

      const matchesLanguage =
        selectedLanguages.length === 0 ||
        selectedLanguages.some((lang) => c.languages.includes(lang));

      const matchesContentType =
        selectedContentTypes.length === 0 ||
        selectedContentTypes.some((ct) => c.contentTypes.includes(ct as UGCContentType));

      const matchesRemote = !remoteOnly || c.availableForRemote;

      const matchesSavedTab =
        (activeTab === "all" || savedIds.includes(String(c.id))) &&
        ((c as any).creator_type === creatorType || (c as any).creator_type === "both" || (creatorType === "ugc" && !(c as any).creator_type));

      return matchesSearch && matchesRegion && matchesCountry && matchesLanguage && matchesContentType && matchesRemote && matchesSavedTab;
    });
  }, [creators, search, selectedRegions, selectedCountries, selectedLanguages, selectedContentTypes, remoteOnly, activeTab, savedIds, creatorType]);

  return (
    <div className="container py-12">
      {/* Hub Header */}
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-5">Creator Hub</p>

        {/* Hub switcher: Real vs AI */}
        <div className="flex rounded-2xl border border-border overflow-hidden mb-8 max-w-md">
          <div className="flex-1 py-4 px-6 bg-foreground text-background">
            <p className="text-sm font-semibold mb-0.5">Real Creators</p>
            <p className="text-xs text-background/60">Humans. Real content.</p>
          </div>
          <div className="w-px bg-border" />
          <a href="/ai-studio" className="flex-1 py-4 px-6 bg-background text-muted-foreground hover:text-foreground transition-colors group">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-sm font-semibold text-foreground group-hover:text-foreground">AI Creators</p>
              <span className="rounded-full bg-primary/10 text-primary text-[9px] px-1.5 py-0.5 font-medium">NEW</span>
            </div>
            <p className="text-xs">AI models + your product</p>
          </a>
        </div>

        {/* Big type switcher */}
        <div className="flex rounded-2xl border border-border overflow-hidden mb-8 max-w-lg">
          <button
            onClick={() => setCreatorType("ugc")}
            className={`flex-1 py-4 px-6 text-left transition-all ${creatorType === "ugc" ? "bg-foreground text-background" : "bg-background text-muted-foreground hover:text-foreground"}`}
          >
            <p className="text-sm font-semibold mb-0.5">UGC Creators</p>
            <p className={`text-xs ${creatorType === "ugc" ? "text-background/60" : "text-muted-foreground"}`}>Buy content. No followers needed.</p>
          </button>
          <div className="w-px bg-border" />
          <button
            onClick={() => setCreatorType("influencer")}
            className={`flex-1 py-4 px-6 text-left transition-all ${creatorType === "influencer" ? "bg-foreground text-background" : "bg-background text-muted-foreground hover:text-foreground"}`}
          >
            <p className="text-sm font-semibold mb-0.5">Influencers</p>
            <p className={`text-xs ${creatorType === "influencer" ? "text-background/60" : "text-muted-foreground"}`}>Buy reach. Follower-based pricing.</p>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-normal">
              {creatorType === "ugc" ? <>Find a <em className="text-primary/60">UGC Creator.</em></> : <>Find an <em className="text-primary/60">Influencer.</em></>}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              {creatorType === "ugc"
                ? "Creators who make scroll-stopping content for your brand. Pay per deliverable — no follower count, just quality."
                : "Creators with real audiences. Buy reach, awareness and trust with their followers."}
            </p>
          </div>
        </div>
      </div>

      {/* Quick niche pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Fashion", "Beauty", "Lifestyle", "Food", "Fitness", "Luxury", "TikTok", "Travel"].map((niche) => (
          <button
            key={niche}
            onClick={() => {
              if (niche === "All") { setSearch(""); }
              else setSearch(niche);
            }}
            className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
              (niche === "All" && !search) || search === niche
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {niche}
          </button>
        ))}
      </div>

      {/* Search + filters row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, role, location..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={14} />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center bg-primary text-primary-foreground">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 rounded-lg border border-border bg-card p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Globe size={14} className="text-primary" />
              Discovery Filters
            </h3>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                <X size={12} /> Clear all
              </button>
            )}
          </div>

          {/* Region */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <MapPin size={11} /> Region
            </p>
            <div className="flex flex-wrap gap-1.5">
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleFilter(selectedRegions, r, setSelectedRegions)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    selectedRegions.includes(r)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <MapPin size={11} /> Location
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                    <MapPin size={12} />
                    {selectedCountries.length > 0
                      ? `${selectedCountries.length} selected`
                      : "Select countries"}
                    <ChevronDown size={12} className="text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search countries..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {allCountries.map((country) => (
                          <CommandItem
                            key={country}
                            onSelect={() => toggleFilter(selectedCountries, country, setSelectedCountries)}
                            className="text-xs"
                          >
                            <Check
                              size={14}
                              className={`mr-2 ${
                                selectedCountries.includes(country) ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {country}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedCountries.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 rounded-full border border-primary bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary"
                >
                  {c}
                  <X size={10} className="cursor-pointer hover:text-primary/70" onClick={() => toggleFilter(selectedCountries, c, setSelectedCountries)} />
                </span>
              ))}

              <button
                onClick={() => setRemoteOnly(!remoteOnly)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all flex items-center gap-1.5 ${
                  remoteOnly
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Wifi size={11} /> Remote
              </button>
            </div>
          </div>

          {/* Language */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Languages size={11} /> Language
            </p>
            <div className="flex flex-wrap gap-1.5">
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => toggleFilter(selectedLanguages, l, setSelectedLanguages)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    selectedLanguages.includes(l)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* UGC Content Type */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Video size={11} /> UGC Content Type
            </p>
            <div className="flex flex-wrap gap-1.5">
              {UGC_CONTENT_TYPES.map((ct) => (
                <button
                  key={ct}
                  onClick={() => toggleFilter(selectedContentTypes, ct, setSelectedContentTypes)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    selectedContentTypes.includes(ct)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {ct}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Active filters summary */}
      {activeFilterCount > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-1">Active:</span>
          {selectedRegions.map((r) => (
            <span key={r} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary">
              {r}
              <X size={10} className="cursor-pointer hover:text-primary/70" onClick={() => toggleFilter(selectedRegions, r, setSelectedRegions)} />
            </span>
          ))}
          {selectedCountries.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary">
              {c}
              <X size={10} className="cursor-pointer hover:text-primary/70" onClick={() => toggleFilter(selectedCountries, c, setSelectedCountries)} />
            </span>
          ))}
          {selectedLanguages.map((l) => (
            <span key={l} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary">
              {l}
              <X size={10} className="cursor-pointer hover:text-primary/70" onClick={() => toggleFilter(selectedLanguages, l, setSelectedLanguages)} />
            </span>
          ))}
          {selectedContentTypes.map((ct) => (
            <span key={ct} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary">
              {ct}
              <X size={10} className="cursor-pointer hover:text-primary/70" onClick={() => toggleFilter(selectedContentTypes, ct, setSelectedContentTypes)} />
            </span>
          ))}
          {remoteOnly && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary">
              Remote
              <X size={10} className="cursor-pointer hover:text-primary/70" onClick={() => setRemoteOnly(false)} />
            </span>
          )}
        </div>
      )}

      {/* Filter tabs: All | ❤️ Saved */}
      <div className="mt-6 flex items-center gap-1 border-b border-border">
        {[
          { key: "all", label: "All" },
          { key: "saved", label: `❤️ Saved${savedIds.length > 0 ? ` (${savedIds.length})` : ""}` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "all" | "saved")}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results count + swipe toggle */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {filtered.length} creator{filtered.length !== 1 ? "s" : ""} found
        </p>
        {isMobile && (
          <button
            onClick={() => { setSwipeMode(!swipeMode); setSwipeIndex(0); }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              swipeMode ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
            }`}
          >
            {swipeMode ? "Grid view" : "✨ Swipe mode"}
          </button>
        )}
      </div>

      {/* Swipe mode — mobile only */}
      {swipeMode && isMobile && filtered.length > 0 && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <p className="text-xs text-muted-foreground">{swipeIndex + 1} / {filtered.length}</p>
          <div className="relative w-full max-w-xs h-[480px]">
            {filtered.slice(swipeIndex, swipeIndex + 2).reverse().map((creator, i) => (
              <motion.div
                key={creator.id}
                className={`absolute inset-0 rounded-2xl border border-border bg-card p-6 shadow-lg swipe-card ${i === 1 ? "z-10" : "z-0 scale-95 opacity-60"}`}
                drag={i === 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > 80) {
                    if (info.offset.x > 0) setSwipeSaved(s => [...s, creator.id]);
                    setSwipeIndex(idx => Math.min(idx + 1, filtered.length - 1));
                  }
                }}
                whileDrag={{ rotate: (0.05 * 1) }}
              >
                <img src={creator.avatar} alt={creator.name} className="h-16 w-16 rounded-full object-cover mx-auto" />
                <h3 className="mt-3 text-center text-lg font-semibold">{creator.name}</h3>
                <p className="text-center text-xs text-muted-foreground">{creator.role}</p>
                <p className="text-center text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1"><MapPin size={10} />{creator.location}</p>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">{creator.bio}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {creator.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="rounded-full bg-accent px-2.5 py-0.5 text-[11px]">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Star size={11} className="text-primary" /> {creator.rating} · {creator.portfolio} works
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setSwipeIndex(i => Math.min(i + 1, filtered.length - 1))} className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card shadow-md text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors">
              <XCircle size={22} />
            </button>
            <Button size="sm" asChild variant="outline">
              <Link to={`/creators/${filtered[swipeIndex]?.id}`}>View Profile</Link>
            </Button>
            <button onClick={() => { setSwipeSaved(s => [...s, filtered[swipeIndex]?.id]); setSwipeIndex(i => Math.min(i + 1, filtered.length - 1)); }} className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10 shadow-md text-primary hover:bg-primary/20 transition-colors">
              <Heart size={22} />
            </button>
          </div>
          {swipeSaved.length > 0 && (
            <p className="text-xs text-muted-foreground">{swipeSaved.length} creator{swipeSaved.length > 1 ? "s" : ""} saved ❤️</p>
          )}
          {swipeIndex >= filtered.length - 1 && (
            <div className="text-center text-sm text-muted-foreground py-4">
              <p>You've seen all creators! 🎉</p>
              <button onClick={() => setSwipeIndex(0)} className="mt-2 text-primary hover:underline text-xs">Start over</button>
            </div>
          )}
        </div>
      )}

      {/* Grid — hidden in swipe mode */}
      {!swipeMode && <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((creator, i) => {
          const creatorIdStr = String(creator.id);
          const isHeartSaved = savedIds.includes(creatorIdStr);
          const isPending = pendingHeartId === creatorIdStr;
          return (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="group block rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg relative">
              {/* Heart button — absolute top-right of the card */}
              <div className="absolute top-2 right-2 z-40">
                {isPending ? (
                  <div className="bg-card border border-border rounded-xl shadow-lg p-2 w-48">
                    <p className="text-[10px] text-muted-foreground mb-1.5">Enter your email to save</p>
                    <input
                      type="email"
                      value={emailPromptValue}
                      onChange={(e) => setEmailPromptValue(e.target.value)}
                      placeholder="you@brand.com"
                      className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs mb-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmEmailAndSave(creatorIdStr);
                        if (e.key === "Escape") setPendingHeartId(null);
                      }}
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPendingHeartId(null)}
                        className="flex-1 rounded-md border border-border text-[10px] py-1 text-muted-foreground hover:bg-accent transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => confirmEmailAndSave(creatorIdStr)}
                        disabled={!emailPromptValue.trim()}
                        className="flex-1 rounded-md bg-primary text-primary-foreground text-[10px] py-1 disabled:opacity-40 transition-colors"
                      >
                        Save ❤️
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleHeartClick(creatorIdStr); }}
                    className={`h-8 w-8 rounded-full flex items-center justify-center shadow-md transition-all ${
                      isHeartSaved
                        ? "bg-rose-500 text-white border border-rose-500"
                        : "bg-card/90 backdrop-blur border border-border text-muted-foreground hover:text-rose-500 hover:border-rose-300"
                    }`}
                    title={isHeartSaved ? "Remove from saved" : "Save creator"}
                  >
                    <Heart size={13} className={isHeartSaved ? "fill-white" : ""} />
                  </button>
                )}
              </div>

              <CreatorCardGallery creator={creator} />

              {/* Stats row — different for UGC vs Influencer */}
              {((creator as any).creator_type === "influencer" || ((creator as any).creator_type === "both" && creatorType === "influencer")) ? (
                <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-xs font-semibold">{fmtNum(creator.followers)}</p>
                    <p className="text-[9px] text-muted-foreground flex items-center justify-center gap-0.5">
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 shrink-0"><defs><radialGradient id="ig-stat-inf" cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#fdf497"/><stop offset="45%" stopColor="#fd5949"/><stop offset="60%" stopColor="#d6249f"/><stop offset="90%" stopColor="#285AEB"/></radialGradient></defs><rect width="24" height="24" rx="6" fill="url(#ig-stat-inf)"/><circle cx="12" cy="12" r="4.5" fill="none" stroke="white" strokeWidth="2"/><circle cx="17.2" cy="6.8" r="1.3" fill="white"/></svg>
                      IG
                    </p>
                  </div>
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-xs font-semibold">{fmtNum((creator as any).tiktokFollowers)}</p>
                    <p className="text-[9px] text-muted-foreground flex items-center justify-center gap-0.5">
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 shrink-0" fill="none"><rect width="24" height="24" rx="4" fill="black"/><path d="M16.5 5.5a3.5 3.5 0 0 0 2 .5V9a5.5 5.5 0 0 1-2-.4v5.4a5 5 0 1 1-3-4.6V12a2.5 2.5 0 1 0 1.5 2.3V5.5h1.5Z" fill="white"/></svg>
                      TikTok
                    </p>
                  </div>
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-xs font-semibold text-emerald-500">{creator.engagementRate ? `${creator.engagementRate}%` : "—"}</p>
                    <p className="text-[9px] text-muted-foreground">Engagement</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-xs font-semibold">{creator.rates ? creator.rates.split("–")[0] : "—"}</p>
                    <p className="text-[9px] text-muted-foreground">Starting from</p>
                  </div>
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-xs font-semibold">{creator.completedCampaigns || creator.portfolio || "—"}</p>
                    <p className="text-[9px] text-muted-foreground">Campaigns</p>
                  </div>
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-xs font-semibold text-emerald-500">{creator.engagementRate ? `${creator.engagementRate}%` : "—"}</p>
                    <p className="text-[9px] text-muted-foreground">Engagement</p>
                  </div>
                </div>
              )}

              {/* Tags + bio + socials */}
              <div className="p-3 space-y-2.5">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {creator.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Short bio */}
                {creator.bio && (
                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{creator.bio}</p>
                )}
                {/* Socials row */}
                <div className="flex items-center gap-2">
                  {creator.instagram && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0"><defs><radialGradient id={`ig-${creator.id}`} cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#fdf497"/><stop offset="45%" stopColor="#fd5949"/><stop offset="60%" stopColor="#d6249f"/><stop offset="90%" stopColor="#285AEB"/></radialGradient></defs><rect width="24" height="24" rx="6" fill={`url(#ig-${creator.id})`}/><circle cx="12" cy="12" r="4.5" fill="none" stroke="white" strokeWidth="2"/><circle cx="17.2" cy="6.8" r="1.3" fill="white"/></svg>
                      @{String(creator.instagram).replace("@","")}
                    </span>
                  )}
                  {(creator as any).tiktok && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0 bg-black rounded-sm" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/></svg>
                      @{String((creator as any).tiktok).replace("@","")}
                    </span>
                  )}
                </div>

                {/* CTA buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <Link to={`/creators/${creator.id}`}
                    className="flex-1 text-center rounded-full bg-foreground text-background text-[11px] font-medium py-2 hover:opacity-80 transition-opacity">
                    Hire
                  </Link>
                  <Link to={`/ai-studio?creator=${creator.id}&name=${encodeURIComponent(String(creator.display_name || creator.name || ""))}&avatar=${encodeURIComponent(String(creator.avatar_url || ""))}`}
                    className="flex-[0.6] text-center rounded-full border border-border text-[11px] text-muted-foreground py-2 hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                    AI
                  </Link>
                  <Link to={`/creators/${creator.id}`}
                    className="flex-1 text-center rounded-full border border-border text-[11px] text-muted-foreground py-2 hover:border-muted-foreground/60 hover:text-foreground transition-colors">
                    Profile
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>}

      {filtered.length === 0 && !swipeMode && (
        <div className="mt-20 text-center">
          <Globe size={32} className="mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground">No creators found</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={clearAll}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Creators;
