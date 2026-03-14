import { motion } from "framer-motion";

const brands = [
  { name: "L'Oréal", logo: "/brand-logos/loreal.png" },
  { name: "Ritual", logo: "/brand-logos/ritual.svg" },
  { name: "Oatly", logo: "/brand-logos/oatly.png" },
  { name: "Glossier", logo: "/brand-logos/glossier.png" },
  { name: "L'Oréal", logo: "/brand-logos/loreal.png" },
  { name: "Ritual", logo: "/brand-logos/ritual.svg" },
  { name: "Oatly", logo: "/brand-logos/oatly.png" },
  { name: "Glossier", logo: "/brand-logos/glossier.png" },
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
        className="flex items-center gap-16 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {brands.map((brand, i) => (
          <img
            key={`${brand.name}-${i}`}
            src={brand.logo}
            alt={brand.name}
            className="h-8 w-auto object-contain opacity-40 grayscale select-none"
          />
        ))}
      </motion.div>
    </div>
  </section>
);

export default BrandLogoBar;
