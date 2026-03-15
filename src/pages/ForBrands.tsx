import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, Zap, FileText, BarChart3, Users, Shield, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PAIN_POINTS = [
  { old: "Spending weeks searching for the right creator", new: "AI matches you in under 60 seconds" },
  { old: "Back-and-forth DMs and messy negotiations", new: "One platform. Everything in one place." },
  { old: "No contract, no protection, no recourse", new: "Auto-generated contracts. Escrow payments." },
  { old: "Content arrives late, off-brief, unusable", new: "Clear brief → polished UGC in 48 hours" },
  { old: "Zero visibility on what's actually performing", new: "Real analytics across every channel" },
];

const FEATURES = [
  { icon: Sparkles, title: "AI Matchmaker", desc: "Describe your campaign in plain English. Our AI scores every creator in our network and surfaces the top matches — with a compatibility percentage." },
  { icon: FileText, title: "AI Brief Generator", desc: "Answer 5 questions. Get a complete, professional creator brief in seconds. Ready to send, legally sound, and optimised to attract the right talent." },
  { icon: Shield, title: "Escrow Payments", desc: "You only pay when you approve the content. Lumeya holds payment in escrow — creators are protected, brands are protected. No risk." },
  { icon: Zap, title: "Content Activation", desc: "Turn raw UGC into ad-ready content instantly. Generate hooks, captions and platform-specific formats with one click." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "See reach, engagement and ROI across Instagram, TikTok and LinkedIn. Know exactly which creator and which content is driving results." },
  { icon: Clock, title: "48-Hour Turnaround", desc: "Our creators are briefed, responsive and professional. Average content delivery is 48 hours from brief approval." },
];

const CREATORS = [
  { name: "Ronja Aaslund", niche: "Fashion & Beauty", followers: "42.8K", engagement: "5.2%", avatar: "/lovable-uploads/488193ca-12b4-40ef-905e-1c618634eef9.jpg" },
  { name: "Sussie Agger", niche: "Lifestyle & TikTok", followers: "89.2K", engagement: "6.8%", avatar: "/lovable-uploads/ff812edb-72d9-419a-809e-81d311763fdb.jpg" },
  { name: "Amalie Asheim", niche: "Travel & Luxury", followers: "124K", engagement: "3.9%", avatar: "/lovable-uploads/b0a2c103-a2be-4f3e-8785-4b072d9f90cf.png" },
  { name: "Nella Ryglova", niche: "Food & Fashion", followers: "31.6K", engagement: "7.1%", avatar: "/lovable-uploads/59419297-8971-48c3-a2c5-2b636c4b1db6.png" },
];

