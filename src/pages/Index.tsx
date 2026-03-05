import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Briefcase, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const steps = [
  { icon: Users, title: "Create your profile", desc: "Showcase your skills, portfolio, and rates to attract the right brands." },
  { icon: Briefcase, title: "Browse opportunities", desc: "Find collaborations that match your niche — UGC, photography, social media, and more." },
  { icon: MessageCircle, title: "Connect & collaborate", desc: "Message brands directly, negotiate terms, and start creating together." },
];

const featuredCreators = [
  { name: "Mia Chen", role: "UGC Creator", tags: ["Lifestyle", "Fashion"], color: "bg-peach" },
  { name: "Jordan Blake", role: "Photographer", tags: ["Product", "Food"], color: "bg-lavender" },
  { name: "Aisha Koroma", role: "Social Media", tags: ["TikTok", "Reels"], color: "bg-secondary" },
  { name: "Leo Martinez", role: "Videographer", tags: ["Brand Films", "Ads"], color: "bg-peach" },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="relative container flex flex-col items-center py-28 text-center md:py-40">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground"
          >
            <Sparkles size={14} className="text-primary" />
            The creator marketplace
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="mt-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl"
          >
            Connect with creators and{" "}
            <span className="text-primary">opportunities</span>.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            Lumeya bridges the gap between talented creators and brands looking for collaborations, content, and growth.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" asChild>
              <Link to="/creators">
                Explore Creators <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/opportunities">Post an Opportunity</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold md:text-4xl">How Lumeya works</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Whether you're a creator or a brand, getting started takes minutes.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-2xl border border-border bg-card p-8 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <step.icon size={24} className="text-primary" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured creators */}
      <section className="border-t border-border bg-muted/30 py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Featured creators</h2>
              <p className="mt-2 text-muted-foreground">Discover talented creators ready to collaborate.</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/creators">View all creators</Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCreators.map((creator, i) => (
              <motion.div
                key={creator.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <div className={`h-32 w-full rounded-xl ${creator.color}`} />
                <h3 className="mt-4 text-lg font-semibold group-hover:text-primary transition-colors">
                  {creator.name}
                </h3>
                <p className="text-sm text-muted-foreground">{creator.role}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {creator.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl rounded-3xl bg-primary/5 border border-primary/20 p-12"
          >
            <h2 className="text-3xl font-bold md:text-4xl">Ready to start?</h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of creators and brands already collaborating on Lumeya.
            </p>
            <Button size="lg" className="mt-8">
              Get Started Free <ArrowRight size={16} className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
