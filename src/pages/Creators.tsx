import { motion } from "framer-motion";
import { Search, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const allCreators = [
  { id: 1, name: "Mia Chen", role: "UGC Creator", location: "Los Angeles, CA", rating: 4.9, tags: ["Lifestyle", "Fashion", "Beauty"], bio: "Creating authentic content that converts. 3+ years of UGC experience.", color: "bg-peach", portfolio: 24 },
  { id: 2, name: "Jordan Blake", role: "Photographer", location: "New York, NY", rating: 4.8, tags: ["Product", "Food", "Flat Lay"], bio: "Specializing in product photography that tells your brand story.", color: "bg-lavender", portfolio: 48 },
  { id: 3, name: "Aisha Koroma", role: "Social Media Manager", location: "London, UK", rating: 5.0, tags: ["TikTok", "Reels", "Strategy"], bio: "Growing brands through viral short-form content and strategy.", color: "bg-secondary", portfolio: 15 },
  { id: 4, name: "Leo Martinez", role: "Videographer", location: "Miami, FL", rating: 4.7, tags: ["Brand Films", "Ads", "Documentary"], bio: "Cinematic storytelling for brands that want to stand out.", color: "bg-peach", portfolio: 32 },
  { id: 5, name: "Priya Sharma", role: "Graphic Designer", location: "Toronto, CA", rating: 4.9, tags: ["Branding", "Social Media", "Illustration"], bio: "Crafting visual identities that resonate with your audience.", color: "bg-lavender", portfolio: 56 },
  { id: 6, name: "Marcus Johnson", role: "Copywriter", location: "Austin, TX", rating: 4.6, tags: ["Email", "Web Copy", "Ads"], bio: "Words that sell. Conversion-focused copy for modern brands.", color: "bg-secondary", portfolio: 20 },
  { id: 7, name: "Sakura Tanaka", role: "Influencer", location: "Tokyo, JP", rating: 4.8, tags: ["Beauty", "Skincare", "Wellness"], bio: "150K+ followers. Authentic reviews and sponsored content.", color: "bg-peach", portfolio: 40 },
  { id: 8, name: "Daniel Osei", role: "Motion Designer", location: "Berlin, DE", rating: 4.9, tags: ["Animation", "Motion Graphics", "3D"], bio: "Bringing brands to life with dynamic motion design.", color: "bg-lavender", portfolio: 28 },
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
    <div className="container py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Creators</h1>
          <p className="mt-2 text-muted-foreground">Browse talented creators ready for your next project.</p>
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

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((creator, i) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div className={`h-28 w-full ${creator.color}`} />
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{creator.name}</h3>
                  <p className="text-sm text-muted-foreground">{creator.role}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Star size={14} className="fill-primary text-primary" />
                  {creator.rating}
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={12} />
                {creator.location}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">{creator.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {creator.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{creator.portfolio} portfolio items</span>
                <Button size="sm" variant="outline">View Profile</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-20 text-center text-muted-foreground">
          <p className="text-lg">No creators found matching "{search}"</p>
          <p className="mt-1 text-sm">Try a different search term.</p>
        </div>
      )}
    </div>
  );
};

export default Creators;
