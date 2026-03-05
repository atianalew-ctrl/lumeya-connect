import { motion } from "framer-motion";
import { Users, Briefcase, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: Users,
    step: "01",
    title: "Create your profile",
    desc: "Showcase your skills, portfolio, and experience so brands can discover you.",
  },
  {
    icon: Briefcase,
    step: "02",
    title: "Browse opportunities",
    desc: "Find collaborations that match your niche — UGC, photography, social media, and more.",
  },
  {
    icon: MessageCircle,
    step: "03",
    title: "Connect and collaborate",
    desc: "Message brands directly, agree on terms, and start creating.",
  },
];

const HowItWorksSection = () => (
  <section className="border-t border-border py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Simple process</p>
        <h2 className="mt-3 text-3xl md:text-4xl">How Lumeya Works</h2>
      </motion.div>

      <div className="mt-16 grid gap-12 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
              <step.icon size={22} className="text-accent-foreground" />
            </div>
            <span className="mt-5 inline-block text-xs font-medium uppercase tracking-widest text-primary">
              Step {step.step}
            </span>
            <h3 className="mt-2 text-lg font-body font-semibold">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
