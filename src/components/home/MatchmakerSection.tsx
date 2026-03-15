import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import AIMatchmaker from "@/components/matchmaker/AIMatchmaker";

const MatchmakerSection = () => (
  <section className="border-t border-border py-20 bg-primary/[0.03]">
    <div className="container max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-5">
          <Sparkles size={12} />
          AI Matchmaker — New
        </div>
        <h2 className="text-3xl md:text-4xl font-normal">
          Find the right creator<br />
          <span className="italic text-primary/80">in seconds.</span>
        </h2>
        <p className="mt-4 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Just describe what you need. Our AI reads your brief and instantly finds your perfect match.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <AIMatchmaker compact />
      </motion.div>
    </div>
  </section>
);

export default MatchmakerSection;
