import { motion } from "framer-motion";
import { Camera, Video, Palette, PenTool, Share2, Film } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { icon: Video, label: "UGC Creators", count: 120, slug: "ugc" },
  { icon: Camera, label: "Photography", count: 85, slug: "photography" },
  { icon: Film, label: "Videography", count: 64, slug: "videography" },
  { icon: Share2, label: "Social Media", count: 95, slug: "social-media" },
  { icon: Palette, label: "Design", count: 72, slug: "design" },
  { icon: PenTool, label: "Writing", count: 48, slug: "writing" },
];

const CategoriesSection = () => (
  <section className="border-t border-border py-24 bg-muted/30">
    <div className="container">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Explore</p>
        <h2 className="mt-3 text-3xl md:text-4xl">Browse by Category</h2>
      </motion.div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/creators?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent transition-colors group-hover:bg-primary/10">
                <cat.icon size={22} className="text-accent-foreground transition-colors group-hover:text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{cat.label}</p>
                <p className="text-xs text-muted-foreground">{cat.count} creators</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CategoriesSection;
