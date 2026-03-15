import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import AIMatchmaker from "@/components/matchmaker/AIMatchmaker";

const Matchmaker = () => (
  <div className="container py-16 max-w-2xl">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-10"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-6">
        <Sparkles size={12} />
        AI Powered
      </div>
      <h1 className="text-4xl md:text-5xl font-normal leading-tight">
        Find your perfect<br />
        <span className="italic text-primary/80">creator match.</span>
      </h1>
      <p className="mt-5 text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
        Describe what you need in plain English. Our AI instantly finds the best creators for your brand — no filters, no scrolling, no guesswork.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <AIMatchmaker />
    </motion.div>

    {/* How it works */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-16 grid grid-cols-3 gap-6 text-center"
    >
      {[
        { step: "01", title: "Describe", desc: "Tell us about your brand and campaign in plain English" },
        { step: "02", title: "Match", desc: "AI scores every creator and ranks the best fits for you" },
        { step: "03", title: "Connect", desc: "View profiles and start a collaboration instantly" },
      ].map(({ step, title, desc }) => (
        <div key={step} className="space-y-2">
          <p className="text-xs text-primary font-medium tracking-widest uppercase">{step}</p>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      ))}
    </motion.div>
  </div>
);

export default Matchmaker;
