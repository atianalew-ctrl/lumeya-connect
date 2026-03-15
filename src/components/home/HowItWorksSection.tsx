import { motion } from "framer-motion";
import { Sparkles, Users, Package, BarChart3, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

// These are mock "app UI" screenshots showing what happens at each step
// Using real Lumeya page paths so they feel native
const steps = [
  {
    number: "01",
    icon: Sparkles,
    tag: "5 minutes",
    tagColor: "bg-violet-100 text-violet-600",
    title: "Post your campaign brief",
    desc: "Tell us your product, content style, and deadline. Our AI writes a complete creator brief for you — no agency needed.",
    bullets: ["AI writes the brief for you", "Set budget, deadline & content type", "Add reference videos or moodboard"],
    // Mock UI card — shows what the brief form looks like
    mockUI: (
      <div className="rounded-2xl bg-background border border-border p-5 text-left space-y-3 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles size={12} className="text-primary" />
          </div>
          <span className="text-xs font-medium text-foreground/70">AI Brief Generator</span>
        </div>
        <div className="space-y-2">
          <div className="rounded-lg bg-accent border border-border px-3 py-2">
            <p className="text-[9px] text-muted-foreground mb-0.5">Product</p>
            <p className="text-xs text-foreground/80">Glow Serum — 30ml</p>
          </div>
          <div className="rounded-lg bg-accent border border-border px-3 py-2">
            <p className="text-[9px] text-muted-foreground mb-0.5">Content Type</p>
            <p className="text-xs text-foreground/80">UGC Video · Unboxing + Review</p>
          </div>
          <div className="rounded-lg bg-accent border border-border px-3 py-2">
            <p className="text-[9px] text-muted-foreground mb-0.5">Budget per creator</p>
            <p className="text-xs text-foreground/80">€150 – €300</p>
          </div>
        </div>
        <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-2 flex items-center gap-2">
          <Sparkles size={11} className="text-primary" />
          <p className="text-[10px] text-primary font-medium">Brief generated in 12 seconds ✓</p>
        </div>
      </div>
    ),
  },
  {
    number: "02",
    icon: Users,
    tag: "Under 60 sec",
    tagColor: "bg-emerald-100 text-emerald-600",
    title: "AI finds your perfect creators",
    desc: "Our AI scores every creator against your brief and surfaces the top matches — with engagement rate, past brands and pricing visible upfront.",
    bullets: ["Compatibility score per creator", "Filter by niche, followers, location", "See past work before you commit"],
    mockUI: (
      <div className="rounded-2xl bg-background border border-border p-5 text-left space-y-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Top Matches</span>
          <span className="text-[10px] text-primary">3 of 24</span>
        </div>
        {[
          { name: "Ronja A.", niche: "Beauty · SE", match: "98%", followers: "42.8K", color: "text-emerald-500" },
          { name: "Sussie K.", niche: "Lifestyle · DK", match: "94%", followers: "89K", color: "text-emerald-500" },
          { name: "Amalie R.", niche: "Luxury · NO", match: "91%", followers: "124K", color: "text-amber-500" },
        ].map((c) => (
          <div key={c.name} className="flex items-center gap-3 rounded-lg bg-accent border border-border px-3 py-2.5">
            <div className="h-7 w-7 rounded-full bg-primary/10 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground/80 font-medium">{c.name}</p>
              <p className="text-[9px] text-muted-foreground">{c.niche} · {c.followers}</p>
            </div>
            <span className={`text-xs font-medium ${c.color}`}>{c.match}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: "03",
    icon: Package,
    tag: "48hr delivery",
    tagColor: "bg-blue-100 text-blue-600",
    title: "Content lands in your dashboard",
    desc: "Creators deliver polished UGC straight into your content board. Review it, request changes, download in any format. You only pay when you approve.",
    bullets: ["Review before paying", "Request revisions in one click", "Download in TikTok, Reels, Story format"],
    mockUI: (
      <div className="rounded-2xl bg-background border border-border p-5 text-left space-y-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Delivered UGC</span>
          <span className="text-[10px] text-muted-foreground">6 / 9</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[9/16] rounded-lg bg-accent border border-border overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-[8px]">▶</span>
                </div>
              </div>
              {i < 4 && (
                <div className="absolute top-1 right-1">
                  <Check size={9} className="text-emerald-500" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
          <p className="text-[10px] text-emerald-600">4 approved · 2 awaiting review</p>
        </div>
      </div>
    ),
  },
  {
    number: "04",
    icon: BarChart3,
    tag: "Live data",
    tagColor: "bg-orange-100 text-orange-600",
    title: "See what's actually working",
    desc: "Real-time analytics across every piece of content. Know exactly which creator, which format and which platform is driving your ROI.",
    bullets: ["Reach, saves & conversions per creator", "Platform breakdown: TikTok, Reels, Story", "ROI per campaign at a glance"],
    mockUI: (
      <div className="rounded-2xl bg-background border border-border p-5 text-left space-y-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Campaign ROI</span>
          <span className="text-[10px] text-emerald-500 font-medium">↑ 312%</span>
        </div>
        {[
          { label: "Total Reach", val: "428K", bar: 80 },
          { label: "Engagement Rate", val: "5.8%", bar: 58 },
          { label: "Conversions", val: "1,240", bar: 45 },
          { label: "Cost per View", val: "€0.03", bar: 30 },
        ].map(({ label, val, bar }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-muted-foreground">{label}</span>
              <span className="text-[10px] text-foreground/70 font-medium">{val}</span>
            </div>
            <div className="h-1 rounded-full bg-accent overflow-hidden">
              <div className="h-full rounded-full bg-primary/70" style={{ width: `${bar}%` }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

const HowItWorksSection = () => (
  <section className="py-28 border-t border-border bg-background">
    <div className="container">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-5">For Brands</p>
        <h2 className="text-4xl md:text-5xl font-display font-normal leading-tight">
          Brief to content.
          <br />
          <em className="text-primary/60">Four steps. Zero stress.</em>
        </h2>
        <p className="mt-5 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          No agencies. No DMs. No guesswork. Everything from brief to analytics lives in one place.
        </p>
      </motion.div>

      <div className="space-y-5">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="grid md:grid-cols-2 rounded-2xl border border-border bg-card overflow-hidden"
            >
              {/* Left: content */}
              <div className="p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-5xl font-display font-light text-foreground/10">{step.number}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${step.tagColor}`}>{step.tag}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon size={14} className="text-primary" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-display font-normal mb-4">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{step.desc}</p>
                <ul className="space-y-2 mb-8">
                  {step.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check size={12} className="text-primary shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: mock UI */}
              <div className="bg-accent/40 border-t md:border-t-0 md:border-l border-border p-8 md:p-10 flex items-center justify-center order-1 md:order-2">
                <div className="w-full max-w-[280px]">
                  {step.mockUI}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
      >
        <div>
          <p className="text-primary/50 text-[10px] uppercase tracking-widest mb-2">Guarantee</p>
          <h3 className="text-xl font-display font-normal">Payment only releases when you approve.</h3>
          <p className="text-sm text-muted-foreground mt-1">You're always in control. Zero risk.</p>
        </div>
        <Link to="/post-opportunity"
          className="inline-flex items-center gap-2 shrink-0 bg-primary text-primary-foreground px-8 py-4 text-xs font-medium tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all">
          Start Free <ArrowRight size={13} />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default HowItWorksSection;
