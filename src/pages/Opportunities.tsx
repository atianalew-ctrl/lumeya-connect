import { motion } from "framer-motion";
import { Search, Clock, DollarSign } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = ["All", "UGC", "Photography", "Social Media", "Videography", "Design", "Writing"];

const opportunities = [
  { id: 1, title: "UGC Creator for Skincare Brand", brand: "GlowCo", category: "UGC", budget: "$500–$1,000", deadline: "Mar 15, 2026", desc: "Looking for an authentic UGC creator to produce 5 short-form videos showcasing our new serum line.", tags: ["Beauty", "Skincare", "Short-form"] },
  { id: 2, title: "Product Photographer Needed", brand: "Brew & Co.", category: "Photography", budget: "$800–$1,500", deadline: "Mar 20, 2026", desc: "Need a photographer for a flat-lay product shoot of our coffee collection. 20 final images.", tags: ["Product", "Food", "Lifestyle"] },
  { id: 3, title: "TikTok Content Manager", brand: "FitPulse", category: "Social Media", budget: "$2,000/mo", deadline: "Ongoing", desc: "Manage our TikTok account: strategy, content creation, and community engagement. 4 posts/week.", tags: ["TikTok", "Fitness", "Strategy"] },
  { id: 4, title: "Brand Film Director", brand: "Wanderlust Travel", category: "Videography", budget: "$3,000–$5,000", deadline: "Apr 1, 2026", desc: "Direct a 2-minute brand film for our summer campaign. Travel to Bali included.", tags: ["Travel", "Cinematic", "Brand Film"] },
  { id: 5, title: "Social Media Graphics Designer", brand: "TechNova", category: "Design", budget: "$600/mo", deadline: "Ongoing", desc: "Create weekly social media graphics for our tech brand. Figma proficiency required.", tags: ["Design", "Social Media", "Tech"] },
  { id: 6, title: "Email Copywriter for Launch", brand: "PureBlend", category: "Writing", budget: "$400–$700", deadline: "Mar 25, 2026", desc: "Write a 5-email launch sequence for our new wellness supplement line.", tags: ["Email", "Wellness", "Launch"] },
];

const Opportunities = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = opportunities.filter((opp) => {
    const matchesSearch = opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.brand.toLowerCase().includes(search.toLowerCase()) ||
      opp.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "All" || opp.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-16">
      <div>
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Discover</p>
        <h1 className="mt-2 text-4xl">Opportunities</h1>
      </div>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                activeCategory === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search opportunities..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {filtered.map((opp, i) => (
          <motion.div
            key={opp.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h3 className="font-body text-base font-semibold group-hover:text-primary transition-colors">{opp.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">by {opp.brand}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{opp.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {opp.tags.map((tag) => (
                    <span key={tag} className="text-xs text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 md:min-w-[140px]">
                <span className="flex items-center gap-1 text-sm font-medium">
                  <DollarSign size={13} className="text-primary" />{opp.budget}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={11} />{opp.deadline}
                </span>
                <Button size="sm" className="mt-2 text-xs h-8">Apply</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-20 text-center text-muted-foreground">
          <p>No opportunities found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Opportunities;
