import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Package, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: Sparkles,
    title: "Post your campaign",
    desc: "Tell us what you need. Product name, content style, deadline. Our AI Brief Generator writes your brief for you in 60 seconds.",
    cta: "Try Brief Generator",
    href: "/brief",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=85",
    tag: "Takes 5 minutes",
  },
  {
    number: "02",
    icon: Users,
    title: "AI matches you with creators",
    desc: "Our AI scores every creator in our network against your brief. You get a shortlist of the top matches — with engagement rates, past work and pricing.",
    cta: "See how matching works",
    href: "/matchmaker",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=85",
    tag: "Under 60 seconds",
  },
  {
    number: "03",
    icon: Package,
    title: "Get polished content delivered",
    desc: "Creators deliver UGC straight into your dashboard. Review it, request changes, download in any format. Payment only releases when you approve.",
    cta: "See the content board",
    href: "/feed",
    image: "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=800&q=85",
    tag: "48hr average delivery",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Track what performs",
    desc: "See reach, saves, clicks and ROI across every piece of content. Know exactly which creator and which format is driving your results.",
    cta: "View Analytics",
    href: "/analytics",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=85",
    tag: "Real-time dashboard",
  },
];

const HowItWorksSection = () => (
  <section className="py-28 border-t border-border">
    <div className="container">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4">For Brands</p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="text-4xl md:text-5xl font-display font-normal leading-tight">
            From brief to
            <br />
            <em className="text-primary/70">content in 4 steps.</em>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            No agencies. No back-and-forth. No wasted budget. Just great UGC, delivered fast.
          </p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isEven = i % 2 === 1;
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`grid md:grid-cols-2 gap-0 rounded-2xl border border-border bg-card overflow-hidden ${isEven ? "md:[direction:rtl]" : ""}`}
            >
              {/* Image side */}
              <div className={`relative overflow-hidden aspect-[4/3] md:aspect-auto ${isEven ? "md:[direction:ltr]" : ""}`}>
                <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 text-[10px] text-white tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {step.tag}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="text-white/20 font-display text-7xl font-normal leading-none">{step.number}</span>
                </div>
              </div>

              {/* Content side */}
              <div className={`p-8 md:p-12 flex flex-col justify-center ${isEven ? "md:[direction:ltr]" : ""}`}>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Icon size={16} className="text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-normal mb-4">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">{step.desc}</p>
                <Link to={step.href} className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:gap-3 transition-all group">
                  {step.cta} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom guarantee */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 rounded-2xl bg-foreground text-background p-10 text-center"
      >
        <p className="text-3xl mb-3">✦</p>
        <h3 className="text-xl font-display mb-3">Not happy? We'll make it right.</h3>
        <p className="text-sm text-background/50 max-w-sm mx-auto leading-relaxed">
          Payment only releases when you approve the content. You always stay in control.
        </p>
      </motion.div>
    </div>
  </section>
);

export default HowItWorksSection;
