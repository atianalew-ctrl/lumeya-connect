import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="border-t border-border py-24">
    <div className="container text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto max-w-lg"
      >
        <h2 className="text-3xl md:text-4xl">Ready to start collaborating?</h2>
        <p className="mt-4 text-muted-foreground">
          Join creators and brands already connecting on Lumeya.
        </p>
        <Button size="lg" className="mt-8">
          Get Started Free <ArrowRight size={16} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
