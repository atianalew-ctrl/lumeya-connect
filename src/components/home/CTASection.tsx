import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => (
  <section className="py-32 bg-linen">
    <div className="container text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto max-w-md"
      >
        <h2 className="text-3xl md:text-4xl leading-tight">Be part of something meaningful</h2>
        <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
          Join a global community where brands discover new talent and creators find real opportunities to grow.
        </p>
        <Button size="lg" className="mt-10 rounded-full px-8" asChild>
          <Link to="/creators">
            Join the Community <ArrowRight size={15} className="ml-2" />
          </Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
