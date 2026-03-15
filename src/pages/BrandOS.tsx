import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Zap, Users, BarChart3, Calendar, MessageSquare,
  Instagram, Linkedin, TrendingUp, Star, Plus, ArrowUpRight,
  Sparkles, Play, Copy, Check, ChevronRight, Globe, Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { creators } from "@/lib/data";
import { toast } from "sonner";

// ── Sidebar nav items
const NAV = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "content", icon: Zap, label: "Content AI" },
  { id: "creators", icon: Users, label: "Creators" },
  { id: "linkedin", icon: Linkedin, label: "LinkedIn" },
  { id: "schedule", icon: Calendar, label: "Schedule" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
];

// ── Fake metrics for demo
const METRICS = [
  { label: "Content Generated", value: "47", change: "+12 this week", up: true },
  { label: "Creator Matches", value: "8", change: "+3 this month", up: true },
  { label: "Scheduled Posts", value: "24", change: "Next 30 days", up: true },
  { label: "Estimated Reach", value: "142K", change: "+28% vs last month", up: true },
];

const SCHEDULED = [
  { day: "Mon", platform: "Instagram", type: "Reel", status: "ready", content: "Product reveal — new summer drop" },
  { day: "Tue", platform: "TikTok", type: "Video", status: "ready", content: "Behind the scenes at the studio" },
  { day: "Wed", platform: "LinkedIn", type: "Post", status: "draft", content: "Why authentic UGC outperforms ads" },
  { day: "Thu", platform: "Instagram", type: "Story", status: "ready", content: "Creator spotlight — Ronja Aaslund" },
  { day: "Fri", platform: "TikTok", type: "Video", status: "generating", content: "Trending sound + product integration" },
];

const LINKEDIN_LEADS = [
  { name: "Maria Jensen", title: "Head of Marketing", company: "SELECTED Femme", status: "connected", avatar: "MJ" },
  { name: "Erik Lindqvist", title: "Brand Director", company: "NA-KD", status: "pending", avatar: "EL" },
  { name: "Sophie Müller", title: "CMO", company: "Arket", status: "replied", avatar: "SM" },
  { name: "Lucas Andersen", title: "Marketing Manager", company: "Won Hundred", status: "connected", avatar: "LA" },
];

const statusColor: Record<string, string> = {
  ready: "text-emerald-500 bg-emerald-500/10",
  draft: "text-amber-500 bg-amber-500/10",
  generating: "text-primary bg-primary/10",
  connected: "text-emerald-500 bg-emerald-500/10",
  pending: "text-amber-500 bg-amber-500/10",
  replied: "text-primary bg-primary/10",
};

