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
  <section className="py-28">
    <div className="container">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-[11px] uppercase tracking-scandi text-muted-foreground">Simple process</p>
        <h2 className="mt-4 text-3xl md:text-4xl">How Lumeya works</h2>
      </motion.div>

      <div className="mt-18 grid gap-16 md:grid-cols-3 mt-16">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/[0.06]">
              <step.icon size={20} className="text-primary" />
            </div>
            <span className="mt-6 inline-block text-[10px] font-medium uppercase tracking-scandi text-primary">
              Step {step.step}
            </span>
            <h3 className="mt-2 text-base font-body font-medium">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
