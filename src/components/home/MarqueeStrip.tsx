const words = [
  "UGC Creators", "Brand Films", "Photography", "TikTok Strategy",
  "Motion Design", "Lifestyle Content", "Product Shoots", "Social Media",
  "Video Editing", "Copywriting", "Illustration", "Brand Identity",
];

const MarqueeStrip = ({ variant = "default" }: { variant?: "default" | "muted" }) => {
  const baseClasses = variant === "muted"
    ? "border-y border-border/50 bg-muted/20"
    : "border-y border-terracotta/10 bg-terracotta-light/30";

  const textClasses = variant === "muted"
    ? "text-muted-foreground/40"
    : "text-terracotta/25";

  const dotClasses = variant === "muted"
    ? "bg-muted-foreground/20"
    : "bg-terracotta/15";

  return (
    <div className={`overflow-hidden py-4 ${baseClasses}`}>
      <div className="animate-marquee flex whitespace-nowrap">
        {[...words, ...words].map((word, i) => (
          <span key={i} className="flex items-center">
            <span className={`mx-6 text-sm md:text-base font-display tracking-wide ${textClasses}`}>
              {word}
            </span>
            <span className={`h-1.5 w-1.5 rounded-full ${dotClasses} flex-shrink-0`} />
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStrip;
