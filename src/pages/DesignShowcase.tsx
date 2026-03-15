import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, MapPin, Star, Play, Heart, Zap, Globe, Users, TrendingUp } from "lucide-react";
import { creators } from "@/lib/data";

const DESIGNS = [
  { id: "noir", label: "01 — Lumeya Noir", tagline: "Dark luxury editorial" },
  { id: "aurora", label: "02 — Aurora", tagline: "Gradient Nordic light" },
  { id: "minimal", label: "03 — Blanc", tagline: "Ultra-minimal Scandi" },
  { id: "magazine", label: "04 — Editorial", tagline: "Fashion magazine grid" },
  { id: "kinetic", label: "05 — Kinetic", tagline: "Bold Gen Z energy" },
];

// ─────────────────────────────────────────────
// DESIGN 1 — LUMEYA NOIR (Dark luxury, like Net-A-Porter)
// ─────────────────────────────────────────────
const DesignNoir = () => (
  <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
    {/* Nav */}
    <nav className="flex items-center justify-between px-10 py-6 border-b border-white/10">
      <span className="text-lg tracking-[0.3em] uppercase font-light">Lumeya</span>
      <div className="flex gap-8 text-xs tracking-widest uppercase text-white/50">
        <span className="hover:text-white cursor-pointer transition-colors">Creators</span>
        <span className="hover:text-white cursor-pointer transition-colors">Brands</span>
        <span className="hover:text-white cursor-pointer transition-colors">Black</span>
        <span className="hover:text-white cursor-pointer transition-colors">Community</span>
      </div>
      <button className="border border-white/20 px-5 py-2 text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all">
        Apply
      </button>
    </nav>

    {/* Hero */}
    <div className="px-10 py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-8">The Creator Economy, Curated</p>
        <h1 className="text-6xl md:text-8xl font-extralight leading-none tracking-tight mb-8">
          Content that<br />
          <span className="italic text-white/60">converts.</span>
        </h1>
        <p className="text-sm text-white/50 max-w-sm leading-relaxed mb-12">
          An exclusive network of the world's finest creators. Built for brands that refuse to settle.
        </p>
        <div className="flex gap-6">
          <button className="bg-white text-black px-8 py-3 text-xs tracking-widest uppercase hover:bg-white/90 transition-colors">
            Find Creators
          </button>
          <button className="border border-white/20 px-8 py-3 text-xs tracking-widest uppercase text-white/60 hover:text-white hover:border-white/40 transition-all">
            Lumeya Black ↗
          </button>
        </div>
      </motion.div>
    </div>

    {/* Creator grid */}
    <div className="px-10 pb-20">
      <div className="flex items-center justify-between mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-white/30">Featured Creators</p>
        <p className="text-xs text-white/30">500+ Global Talent</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
        {creators.slice(0, 4).map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0a0a0a] p-6 hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <img src={c.avatar} alt={c.name} className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-500 mb-4" />
            <p className="text-sm font-light">{c.name}</p>
            <p className="text-xs text-white/40 mt-1">{c.location}</p>
            <div className="flex gap-2 mt-3">
              {c.tags.slice(0, 2).map(t => (
                <span key={t} className="text-[10px] text-white/30 border border-white/10 px-2 py-0.5">{t}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Stats bar */}
    <div className="border-t border-white/10 px-10 py-8 flex items-center justify-between">
      {[["500+", "Creators"], ["120+", "Brands"], ["1,200+", "Collabs"], ["€2.4M", "Creator Earnings"]].map(([num, label]) => (
        <div key={label} className="text-center">
          <p className="text-2xl font-extralight">{num}</p>
          <p className="text-xs text-white/30 tracking-widest uppercase mt-1">{label}</p>
        </div>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// DESIGN 2 — AURORA (Nordic gradient, dreamy)
// ─────────────────────────────────────────────
const DesignAurora = () => (
  <div className="min-h-screen bg-[#0d0d1a] text-white overflow-hidden">
    {/* Aurora gradient background */}
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-[#4ade80]/10 blur-[120px]" />
      <div className="absolute top-20 right-1/4 w-[500px] h-[300px] rounded-full bg-[#818cf8]/15 blur-[100px]" />
      <div className="absolute bottom-0 left-1/2 w-[400px] h-[300px] rounded-full bg-[#f472b6]/10 blur-[100px]" />
    </div>

    {/* Nav */}
    <nav className="relative z-10 flex items-center justify-between px-8 py-5 backdrop-blur-sm border-b border-white/10">
      <span className="text-xl font-light tracking-wider">lumeya</span>
      <div className="flex gap-6 text-sm text-white/60">
        <span className="hover:text-white cursor-pointer">Creators</span>
        <span className="hover:text-white cursor-pointer">Brands</span>
        <span className="hover:text-white cursor-pointer">Community</span>
      </div>
      <button className="bg-gradient-to-r from-[#818cf8] to-[#4ade80] text-black text-sm px-5 py-2 rounded-full font-medium">
        Get Started
      </button>
    </nav>

    {/* Hero */}
    <div className="relative z-10 text-center px-8 pt-24 pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-1.5 text-xs text-white/70 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
          500+ creators online now
        </div>
        <h1 className="text-5xl md:text-7xl font-light leading-tight mb-6">
          The creator platform<br />
          <span className="bg-gradient-to-r from-[#818cf8] via-[#4ade80] to-[#f472b6] bg-clip-text text-transparent">
            built for the north.
          </span>
        </h1>
        <p className="text-white/50 text-base max-w-md mx-auto mb-10 leading-relaxed">
          Scandinavian creators. Bali aesthetics. Global brands. One home.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full text-sm hover:bg-white/20 transition-all">
            Explore Creators
          </button>
          <button className="bg-gradient-to-r from-[#818cf8] to-[#4ade80] text-black px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
            Post a Campaign ✦
          </button>
        </div>
      </motion.div>
    </div>

    {/* Floating creator cards */}
    <div className="relative z-10 px-8 pb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {creators.slice(0, 4).map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition-all hover:border-white/20 cursor-pointer"
          >
            <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full object-cover mb-3 ring-2 ring-white/10" />
            <p className="text-sm font-medium">{c.name}</p>
            <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1"><MapPin size={10} />{c.location}</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-white/40">
                <Star size={10} className="text-[#4ade80]" /> {c.rating}
              </div>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{c.tags[0]}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// DESIGN 3 — BLANC (Ultra-minimal Scandi)
// ─────────────────────────────────────────────
const DesignBlanc = () => (
  <div className="min-h-screen bg-[#fafaf8] text-[#1a1a18]">
    {/* Nav */}
    <nav className="flex items-center justify-between px-12 py-7 border-b border-[#e8e8e4]">
      <span className="text-base tracking-[0.2em] uppercase font-light">Lumeya</span>
      <div className="flex gap-10 text-xs tracking-widest uppercase text-[#999990]">
        <span className="hover:text-[#1a1a18] cursor-pointer transition-colors">Discover</span>
        <span className="hover:text-[#1a1a18] cursor-pointer transition-colors">Brands</span>
        <span className="hover:text-[#1a1a18] cursor-pointer transition-colors">Community</span>
      </div>
      <button className="text-xs tracking-widest uppercase text-[#999990] hover:text-[#1a1a18] transition-colors">
        Join →
      </button>
    </nav>

    {/* Hero — asymmetric layout */}
    <div className="grid md:grid-cols-2 min-h-[80vh]">
      <div className="flex flex-col justify-center px-12 py-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-xs tracking-[0.4em] uppercase text-[#999990] mb-10">Est. 2026</p>
          <h1 className="text-5xl font-extralight leading-[1.1] mb-8 text-[#1a1a18]">
            Creators who<br />
            <em className="text-[#8c8c7a]">actually deliver.</em>
          </h1>
          <p className="text-sm text-[#999990] leading-relaxed max-w-xs mb-12">
            A curated network of Scandinavian and global creators for brands that value quality over quantity.
          </p>
          <div className="flex gap-3">
            <button className="bg-[#1a1a18] text-white px-7 py-3 text-xs tracking-widest uppercase hover:bg-[#333] transition-colors">
              Find Talent
            </button>
            <button className="border border-[#e8e8e4] px-7 py-3 text-xs tracking-widest uppercase text-[#999990] hover:border-[#1a1a18] hover:text-[#1a1a18] transition-all">
              For Creators
            </button>
          </div>
        </motion.div>
      </div>

      <div className="relative bg-[#f0f0ea] overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1">
          {creators.slice(0, 4).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="relative overflow-hidden group cursor-pointer"
            >
              <img src={c.avatar} alt={c.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium">{c.name}</p>
                <p className="text-white/70 text-[10px]">{c.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-[#e8e8e4] px-12 py-6 flex items-center justify-between text-xs text-[#999990] tracking-widest uppercase">
      <span>Scandinavia · Bali · Global</span>
      <span>500+ Creators · 120+ Brands</span>
      <span>Quality Over Quantity</span>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// DESIGN 4 — EDITORIAL (Fashion magazine)
// ─────────────────────────────────────────────
const DesignEditorial = () => (
  <div className="min-h-screen bg-white text-black">
    {/* Header */}
    <header className="border-b-4 border-black px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="text-xs tracking-widest uppercase text-gray-400">Vol. 1 — 2026</div>
        <h1 className="text-4xl font-black tracking-tight uppercase">LUMEYA</h1>
        <div className="text-xs tracking-widest uppercase text-gray-400">Creator Economy</div>
      </div>
    </header>

    {/* Magazine grid hero */}
    <div className="grid grid-cols-12 gap-4 p-8 border-b border-gray-200">
      {/* Big feature */}
      <div className="col-span-7 relative group cursor-pointer overflow-hidden">
        <img src={creators[0].avatar} alt="" className="w-full aspect-[4/5] object-cover grayscale-[20%] group-hover:scale-[1.02] transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-[10px] tracking-widest uppercase text-white/60 mb-1">Cover Creator</p>
          <h2 className="text-2xl font-black text-white leading-tight">{creators[0].name.toUpperCase()}</h2>
          <p className="text-white/70 text-xs mt-1">{creators[0].location} · {creators[0].tags[0]}</p>
        </div>
        <div className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
          ★ {creators[0].rating}
        </div>
      </div>

      {/* Side stack */}
      <div className="col-span-5 flex flex-col gap-4">
        <div className="border-b border-gray-200 pb-4">
          <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-3">This Month</p>
          <h2 className="text-3xl font-black leading-none mb-2">THE UGCREVOLUTION</h2>
          <p className="text-sm text-gray-500 leading-relaxed">Why authentic creator content is outperforming every other ad format in 2026.</p>
        </div>

        {creators.slice(1, 3).map(c => (
          <div key={c.id} className="flex gap-3 group cursor-pointer">
            <img src={c.avatar} alt={c.name} className="w-16 h-16 object-cover grayscale-[20%] shrink-0" />
            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400">{c.role}</p>
              <p className="text-sm font-bold">{c.name}</p>
              <p className="text-xs text-gray-400">{c.location}</p>
            </div>
          </div>
        ))}

        <button className="border-2 border-black px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all mt-auto">
          Browse All Creators →
        </button>
      </div>
    </div>

    {/* Ticker */}
    <div className="bg-black text-white py-2 px-8 flex items-center gap-8 overflow-hidden text-xs tracking-widest uppercase">
      {["Sustainable Fashion", "UGC Creators", "Nordic Aesthetic", "Bali Shoots", "Brand Collabs", "Community"].map(t => (
        <span key={t} className="shrink-0">✦ {t}</span>
      ))}
    </div>

    {/* Stats row */}
    <div className="grid grid-cols-4 border-t border-gray-200">
      {[["500+", "Global Creators"], ["120+", "Brand Partners"], ["1,200+", "Collaborations"], ["#1", "Nordic Platform"]].map(([num, label]) => (
        <div key={label} className="border-r last:border-r-0 border-gray-200 px-8 py-6 text-center">
          <p className="text-4xl font-black">{num}</p>
          <p className="text-[10px] tracking-widest uppercase text-gray-400 mt-1">{label}</p>
        </div>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// DESIGN 5 — KINETIC (Bold Gen Z, TikTok energy)
// ─────────────────────────────────────────────
const DesignKinetic = () => (
  <div className="min-h-screen bg-[#ff3c00] text-white overflow-hidden">
    {/* Nav */}
    <nav className="flex items-center justify-between px-8 py-5">
      <span className="text-2xl font-black italic">Lumeya*</span>
      <div className="flex gap-6 text-sm font-medium">
        <span className="hover:underline cursor-pointer">Creators</span>
        <span className="hover:underline cursor-pointer">Brands</span>
        <span className="hover:underline cursor-pointer">Community</span>
      </div>
      <button className="bg-white text-[#ff3c00] font-black text-sm px-5 py-2 rounded-none hover:bg-black hover:text-white transition-colors">
        JOIN NOW
      </button>
    </nav>

    {/* Hero */}
    <div className="px-8 pt-12 pb-16">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="inline-block bg-black text-white text-xs font-bold px-3 py-1 mb-6 uppercase tracking-widest">
          ⚡ New: AI Matchmaker
        </div>
        <h1 className="text-6xl md:text-9xl font-black leading-none uppercase mb-6" style={{ WebkitTextStroke: "2px white" }}>
          CREATE<br />
          <span className="text-white">COLLAB</span><br />
          <span style={{ WebkitTextStroke: "2px white", color: "transparent" }}>CONVERT</span>
        </h1>
        <div className="flex gap-4 mt-10">
          <button className="bg-black text-white font-black text-lg px-8 py-4 hover:bg-white hover:text-black transition-colors uppercase">
            Find Creators →
          </button>
          <button className="border-2 border-white font-black text-lg px-8 py-4 hover:bg-white hover:text-[#ff3c00] transition-colors uppercase">
            Post Campaign
          </button>
        </div>
      </motion.div>
    </div>

    {/* Creator strip */}
    <div className="bg-black px-8 py-8">
      <p className="text-[#ff3c00] text-xs font-bold tracking-widest uppercase mb-6">Hot right now 🔥</p>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {creators.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="shrink-0 w-40 cursor-pointer group"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img src={c.avatar} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-xs font-bold">{c.name.split(" ")[0]}</p>
                <p className="text-[10px] text-white/60">{c.tags[0]}</p>
              </div>
              <div className="absolute top-2 right-2 bg-[#ff3c00] text-white text-[9px] font-black px-1.5 py-0.5">
                ★{c.rating}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-3 border-t-4 border-black">
      {[["500+", "CREATORS"], ["1,200+", "COLLABS"], ["€2.4M", "EARNED"]].map(([num, label]) => (
        <div key={label} className="border-r-4 last:border-r-0 border-black px-8 py-6">
          <p className="text-4xl font-black">{num}</p>
          <p className="text-white/60 text-xs font-bold tracking-widest mt-1">{label}</p>
        </div>
      ))}
    </div>
  </div>
);

const DESIGN_COMPONENTS: Record<string, () => JSX.Element> = {
  noir: DesignNoir,
  aurora: DesignAurora,
  minimal: DesignBlanc,
  magazine: DesignEditorial,
  kinetic: DesignKinetic,
};

const DesignShowcase = () => {
  const [active, setActive] = useState("noir");
  const Component = DESIGN_COMPONENTS[active];

  return (
    <div>
      {/* Selector bar */}
      <div className="sticky top-[4.25rem] z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center gap-0 overflow-x-auto py-2">
          {DESIGNS.map(d => (
            <button
              key={d.id}
              onClick={() => setActive(d.id)}
              className={`shrink-0 px-4 py-2.5 text-xs transition-all border-b-2 ${
                active === d.id
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="block">{d.label}</span>
              <span className="block text-[10px] opacity-60 mt-0.5">{d.tagline}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Design preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Component />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DesignShowcase;
