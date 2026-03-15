import { motion } from "framer-motion";
import { TrendingUp, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { creators } from "@/lib/data";

const trending = [
  { ...creators[0], growth: "+18%" },
  { ...creators[4], growth: "+25%" },
  { ...creators[2], growth: "+32%" },
  { ...creators[7], growth: "+21%" },
  { ...creators[3], growth: "+15%" },
  { ...creators[6], growth: "+28%" },
];

const TrendingCreatorsSection = () => (
  <section className="border-t border-border py-24 bg-foreground text-background">
    <div className="container">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <p className="text-sm uppercase tracking-widest text-background/40 flex items-center gap-1.5">
            <TrendingUp size={12} /> This week
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl text-background">Trending Creators</h2>
        </div>
        <Button variant="outline" asChild>
          <Link to="/creators">View all</Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trending.map((creator, i) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/8"
          >
            <img src={creator.avatar} alt={creator.name} className="h-12 w-12 flex-shrink-0 rounded-full bg-accent" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-background/90 group-hover:text-white transition-colors truncate">
                {creator.name}
              </h3>
              <p className="text-xs text-background/40">{creator.role}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-background/40">
                <span className="flex items-center gap-0.5"><MapPin size={9} />{creator.location}</span>
                <span className="flex items-center gap-0.5"><Star size={9} className="text-primary" />{creator.rating}</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-400">{creator.growth}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrendingCreatorsSection;
