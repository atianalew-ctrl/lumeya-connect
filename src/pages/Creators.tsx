import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Search, MapPin, Star, Globe, Languages, Filter, X, Wifi, Video, ChevronDown, Check, Heart, XCircle } from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { creators, type Region, UGC_CONTENT_TYPES, type UGCContentType } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

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
  }, [search, selectedRegions, selectedCountries, selectedLanguages, selectedContentTypes, remoteOnly]);

  return (
    <div className="container py-16">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Discover</p>
          <h1 className="mt-2 text-4xl">Global Creators</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Find talent across borders — filter by region, language, and specialty.
          </p>
        </div>
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
      {!swipeMode && <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((creator, i) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="group cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 creator-card-hover"
          >
            <div className="flex items-center gap-3">
              <img src={creator.avatar} alt={creator.name} className="h-10 w-10 rounded-full bg-accent object-cover" />
              <div>
                <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{creator.name}</h3>
                <p className="text-xs text-muted-foreground">{creator.role}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin size={10} />{creator.location}</span>
              <span className="flex items-center gap-1"><Star size={10} className="text-primary" />{creator.rating}</span>
            </div>

            {/* Languages */}
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Languages size={10} />
              <span>{creator.languages.join(", ")}</span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">{creator.bio}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {creator.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] text-accent-foreground">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{creator.portfolio} works</span>
                {creator.availableForRemote && (
                  <span className="flex items-center gap-0.5 text-[10px] text-primary">
                    <Wifi size={9} /> Remote
                  </span>
                )}
              </div>
              <Button size="sm" variant="outline" className="text-xs h-7" asChild>
                <Link to={`/creators/${creator.id}`}>View</Link>
              </Button>
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
