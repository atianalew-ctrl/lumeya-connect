import { motion } from "framer-motion";
import { CheckCircle2, Quote } from "lucide-react";

const collabs = [
  { brand: "GlowCo", creator: "Anna Johnson", result: "5 TikTok videos produced", metric: "2.1M views", quote: "The content felt so authentic — exactly what we needed." },
  { brand: "Brew & Co.", creator: "Leo Martinez", result: "Product photography campaign", metric: "45 assets delivered", quote: "Leo's eye for detail elevated our entire brand." },
  { brand: "FitPulse", creator: "Aisha Koroma", result: "30-day TikTok strategy", metric: "150K new followers", quote: "Our TikTok presence was transformed in weeks." },
  { brand: "Nourish", creator: "Priya Sharma", result: "Complete brand identity redesign", metric: "Brand launched", quote: "Priya understood our vision from day one." },
];

const CollaborationsSection = () => (
  <section className="border-t border-border py-24 bg-muted/30 relative overflow-hidden">
    <div className="absolute -top-32 -right-32 w-[300px] h-[300px] rounded-full bg-terracotta/[0.03] blur-[80px]" />

    <div className="container relative">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        <p className="text-[11px] uppercase tracking-scandi text-terracotta font-medium">Community stories</p>
        <h2 className="mt-3 text-3xl md:text-[2.75rem]">Recent Collaborations</h2>
      </motion.div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {collabs.map((c, i) => (
          <motion.div
            key={c.brand}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            className="group rounded-2xl border border-border bg-card p-6 hover:border-terracotta/20 transition-all hover:shadow-lg hover:shadow-terracotta/[0.03]"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-terracotta/[0.08] flex items-center justify-center">
                <Quote size={12} className="text-terracotta" />
              </div>
            </div>
            <p className="mt-4 text-xs italic leading-relaxed text-muted-foreground">"{c.quote}"</p>
            <h3 className="mt-4 font-body text-sm font-semibold">
              {c.brand} <span className="text-terracotta/60">×</span> {c.creator}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">{c.result}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-terracotta">
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
