import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => (
  <section className="py-32 bg-linen relative overflow-hidden">
    {/* Decorative elements */}
    <div className="absolute inset-0">
      <div className="absolute top-12 left-[10%] w-[200px] h-[200px] rounded-full bg-terracotta/[0.05] blur-[60px]" />
      <div className="absolute bottom-12 right-[10%] w-[250px] h-[250px] rounded-full bg-primary/[0.04] blur-[60px]" />
    </div>
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-16 right-[20%] h-10 w-10 rounded-xl border border-terracotta/15 bg-terracotta/[0.03] hidden md:block"
    />
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      className="absolute bottom-20 left-[18%] h-6 w-6 rounded-full border border-primary/15 bg-primary/[0.04] hidden md:block"
    />

    <div className="container text-center relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-lg"
      >
        <h2 className="text-3xl md:text-[2.75rem] leading-tight">
          Be part of something{" "}
          <span className="relative inline-block">
            <span className="italic text-terracotta">meaningful</span>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-1 left-0 right-0 h-[2px] bg-terracotta/30 origin-left rounded-full"
            />
          </span>
        </h2>
        <p className="mt-6 text-base text-muted-foreground leading-relaxed">
          Join a global community where brands discover new talent and creators find real opportunities to grow.
        </p>
        <Button size="lg" className="mt-10 rounded-full px-8 bg-terracotta hover:bg-terracotta/90 text-primary-foreground shadow-lg shadow-terracotta/20" asChild>
          <Link to="/creators">
            Join the Community <ArrowRight size={15} className="ml-2" />
          </Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
