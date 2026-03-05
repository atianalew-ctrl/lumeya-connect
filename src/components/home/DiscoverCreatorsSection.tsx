import { motion } from "framer-motion";
import { MapPin, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const creators = [
  { id: 1, name: "Anna Johnson", role: "UGC Creator", location: "London, UK", color: "from-pink-200 to-purple-200" },
  { id: 2, name: "Leo Martinez", role: "Videographer", location: "Miami, FL", color: "from-amber-200 to-orange-200" },
  { id: 3, name: "Priya Sharma", role: "Graphic Designer", location: "Toronto, CA", color: "from-cyan-200 to-blue-200" },
  { id: 4, name: "Aisha Koroma", role: "Social Media Manager", location: "London, UK", color: "from-emerald-200 to-teal-200" },
  { id: 5, name: "Jordan Blake", role: "Photographer", location: "New York, NY", color: "from-violet-200 to-indigo-200" },
  { id: 6, name: "Sakura Tanaka", role: "Influencer", location: "Tokyo, JP", color: "from-rose-200 to-pink-200" },
  { id: 7, name: "Marcus Johnson", role: "Copywriter", location: "Austin, TX", color: "from-yellow-200 to-amber-200" },
  { id: 8, name: "Daniel Osei", role: "Motion Designer", location: "Berlin, DE", color: "from-sky-200 to-cyan-200" },
];

const DiscoverCreatorsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="border-t border-border py-24">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Browse</p>
            <h2 className="mt-2 text-3xl md:text-4xl">Discover Creators</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
              Browse real content from creators ready to collaborate with brands.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/creators">View all creators</Link>
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mt-12 flex gap-5 overflow-x-auto px-[max(1rem,calc((100vw-1400px)/2+2rem))] pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {creators.map((creator, i) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="group flex-shrink-0 w-[220px] cursor-pointer"
          >
            {/* Video preview placeholder */}
            <div className={`relative aspect-[9/16] w-full rounded-xl bg-gradient-to-br ${creator.color} overflow-hidden`}>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/10 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/90 shadow-lg">
                  <Play size={18} className="text-foreground ml-0.5" />
                </div>
              </div>
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-foreground/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-sm font-semibold text-primary-foreground drop-shadow-sm">{creator.name}</p>
                <p className="text-xs text-primary-foreground/80">{creator.role}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={10} />
              {creator.location}
            </div>

            <Button size="sm" variant="outline" className="mt-2 w-full text-xs h-8" asChild>
              <Link to={`/creators/${creator.id}`}>View Profile</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default DiscoverCreatorsSection;
