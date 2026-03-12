import { motion } from "framer-motion";
import howStep1 from "@/assets/how-step-1.png";
import howStep2 from "@/assets/how-step-2.png";
import howStep3 from "@/assets/how-step-3.png";

const steps = [
  {
    image: howStep1,
    step: 1,
    title: "Launch Your Campaign",
    desc: "Add your product info, set your content brief, and define what you're looking for. It takes less than 5 minutes.",
  },
  {
    image: howStep2,
    step: 2,
    title: "Creators Apply to You",
    desc: "Browse through creator profiles who match your niche. Only aligned creators will appear — making selection easy.",
  },
  {
    image: howStep3,
    step: 3,
    title: "Get Your Content Delivered",
    desc: "Creators deliver polished UGC within days. Review, request revisions, and download — all in one place.",
  },
];

const HowItWorksSection = () => (
  <section className="py-28 bg-muted/30">
    <div className="container">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-[11px] uppercase tracking-scandi text-muted-foreground">
          For brands
        </p>
        <h2 className="mt-4 text-3xl md:text-4xl">
          How it works
        </h2>
        <p className="mt-4 mx-auto max-w-md text-sm text-muted-foreground leading-relaxed">
          Get professional UGC content for your brand in three simple steps.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-10 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="text-center"
          >
            {/* Image card */}
            <div className="mx-auto max-w-[280px] rounded-2xl border border-border/40 bg-card p-3 shadow-sm">
              <img
                src={step.image}
                alt={step.title}
                className="w-full rounded-xl object-cover"
                loading="lazy"
              />
            </div>

            {/* Step number */}
            <div className="mx-auto mt-8 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {step.step}
            </div>

            <h3 className="mt-5 text-lg font-medium">{step.title}</h3>
            <p className="mt-3 mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Guarantee banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mt-16 max-w-lg rounded-2xl bg-primary px-8 py-6 text-center text-primary-foreground"
      >
        <p className="text-base font-medium">⭐ Satisfaction Guarantee</p>
        <p className="mt-2 text-sm opacity-90 leading-relaxed">
          If you're not happy with the creators who apply, we'll work with you until you find the right match.
        </p>
      </motion.div>
    </div>
  </section>
);

export default HowItWorksSection;
