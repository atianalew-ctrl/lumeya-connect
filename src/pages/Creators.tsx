import { motion } from "framer-motion";
import { Search, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const allCreators = [
  { id: 1, name: "Mia Chen", role: "UGC Creator", location: "Los Angeles, CA", rating: 4.9, tags: ["Lifestyle", "Fashion", "Beauty"], bio: "Creating authentic content that converts. 3+ years of UGC experience.", portfolio: 24 },
  { id: 2, name: "Jordan Blake", role: "Photographer", location: "New York, NY", rating: 4.8, tags: ["Product", "Food", "Flat Lay"], bio: "Specializing in product photography that tells your brand story.", portfolio: 48 },
  { id: 3, name: "Aisha Koroma", role: "Social Media Manager", location: "London, UK", rating: 5.0, tags: ["TikTok", "Reels", "Strategy"], bio: "Growing brands through viral short-form content and strategy.", portfolio: 15 },
  { id: 4, name: "Leo Martinez", role: "Videographer", location: "Miami, FL", rating: 4.7, tags: ["Brand Films", "Ads", "Documentary"], bio: "Cinematic storytelling for brands that want to stand out.", portfolio: 32 },
  { id: 5, name: "Priya Sharma", role: "Graphic Designer", location: "Toronto, CA", rating: 4.9, tags: ["Branding", "Social Media", "Illustration"], bio: "Crafting visual identities that resonate with your audience.", portfolio: 56 },
  { id: 6, name: "Marcus Johnson", role: "Copywriter", location: "Austin, TX", rating: 4.6, tags: ["Email", "Web Copy", "Ads"], bio: "Words that sell. Conversion-focused copy for modern brands.", portfolio: 20 },
  { id: 7, name: "Sakura Tanaka", role: "Influencer", location: "Tokyo, JP", rating: 4.8, tags: ["Beauty", "Skincare", "Wellness"], bio: "150K+ followers. Authentic reviews and sponsored content.", portfolio: 40 },
  { id: 8, name: "Daniel Osei", role: "Motion Designer", location: "Berlin, DE", rating: 4.9, tags: ["Animation", "Motion Graphics", "3D"], bio: "Bringing brands to life with dynamic motion design.", portfolio: 28 },
];

const Creators = () => {
  const [search, setSearch] = useState("");
  const filtered = allCreators.filter(
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
              <div className="h-10 w-10 rounded-full bg-accent" />
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
              <Button size="sm" variant="outline" className="text-xs h-7">View</Button>
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
