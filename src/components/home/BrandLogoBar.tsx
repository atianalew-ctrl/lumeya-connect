import { motion } from "framer-motion";

const brands = [
  { name: "GANNI", style: "font-serif tracking-[0.25em] text-lg font-normal" },
  { name: "NA-KD", style: "font-sans tracking-[0.3em] text-base font-light" },
  { name: "COS", style: "font-sans tracking-[0.45em] text-xl font-light" },
  { name: "ARKET", style: "font-sans tracking-[0.3em] text-base font-light" },
  { name: "OATLY", style: "font-serif text-lg italic font-normal tracking-wide" },
  { name: "SKIMS", style: "font-sans tracking-[0.35em] text-base font-light" },
  { name: "GLOSSIER", style: "font-serif text-lg font-normal tracking-wide" },
  { name: "ZARA", style: "font-sans tracking-[0.4em] text-xl font-light" },
  { name: "JACQUEMUS", style: "font-serif text-base italic font-normal tracking-wider" },
  { name: "A.P.C.", style: "font-sans tracking-[0.4em] text-base font-light" },
];

const allBrands = [...brands, ...brands];

const BrandLogoBar = () => (
  <section className="py-14 border-t border-border/50 overflow-hidden bg-background">
    <div className="container mb-8">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border/50" />
        <p className="text-[9px] tracking-[0.5em] uppercase text-muted-foreground/50 shrink-0">
          Selected brand partners
        </p>
        <div className="h-px flex-1 bg-border/50" />
      </div>
    </div>

    <div className="relative">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        className="flex items-center gap-20 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 45, ease: "linear", repeat: Infinity }}
      >
        {allBrands.map((brand, i) => (
          <span
            key={`${brand.name}-${i}`}
            className={`select-none text-muted-foreground/25 hover:text-muted-foreground/50 transition-colors duration-500 cursor-default ${brand.style}`}
          >
            {brand.name}
          </span>
        ))}
      </motion.div>
    </div>
  </section>
);

export default BrandLogoBar;
