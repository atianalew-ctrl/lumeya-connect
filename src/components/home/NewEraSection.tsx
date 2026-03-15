import { motion } from "framer-motion";

const WORDS = ["authentic", "fast", "exclusive", "high-converting", "creator-led"];

const NewEraSection = () => (
  <section className="border-t border-border py-20 bg-background overflow-hidden">
    <div className="container max-w-4xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-6">
          A new era
        </p>

        <h2 className="text-4xl md:text-6xl font-display font-normal leading-[1.1] mb-6">
          Content isn't made
          <br />
          in boardrooms anymore.
          <br />
          <em className="text-primary/60">It's made by creators.</em>
        </h2>

        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
          The brands winning right now aren't the ones with the biggest ad budgets. They're the ones with the most trusted creators. Lumeya is where that relationship starts.
        </p>

        {/* Scrolling word ticker */}
        <div className="flex flex-wrap justify-center gap-3">
          {WORDS.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-full border border-border px-5 py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors cursor-default"
            >
              {word}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default NewEraSection;
