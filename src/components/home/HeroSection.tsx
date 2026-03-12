import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const }
  })
};

const HeroSection = () =>
<section className="relative py-36 md:py-52 overflow-hidden">
    {/* Soft abstract gradient — no image needed for Scandi feel */}
    <div className="absolute inset-0 bg-gradient-to-b from-sand via-background to-background" />
    <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-3xl -translate-y-1/2 translate-x-1/4" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-3xl translate-y-1/3 -translate-x-1/4" />

    <div className="container relative z-10 flex flex-col items-center text-center">
      <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={0}
      className="inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-5 py-2 text-xs tracking-scandi uppercase text-muted-foreground">
      
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        Creator community & collaboration
      </motion.div>

      <motion.h1
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={1}
      className="mt-10 max-w-2xl text-4xl font-normal leading-[1.15] md:text-[3.5rem] text-balance">
      
        Where creators and brands{" "}
        <span className="italic text-primary/80">build together.</span>
      </motion.h1>

      <motion.p
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={2}
      className="mt-7 max-w-md text-base text-muted-foreground leading-relaxed">
      
        An exclusive matchmaking community so you never waste time on bad UGC again.                  
      </motion.p>

      <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={3}
      className="mt-12 flex flex-wrap justify-center gap-3">
      
        <Button size="lg" className="rounded-full px-7" asChild>
          <Link to="/creators">
            Find Creators <ArrowRight size={15} className="ml-2" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="rounded-full px-7" asChild>
          <Link to="/opportunities">
            Post an Opportunity
          </Link>
        </Button>
      </motion.div>

      <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={4}
      className="mt-16 flex items-center gap-8 text-sm text-muted-foreground">
      
        <span className="flex items-center gap-1.5">
          <span className="font-medium text-foreground">500+</span> Creators
        </span>
        <span className="h-3 w-px bg-border" />
        <span className="flex items-center gap-1.5">
          <span className="font-medium text-foreground">120+</span> Brands
        </span>
        <span className="h-3 w-px bg-border" />
        <span className="flex items-center gap-1.5">
          <span className="font-medium text-foreground">1,200+</span> Collaborations
        </span>
      </motion.div>
    </div>
  </section>;


export default HeroSection;