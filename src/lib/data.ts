export type Region = "Europe" | "North America" | "Asia Pacific" | "Southeast Asia" | "Middle East" | "Latin America" | "Africa" | "Scandinavia" | "Bali / Southeast Asia" | "Global";

export type UGCContentType =
  | "Product Review"
  | "Product Demo"
  | "Testimonial"
  | "Unboxing"
  | "Lifestyle Content"
  | "Problem → Solution Ad"
  | "Voiceover / B-roll"
  | "Vlog / Day-in-the-life"
  | "TikTok Trend / Social Trend";

export const UGC_CONTENT_TYPES: UGCContentType[] = [
  "Product Review",
  "Product Demo",
  "Testimonial",
  "Unboxing",
  "Lifestyle Content",
  "Problem → Solution Ad",
  "Voiceover / B-roll",
  "Vlog / Day-in-the-life",
  "TikTok Trend / Social Trend",
];

export interface Creator {
  id: number;
  name: string;
  role: string;
  location: string;
  country: string;
  region: Region;
  languages: string[];
  timezone: string;
  rating: number;
  tags: string[];
  bio: string;
  portfolio: number;
  rates: string;
  skills: string[];
  color: string;
  brands: string[];
  videoUrl: string;
  avatar: string;
  availableForRemote: boolean;
  contentTypes: UGCContentType[];
}

