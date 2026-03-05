import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const filters = ["UGC", "Photography", "Videography", "Social Media", "Design", "Writing"];
const platforms = ["TikTok", "Instagram", "YouTube"];

const SearchFilterSection = () => {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/creators?search=${encodeURIComponent(query)}${activeFilter ? `&category=${activeFilter}` : ""}`);
  };

  return (
    <section className="border-t border-border py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl md:text-4xl">Find the perfect creator</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Search by skill, location, platform, or content type.
          </p>

          <div className="mt-8 flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search creators, skills, or opportunities..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(activeFilter === f ? null : f)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  activeFilter === f
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
            <span className="h-5 w-px bg-border self-center" />
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setActiveFilter(activeFilter === p ? null : p)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  activeFilter === p
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchFilterSection;
