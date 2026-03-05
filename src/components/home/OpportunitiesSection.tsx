import { motion } from "framer-motion";
import { DollarSign, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ApplyModal from "@/components/ApplyModal";

const opportunities = [
  {
    title: "UGC Creator for Skincare Brand",
    brand: "GlowCo",
    desc: "Looking for a creator to produce 5 short-form product videos for TikTok and Reels.",
    budget: "$500–$1,000",
    deadline: "Mar 15",
  },
  {
    title: "Product Photographer Needed",
    brand: "Brew & Co.",
    desc: "Need high-quality product photography for our new coffee line launch.",
    budget: "$800–$1,500",
    deadline: "Mar 20",
  },
  {
    title: "TikTok Content Manager",
    brand: "FitPulse",
    desc: "Manage and create TikTok content strategy with 3 posts per week.",
    budget: "$2,000/mo",
    deadline: "Ongoing",
  },
  {
    title: "Brand Identity Designer",
    brand: "Nourish",
    desc: "Complete brand identity package including logo, color palette, and social templates.",
    budget: "$1,500–$3,000",
    deadline: "Apr 1",
  },
];

const OpportunitiesSection = () => {
  const [applyOpp, setApplyOpp] = useState<typeof opportunities[0] | null>(null);

  return (
    <section className="border-t border-border py-24 bg-muted/30">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Open now</p>
            <h2 className="mt-2 text-3xl md:text-4xl">Latest Opportunities</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
              Brands are looking for creators right now.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/opportunities">View all</Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {opportunities.map((opp, i) => (
            <motion.div
              key={opp.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <Link to={`/opportunities/${i + 1}`} className="flex-1">
                  <h3 className="font-body text-base font-semibold group-hover:text-primary transition-colors">
                    {opp.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">by {opp.brand}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{opp.desc}</p>
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <DollarSign size={13} className="text-primary" />
                    {opp.budget}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={11} />
                    {opp.deadline}
                  </span>
                </div>
                <Button size="sm" className="text-xs h-8" onClick={() => setApplyOpp(opp)}>
                  Apply <ArrowRight size={12} className="ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ApplyModal open={!!applyOpp} onOpenChange={(o) => !o && setApplyOpp(null)} opportunity={applyOpp} />
    </section>
  );
};

export default OpportunitiesSection;
