import { motion } from "framer-motion";
import { Search, MapPin, Star, Globe, Languages, Filter, X, Wifi } from "lucide-react";
import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { creators, type Region } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

const categories = ["UGC", "Photography", "Videography", "Social Media", "Design", "Writing", "Influencer", "Motion Design"];
const regions: Region[] = ["Southeast Asia", "Europe", "North America", "Asia Pacific"];
const languages = ["English", "Japanese", "Indonesian", "Spanish", "Danish", "German", "French", "Polish", "Vietnamese"];

const Creators = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const toggleFilter = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const activeFilterCount = selectedRegions.length + selectedCategories.length + selectedLanguages.length + (remoteOnly ? 1 : 0);

  const clearAll = () => {
    setSelectedRegions([]);
    setSelectedCategories([]);
    setSelectedLanguages([]);
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

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some(
          (cat) =>
            c.role.toLowerCase().includes(cat.toLowerCase()) ||
            c.tags.some((t) => t.toLowerCase().includes(cat.toLowerCase())) ||
            c.skills.some((s) => s.toLowerCase().includes(cat.toLowerCase()))
        );

      const matchesLanguage =
        selectedLanguages.length === 0 ||
        selectedLanguages.some((lang) => c.languages.includes(lang));

      const matchesRemote = !remoteOnly || c.availableForRemote;

      return matchesSearch && matchesRegion && matchesCategory && matchesLanguage && matchesRemote;
    });
  }, [search, selectedRegions, selectedCategories, selectedLanguages, remoteOnly]);

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

          {/* Category */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Category</p>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleFilter(selectedCategories, c, setSelectedCategories)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    selectedCategories.includes(c)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
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

          {/* Remote toggle */}
          <div>
            <button
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all flex items-center gap-1.5 ${
                remoteOnly
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              <Wifi size={11} /> Available for remote
            </button>
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
          {selectedCategories.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary">
              {c}
              <X size={10} className="cursor-pointer hover:text-primary/70" onClick={() => toggleFilter(selectedCategories, c, setSelectedCategories)} />
            </span>
          ))}
          {selectedLanguages.map((l) => (
            <span key={l} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary">
              {l}
              <X size={10} className="cursor-pointer hover:text-primary/70" onClick={() => toggleFilter(selectedLanguages, l, setSelectedLanguages)} />
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

      {/* Results count */}
      <p className="mt-6 text-xs text-muted-foreground">
        {filtered.length} creator{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((creator, i) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="group cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30"
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
      </div>

      {filtered.length === 0 && (
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
