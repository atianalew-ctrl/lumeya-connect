import { motion } from "framer-motion";
import { MapPin, Play, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { creators } from "@/lib/data";
import { useAllCreatorVideos } from "@/hooks/use-creator-videos";
import DropZoneUpload from "./DropZoneUpload";

const DiscoverCreatorsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: uploadedVideos } = useAllCreatorVideos();

  // Build a map of creatorId -> featured video URL from DB
  const videoMap = new Map<number, string>();
  uploadedVideos?.forEach((v) => {
    if (!videoMap.has(v.creator_id)) {
      videoMap.set(v.creator_id, v.video_url);
    }
  });

  return (
    <section className="border-t border-border py-6">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Browse</p>
            <h2 className="mt-2 text-3xl md:text-4xl">Discover Creators</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
              Browse real content from creators ready to collaborate with brands.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/upload-video">Upload Video</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/creators">View all creators</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 overflow-hidden relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-background to-transparent" />

        <motion.div
          className="flex gap-5 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        >
          {[...creators, ...creators].map((creator, i) => (
            <CreatorVideoCard
              key={`${creator.id}-${i}`}
              creator={creator}
              index={i % creators.length}
              uploadedVideoUrl={videoMap.get(creator.id)}
            />
          ))}
        </motion.div>
      </div>

      <DropZoneUpload />
    </section>
  );
};

const CreatorVideoCard = ({ creator, index, uploadedVideoUrl }: { creator: typeof creators[0]; index: number; uploadedVideoUrl?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const previewTimeout = useRef<ReturnType<typeof setTimeout>>();

  const videoSrc = uploadedVideoUrl || creator.videoUrl;

  // Lazy load: only load video src when card enters viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {}); // play() returns a promise; ignore autoplay errors
      previewTimeout.current = setTimeout(() => {
        if (videoRef.current) { videoRef.current.pause(); }
      }, 5000);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    clearTimeout(previewTimeout.current);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="group flex-shrink-0 w-[220px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video preview */}
      <div className={`relative aspect-[9/16] w-full rounded-xl bg-gradient-to-br ${creator.color} overflow-hidden`}>
        {isVisible && (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Play icon overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isHovering ? "opacity-0" : "opacity-100"} bg-foreground/5`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/80 shadow-lg backdrop-blur-sm">
            <Play size={18} className="text-foreground ml-0.5" />
          </div>
        </div>

        {/* Bottom gradient + info */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <img src={creator.avatar} alt={creator.name} className="h-8 w-8 rounded-full border-2 border-primary-foreground/40 bg-accent flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary-foreground drop-shadow-sm">{creator.name}</p>
            <p className="text-xs text-primary-foreground/80">{creator.role}</p>
            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-primary-foreground/70">
              <MapPin size={9} />
              {creator.location}
            </div>
          </div>
        </div>
      </div>

      {/* Niche tags */}
      <div className="mt-3 flex flex-wrap gap-1">
        {creator.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">{tag}</span>
        ))}
      </div>

      {/* Action buttons */}
      <div className="mt-2 flex gap-1.5">
        <Button size="sm" variant="outline" className="flex-1 text-xs h-8" asChild>
          <Link to={`/creators/${creator.id}`}>View Profile</Link>
        </Button>
        <Button size="sm" variant="ghost" className="text-xs h-8 px-2" asChild>
          <Link to="/post-opportunity"><Send size={12} /></Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default DiscoverCreatorsSection;