// ── Content AI tab
const ContentAITab = () => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<null | { hook: string; caption: string; hashtags: string }>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1200));
    setResult({
      hook: `POV: you found the ${prompt.split(" ")[0].toLowerCase()} that changes everything 🤍`,
      caption: `We've been working on something special.\n\n${prompt}\n\nThis is the content your audience has been waiting for — authentic, intentional, and completely on-brand.\n\nDrop a 🖤 if this resonates.`,
      hashtags: "#ugccreator #brandcollaboration #contentcreator #lumeya #authenticcontent #creatoreconomy",
    });
    setGenerating(false);
  };

  const copyAll = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${result.hook}\n\n${result.caption}\n\n${result.hashtags}`);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-1">Content AI</h2>
        <p className="text-sm text-muted-foreground">Describe your content or campaign — AI writes everything.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <Textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g. New summer collection drop for a Scandinavian fashion brand, minimalist aesthetic, targeting women 25-35..."
          className="min-h-[80px] resize-none text-sm border-0 p-0 focus-visible:ring-0"
        />
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex gap-2">
            {["Instagram", "TikTok", "LinkedIn"].map(p => (
              <span key={p} className="text-[10px] border border-border rounded-full px-2.5 py-0.5 text-muted-foreground">{p}</span>
            ))}
          </div>
          <Button size="sm" className="rounded-full gap-1.5" onClick={generate} disabled={!prompt.trim() || generating}>
            {generating ? "Generating..." : <><Sparkles size={13} /> Generate</>}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary flex items-center gap-1.5"><Sparkles size={11} /> Generated</span>
              <button onClick={copyAll} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy all"}
              </button>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg bg-accent/50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Hook (first 3 seconds)</p>
                <p className="text-sm font-medium">{result.hook}</p>
              </div>
              <div className="rounded-lg bg-accent/50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Caption</p>
                <p className="text-sm whitespace-pre-line text-foreground/80">{result.caption}</p>
              </div>
              <div className="rounded-lg bg-accent/50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Hashtags</p>
                <p className="text-xs text-primary/80">{result.hashtags}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="outline" className="flex-1 text-xs rounded-full">Schedule Post</Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs rounded-full">Send to Creator</Button>
              <Button size="sm" className="flex-1 text-xs rounded-full gap-1"><Zap size={11} /> Make Ad</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Overview tab
const OverviewTab = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-medium mb-1">Brand Overview</h2>
      <p className="text-sm text-muted-foreground">Your marketing engine at a glance.</p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {METRICS.map((m, i) => (
        <motion.div key={m.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
          className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-light">{m.value}</p>
          <p className="text-xs font-medium mt-1">{m.label}</p>
          <p className={`text-[10px] mt-1 ${m.up ? "text-emerald-500" : "text-red-400"}`}>{m.change}</p>
        </motion.div>
      ))}
    </div>

    {/* Quick actions */}
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-medium mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Generate Content", icon: Sparkles, to: null },
          { label: "Find Creator", icon: Users, to: "/matchmaker" },
          { label: "Activate UGC", icon: Zap, to: "/activate" },
          { label: "Post Opportunity", icon: Plus, to: "/post-opportunity" },
        ].map(({ label, icon: Icon, to }) => (
          <div key={label}>
            {to ? (
              <Link to={to} className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-accent/30 p-4 hover:bg-accent transition-colors text-center cursor-pointer">
                <Icon size={18} className="text-primary" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-accent/30 p-4 hover:bg-accent transition-colors text-center cursor-pointer">
                <Icon size={18} className="text-primary" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Upcoming schedule */}
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Upcoming Posts</h3>
        <span className="text-xs text-muted-foreground">Next 5 days</span>
      </div>
      <div className="space-y-2">
        {SCHEDULED.slice(0, 3).map((s, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
            <span className="text-xs text-muted-foreground w-8">{s.day}</span>
            <span className="text-xs bg-accent px-2 py-0.5 rounded-full shrink-0">{s.platform}</span>
            <span className="text-xs text-foreground/80 flex-1 truncate">{s.content}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${statusColor[s.status]}`}>{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── LinkedIn tab
const LinkedInTab = () => {
  const [message, setMessage] = useState("");
  const [generating, setGenerating] = useState(false);

  const generateMessage = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 900));
    setMessage(`Hi [Name],\n\nI came across [Company] and was genuinely impressed by your recent campaign — the way you've positioned the brand feels very aligned with where the market is heading.\n\nI run Lumeya, a creator platform specifically for Scandinavian and global lifestyle brands. We've helped brands like yours find the exact right creators for their campaigns in under 24 hours.\n\nWould love to show you what we've been building — would a 15-minute call make sense?\n\nBest,\nAtiana`);
    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-1">LinkedIn Outreach</h2>
        <p className="text-sm text-muted-foreground">AI-written personalised messages for every prospect.</p>
      </div>

      {/* Lead list */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Active Leads</h3>
          <Button size="sm" variant="outline" className="text-xs rounded-full gap-1"><Plus size={11} /> Add Lead</Button>
        </div>
        <div className="space-y-3">
          {LINKEDIN_LEADS.map((lead, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                {lead.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{lead.name}</p>
                <p className="text-xs text-muted-foreground truncate">{lead.title} · {lead.company}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${statusColor[lead.status]}`}>{lead.status}</span>
              <Button size="sm" variant="ghost" className="text-xs h-7 px-2 shrink-0">
                <MessageSquare size={12} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Message generator */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium mb-3">AI Message Generator</h3>
        <Button size="sm" onClick={generateMessage} disabled={generating} className="rounded-full gap-1.5 mb-4">
          {generating ? "Writing..." : <><Sparkles size={12} /> Generate Outreach Message</>}
        </Button>
        {message && (
          <div className="rounded-lg bg-accent/50 p-4">
            <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-sans leading-relaxed">{message}</pre>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="text-xs rounded-full" onClick={() => { navigator.clipboard.writeText(message); toast.success("Copied!"); }}>
                <Copy size={11} className="mr-1" /> Copy
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Creators tab
const CreatorsTab = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-medium mb-1">Your Creators</h2>
      <p className="text-sm text-muted-foreground">Manage creator relationships and campaigns.</p>
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      {creators.slice(0, 4).map((c, i) => (
        <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
          <img src={c.avatar} alt={c.name} className="h-12 w-12 rounded-full object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{c.name}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><Star size={10} className="text-primary" />{c.rating}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{c.role} · {c.location}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {c.tags.slice(0, 2).map(t => <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-[10px]">{t}</span>)}
            </div>
          </div>
          <Button size="sm" variant="outline" className="text-xs h-8 shrink-0" asChild>
            <Link to={`/creators/${c.id}`}><ChevronRight size={13} /></Link>
          </Button>
        </motion.div>
      ))}
    </div>
    <div className="rounded-xl border border-dashed border-border p-8 text-center">
      <Users size={24} className="mx-auto text-muted-foreground/40 mb-3" />
      <p className="text-sm text-muted-foreground mb-3">Find your perfect creator match</p>
      <Button size="sm" className="rounded-full" asChild>
        <Link to="/matchmaker"><Sparkles size={13} className="mr-1.5" /> AI Matchmaker</Link>
      </Button>
    </div>
  </div>
);

// ── Analytics tab
const AnalyticsTab = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-medium mb-1">Analytics</h2>
      <p className="text-sm text-muted-foreground">Performance across all your channels.</p>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[
        { platform: "Instagram", reach: "48,200", engagement: "4.2%", posts: 12, icon: "📸" },
        { platform: "TikTok", reach: "93,800", engagement: "6.8%", posts: 8, icon: "🎵" },
        { platform: "LinkedIn", reach: "12,400", engagement: "3.1%", posts: 6, icon: "💼" },
        { platform: "UGC Ads", reach: "142K", engagement: "2.4% CTR", posts: 5, icon: "🎯" },
      ].map((p, i) => (
        <motion.div key={p.platform} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium flex items-center gap-2">{p.icon} {p.platform}</span>
            <ArrowUpRight size={14} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-light">{p.reach}</p>
          <p className="text-xs text-muted-foreground mt-1">Reach this month</p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-500">{p.engagement} eng.</span>
            <span className="text-muted-foreground">{p.posts} posts</span>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-medium mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-primary" /> Top Performing Content</h3>
      {[
        { title: "Ronja × Summer Collection", platform: "TikTok", reach: "34,200", type: "UGC Video" },
        { title: "Behind the scenes Bali shoot", platform: "Instagram", reach: "18,900", type: "Reel" },
        { title: "Why Nordic brands win on UGC", platform: "LinkedIn", reach: "8,400", type: "Article" },
      ].map((c, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
          <div className="flex-1">
            <p className="text-xs font-medium">{c.title}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{c.platform} · {c.type}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium">{c.reach}</p>
            <p className="text-[10px] text-muted-foreground">reach</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Main BrandOS component
const BrandOS = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "content": return <ContentAITab />;
      case "creators": return <CreatorsTab />;
      case "linkedin": return <LinkedInTab />;
      case "analytics": return <AnalyticsTab />;
      default: return (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <Calendar size={32} className="mb-3 opacity-30" />
          <p className="text-sm">Coming soon</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Globe size={12} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium leading-none">Brand OS</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Your AI-powered marketing engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">✦ Pro Plan</span>
          <Button size="sm" variant="outline" className="text-xs rounded-full h-8" asChild>
            <Link to="/">← Back to Lumeya</Link>
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 border-r border-border min-h-[calc(100vh-53px)] p-3 hidden md:block">
          <div className="space-y-0.5">
            {NAV.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-8 mx-2 rounded-lg bg-primary/5 border border-primary/10 p-3">
            <p className="text-xs font-medium text-primary mb-1">Upgrade to Black</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">Elite creators, travel campaigns, full exclusivity.</p>
            <Link to="/black" className="text-[10px] text-primary hover:underline mt-2 flex items-center gap-1">
              Learn more <ChevronRight size={10} />
            </Link>
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden border-b border-border w-full flex overflow-x-auto">
          {NAV.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-3 text-xs transition-colors border-b-2 ${
                activeTab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              }`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default BrandOS;
