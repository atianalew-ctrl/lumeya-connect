import { motion } from "framer-motion";
import { Users, Sparkles, Globe } from "lucide-react";

const pillars = [
  { icon: Sparkles, title: "Showcase your work", desc: "Build your portfolio and let your content speak for itself." },
  { icon: Globe, title: "Discover opportunities", desc: "Find campaigns and collaborations that match your creative niche." },
  { icon: Users, title: "Connect with brands", desc: "Build lasting relationships with brands looking for authentic content." },
];

const CreatorCommunitySection = () => (
  <section className="border-t border-border py-24 bg-muted/30">
    <div className="container">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Our community</p>
        <h2 className="mt-3 text-3xl md:text-4xl">Join the Lumeya Creator Community</h2>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Lumeya is more than a marketplace. It is a growing community of creators and brands collaborating on content, campaigns and creative projects.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Creators can showcase their work, discover opportunities and connect with brands looking for authentic content.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <p.icon size={20} className="text-primary" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">{p.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CreatorCommunitySection;
