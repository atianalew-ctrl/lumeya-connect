import { motion } from "framer-motion";

const brands = [
  { name: "L'ORÉAL", style: "font-serif tracking-[0.15em] text-2xl font-bold" },
  { name: "RITUAL", style: "font-sans tracking-[0.25em] text-lg font-light" },
  { name: "OATLY", style: "font-bold text-2xl tracking-tight italic" },
  { name: "Glossier", style: "font-serif text-2xl italic font-normal tracking-wide" },
  { name: "ZARA", style: "font-sans tracking-[0.35em] text-xl font-light" },
  { name: "SKIMS", style: "font-sans tracking-[0.3em] text-lg font-medium" },
  { name: "Ganni", style: "font-serif text-2xl font-normal" },
  { name: "COS", style: "font-sans tracking-[0.4em] text-xl font-light" },
];

const allBrands = [...brands, ...brands];

const BrandLogoBar = () => (
  <section className="py-8 border-t border-border overflow-hidden">
    <p className="text-center text-[11px] uppercase tracking-scandi text-muted-foreground mb-6">
      Trusted by leading brands
    </p>
    <div className="relative">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        className="flex items-center gap-16 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {allBrands.map((brand, i) => (
          <span
            key={`${brand.name}-${i}`}
            className={`select-none text-muted-foreground/40 ${brand.style}`}
          >
            {brand.name}
          </span>
        ))}
      </motion.div>
    </div>
  </section>
);

export default BrandLogoBar;