const ForBrandsPage = () => (
  <div className="min-h-screen">

    {/* HERO */}
    <section className="relative bg-[#080808] text-white min-h-[90vh] flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=85" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      <div className="container relative z-10 py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[10px] tracking-[0.3em] uppercase text-white/50 mb-10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Now accepting brand partners
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-normal leading-[1.0] mb-8">
            Stop searching
            <br />
            for creators.
            <br />
            <em className="text-white/40">Let AI find them.</em>
          </h1>

          <p className="text-base text-white/50 leading-relaxed max-w-lg mb-12">
            Lumeya is the only platform that uses AI to match your brief with the exact right creator — then handles everything from contract to content delivery to analytics.
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <Link to="/post-opportunity" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-medium tracking-widest uppercase hover:bg-white/90 transition-all">
              Post Your First Campaign <ArrowRight size={13} />
            </Link>
            <Link to="/matchmaker" className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-8 py-4 text-xs font-medium tracking-widest uppercase hover:border-white/40 hover:text-white transition-all">
              Try the AI Matchmaker
            </Link>
          </div>

          <div className="flex flex-wrap gap-10 border-t border-white/10 pt-10">
            {[["2,400+", "Vetted Creators"], ["48 hrs", "Avg. Delivery"], ["94%", "Brand Satisfaction"], ["€0", "To Get Started"]].map(([val, lbl]) => (
              <div key={lbl}>
                <p className="text-3xl font-light">{val}</p>
                <p className="text-[10px] text-white/30 tracking-wider mt-1">{lbl}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* PAIN → SOLUTION */}
    <section className="py-28 border-t border-border">
      <div className="container max-w-4xl">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">Why Lumeya</p>
          <h2 className="text-4xl md:text-5xl font-display font-normal">
            Every brand's
            <em className="text-primary/70"> creator problem</em>
            <br />solved in one place.
          </h2>
        </motion.div>
        <div className="space-y-0 border border-border divide-y divide-border rounded-2xl overflow-hidden">
          {PAIN_POINTS.map(({ old, new: fix }, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="p-6 flex items-start gap-3 bg-card">
                <span className="text-red-400 mt-0.5 text-lg shrink-0">✗</span>
                <p className="text-sm text-muted-foreground">{old}</p>
              </div>
              <div className="p-6 flex items-start gap-3 bg-primary/[0.03]">
                <Check size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-sm font-medium">{fix}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* FEATURES */}
    <section className="py-28 bg-foreground text-background">
      <div className="container">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase text-background/30 mb-4">The Platform</p>
          <h2 className="text-4xl md:text-5xl font-display text-background font-normal">
            Everything you need.
            <br />
            <em className="text-background/40">Nothing you don't.</em>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-background/10">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-foreground p-8 hover:bg-background/5 transition-colors group">
              <div className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center mb-6 group-hover:bg-background/15 transition-colors">
                <Icon size={16} className="text-background/70" />
              </div>
              <h3 className="text-base font-medium text-background mb-3">{title}</h3>
              <p className="text-xs text-background/40 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CREATOR PREVIEW */}
    <section className="py-28 border-t border-border">
      <div className="container">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">The Talent</p>
            <h2 className="text-4xl font-display font-normal">
              Creators who
              <em className="text-primary/70"> actually convert.</em>
            </h2>
          </div>
          <Button variant="outline" className="rounded-full" asChild>
            <Link to="/creators">Browse all creators <ArrowRight size={13} className="ml-1" /></Link>
          </Button>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CREATORS.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card overflow-hidden group hover:border-primary/30 transition-all">
              <div className="aspect-[4/3] relative overflow-hidden bg-accent">
                <img src={c.avatar} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-sm font-medium">{c.name}</p>
                  <p className="text-white/60 text-[10px]">{c.niche}</p>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium">{c.followers}</p>
                  <p className="text-[10px] text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-500">{c.engagement}</p>
                  <p className="text-[10px] text-muted-foreground">Engagement</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* TESTIMONIALS */}
    <section className="py-28 bg-accent/30 border-t border-border">
      <div className="container max-w-4xl">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">Results</p>
          <h2 className="text-4xl font-display font-normal">What brands say.</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { quote: "We launched 12 UGC videos in one week. Our TikTok CPM dropped from €0.80 to €0.22. Lumeya paid for itself 10x over.", brand: "GlowCo", role: "Head of Performance Marketing", stars: 5 },
            { quote: "Finding creators used to take 3 weeks of DMs. Lumeya matched us in under an hour. The content was exactly what we needed.", brand: "NA-KD", role: "Brand Partnerships Director", stars: 5 },
            { quote: "The AI brief generator produced a better brief than our team would write. Creators came back with incredible content first try.", brand: "Arket", role: "Marketing Manager", stars: 5 },
          ].map(({ quote, brand, role, stars }) => (
            <motion.div key={brand} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="rounded-2xl bg-card border border-border p-6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: stars }).map((_, i) => <Star key={i} size={12} className="text-primary fill-primary" />)}
              </div>
              <p className="text-sm leading-relaxed text-foreground/80 mb-6">"{quote}"</p>
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">{brand[0]}</div>
                <div>
                  <p className="text-xs font-medium">{brand}</p>
                  <p className="text-[10px] text-muted-foreground">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* PRICING PREVIEW */}
    <section className="py-28 border-t border-border">
      <div className="container max-w-3xl text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-display font-normal mb-6">
            Start free.
            <em className="text-primary/70"> Scale when ready.</em>
          </h2>
          <p className="text-sm text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
            14-day free trial on all plans. No credit card needed. Cancel any time.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="rounded-2xl border border-border bg-card px-8 py-6 text-left min-w-[180px]">
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Starter</p>
              <p className="text-3xl font-light mb-1">€49<span className="text-sm text-muted-foreground">/mo</span></p>
              <p className="text-xs text-muted-foreground">3 campaigns · 50+ creators</p>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 px-8 py-6 text-left min-w-[180px] relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-primary text-white rounded-full px-3 py-0.5 font-medium">Most Popular</span>
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Growth</p>
              <p className="text-3xl font-light mb-1">€149<span className="text-sm text-muted-foreground">/mo</span></p>
              <p className="text-xs text-muted-foreground">Unlimited · Full OS</p>
            </div>
            <div className="rounded-2xl border border-foreground/20 bg-foreground text-background px-8 py-6 text-left min-w-[180px]">
              <p className="text-[10px] tracking-widest uppercase text-background/40 mb-2">Black ✦</p>
              <p className="text-3xl font-light mb-1">€399<span className="text-sm text-background/40">/mo</span></p>
              <p className="text-xs text-background/40">Elite · White-glove</p>
            </div>
          </div>
          <Button size="lg" className="rounded-full px-12 gap-2" asChild>
            <Link to="/pricing">See Full Pricing <ArrowRight size={14} /></Link>
          </Button>
        </motion.div>
      </div>
    </section>

    {/* FINAL CTA */}
    <section className="bg-foreground text-background py-28 text-center">
      <div className="container max-w-xl">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-background/30 mb-6">Ready?</p>
          <h2 className="text-5xl font-display mb-6">
            Your next campaign
            <br />
            <em className="text-background/40">starts today.</em>
          </h2>
          <p className="text-sm text-background/40 mb-10 leading-relaxed">
            Join hundreds of brands finding creators, launching campaigns and getting content that converts — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/post-opportunity" className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 text-xs font-medium tracking-widest uppercase hover:bg-background/90 transition-all">
              Start Free Trial <ArrowRight size={13} />
            </Link>
            <Link to="/matchmaker" className="inline-flex items-center gap-2 border border-background/20 text-background/60 px-8 py-4 text-xs font-medium tracking-widest uppercase hover:text-background hover:border-background/40 transition-all">
              Try Matchmaker First
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  </div>
);

export default ForBrandsPage;
