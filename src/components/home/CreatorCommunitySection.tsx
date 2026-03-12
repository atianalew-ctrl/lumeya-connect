import { motion } from "framer-motion";
import { Users, Sparkles, Globe } from "lucide-react";

const pillars = [
  { icon: Sparkles, title: "Build your portfolio", desc: "Create a profile that showcases your best work and attracts the right brands." },
  { icon: Globe, title: "Get discovered", desc: "Be found by brands looking for creators in your niche." },
  { icon: Users, title: "Collaborate with brands", desc: "Turn your content into real partnerships and campaigns." },
];

const CreatorCommunitySection = () => (
  <section className="py-28 bg-linen">
    <div className="container">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto max-w-xl text-center"
      >
        <p className="text-[11px] uppercase tracking-scandi text-muted-foreground">Our community</p>
        <h2 className="mt-4 text-3xl md:text-4xl leading-tight">Where creators get discovered.</h2>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Lumeya connects creators and brands to collaborate on content, campaigns, and creative projects.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl bg-card p-8 text-center border border-border/40"
          >
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/[0.07]">
              <p.icon size={18} className="text-primary" />
            </div>
            <h3 className="mt-5 text-sm font-medium">{p.title}</h3>
            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CreatorCommunitySection;
