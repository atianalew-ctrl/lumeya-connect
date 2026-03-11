import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.2 + i * 0.15, duration: 0.7, ease: "easeOut" as const },
  }),
};

const HeroSection = () => (
  <section className="relative py-32 md:py-44 overflow-hidden">
    {/* Background layers */}
    <div className="absolute inset-0 bg-gradient-to-b from-sand via-background to-background" />

    {/* Organic blob shapes for personality */}
    <div className="absolute top-12 right-[10%] w-[320px] h-[320px] rounded-full bg-terracotta/[0.06] blur-[80px]" />
    <div className="absolute top-[60%] left-[5%] w-[250px] h-[250px] rounded-full bg-primary/[0.05] blur-[60px]" />
    <div className="absolute bottom-0 right-[30%] w-[400px] h-[200px] rounded-full bg-clay/[0.08] blur-[80px]" />

    {/* Floating decorative elements */}
    <motion.div
      animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-24 right-[15%] h-16 w-16 rounded-2xl border border-terracotta/20 bg-terracotta/[0.04] backdrop-blur-sm hidden md:block"
    />
    <motion.div
      animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-32 left-[12%] h-12 w-12 rounded-full border border-primary/15 bg-primary/[0.04] backdrop-blur-sm hidden md:block"
    />
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      className="absolute top-[45%] left-[8%] h-3 w-3 rounded-full bg-terracotta/30 hidden md:block"
    />
    <motion.div
      animate={{ y: [0, 6, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute top-[30%] right-[8%] h-2 w-2 rounded-full bg-primary/40 hidden md:block"
    />

    <div className="container relative z-10 flex flex-col items-center text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="inline-flex items-center gap-2.5 rounded-full border border-terracotta/20 bg-terracotta-light/60 backdrop-blur-sm px-5 py-2 text-xs tracking-scandi uppercase text-terracotta"
      >
        <Sparkles size={12} />
        Creator community & collaboration
      </motion.div>

      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        className="mt-10 max-w-3xl text-[2.75rem] font-normal leading-[1.1] md:text-[4.25rem] text-balance"
      >
        Where creators{" "}
        <span className="relative inline-block">
          <span className="italic text-terracotta">& brands</span>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-1 left-0 right-0 h-[3px] bg-terracotta/30 origin-left rounded-full"
          />
        </span>
        <br className="hidden md:block" />
        build together.
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={2}
        className="mt-8 max-w-lg text-base md:text-lg text-muted-foreground leading-relaxed"
      >
        A curated community for creators and brands to discover, connect, and collaborate on meaningful projects.
      </motion.p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={3}
        className="mt-12 flex flex-wrap justify-center gap-3"
      >
        <Button size="lg" className="rounded-full px-8 bg-terracotta hover:bg-terracotta/90 text-primary-foreground shadow-lg shadow-terracotta/20" asChild>
          <Link to="/creators">
            Find Creators <ArrowRight size={15} className="ml-2" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="rounded-full px-8 border-foreground/15 hover:bg-foreground/[0.03]" asChild>
          <Link to="/opportunities">
            Post an Opportunity
          </Link>
        </Button>
      </motion.div>

      {/* Stats with visual flair */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={4}
        className="mt-20 flex items-center gap-10 text-sm"
      >
        {[
          { value: "500+", label: "Creators" },
          { value: "120+", label: "Brands" },
          { value: "1,200+", label: "Collaborations" },
        ].map((stat, i) => (
          <div key={stat.label} className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-display text-foreground">{stat.value}</span>
            <span className="mt-1 text-xs tracking-scandi uppercase text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
