import { motion } from "framer-motion";
import { Search, Clock, DollarSign, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { opportunities as staticOpportunities } from "@/lib/data";
import ApplyModal from "@/components/ApplyModal";
import { supabase } from "@/integrations/supabase/client";

const categories = ["All", "UGC", "Photography", "Social Media", "Videography", "Design", "Writing"];

type Opportunity = {
  id: string | number;
  title: string;
  brand: string;
  category: string;
  budget: string;
  deadline: string;
  location?: string | null;
  desc: string;
  tags: string[];
  overview?: string | null;
  deliverables?: string | string[] | null;
  timeline?: string | null;
};

const Opportunities = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [applyOpp, setApplyOpp] = useState<Opportunity | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const { data, error } = await supabase
          .from("opportunities")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          // Fall back to static data
          setOpportunities(staticOpportunities.map((o) => ({ ...o, id: String(o.id) })));
        } else {
          setOpportunities(
            data.map((o) => ({
              id: o.id,
              title: o.title,
              brand: o.brand,
              category: o.category,
              budget: o.budget,
              deadline: o.deadline,
              location: o.location,
              desc: o.description,
              tags: o.tags ?? [],
              overview: o.overview,
              deliverables: o.deliverables,
              timeline: o.timeline,
            }))
          );
        }
      } catch {
        setOpportunities(staticOpportunities.map((o) => ({ ...o, id: String(o.id) })));
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const filtered = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.brand.toLowerCase().includes(search.toLowerCase()) ||
      opp.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "All" || opp.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-16">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Discover</p>
          <h1 className="mt-2 text-4xl">Opportunities</h1>
        </div>
        <Button asChild>
          <Link to="/post-opportunity">Post Opportunity</Link>
        </Button>
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
          <Input
            placeholder="Search opportunities..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="mt-20 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((opp, i) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-md"
            >
              {/* Cover image — category-based gradient with label */}
              <Link to={`/opportunities/${opp.id}`}>
                <div className={`relative h-32 w-full flex items-end p-4 ${
                  opp.category === "Beauty" ? "bg-gradient-to-br from-pink-100 to-rose-200" :
                  opp.category === "Fashion" ? "bg-gradient-to-br from-slate-200 to-zinc-300" :
                  opp.category === "Lifestyle" ? "bg-gradient-to-br from-amber-100 to-orange-200" :
                  opp.category === "Food" ? "bg-gradient-to-br from-yellow-100 to-amber-200" :
                  opp.category === "Fitness" ? "bg-gradient-to-br from-emerald-100 to-teal-200" :
                  opp.category === "Travel" ? "bg-gradient-to-br from-sky-100 to-blue-200" :
                  opp.category === "Tech" ? "bg-gradient-to-br from-violet-100 to-indigo-200" :
                  "bg-gradient-to-br from-accent to-muted"
                }`}>
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-white/80 backdrop-blur px-2.5 py-1 text-[10px] font-medium text-foreground">{opp.category}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground/60">by {opp.brand}</p>
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/opportunities/${opp.id}`}>
                  <h3 className="font-body text-sm font-semibold group-hover:text-primary transition-colors mb-1">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">{opp.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {opp.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                </Link>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      <DollarSign size={12} className="text-primary" />{opp.budget}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock size={10} />{opp.deadline}
                    </span>
                  </div>
                  <Button size="sm" className="text-xs h-7 rounded-full" onClick={() => setApplyOpp(opp)}>Apply</Button>
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="mt-20 text-center text-muted-foreground">
              <p>No opportunities found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      )}

      <ApplyModal
        open={!!applyOpp}
        onOpenChange={(o) => !o && setApplyOpp(null)}
        opportunity={applyOpp}
      />
    </div>
  );
};

export default Opportunities;
