import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&q=90",
  "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=1600&q=90",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1600&q=90",
];

const STATS = [
  { value: "2,400+", label: "Vetted Creators" },
  { value: "94%", label: "Brand Satisfaction" },
  { value: "48hrs", label: "Avg. Content Turnaround" },
  { value: "€0", label: "To Get Started" },
];

const HeroSection = () => {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <section className="relative min-h-[92vh] flex flex-col overflow-hidden bg-[#0c0c0b]">
      {/* Background image — full bleed */}
      <div className="absolute inset-0">
        {HERO_IMAGES.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            animate={{ opacity: activeImg === i ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </motion.div>
        ))}
        {/* Gradient overlay — dark at bottom and left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full flex-1 container pb-16 pt-32 md:pt-40">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2.5 mb-8"
          >
            <span className="h-px w-8 bg-white/40" />
            <span className="text-[11px] tracking-[0.35em] uppercase text-white/60">
              Creator Marketplace
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-display font-normal leading-[1.05] text-white mb-6"
          >
            Where brands
            <br />
            <em className="text-white/60">meet creators</em>
            <br />
            who convert.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-sm text-white/50 leading-relaxed max-w-sm mb-10"
          >
            Find, brief, and collaborate with world-class UGC creators in one place. No agencies. No middlemen.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-wrap gap-3 mb-16"
          >
            <Link
              to="/post-opportunity"
              className="inline-flex items-center gap-2 bg-white text-black px-7 py-3.5 text-xs font-medium tracking-widest uppercase hover:bg-white/90 transition-all"
            >
              Post a Campaign <ArrowRight size={13} />
            </Link>
            <Link
              to="/creators"
              className="inline-flex items-center gap-2 border border-white/25 text-white/80 px-7 py-3.5 text-xs font-medium tracking-widest uppercase hover:border-white/50 hover:text-white transition-all"
            >
              Browse Creators
            </Link>
            <Link
              to="/feed"
              className="inline-flex items-center gap-2 text-white/50 px-4 py-3.5 text-xs font-medium tracking-wider hover:text-white transition-all"
            >
              <Play size={11} className="mr-0.5" /> Watch The Feed
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-8 border-t border-white/10 pt-8"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-light text-white">{s.value}</p>
                <p className="text-[10px] text-white/40 tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Image switcher dots */}
        <div className="absolute bottom-8 right-6 md:right-10 flex flex-col gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`w-1 rounded-full transition-all ${activeImg === i ? "h-8 bg-white" : "h-3 bg-white/30 hover:bg-white/50"}`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>

      {/* Brand trust strip — bottom */}
      <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-sm py-4">
        <div className="container flex items-center gap-6 overflow-x-auto">
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/30 shrink-0">Trusted by</span>
          {["GANNI", "NA-KD", "COS", "ARKET", "OATLY", "SKIMS", "GLOSSIER", "ZARA"].map(b => (
            <span key={b} className="text-sm font-light tracking-[0.2em] text-white/25 shrink-0 hover:text-white/50 transition-colors cursor-default">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
