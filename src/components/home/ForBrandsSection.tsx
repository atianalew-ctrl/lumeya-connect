import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FileText, Zap, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const STEPS = [
  {
    number: "01",
    icon: FileText,
    title: "Post your campaign",
    desc: "Tell us what content you need, what type of creator, and your budget. Takes 3 minutes.",
    cta: "Post a Campaign",
    to: "/post-opportunity",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI finds your perfect match",
    desc: "Our AI Matchmaker scores every creator against your brief and surfaces the top 3–5 matches instantly.",
    cta: "Try the Matchmaker",
    to: "/matchmaker",
  },
  {
    number: "03",
    icon: Zap,
    title: "Get content that converts",
    desc: "Creators deliver polished UGC. You approve, request revisions, or activate it directly into ads.",
    cta: "See Content Activation",
    to: "/activate",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Track everything",
    desc: "See reach, engagement and ROI across all platforms in one clean analytics dashboard.",
    cta: "View Analytics",
    to: "/analytics",
  },
];

const ForBrandsSection = () => (
  <section className="py-28 bg-background border-t border-border">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-xl mb-20"
      >
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">For Brands</p>
        <h2 className="text-4xl md:text-5xl font-display font-normal leading-tight">
          From brief to
          <br />
          <em className="text-primary/70">viral content</em> in 48hrs.
        </h2>
        <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-sm">
          No agencies. No spreadsheets. Just an AI-powered workflow that finds the right creators and delivers content that sells.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background p-8 group hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="text-5xl font-light text-border">{step.number}</span>
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon size={15} className="text-primary" />
                </div>
              </div>
              <h3 className="text-base font-medium mb-3">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">{step.desc}</p>
              <Link
                to={step.to}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary hover:gap-2.5 transition-all"
              >
                {step.cta} <ArrowRight size={11} />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Brand proof */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 grid md:grid-cols-3 gap-6"
      >
        {[
          {
            quote: "We launched 12 pieces of UGC in one week. Our TikTok ads dropped from €0.80 to €0.22 CPM.",
            brand: "GlowCo",
            role: "Head of Performance Marketing",
          },
          {
            quote: "Finding creators used to take our team 3 weeks of DMs. Lumeya did it in a day. The match was perfect.",
            brand: "NA-KD",
            role: "Brand Partnerships Director",
          },
          {
            quote: "The AI brief generator alone saved us hours. The content brief it produced was better than what we'd write ourselves.",
            brand: "Arket",
            role: "Marketing Manager",
          },
        ].map(({ quote, brand, role }) => (
          <div key={brand} className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm leading-relaxed text-foreground/80 mb-5">"{quote}"</p>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">{brand[0]}</div>
              <div>
                <p className="text-xs font-medium">{brand}</p>
                <p className="text-[10px] text-muted-foreground">{role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ForBrandsSection;
