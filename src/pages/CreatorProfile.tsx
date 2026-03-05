import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowLeft, MessageCircle, Send, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { creators } from "@/lib/data";

const CreatorProfile = () => {
  const { id } = useParams();
  const creator = creators.find((c) => c.id === Number(id));

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
            <div className="mx-auto h-20 w-20 rounded-full bg-accent flex items-center justify-center text-xl font-semibold text-accent-foreground">
              {creator.name.split(" ").map(n => n[0]).join("")}
            </div>
            <h1 className="mt-5 text-center text-2xl font-display">{creator.name}</h1>
            <p className="mt-1 text-center text-sm text-muted-foreground">{creator.role}</p>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin size={12} />{creator.location}</span>
            <span className="flex items-center gap-1"><Star size={12} className="text-primary" />{creator.rating}</span>
          </div>

          {/* Skills */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Skills</p>
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
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Rates</p>
            <p className="text-sm font-medium flex items-center gap-1"><DollarSign size={13} className="text-primary" />{creator.rates}</p>
          </div>

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
          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="text-lg font-display">About</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{creator.bio}</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="text-lg font-display">Portfolio</h2>
            <p className="mt-2 text-sm text-muted-foreground">{creator.portfolio} works</p>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-md bg-accent hover:opacity-80 transition-opacity cursor-pointer" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatorProfile;
