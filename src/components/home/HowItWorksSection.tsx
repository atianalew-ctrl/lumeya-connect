import { motion } from "framer-motion";
import { Users, Briefcase, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: Users,
    step: "01",
    title: "Join the community",
    desc: "Create your profile, showcase your portfolio, and become part of the Lumeya creator network.",
  },
  {
    icon: Briefcase,
    step: "02",
    title: "Discover collaborations",
    desc: "Browse campaigns and opportunities that match your creative niche and skills.",
  },
  {
    icon: MessageCircle,
    step: "03",
    title: "Collaborate and create",
    desc: "Connect with brands, work together on projects, and grow as part of the community.",
  },
];

const HowItWorksSection = () => (
  <section className="py-28 relative overflow-hidden">
    {/* Background accents */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sand/80 blur-[120px]" />

    <div className="container relative">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        <p className="text-[11px] uppercase tracking-scandi text-terracotta font-medium">Simple process</p>
        <h2 className="mt-4 text-3xl md:text-[2.75rem]">How Lumeya works</h2>
      </motion.div>

      <div className="mt-20 grid gap-8 md:grid-cols-3 md:gap-0 relative">
        {/* Connecting line (desktop) */}
        <div className="hidden md:block absolute top-[3.25rem] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-terracotta/20 to-transparent" />

        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="text-center relative"
          >
            {/* Step number circle */}
            <div className="mx-auto relative">
              <div className="mx-auto flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full bg-card border-2 border-terracotta/15 relative z-10">
                <span className="text-lg font-display text-terracotta">{step.step}</span>
              </div>
              <div className="absolute inset-0 mx-auto h-[4.25rem] w-[4.25rem] rounded-full bg-terracotta/[0.06] blur-xl" />
            </div>

            <div className="mx-auto mt-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.06]">
              <step.icon size={18} className="text-primary" />
            </div>
            <h3 className="mt-4 text-base font-body font-medium">{step.title}</h3>
            <p className="mt-3 mx-auto max-w-[260px] text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
