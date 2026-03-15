import { motion } from "framer-motion";
import { ArrowRight, Zap, Clock, TrendingUp, Play, Check } from "lucide-react";
import { Link } from "react-router-dom";

const TICKER_ITEMS = [
  "Stop paying agency fees ✦",
  "Get your ad in 48 hours ✦",
  "No briefs. No meetings. ✦",
  "Just scroll-stopping content ✦",
  "Made by creators who get it ✦",
  "Stop paying agency fees ✦",
  "Get your ad in 48 hours ✦",
  "No briefs. No meetings. ✦",
  "Just scroll-stopping content ✦",
  "Made by creators who get it ✦",
];

const STEPS = [
  { time: "30 sec", label: "Describe your product", sub: "Type what you sell. Our AI does the rest." },
  { time: "60 sec", label: "Pick your creator", sub: "See their stats, past work, rates. Tap once to hire." },
  { time: "48 hrs", label: "Get your ad", sub: "Polished UGC delivered straight to your dashboard." },
];

const FORMATS = [
  { label: "TikTok Ad", tag: "9:16", color: "bg-black text-white" },
  { label: "Instagram Reel", tag: "9:16", color: "bg-gradient-to-br from-purple-500 to-pink-500 text-white" },
  { label: "Story Ad", tag: "9:16", color: "bg-gradient-to-br from-orange-400 to-pink-400 text-white" },
  { label: "YouTube Short", tag: "9:16", color: "bg-red-600 text-white" },
  { label: "UGC Raw", tag: "Any", color: "bg-foreground text-background" },
];

const MakeAds = () => (
  <div className="min-h-screen overflow-hidden">

    {/* HERO */}
    <section className="relative bg-background pt-16 pb-0 overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-violet-400/10 blur-3xl" />

      <div className="container relative z-10 text-center pb-16">
        {/* Pill badge */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] tracking-[0.3em] uppercase text-primary mb-8">
          <Zap size={10} className="fill-primary" /> New way to make ads
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-display font-bold leading-[1.0] tracking-tight mb-6">
          Make ads<br />
          <span className="text-primary">in minutes.</span><br />
          <span className="text-foreground/20 font-normal text-4xl md:text-6xl">not months.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
          Lumeya connects you to vetted UGC creators instantly. Post your product, pick your creator, get your ad. No agency. No waiting. No BS.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3 justify-center mb-16">
          <Link to="/post-opportunity"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-sm font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25">
            Make my ad now <ArrowRight size={15} />
          </Link>
          <Link to="/creators"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-8 py-4 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all">
            <Play size={13} /> See creator examples
          </Link>
        </motion.div>

        {/* Social proof row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 text-center">
          {[["2,400+", "Vetted creators"], ["48hrs", "Avg delivery"], ["10x", "Cheaper than agencies"], ["€0", "To get started"]].map(([val, lbl]) => (
            <div key={lbl}>
              <p className="text-2xl font-bold">{val}</p>
              <p className="text-[10px] text-muted-foreground tracking-wider mt-0.5">{lbl}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* TICKER */}
    <div className="border-y border-border bg-primary/5 py-3 overflow-hidden">
      <motion.div className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}>
        {TICKER_ITEMS.map((item, i) => (
          <span key={i} className="text-xs font-medium text-primary/70 shrink-0">{item}</span>
        ))}
      </motion.div>
    </div>

    {/* HOW IT WORKS - 3 steps, super fast */}
    <section className="py-24 container">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-display font-bold">
          3 steps.<br />
          <span className="text-muted-foreground font-normal text-3xl">That's actually it.</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {STEPS.map(({ time, label, sub }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="relative rounded-3xl border border-border bg-card p-8 hover:border-primary/30 transition-all group">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-6">
              <Clock size={10} /> {time}
            </div>
            <p className="text-[4rem] font-bold text-foreground/5 absolute top-4 right-6 font-display">{i + 1}</p>
            <h3 className="text-xl font-semibold mb-2">{label}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{sub}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* AD FORMATS */}
    <section className="py-16 border-t border-border">
      <div className="container">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Every format. One platform.</h2>
          <p className="text-sm text-muted-foreground">Get content ready to upload straight to your ad manager.</p>
        </motion.div>
        <div className="flex flex-wrap gap-3 justify-center">
          {FORMATS.map(({ label, tag, color }) => (
            <motion.div key={label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className={`rounded-2xl px-6 py-4 flex items-center gap-3 ${color}`}>
              <span className="font-semibold text-sm">{label}</span>
              <span className="text-[10px] opacity-60 border border-current/30 rounded px-1.5 py-0.5">{tag}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* COMPARISON */}
    <section className="py-24 container max-w-3xl">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold">Why not just hire an agency?</h2>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-6">Old way 🥱</p>
          <ul className="space-y-3">
            {["4–6 week turnaround", "€5,000+ per campaign", "3 revision rounds minimum", "You still don't own the content", "No data on what actually works"].map(s => (
              <li key={s} className="flex items-start gap-2 text-sm text-red-700">
                <span className="text-red-400 mt-0.5">✗</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-6">Lumeya ⚡</p>
          <ul className="space-y-3">
            {["48 hour delivery", "From €49/month", "Revisions built in", "You own all content forever", "Analytics on every piece"].map(s => (
              <li key={s} className="flex items-start gap-2 text-sm text-foreground/80">
                <Check size={14} className="text-primary mt-0.5 shrink-0" /> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 bg-foreground text-background text-center">
      <div className="container max-w-xl">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-background/30 mb-4">Ready?</p>
          <h2 className="text-5xl font-display font-bold mb-4">Your ad.<br />48 hours.</h2>
          <p className="text-sm text-background/40 mb-10">Start free. No credit card. Cancel anytime.</p>
          <Link to="/post-opportunity"
            className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-10 py-4 text-sm font-semibold hover:bg-background/90 transition-all">
            Make my first ad <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  </div>
);

export default MakeAds;
