import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const allCreators = [
  { id: 1, name: "Mia Chen", role: "UGC Creator", location: "Los Angeles, CA", rating: 4.9, tags: ["Lifestyle", "Fashion", "Beauty"], bio: "Creating authentic content that converts. 3+ years of UGC experience with top DTC brands. Specializing in lifestyle and beauty content that feels real and relatable.", portfolio: 24 },
  { id: 2, name: "Jordan Blake", role: "Photographer", location: "New York, NY", rating: 4.8, tags: ["Product", "Food", "Flat Lay"], bio: "Specializing in product photography that tells your brand story. Working with food, lifestyle, and e-commerce brands to create scroll-stopping visuals.", portfolio: 48 },
  { id: 3, name: "Aisha Koroma", role: "Social Media Manager", location: "London, UK", rating: 5.0, tags: ["TikTok", "Reels", "Strategy"], bio: "Growing brands through viral short-form content and strategy. Managed accounts with 500K+ combined followers across TikTok and Instagram.", portfolio: 15 },
  { id: 4, name: "Leo Martinez", role: "Videographer", location: "Miami, FL", rating: 4.7, tags: ["Brand Films", "Ads", "Documentary"], bio: "Cinematic storytelling for brands that want to stand out. From concept to final cut, I craft films that move people and drive results.", portfolio: 32 },
  { id: 5, name: "Priya Sharma", role: "Graphic Designer", location: "Toronto, CA", rating: 4.9, tags: ["Branding", "Social Media", "Illustration"], bio: "Crafting visual identities that resonate with your audience. From logo design to full brand systems, I help brands look their best.", portfolio: 56 },
  { id: 6, name: "Marcus Johnson", role: "Copywriter", location: "Austin, TX", rating: 4.6, tags: ["Email", "Web Copy", "Ads"], bio: "Words that sell. Conversion-focused copy for modern brands. Specializing in email sequences, landing pages, and ad copy that drives action.", portfolio: 20 },
  { id: 7, name: "Sakura Tanaka", role: "Influencer", location: "Tokyo, JP", rating: 4.8, tags: ["Beauty", "Skincare", "Wellness"], bio: "150K+ followers. Authentic reviews and sponsored content that my audience trusts. Focused on beauty, skincare, and wellness brands.", portfolio: 40 },
  { id: 8, name: "Daniel Osei", role: "Motion Designer", location: "Berlin, DE", rating: 4.9, tags: ["Animation", "Motion Graphics", "3D"], bio: "Bringing brands to life with dynamic motion design. From social media animations to full brand videos, I make things move.", portfolio: 28 },
];

const CreatorProfile = () => {
  const { id } = useParams();
  const creator = allCreators.find((c) => c.id === Number(id));

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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 flex flex-col gap-8 md:flex-row"
      >
        {/* Sidebar */}
        <div className="w-full rounded-lg border border-border bg-card p-8 md:max-w-xs">
          <div className="mx-auto h-20 w-20 rounded-full bg-accent" />
          <h1 className="mt-5 text-center text-2xl">{creator.name}</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">{creator.role}</p>

          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin size={12} />{creator.location}</span>
            <span className="flex items-center gap-1"><Star size={12} className="text-primary" />{creator.rating}</span>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-1.5">
            {creator.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] text-accent-foreground">
                {tag}
              </span>
            ))}
          </div>

          <Button className="mt-6 w-full" asChild>
            <Link to="/messages">
              <MessageCircle size={14} className="mr-2" /> Message
            </Link>
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="text-lg">About</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{creator.bio}</p>
          </div>

          <div className="mt-6 rounded-lg border border-border bg-card p-8">
            <h2 className="text-lg">Portfolio</h2>
            <p className="mt-2 text-sm text-muted-foreground">{creator.portfolio} works</p>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-md bg-accent" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatorProfile;