export const creators: Creator[] = [
  { id: 1, name: "Ronja Aaslund", role: "UGC Creator", location: "Stockholm, SE", country: "Sweden", region: "Scandinavia", languages: ["English", "Swedish"], timezone: "CET", availableForRemote: true, rating: 4.9, tags: ["Lifestyle", "Fashion", "Beauty"], bio: "Scandinavian minimalistic vibe, specialised in lifestyle and beauty brands", portfolio: 24, rates: "$200–$500 per video", skills: ["UGC", "TikTok", "Photography", "Social Media", "Video Editing"], color: "from-pink-300 to-rose-200", brands: ["GlowCo", "LuxeBeauty", "FreshFace"], videoUrl: "/src/assets/sara-lee-video.mov", avatar: "/lovable-uploads/488193ca-12b4-40ef-905e-1c618634eef9.jpg", contentTypes: ["Product Review", "Testimonial", "Lifestyle Content", "TikTok Trend / Social Trend"] },
  { id: 2, name: "Jordan Blake", role: "Photographer", location: "New York, NY", country: "United States", region: "North America", languages: ["English"], timezone: "EST", availableForRemote: true, rating: 4.8, tags: ["Product", "Food", "Flat Lay"], bio: "Specializing in product photography that tells your brand story. Working with food, lifestyle, and e-commerce brands to create scroll-stopping visuals.", portfolio: 48, rates: "$300–$800 per shoot", skills: ["Photography", "Design", "Social Media", "Product Videos"], color: "from-amber-200 to-orange-200", brands: ["Brew & Co.", "FarmTable", "UrbanBite"], videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan", contentTypes: ["Product Demo", "Unboxing", "Voiceover / B-roll"] },
  { id: 3, name: "Amelia Kozak", role: "Content Creator", location: "Bali, ID", country: "Indonesia", region: "Southeast Asia", languages: ["English", "Polish", "Indonesian"], timezone: "WITA", availableForRemote: true, rating: 5.0, tags: ["TikTok", "Reels", "Strategy"], bio: "Scandinavian minimalistic vibe, specialized in voice overs, food & fashion", portfolio: 15, rates: "$1,500–$3,000/mo", skills: ["Social Media", "TikTok", "Instagram", "Strategy", "Video Editing"], color: "from-emerald-200 to-teal-200", brands: ["FitPulse", "TechNova", "Wanderlust"], videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", avatar: "/lovable-uploads/23b97164-8b1e-40d0-a9c4-fc5686f28068.jpg", contentTypes: ["Voiceover / B-roll", "Lifestyle Content", "Vlog / Day-in-the-life", "TikTok Trend / Social Trend"] },
  { id: 4, name: "Leo Martinez", role: "Videographer", location: "Miami, FL", country: "United States", region: "North America", languages: ["English", "Spanish"], timezone: "EST", availableForRemote: false, rating: 4.7, tags: ["Brand Films", "Ads", "Documentary"], bio: "Cinematic storytelling for brands that want to stand out. From concept to final cut, I craft films that move people and drive results.", portfolio: 32, rates: "$1,000–$5,000 per project", skills: ["Videography", "Photography", "YouTube", "Video Editing"], color: "from-cyan-200 to-blue-200", brands: ["Wanderlust Travel", "Nike Local", "RedBull"], videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Leo", contentTypes: ["Problem → Solution Ad", "Product Demo", "Testimonial"] },
  { id: 5, name: "Natalia Mai", role: "UGC Creator", location: "Canggu, Bali", country: "Indonesia", region: "Southeast Asia", languages: ["English", "Vietnamese", "Indonesian"], timezone: "WITA", availableForRemote: true, rating: 4.9, tags: ["Branding", "Social Media", "Illustration"], bio: "Crafting visual identities that resonate with your audience. From logo design to full brand systems, I help brands look their best.", portfolio: 56, rates: "$500–$2,000 per project", skills: ["Design", "Social Media", "Photography", "Illustration"], color: "from-violet-200 to-indigo-200", brands: ["TechNova", "Nourish", "PureBlend"], videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", avatar: "/lovable-uploads/ca56b912-7edc-40a0-9611-c29da383fee8.jpg", contentTypes: ["Unboxing", "Lifestyle Content", "Product Review"] },
  { id: 6, name: "Marcus Johnson", role: "Copywriter", location: "Austin, TX", country: "United States", region: "North America", languages: ["English"], timezone: "CST", availableForRemote: true, rating: 4.6, tags: ["Email", "Web Copy", "Ads"], bio: "Words that sell. Conversion-focused copy for modern brands. Specializing in email sequences, landing pages, and ad copy that drives action.", portfolio: 20, rates: "$200–$600 per piece", skills: ["Writing", "Social Media", "Email Marketing"], color: "from-yellow-200 to-amber-200", brands: ["PureBlend", "GlowCo"], videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus", contentTypes: ["Voiceover / B-roll", "Testimonial"] },
  { id: 7, name: "Sakura Tanaka", role: "Influencer", location: "Tokyo, JP", country: "Japan", region: "Asia Pacific", languages: ["Japanese", "English"], timezone: "JST", availableForRemote: true, rating: 4.8, tags: ["Beauty", "Skincare", "Wellness"], bio: "150K+ followers. Authentic reviews and sponsored content that my audience trusts. Focused on beauty, skincare, and wellness brands.", portfolio: 40, rates: "$500–$2,000 per post", skills: ["Instagram", "TikTok", "UGC", "Photography"], color: "from-rose-200 to-pink-200", brands: ["GlowCo", "FreshFace", "WellnessPlus"], videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sakura", contentTypes: ["Product Review", "Unboxing", "TikTok Trend / Social Trend", "Vlog / Day-in-the-life"] },
  { id: 8, name: "Daniel Osei", role: "Motion Designer", location: "Berlin, DE", country: "Germany", region: "Europe", languages: ["English", "German", "French"], timezone: "CET", availableForRemote: true, rating: 4.9, tags: ["Animation", "Motion Graphics", "3D"], bio: "Bringing brands to life with dynamic motion design. From social media animations to full brand videos, I make things move.", portfolio: 28, rates: "$800–$3,000 per project", skills: ["Design", "Videography", "Social Media", "3D Animation"], color: "from-sky-200 to-cyan-200", brands: ["TechNova", "FitPulse", "Wanderlust"], videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Daniel", contentTypes: ["Problem → Solution Ad", "Product Demo", "Voiceover / B-roll"] },
];

export const opportunities = [
  {
    id: 1, title: "UGC Creator for Skincare Brand", brand: "GlowCo", category: "UGC",
    budget: "$500–$1,000", deadline: "Mar 15, 2026", location: "Remote",
    desc: "Looking for an authentic UGC creator to produce 5 short-form videos showcasing our new serum line.",
    tags: ["Beauty", "Skincare", "Short-form"],
    overview: "GlowCo is launching a new line of vitamin C serums and we need authentic, relatable UGC content that resonates with our target audience of women aged 20–35. We want content that feels natural and not overly produced.",
    deliverables: ["5 short-form videos (30–60 seconds each)", "Vertical format optimized for TikTok and Instagram Reels", "Raw footage files included", "2 rounds of revisions"],
    timeline: "Content needed by March 15, 2026. First drafts due by March 8.",
  },
  {
    id: 2, title: "Product Photographer Needed", brand: "Brew & Co.", category: "Photography",
    budget: "$800–$1,500", deadline: "Mar 20, 2026", location: "New York, NY",
    desc: "Need a photographer for a flat-lay product shoot of our coffee collection. 20 final images.",
    tags: ["Product", "Food", "Lifestyle"],
    overview: "Brew & Co. is a specialty coffee brand launching 4 new blends. We need a talented photographer to create stunning flat-lay and lifestyle product shots for our website, social media, and Amazon listing.",
    deliverables: ["20 final retouched images", "Mix of flat-lay and lifestyle shots", "High-res files suitable for print and web", "Props and styling included"],
    timeline: "Shoot date flexible within March 15–20. Final images due March 25.",
  },
  {
    id: 3, title: "TikTok Content Manager", brand: "FitPulse", category: "Social Media",
    budget: "$2,000/mo", deadline: "Ongoing", location: "Remote",
    desc: "Manage our TikTok account: strategy, content creation, and community engagement. 4 posts/week.",
    tags: ["TikTok", "Fitness", "Strategy"],
    overview: "FitPulse is a fitness app looking for a dedicated TikTok content manager to grow our presence on the platform. We currently have 12K followers and want to reach 100K within 6 months.",
    deliverables: ["Content strategy and calendar", "4 TikTok posts per week", "Community engagement and comment management", "Monthly analytics reports"],
    timeline: "Ongoing engagement starting immediately. Month-to-month contract.",
  },
  {
    id: 4, title: "Brand Film Director", brand: "Wanderlust Travel", category: "Videography",
    budget: "$3,000–$5,000", deadline: "Apr 1, 2026", location: "Bali, Indonesia",
    desc: "Direct a 2-minute brand film for our summer campaign. Travel to Bali included.",
    tags: ["Travel", "Cinematic", "Brand Film"],
    overview: "Wanderlust Travel is producing a cinematic brand film to promote our new luxury eco-resort in Bali. We're looking for a director who can capture the beauty of the location and the spirit of sustainable travel.",
    deliverables: ["2-minute hero brand film", "3 x 30-second social media cuts", "Behind-the-scenes content", "All travel and accommodation covered"],
    timeline: "Pre-production in March. Shoot dates April 1–5 in Bali. Final delivery April 20.",
  },
  {
    id: 5, title: "Social Media Graphics Designer", brand: "TechNova", category: "Design",
    budget: "$600/mo", deadline: "Ongoing", location: "Remote",
    desc: "Create weekly social media graphics for our tech brand. Figma proficiency required.",
    tags: ["Design", "Social Media", "Tech"],
    overview: "TechNova is a B2B SaaS company looking for a designer to create consistent, on-brand social media graphics. Our brand style is clean, modern, and uses a blue/purple palette.",
    deliverables: ["8–10 social media graphics per week", "Instagram, LinkedIn, and Twitter formats", "Figma source files", "Monthly template updates"],
    timeline: "Ongoing engagement. Start immediately.",
  },
  {
    id: 6, title: "Email Copywriter for Launch", brand: "PureBlend", category: "Writing",
    budget: "$400–$700", deadline: "Mar 25, 2026", location: "Remote",
    desc: "Write a 5-email launch sequence for our new wellness supplement line.",
    tags: ["Email", "Wellness", "Launch"],
    overview: "PureBlend is launching a new line of plant-based wellness supplements. We need a skilled copywriter to create a compelling 5-email launch sequence that builds anticipation and drives pre-orders.",
    deliverables: ["5-email launch sequence", "Subject lines with A/B variants", "Preview text for each email", "CTA optimization"],
    timeline: "First drafts due March 18. Final versions by March 25.",
  },
];
