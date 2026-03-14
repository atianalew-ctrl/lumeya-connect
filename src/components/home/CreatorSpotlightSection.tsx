import { motion } from "framer-motion";
import { Star, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { creators } from "@/lib/data";

const spotlightCreators = [creators[0], creators[2], creators[4]];

const CreatorSpotlightSection = () => (
  <section className="border-t border-border py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-sm uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-1.5">
          <Star size={12} className="text-primary" /> Featured talent
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl">Creator Spotlight</h2>
        <p className="mt-3 max-w-md mx-auto text-sm text-muted-foreground">
          Highlighting talented creators making an impact in the Lumeya community.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {spotlightCreators.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-6 text-center"
          >
            <img
              src={c.avatar}
              alt={c.name}
              className="mx-auto h-20 w-20 rounded-full bg-accent border-2 border-primary/20 object-cover"
            />
            <h3 className="mt-4 text-base font-semibold">{c.name}</h3>
            <p className="text-xs text-primary font-medium">{c.role}</p>
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <MapPin size={10} /> {c.location}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
              {c.bio}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-1">
              {c.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2 justify-center">
              <Button size="sm" variant="outline" className="text-xs h-8" asChild>
                <Link to={`/creators/${c.id}`}>
                  View Profile <ExternalLink size={10} className="ml-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CreatorSpotlightSection;
