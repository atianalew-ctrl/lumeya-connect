import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

const HeroSection = () => (
  <section className="relative py-32 md:py-44 overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center opacity-30"
      style={{ backgroundImage: `url(${heroBg})` }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
    <div className="container relative z-10 flex flex-col items-center text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        The creator community & collaboration network
      </motion.div>

      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        className="mt-8 max-w-3xl text-4xl font-normal leading-tight md:text-6xl"
      >
        Where creators and brands{" "}
        <span className="italic">build together.</span>
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={2}
        className="mt-6 max-w-lg text-lg text-muted-foreground leading-relaxed"
      >
        Join a growing community of creators and brands collaborating on content, campaigns, and creative projects — together.
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
            Join the Community <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/opportunities">
            Post an Opportunity <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={4}
        className="mt-12 flex items-center gap-6 text-sm text-muted-foreground"
      >
        <span className="flex items-center gap-1.5">
          <span className="font-semibold text-foreground">500+</span> Creators
        </span>
        <span className="h-4 w-px bg-border" />
        <span className="flex items-center gap-1.5">
          <span className="font-semibold text-foreground">120+</span> Brands
        </span>
        <span className="h-4 w-px bg-border" />
        <span className="flex items-center gap-1.5">
          <span className="font-semibold text-foreground">1,200+</span> Collaborations
        </span>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
