import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const collabs = [
  { brand: "GlowCo", creator: "Anna Johnson", result: "5 TikTok videos produced", metric: "2.1M views", color: "from-pink-100 to-purple-100" },
  { brand: "Brew & Co.", creator: "Leo Martinez", result: "Product photography campaign", metric: "45 assets delivered", color: "from-amber-100 to-orange-100" },
  { brand: "FitPulse", creator: "Aisha Koroma", result: "30-day TikTok strategy", metric: "150K new followers", color: "from-emerald-100 to-teal-100" },
  { brand: "Nourish", creator: "Priya Sharma", result: "Complete brand identity redesign", metric: "Brand launched", color: "from-cyan-100 to-blue-100" },
];

const CollaborationsSection = () => (
  <section className="border-t border-border py-24 bg-muted/30">
    <div className="container">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Community stories</p>
        <h2 className="mt-3 text-3xl md:text-4xl">Recent Collaborations</h2>
      </motion.div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {collabs.map((c, i) => (
          <motion.div
            key={c.brand}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className={`h-2 w-12 rounded-full bg-gradient-to-r ${c.color}`} />
            <h3 className="mt-4 font-body text-sm font-semibold">
              {c.brand} <span className="text-muted-foreground font-normal">×</span> {c.creator}
            </h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{c.result}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary">
              <CheckCircle2 size={12} />
              {c.metric}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CollaborationsSection;
