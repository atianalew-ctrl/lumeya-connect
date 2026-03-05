import { motion } from "framer-motion";
import { Search, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { creators } from "@/lib/data";

const Creators = () => {
  const [search, setSearch] = useState("");
  const filtered = creators.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Browse</p>
          <h1 className="mt-2 text-4xl">Creators</h1>
        </div>
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, role, or skill..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((creator, i) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="group cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                {creator.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{creator.name}</h3>
                <p className="text-xs text-muted-foreground">{creator.role}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin size={10} />{creator.location}</span>
              <span className="flex items-center gap-1"><Star size={10} className="text-primary" />{creator.rating}</span>
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
              <span className="text-xs text-muted-foreground">{creator.portfolio} works</span>
              <Button size="sm" variant="outline" className="text-xs h-7" asChild>
                <Link to={`/creators/${creator.id}`}>View</Link>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-20 text-center text-muted-foreground">
          <p>No creators found matching "{search}"</p>
        </div>
      )}
    </div>
  );
};

export default Creators;
