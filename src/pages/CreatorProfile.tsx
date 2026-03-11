import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowLeft, MessageCircle, Send, DollarSign, Play, Building2, Languages, Globe, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { creators } from "@/lib/data";
import { useCreatorVideos } from "@/hooks/use-creator-videos";
import { useRef, useState } from "react";

const CreatorProfile = () => {
  const { id } = useParams();
  const creator = creators.find((c) => c.id === Number(id));
  const { data: uploadedVideos } = useCreatorVideos(Number(id));

  if (!creator) {
    return (
      <div className="container py-24 text-center">
        <p className="text-muted-foreground">Creator not found.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/creators">Back to Creators</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <Link to="/creators" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={14} /> Back to Creators
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <div className="w-full rounded-lg border border-border bg-card p-8 lg:max-w-xs space-y-6">
          <div>
            <img src={creator.avatar} alt={creator.name} className="mx-auto h-24 w-24 rounded-full bg-accent" />
            <h1 className="mt-5 text-center text-2xl font-display">{creator.name}</h1>
            <p className="mt-1 text-center text-sm text-muted-foreground">{creator.role}</p>
          </div>

          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><MapPin size={12} />{creator.location}</span>
              <span className="flex items-center gap-1"><Star size={12} className="text-primary" />{creator.rating}</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><Globe size={11} />{creator.region}</span>
              {creator.availableForRemote && (
                <span className="flex items-center gap-1 text-primary"><Wifi size={11} />Remote OK</span>
              )}
            </div>
          </div>

          {/* Languages */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Languages size={11} /> Languages
            </p>
            <div className="flex flex-wrap gap-1.5">
              {creator.languages.map((lang) => (
                <span key={lang} className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">{lang}</span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm leading-relaxed text-muted-foreground">{creator.bio}</p>

          {/* Skills */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Skills & Categories</p>
            <div className="flex flex-wrap gap-1.5">
              {creator.skills.map((skill) => (
                <span key={skill} className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">{skill}</span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Specialties</p>
            <div className="flex flex-wrap gap-1.5">
              {creator.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] text-accent-foreground">{tag}</span>
              ))}
            </div>
          </div>

          {/* Rates */}
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Price Range</p>
            <p className="text-sm font-medium flex items-center gap-1"><DollarSign size={13} className="text-primary" />{creator.rates}</p>
          </div>

          {/* Brands worked with */}
          {creator.brands && creator.brands.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Brands Worked With</p>
              <div className="space-y-2">
                {creator.brands.map((brand) => (
                  <div key={brand} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 size={12} className="text-primary" />
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Button className="w-full" asChild>
              <Link to="/messages"><MessageCircle size={14} className="mr-2" />Message Creator</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/post-opportunity"><Send size={14} className="mr-2" />Invite to Opportunity</Link>
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Featured Video */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-display mb-4">Featured Video</h2>
            <VideoPlayer src={creator.videoUrl} />
          </div>

          {/* Portfolio Grid */}
          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="text-lg font-display">Portfolio</h2>
            <p className="mt-2 text-sm text-muted-foreground">{creator.portfolio} works</p>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`relative overflow-hidden rounded-md cursor-pointer group ${i % 3 === 0 ? "aspect-[9/16]" : "aspect-square"}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${creator.color} opacity-60`} />
                  <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                    {i % 2 === 0 && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card/80 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={14} className="text-foreground ml-0.5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden bg-accent cursor-pointer" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card/90 shadow-lg">
            <Play size={24} className="text-foreground ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorProfile;
