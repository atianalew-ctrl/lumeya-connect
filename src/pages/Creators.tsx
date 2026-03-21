import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Search, MapPin, Star, Globe, Languages, Filter, X, Wifi, Video, ChevronDown, Check, Heart, XCircle } from "lucide-react";
import { useState, useMemo, useRef, useEffect, useRef as useRefAlias } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { creators as staticCreators, type Region, UGC_CONTENT_TYPES, type UGCContentType } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";

const fmtNum = (n: any) => { const f = Number(n); if (!f || f < 100) return "—"; if (f >= 1000000) return `${(f/1000000).toFixed(1)}M`; return `${(f/1000).toFixed(1)}K`; };

// Swipeable photo gallery — CSS scroll snap for reliable mobile swiping
const CreatorCardGallery = ({ creator }: { creator: any }) => {
  const photos = [creator.avatar, ...(creator.portfolioImages || [])].filter(Boolean).slice(0, 6);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const onScroll = () => {
    if (!scrollRef.current) return;
    const i = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
    setIdx(i);
  };

  return (
    <Link to={`/creators/${creator.id}`} className="block">
      <div className="relative aspect-[3/4] overflow-hidden bg-accent">
        {/* Scrollable strip */}
        <div ref={scrollRef} onScroll={onScroll}
          className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {photos.map((src, i) => (
            <div key={i} className="relative shrink-0 w-full h-full snap-start">
              <img src={src} alt={creator.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

        {/* Dot indicators */}
        {photos.length > 1 && (
          <div className="absolute top-3 left-0 right-0 flex justify-center gap-1 z-10 pointer-events-none">
            {photos.map((_, i) => (
              <span key={i} className={`h-0.5 rounded-full transition-all duration-300 ${i === idx ? "w-4 bg-white" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex flex-col gap-1">
            {(creator as any).is_verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/90 backdrop-blur-sm px-2 py-0.5 text-[9px] text-white font-medium">✓ Verified</span>
            )}
            {(creator as any).is_trending && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/90 backdrop-blur-sm px-2 py-0.5 text-[9px] text-white font-medium">🔥 Trending</span>
            )}
            {(creator as any).availability === "available" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-sm px-2 py-0.5 text-[9px] text-white font-medium">● Available</span>
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
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
          <h3 className="text-white font-medium text-sm leading-tight">{creator.name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={9} className="text-white/50" />
            <span className="text-[10px] text-white/50">{creator.location}{creator.country && creator.country !== creator.location ? `, ${creator.country}` : ""}</span>
          </div>
        </div>
      </div>
    </Link>
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
  const [saved, setSaved] = useState<number[]>([]);
  const isMobile = useIsMobile();

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
        engagementRate: c.engagement_rate || 5.0,
        completedCampaigns: 0,
        portfolio: (c.portfolio_images || []).length,
        responseTime: "Same day",
        availableForRemote: c.available_for_remote ?? true,
        available_for_remote: c.available_for_remote ?? true,
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
  };

  const filtered = useMemo(() => {
    return creators.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        c.location.toLowerCase().includes(search.toLowerCase()) ||
        c.country.toLowerCase().includes(search.toLowerCase());

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

      return matchesSearch && matchesRegion && matchesCountry && matchesLanguage && matchesContentType && matchesRemote;
    });
  }, [creators, search, selectedRegions, selectedCountries, selectedLanguages, selectedContentTypes, remoteOnly]);

  return (
    <div className="container py-12">
      {/* Hub Header */}
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">Creator Hub</p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-normal">
              Find your perfect
              <em className="text-primary/60"> creator.</em>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              2,400+ vetted creators across 40+ countries. Filter by niche, location, engagement and more.
            </p>
          </div>
          <div className="flex gap-6 shrink-0">
            {[["14", "Countries"], ["2.4K+", "Creators"], ["94%", "Satisfaction"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-2xl font-light">{v}</p>
                <p className="text-[10px] text-muted-foreground tracking-wider">{l}</p>
              </div>
            ))}
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

      {/* Results count + swipe toggle */}
      <div className="mt-6 flex items-center justify-between">
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
                    if (info.offset.x > 0) setSaved(s => [...s, creator.id]);
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
            <button onClick={() => { setSaved(s => [...s, filtered[swipeIndex]?.id]); setSwipeIndex(i => Math.min(i + 1, filtered.length - 1)); }} className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10 shadow-md text-primary hover:bg-primary/20 transition-colors">
              <Heart size={22} />
            </button>
          </div>
          {saved.length > 0 && (
            <p className="text-xs text-muted-foreground">{saved.length} creator{saved.length > 1 ? "s" : ""} saved ❤️</p>
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
        {filtered.map((creator, i) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="group block rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg">
              <CreatorCardGallery creator={creator} />

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                <div className="px-3 py-2.5 text-center">
                  <p className="text-xs font-semibold">
                    {fmtNum(creator.followers)}
                  </p>
                  <p className="text-[9px] text-muted-foreground">Followers</p>
                </div>
                <div className="px-3 py-2.5 text-center">
                  <p className="text-xs font-semibold text-emerald-500">{creator.engagementRate ? `${creator.engagementRate}%` : "—"}</p>
                  <p className="text-[9px] text-muted-foreground">Engagement</p>
                </div>
                <div className="px-3 py-2.5 text-center">
                  <p className="text-xs font-semibold">{creator.completedCampaigns || creator.portfolio || "—"}</p>
                  <p className="text-[9px] text-muted-foreground">Campaigns</p>
                </div>
              </div>

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
                {/* Socials + view */}
                <div className="flex items-center justify-between pt-0.5">
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
                  <Link to={`/creators/${creator.id}`} className="text-[10px] font-medium text-primary hover:underline">View →</Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>}

      {filtered.length === 0 && !swipeMode && (
        <div className="mt-20 text-center text-muted-foreground">
          <Globe size={32} className="mx-auto mb-3 text-muted-foreground/50" />
          <p>No creators found matching your filters.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={clearAll}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Creators;
