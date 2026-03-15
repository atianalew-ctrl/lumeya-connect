import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, Instagram, Globe, ArrowUpRight, Users, Eye, Heart, Share2, DollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const PERIODS = ["7 days", "30 days", "90 days", "All time"];

const CHANNELS = [
  {
    name: "Instagram", icon: "📸", color: "from-pink-500 to-rose-500",
    metrics: { reach: "48,200", engagement: "4.2%", impressions: "124K", clicks: "2,840", trend: "up", delta: "+18%" },
    posts: [
      { title: "Summer campaign — Ronja", type: "Reel", reach: "18,900", eng: "5.8%", date: "Mar 12" },
      { title: "Behind the scenes Bali", type: "Reel", reach: "12,400", eng: "4.1%", date: "Mar 10" },
      { title: "Product spotlight — serum", type: "Story", reach: "9,800", eng: "3.2%", date: "Mar 8" },
    ],
  },
  {
    name: "TikTok", icon: "🎵", color: "from-slate-800 to-slate-600",
    metrics: { reach: "93,800", engagement: "6.8%", impressions: "280K", clicks: "5,210", trend: "up", delta: "+34%" },
    posts: [
      { title: "Get ready with me × GlowCo", type: "Video", reach: "34,200", eng: "8.2%", date: "Mar 13" },
      { title: "POV: skincare routine", type: "Video", reach: "28,900", eng: "7.1%", date: "Mar 11" },
      { title: "Product unboxing — Nella", type: "Video", reach: "18,400", eng: "5.4%", date: "Mar 9" },
    ],
  },
  {
    name: "LinkedIn", icon: "💼", color: "from-blue-600 to-blue-500",
    metrics: { reach: "12,400", engagement: "3.1%", impressions: "48K", clicks: "840", trend: "up", delta: "+8%" },
    posts: [
      { title: "Why UGC outperforms ads in 2025", type: "Article", reach: "8,400", eng: "4.2%", date: "Mar 11" },
      { title: "Lumeya creator network update", type: "Post", reach: "2,800", eng: "2.8%", date: "Mar 8" },
    ],
  },
];

const CREATORS_PERF = [
  { name: "Ronja Aaslund", platform: "Instagram + TikTok", reach: "52,100", roi: "4.2x", avatar: "/lovable-uploads/488193ca-12b4-40ef-905e-1c618634eef9.jpg" },
  { name: "Nella Ryglova", platform: "TikTok", reach: "28,400", roi: "3.8x", avatar: "/lovable-uploads/59419297-8971-48c3-a2c5-2b636c4b1db6.png" },
  { name: "Sussie Agger", platform: "Instagram", reach: "18,900", roi: "3.1x", avatar: "/lovable-uploads/ff812edb-72d9-419a-809e-81d311763fdb.jpg" },
];

const Analytics = () => {
  const [period, setPeriod] = useState("30 days");
  const [activeChannel, setActiveChannel] = useState(0);

  const ch = CHANNELS[activeChannel];

  return (
    <div className="container py-12 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Performance</p>
            <h1 className="text-4xl font-display font-normal">Analytics</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-card border border-border rounded-full p-1 gap-1">
              {PERIODS.map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`rounded-full px-3 py-1.5 text-xs transition-all ${period === p ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                  {p}
                </button>
              ))}
            </div>
            <Button size="sm" variant="outline" className="rounded-full gap-1.5 text-xs">
              <RefreshCw size={11} /> Sync
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Reach", value: "154K", delta: "+24%", up: true, icon: Eye },
          { label: "Avg. Engagement", value: "5.4%", delta: "+0.8%", up: true, icon: Heart },
          { label: "Creator Campaigns", value: "7", delta: "+3", up: true, icon: Users },
          { label: "Est. Revenue Impact", value: "€28K", delta: "+41%", up: true, icon: DollarSign },
        ].map(({ label, value, delta, up, icon: Icon }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <Icon size={14} className="text-muted-foreground" />
              <span className={`text-[10px] font-medium flex items-center gap-0.5 ${up ? "text-emerald-500" : "text-red-400"}`}>
                {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {delta}
              </span>
            </div>
            <p className="text-2xl font-light">{value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Channel breakdown */}
      <div className="rounded-xl border border-border bg-card overflow-hidden mb-8">
        <div className="flex border-b border-border">
          {CHANNELS.map((c, i) => (
            <button key={c.name} onClick={() => setActiveChannel(i)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-medium transition-colors border-b-2 ${
                activeChannel === i ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Reach", value: ch.metrics.reach },
              { label: "Engagement", value: ch.metrics.engagement },
              { label: "Impressions", value: ch.metrics.impressions },
              { label: "Link Clicks", value: ch.metrics.clicks },
            ].map(m => (
              <div key={m.label} className="rounded-lg bg-accent/50 p-4">
                <p className="text-lg font-light">{m.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={13} className="text-emerald-500" />
            <span className="text-xs text-emerald-500 font-medium">{ch.metrics.delta} vs previous period</span>
          </div>

          <h3 className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">Top Posts</h3>
          <div className="space-y-2">
            {ch.posts.map((post, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                <span className="text-[10px] text-muted-foreground w-12 shrink-0">{post.date}</span>
                <span className="text-[10px] bg-accent px-2 py-0.5 rounded-full shrink-0">{post.type}</span>
                <span className="text-xs flex-1 truncate">{post.title}</span>
                <span className="text-xs font-medium shrink-0">{post.reach}</span>
                <span className="text-[10px] text-emerald-500 shrink-0">{post.eng}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Creator performance */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-medium mb-5 flex items-center gap-2">
          <Users size={14} className="text-primary" /> Creator Performance
        </h3>
        <div className="space-y-4">
          {CREATORS_PERF.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <img src={c.avatar} alt={c.name} className="h-9 w-9 rounded-full object-cover shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.platform}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{c.reach}</p>
                <p className="text-xs text-muted-foreground">reach</p>
              </div>
              <div className="text-right w-14">
                <p className="text-sm font-medium text-emerald-500">{c.roi}</p>
                <p className="text-xs text-muted-foreground">ROI</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-primary/5 border border-primary/15 p-4 flex items-start gap-3">
          <Globe size={14} className="text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-primary mb-1">Connect your accounts</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Link your Instagram, TikTok and LinkedIn to see real-time data from your actual accounts instead of demo data.</p>
            <Button size="sm" className="rounded-full mt-3 text-xs gap-1.5">
              <ArrowUpRight size={11} /> Connect Accounts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
