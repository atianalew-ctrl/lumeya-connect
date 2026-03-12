import { motion } from "framer-motion";

const brands = [
  "Glossier", "Gymshark", "Ritual", "Allbirds", "Hims",
  "Warby Parker", "Away", "Casper", "Oatly", "Fenty",
  "Glossier", "Gymshark", "Ritual", "Allbirds", "Hims",
  "Warby Parker", "Away", "Casper", "Oatly", "Fenty",
];

const BrandLogoBar = () => (
  <section className="py-8 border-t border-border overflow-hidden">
    <p className="text-center text-[11px] uppercase tracking-scandi text-muted-foreground mb-6">
      Trusted by leading brands
    </p>
    <div className="relative">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        className="flex items-center gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {brands.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="text-lg font-medium tracking-tight text-muted-foreground/50 select-none"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            {brand}
          </span>
        ))}
      </motion.div>
    </div>
  </section>
);

export default BrandLogoBar;
