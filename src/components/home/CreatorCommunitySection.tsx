import { motion } from "framer-motion";
import { Users, Sparkles, Globe, ArrowUpRight } from "lucide-react";

const pillars = [
  {
    icon: Sparkles,
    title: "Showcase your work",
    desc: "Build your portfolio and let your content speak for itself.",
    accent: "bg-terracotta/[0.08] text-terracotta",
  },
  {
    icon: Globe,
    title: "Discover opportunities",
    desc: "Find campaigns and collaborations that match your creative niche.",
    accent: "bg-primary/[0.08] text-primary",
  },
  {
    icon: Users,
    title: "Connect with brands",
    desc: "Build lasting relationships with brands seeking authentic content.",
    accent: "bg-olive/[0.12] text-olive",
  },
];

const CreatorCommunitySection = () => (
  <section className="py-28 bg-linen relative overflow-hidden">
    {/* Decorative background circles */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-terracotta/[0.03] blur-[100px] -translate-y-1/2" />
    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-primary/[0.03] blur-[80px] translate-y-1/3" />

    <div className="container relative">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-xl text-center"
      >
        <p className="text-[11px] uppercase tracking-scandi text-terracotta font-medium">Our community</p>
        <h2 className="mt-4 text-3xl md:text-[2.75rem] leading-tight">
          A community built on <span className="italic text-terracotta">trust</span> and creativity
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Lumeya is a growing community of creators and brands collaborating on content, campaigns, and creative projects — together.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.6 }}
            className="group rounded-2xl bg-card p-8 border border-border/40 hover:border-terracotta/20 transition-all hover:shadow-lg hover:shadow-terracotta/[0.04] relative overflow-hidden"
          >
            {/* Subtle corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-terracotta/[0.04] to-transparent rounded-bl-[60px]" />

            <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${p.accent}`}>
              <p.icon size={20} />
            </div>
            <h3 className="mt-5 text-base font-medium flex items-center gap-1.5">
              {p.title}
              <ArrowUpRight size={14} className="text-muted-foreground/40 group-hover:text-terracotta transition-colors" />
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CreatorCommunitySection;
