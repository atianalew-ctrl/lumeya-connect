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
  <section className="py-28 bg-linen">
    <div className="container">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-[11px] uppercase tracking-scandi text-muted-foreground">Explore</p>
        <h2 className="mt-4 text-3xl md:text-4xl">Browse by category</h2>
      </motion.div>

      <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/creators?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3.5 rounded-xl border border-border/40 bg-card p-7 text-center transition-all hover:border-primary/20 hover:shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/[0.06] transition-colors group-hover:bg-primary/[0.1]">
                <cat.icon size={20} className="text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{cat.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{cat.count} creators</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CategoriesSection;
