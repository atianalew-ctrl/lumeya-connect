import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Lock, Star, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { creators } from "@/lib/data";

const PERKS = [
  { icon: Star, title: "Elite Creator Access", desc: "The top 50 creators globally — hand-picked, vetted, exclusive to Black members." },
  { icon: Zap, title: "AI Matchmaker Priority", desc: "Skip the queue. AI finds your perfect creator in seconds, not hours." },
  { icon: Globe, title: "Creator Travel Campaigns", desc: "We send creators to Bali, Copenhagen, Tokyo to film your brand on location." },
  { icon: Lock, title: "Exclusive Briefs", desc: "Your campaigns are never shared with other brands. Full exclusivity on content rights." },
];

const FEATURED_CREATORS = creators.slice(0, 4);

const TESTIMONIALS = [
  { quote: "We found a creator who perfectly captured our Scandinavian aesthetic in 24 hours. Nothing else comes close.", brand: "EcoLabel", role: "Head of Marketing" },
  { quote: "Lumeya Black gave us access to creators we couldn't find anywhere else. The ROI was 4x our usual campaigns.", brand: "NA-KD Studio", role: "Brand Director" },
  { quote: "The travel campaign concept alone made this worth every cent. Our Bali content drove 3x our best month ever.", brand: "WellnessNord", role: "Founder" },
];

const LumeyaBlack = () => {
  const [email, setEmail] = useState("");
  const [brandName, setBrandName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !brandName.trim()) { toast.error("Please fill in both fields"); return; }
    setSubmitted(true);
    toast.success("You're on the waitlist! We'll be in touch.");
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-32 px-6">
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/[0.03] rounded-full blur-[80px] pointer-events-none" />

        <div className="container max-w-3xl text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-5 py-2 text-xs tracking-[0.2em] uppercase text-white/50 mb-10">
              <span className="w-1 h-1 rounded-full bg-white/50" />
              By Invitation Only
            </div>

            <h1 className="text-6xl md:text-8xl font-extralight tracking-tight leading-none mb-8">
              Lumeya<br />
              <span className="italic text-white/30">Black</span>
            </h1>

            <p className="text-base text-white/40 max-w-md mx-auto leading-relaxed mb-12">
              An exclusive tier for brands that refuse to compromise. 50 elite creators. Unlimited ambition. Zero guesswork.
            </p>

            <div className="flex items-center justify-center gap-12 text-center mb-16">
              {[["50", "Elite Creators"], ["24h", "Match Time"], ["€10k+", "Avg. Campaign Value"]].map(([num, label]) => (
                <div key={label}>
                  <p className="text-3xl font-extralight">{num}</p>
                  <p className="text-xs text-white/30 tracking-widest uppercase mt-1">{label}</p>
                </div>
              ))}
            </div>

            <a href="#apply" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-sm font-medium tracking-wide hover:bg-white/90 transition-colors">
              Apply for Access <ArrowRight size={15} />
            </a>
            <p className="text-xs text-white/20 mt-4">Currently accepting 12 brands per quarter</p>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Featured creators */}
      <section className="py-20 px-6">
        <div className="container max-w-4xl">
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-10 text-center">A Glimpse at the Roster</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {FEATURED_CREATORS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#080808] p-6 group cursor-pointer"
              >
                <div className="relative overflow-hidden mb-4">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <div>
                      <p className="text-xs text-white/60">{c.rates}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-light">{c.name}</p>
                <p className="text-xs text-white/30 mt-0.5">{c.location}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-white/20">
                  <Star size={9} className="text-white/40" /> {c.rating}
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-white/20 mt-6 tracking-widest uppercase">
            Full roster revealed upon acceptance
          </p>
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* Perks */}
      <section className="py-20 px-6">
        <div className="container max-w-4xl">
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-12 text-center">What Black Includes</p>
          <div className="grid md:grid-cols-2 gap-px bg-white/5">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#080808] p-8">
                <Icon size={18} className="text-white/40 mb-4" />
                <h3 className="text-base font-light mb-2">{title}</h3>
                <p className="text-sm text-white/30 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="container max-w-4xl">
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-12 text-center">From Our Members</p>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-white/10 p-6"
              >
                <p className="text-sm text-white/50 leading-relaxed italic mb-6">"{t.quote}"</p>
                <div>
                  <p className="text-xs font-medium text-white/70">{t.brand}</p>
                  <p className="text-xs text-white/30">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* Apply form */}
      <section id="apply" className="py-24 px-6">
        <div className="container max-w-md text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-6">Apply for Access</p>
          <h2 className="text-3xl font-extralight mb-4">Join the waitlist</h2>
          <p className="text-sm text-white/30 mb-10 leading-relaxed">
            We review applications quarterly. Selected brands are contacted personally.
          </p>

          {!submitted ? (
            <form onSubmit={handleWaitlist} className="space-y-3">
              <Input
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                placeholder="Brand name"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-none h-12"
              />
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-none h-12"
              />
              <button
                type="submit"
                className="w-full bg-white text-black py-3 text-sm font-medium tracking-wide hover:bg-white/90 transition-colors"
              >
                Request Access
              </button>
              <p className="text-xs text-white/20">We typically respond within 5 business days.</p>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="border border-white/10 p-10">
              <Check size={24} className="mx-auto text-white/50 mb-4" />
              <p className="text-base font-light mb-2">You're on the list.</p>
              <p className="text-sm text-white/30">We'll review your application and be in touch personally.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer strip */}
      <div className="border-t border-white/5 px-6 py-6 flex items-center justify-between text-xs text-white/20 tracking-widest uppercase">
        <span>Lumeya Black</span>
        <span>Exclusive · Curated · Uncompromising</span>
        <span>© 2026</span>
      </div>
    </div>
  );
};

export default LumeyaBlack;
