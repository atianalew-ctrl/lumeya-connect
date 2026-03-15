import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Bookmark, Share2, Play, Instagram, X, ChevronLeft, ChevronRight, Sparkles, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { creators } from "@/lib/data";

// ── Curated content grid — editorial luxury aesthetic
const CONTENT = [
  {
    id: 1, creator: "Ronja Aaslund", handle: "@ronjaaaslund",
    avatar: "/lovable-uploads/488193ca-12b4-40ef-905e-1c618634eef9.jpg",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    type: "reel", category: "Fashion", brand: "GlowCo",
    caption: "Morning ritual ✦ when your skincare routine becomes your favourite part of the day",
    likes: "24.2K", saves: "3.8K", span: "row-span-2",
  },
  {
    id: 2, creator: "Nikoline Amelia", handle: "@nikoline.amelia",
    avatar: "/lovable-uploads/cd5a920c-8cf1-4735-9844-a67d2c7e4d28.png",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    type: "photo", category: "Lifestyle", brand: "Arket",
    caption: "Copenhagen summer. Nothing else needed.",
    likes: "18.9K", saves: "2.1K", span: "",
  },
  {
    id: 3, creator: "Sussie Agger", handle: "@sussieagger",
    avatar: "/lovable-uploads/ff812edb-72d9-419a-809e-81d311763fdb.jpg",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    type: "photo", category: "Fashion", brand: "NA-KD",
    caption: "The pieces that stay. Season after season.",
    likes: "31.4K", saves: "5.2K", span: "",
  },
  {
    id: 4, creator: "Amalie Asheim", handle: "@amalieasheim",
    avatar: "/lovable-uploads/b0a2c103-a2be-4f3e-8785-4b072d9f90cf.png",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
    type: "reel", category: "Travel", brand: "Wanderlust",
    caption: "Bali mornings hit different when the work is this good 🌿",
    likes: "42.1K", saves: "7.9K", span: "row-span-2",
  },
  {
    id: 5, creator: "Nella Ryglova", handle: "@nellaryglova",
    avatar: "/lovable-uploads/59419297-8971-48c3-a2c5-2b636c4b1db6.png",
    image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&q=80",
    type: "photo", category: "Beauty", brand: "LuxeBeauty",
    caption: "Clean skin, cleaner conscience. This is the routine.",
    likes: "15.6K", saves: "4.2K", span: "",
  },
  {
    id: 6, creator: "Celina Beck", handle: "@celinabeck",
    avatar: "/lovable-uploads/0eabe39f-7869-4598-9148-b1264c4af989.jpg",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    type: "photo", category: "Fashion", brand: "COS",
    caption: "Minimal wardrobe. Maximum presence.",
    likes: "28.7K", saves: "6.1K", span: "",
  },
  {
    id: 7, creator: "Ronja Aaslund", handle: "@ronjaaaslund",
    avatar: "/lovable-uploads/488193ca-12b4-40ef-905e-1c618634eef9.jpg",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
    type: "reel", category: "Beauty", brand: "FreshFace",
    caption: "No filter. Just good skin and good light.",
    likes: "38.2K", saves: "8.4K", span: "",
  },
  {
    id: 8, creator: "Amalie Asheim", handle: "@amalieasheim",
    avatar: "/lovable-uploads/b0a2c103-a2be-4f3e-8785-4b072d9f90cf.png",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
    type: "photo", category: "Lifestyle", brand: "Oatly",
    caption: "The brand that matches the lifestyle. Always.",
    likes: "22.3K", saves: "3.5K", span: "",
  },
  {
    id: 9, creator: "Nella Ryglova", handle: "@nellaryglova",
    avatar: "/lovable-uploads/59419297-8971-48c3-a2c5-2b636c4b1db6.png",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    type: "photo", category: "Fashion", brand: "Ganni",
    caption: "She wore it first. You saw it here.",
    likes: "19.8K", saves: "4.7K", span: "row-span-2",
  },
  {
    id: 10, creator: "Sussie Agger", handle: "@sussieagger",
    avatar: "/lovable-uploads/ff812edb-72d9-419a-809e-81d311763fdb.jpg",
    image: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=600&q=80",
    type: "reel", category: "Lifestyle", brand: "1 People",
    caption: "Sustainable never looked so good. Or felt this way.",
    likes: "14.2K", saves: "2.9K", span: "",
  },
  {
    id: 11, creator: "Celina Beck", handle: "@celinabeck",
    avatar: "/lovable-uploads/0eabe39f-7869-4598-9148-b1264c4af989.jpg",
    image: "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&q=80",
    type: "photo", category: "Beauty", brand: "GlowCo",
    caption: "Morning light and the serum that started it all.",
    likes: "33.1K", saves: "5.8K", span: "",
  },
  {
    id: 12, creator: "Nikoline Amelia", handle: "@nikoline.amelia",
    avatar: "/lovable-uploads/cd5a920c-8cf1-4735-9844-a67d2c7e4d28.png",
    image: "https://images.unsplash.com/photo-1602488283247-29bf1f5b148a?w=600&q=80",
    type: "reel", category: "Travel", brand: "Wanderlust",
    caption: "Paris in March. You already know.",
    likes: "47.8K", saves: "9.2K", span: "",
  },
];

const CATEGORIES = ["All", "Fashion", "Beauty", "Lifestyle", "Travel"];

