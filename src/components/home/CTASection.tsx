import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => (
  <section className="relative py-32 overflow-hidden bg-foreground text-background">
    {/* Subtle noise texture overlay */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

    <div className="container relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-xl"
      >
        <p className="text-[10px] tracking-[0.4em] uppercase text-background/40 mb-8">Join the Movement</p>
        <h2 className="text-5xl md:text-6xl font-display font-normal leading-[1.1] mb-8">
          The creator economy<br />
          <em className="text-background/60">starts here.</em>
        </h2>
        <p className="text-sm text-background/50 leading-relaxed max-w-sm mx-auto mb-12">
          Join a global network where brands discover extraordinary creators and creators find the opportunities they deserve.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/creators"
            className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-3.5 text-xs font-medium tracking-widest uppercase hover:bg-background/90 transition-colors"
          >
            Find Creators <ArrowRight size={13} />
          </Link>
          <Link
            to="/black"
            className="inline-flex items-center gap-2 border border-background/20 text-background/70 px-8 py-3.5 text-xs font-medium tracking-widest uppercase hover:border-background/40 hover:text-background transition-colors"
          >
            Lumeya Black ✦
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
