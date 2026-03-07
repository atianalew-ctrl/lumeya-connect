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
        <h2 className="text-3xl md:text-4xl">Be part of the community</h2>
        <p className="mt-4 text-muted-foreground">
          Join Lumeya and become part of a global creator community where brands discover new talent and creators find real opportunities.
        </p>
        <Button size="lg" className="mt-8">
          Join the Community <ArrowRight size={16} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