// ── Lightbox
const Lightbox = ({ item, onClose, onPrev, onNext }: {
  item: typeof CONTENT[0]; onClose: () => void; onPrev: () => void; onNext: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative max-w-4xl w-full bg-[#0a0a0a] rounded-2xl overflow-hidden flex flex-col md:flex-row"
      onClick={e => e.stopPropagation()}
    >
      {/* Image */}
      <div className="md:w-3/5 aspect-[4/5] md:aspect-auto relative">
        <img src={item.image} alt={item.caption} className="w-full h-full object-cover" />
        {item.type === "reel" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Play size={22} className="text-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="md:w-2/5 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <img src={item.avatar} alt={item.creator} className="h-10 w-10 rounded-full object-cover" />
          <div>
            <p className="text-sm font-medium text-white">{item.creator}</p>
            <p className="text-xs text-white/40">{item.handle}</p>
          </div>
          <button className="ml-auto">
            <Instagram size={16} className="text-white/40 hover:text-white transition-colors" />
          </button>
        </div>

        <p className="text-sm text-white/70 leading-relaxed mb-6 flex-1">{item.caption}</p>

        <div className="flex gap-4 mb-6">
          <div>
            <p className="text-lg font-light text-white">{item.likes}</p>
            <p className="text-[10px] text-white/40">Likes</p>
          </div>
          <div>
            <p className="text-lg font-light text-white">{item.saves}</p>
            <p className="text-[10px] text-white/40">Saves</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] border border-white/10 text-white/50 rounded-full px-3 py-1">{item.category}</span>
          <span className="text-[10px] border border-white/10 text-white/50 rounded-full px-3 py-1">{item.brand}</span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1 rounded-full bg-white text-black hover:bg-white/90 text-xs gap-1">
            <Sparkles size={11} /> Hire {item.creator.split(" ")[0]}
          </Button>
          <button className="rounded-full border border-white/10 p-2.5 text-white/60 hover:text-white hover:border-white/30 transition-colors">
            <Bookmark size={13} />
          </button>
        </div>
      </div>

      {/* Close */}
      <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white/60 hover:text-white transition-colors">
        <X size={14} />
      </button>

      {/* Prev/Next */}
      <button onClick={e => { e.stopPropagation(); onPrev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white/60 hover:text-white transition-colors">
        <ChevronLeft size={16} />
      </button>
      <button onClick={e => { e.stopPropagation(); onNext(); }} className="absolute right-3 md:right-[42%] top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white/60 hover:text-white transition-colors">
        <ChevronRight size={16} />
      </button>
    </motion.div>
  </motion.div>
);

// ── Main page
const ContentBoard = () => {
  const [category, setCategory] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const filtered = category === "All" ? CONTENT : CONTENT.filter(c => c.category === category);
  const lbIndex = lightbox !== null ? filtered.findIndex(c => c.id === lightbox) : -1;

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border py-12 text-center">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">Curated Content</p>
            <h1 className="text-5xl font-display font-normal mb-4">
              The Feed.
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              High-end creator content, curated for brands who know the difference. Tap any post to explore and hire.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-[4.25rem] z-40 bg-background/90 backdrop-blur border-b border-border">
        <div className="container flex items-center gap-2 py-3 overflow-x-auto">
          <Filter size={13} className="text-muted-foreground shrink-0" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                category === cat
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto shrink-0 text-xs text-muted-foreground">{filtered.length} posts</div>
        </div>
      </div>

      {/* Masonry grid */}
      <div className="container py-8">
        <motion.div
          layout
          className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-0"
        >
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="break-inside-avoid mb-3 group cursor-pointer relative rounded-xl overflow-hidden bg-accent"
                onClick={() => setLightbox(item.id)}
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.caption}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Reel indicator */}
                  {item.type === "reel" && (
                    <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                      <Play size={10} className="text-white ml-0.5" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex flex-col justify-between p-3">
                    {/* Top actions */}
                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => toggleLike(item.id, e)}
                        className="h-8 w-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"
                      >
                        <Heart size={13} className={liked.has(item.id) ? "text-red-400 fill-red-400" : "text-white"} />
                      </button>
                      <button
                        onClick={e => toggleSave(item.id, e)}
                        className="h-8 w-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"
                      >
                        <Bookmark size={13} className={saved.has(item.id) ? "text-primary fill-primary" : "text-white"} />
                      </button>
                    </div>

                    {/* Bottom info */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 mb-2">
                        <img src={item.avatar} alt={item.creator} className="h-6 w-6 rounded-full object-cover border border-white/30" />
                        <span className="text-[11px] text-white font-medium">{item.creator.split(" ")[0]}</span>
                        <span className="ml-auto text-[10px] text-white/70 bg-white/10 rounded-full px-2 py-0.5">{item.category}</span>
                      </div>
                      <p className="text-[10px] text-white/80 leading-relaxed line-clamp-2">{item.caption}</p>
                    </div>
                  </div>
                </div>

                {/* Stats bar */}
                <div className="flex items-center justify-between px-3 py-2.5 bg-card">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Heart size={9} /> {item.likes}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Bookmark size={9} /> {item.saves}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{item.brand}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load more */}
        <div className="text-center mt-12">
          <Button variant="outline" className="rounded-full px-10">
            Load More
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && lbIndex >= 0 && (
          <Lightbox
            item={filtered[lbIndex]}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox(filtered[(lbIndex - 1 + filtered.length) % filtered.length].id)}
            onNext={() => setLightbox(filtered[(lbIndex + 1) % filtered.length].id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentBoard;
