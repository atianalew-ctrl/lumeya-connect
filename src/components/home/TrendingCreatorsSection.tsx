import { motion } from "framer-motion";
import { TrendingUp, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const trending = [
  { id: 1, name: "Anna Johnson", role: "UGC Creator", location: "London, UK", rating: 4.9, projects: 24, growth: "+18%" },
  { id: 3, name: "Priya Sharma", role: "Graphic Designer", location: "Toronto, CA", rating: 4.9, projects: 56, growth: "+25%" },
  { id: 4, name: "Aisha Koroma", role: "Social Media Manager", location: "London, UK", rating: 5.0, projects: 15, growth: "+32%" },
  { id: 8, name: "Daniel Osei", role: "Motion Designer", location: "Berlin, DE", rating: 4.9, projects: 28, growth: "+21%" },
  { id: 2, name: "Leo Martinez", role: "Videographer", location: "Miami, FL", rating: 4.7, projects: 32, growth: "+15%" },
  { id: 7, name: "Sakura Tanaka", role: "Influencer", location: "Tokyo, JP", rating: 4.8, projects: 40, growth: "+28%" },
];

const TrendingCreatorsSection = () => (
  <section className="border-t border-border py-24">
    <div className="container">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <TrendingUp size={12} /> This week
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl">Trending Creators</h2>
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
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
              {creator.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
                {creator.name}
              </h3>
              <p className="text-xs text-muted-foreground">{creator.role}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-0.5"><MapPin size={9} />{creator.location}</span>
                <span className="flex items-center gap-0.5"><Star size={9} className="text-primary" />{creator.rating}</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-primary">{creator.growth}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrendingCreatorsSection;
