import { motion } from "framer-motion";

const collabs = [
  { creator: "Ronja Aaslund", brand: "GlowCo", type: "Lifestyle Campaign" },
  { creator: "Nella Ryglova", brand: "Ubud Organics", type: "Product Review" },
  { creator: "Sussie Agger", brand: "EcoLabel", type: "TikTok Series" },
  { creator: "Amalie Asheim", brand: "WanderlustTravel", type: "Brand Film" },
  { creator: "Celina Beck", brand: "PureBlend", type: "Testimonial" },
  { creator: "Sakura Tanaka", brand: "FreshFace", type: "Unboxing" },
  { creator: "Daniel Osei", brand: "TechNova", type: "Motion Ad" },
  { creator: "Nikoline Amelia", brand: "FarmTable", type: "Flat Lay Shoot" },
  { creator: "Ronja Aaslund", brand: "LuxeBeauty", type: "Reels Campaign" },
  { creator: "Nella Ryglova", brand: "Nourish", type: "Lifestyle Content" },
];

const TickerItem = ({ creator, brand, type }: { creator: string; brand: string; type: string }) => (
  <div className="flex items-center gap-3 px-6 py-2 shrink-0">
    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
    <span className="text-sm font-medium text-foreground">{creator}</span>
    <span className="text-xs text-muted-foreground">×</span>
    <span className="text-sm font-medium text-primary">{brand}</span>
    <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] text-muted-foreground">{type}</span>
  </div>
);

const CollabTicker = () => {
  return (
    <div className="border-y border-border bg-card/50 py-3 overflow-hidden relative">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-card/80 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-card/80 to-transparent" />
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, ease: "linear", repeat: Infinity }}
      >
        {[...collabs, ...collabs].map((c, i) => (
          <TickerItem key={i} {...c} />
        ))}
      </motion.div>
    </div>
  );
};

export default CollabTicker;
