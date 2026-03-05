import { motion } from "framer-motion";
import { ArrowRight, Users, Briefcase, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

const steps = [
  { icon: Users, title: "Create your profile", desc: "Showcase your skills, portfolio, and rates to attract the right brands." },
  { icon: Briefcase, title: "Browse opportunities", desc: "Find collaborations that match your niche — UGC, photography, social media, and more." },
  { icon: MessageCircle, title: "Connect & collaborate", desc: "Message brands directly, negotiate terms, and start creating together." },
];

const featuredCreators = [
  { name: "Mia Chen", role: "UGC Creator", tags: ["Lifestyle", "Fashion"] },
  { name: "Jordan Blake", role: "Photographer", tags: ["Product", "Food"] },
  { name: "Aisha Koroma", role: "Social Media", tags: ["TikTok", "Reels"] },
  { name: "Leo Martinez", role: "Videographer", tags: ["Brand Films", "Ads"] },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-32 md:py-44">
        <div className="container flex flex-col items-center text-center">
          <motion.img
            src={logo}
            alt="Lumeya logo"
            className="h-20 w-20 rounded-full object-cover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="mt-8 max-w-2xl text-4xl font-normal leading-tight md:text-6xl"
          >
            Connect with creators{" "}
            <span className="italic">and opportunities</span>.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-6 max-w-md text-lg text-muted-foreground leading-relaxed"
          >
            Lumeya bridges the gap between talented creators and brands looking for collaborations.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-10 flex flex-wrap justify-center gap-4"
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
            <p className="text-sm uppercase tracking-widest text-muted-foreground">How it works</p>
            <h2 className="mt-3 text-3xl md:text-4xl">Simple by design</h2>
          </motion.div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <step.icon size={20} className="text-accent-foreground" />
                </div>
                <h3 className="mt-5 text-lg font-body font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured creators */}
      <section className="border-t border-border py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground">Featured</p>
              <h2 className="mt-2 text-3xl md:text-4xl">Creators to watch</h2>
            </div>
            <Button variant="outline" asChild>
              <Link to="/creators">View all</Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCreators.map((creator, i) => (
              <motion.div
                key={creator.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30"
              >
                <div className="h-10 w-10 rounded-full bg-accent" />
                <h3 className="mt-4 font-body text-base font-semibold group-hover:text-primary transition-colors">
                  {creator.name}
                </h3>
                <p className="text-sm text-muted-foreground">{creator.role}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {creator.tags.map((tag) => (
                    <span key={tag} className="text-xs text-muted-foreground">
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-lg"
          >
            <h2 className="text-3xl md:text-4xl">Ready to start?</h2>
            <p className="mt-4 text-muted-foreground">
              Join creators and brands already collaborating on Lumeya.
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
