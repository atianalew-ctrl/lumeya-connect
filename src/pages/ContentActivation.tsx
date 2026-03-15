import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Copy, Check, ChevronDown, ChevronUp, Instagram, Play, FileText, Calendar, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────
interface ActivationResult {
  hooks: string[];
  captions: { platform: string; icon: string; text: string; hashtags: string }[];
  schedule: { day: string; platform: string; time: string; tip: string }[];
  adScript: string;
  briefSummary: string;
}

// ── AI generation (client-side smart templates + Supabase AI edge) ──
async function generateActivation(
  description: string,
  brandName: string,
  product: string,
  niche: string
): Promise<ActivationResult> {
  // We use Supabase AI edge function if available, otherwise smart local templates
  try {
    const { data, error } = await supabase.functions.invoke("ai-brief", {
      body: {
        type: "content-activation",
        description,
        brandName,
        product,
        niche,
      },
    });
    if (!error && data?.result) return data.result;
  } catch (_) {}

  // Fallback: smart local generation based on inputs
  return buildLocalActivation(description, brandName, product, niche);
}

function buildLocalActivation(
  description: string,
  brandName: string,
  product: string,
  niche: string
): ActivationResult {
  const brand = brandName || "the brand";
  const prod = product || "this product";
  const nic = niche.toLowerCase();

  const nicheHookMap: Record<string, string[]> = {
    fashion: [
      `POV: you finally found the piece that makes every outfit make sense 🤍`,
      `I've worn this 3 days in a row and I regret nothing`,
      `This is what confidence looks like — no filter, just ${prod}`,
      `The outfit check nobody asked for but everyone needed`,
      `Stop scrolling. This is the ${prod} you've been looking for.`,
    ],
    beauty: [
      `I tested this so you don't have to — here's what actually happened`,
      `My skin has never looked like this before. I'm in shock.`,
      `The ${prod} that broke my 6-month skincare routine`,
      `POV: 30 days of ${prod} and my camera roll is unrecognisable`,
      `I was today years old when I discovered ${prod} exists`,
    ],
    wellness: [
      `This changed my morning routine and I'll never go back`,
      `I didn't believe the hype until I tried it myself`,
      `30 days of ${prod}. Here's what actually happened to my body.`,
      `The wellness product I keep repurchasing (and I'm picky)`,
      `Your body called. It wants ${prod}.`,
    ],
    food: [
      `I made this recipe 4 times this week. Send help.`,
      `The ${prod} review nobody asked for but here we are`,
      `POV: finding the product that actually tastes as good as it looks`,
      `I brought this to a dinner party and everyone asked where to buy it`,
      `Rate this 1-10 👇 (answer: it's a 10)`,
    ],
    default: [
      `I wasn't expecting to love this. I was wrong.`,
      `POV: finding a product that actually does what it promises`,
      `This is the ${prod} review I wish existed before I bought it`,
      `I've recommended ${prod} to everyone I know this week`,
      `Stop sleeping on ${brand}. Here's why.`,
    ],
  };

  const hooks = (nicheHookMap[nic] || nicheHookMap.default).slice(0, 5);

  const captions = [
    {
      platform: "Instagram Reels",
      icon: "📸",
      text: `${hooks[0]}\n\n${description ? `${description.slice(0, 120)}...` : `Honestly didn't expect to love ${prod} this much — but here we are.`}\n\nHave you tried it? Drop a comment 👇`,
      hashtags: `#${brand.replace(/\s/g, "")} #ugccreator #${nic}content #${nic}tok #creatorcommunity #lumeya`,
    },
    {
      platform: "TikTok",
      icon: "🎵",
      text: `${hooks[1]}\n\n${description ? description.slice(0, 100) : `Testing ${prod} so you don't have to`} — full honest review in the video 👆\n\nSave this for later 🔖`,
      hashtags: `#${brand.replace(/\s/g, "")} #tiktok${nic} #ugc #creatortok #productreview #fyp`,
    },
    {
      platform: "Instagram Story",
      icon: "⭕",
      text: `New collab with ${brand} 🤍\n\nHonest thoughts: ${description ? description.slice(0, 80) : `${prod} is actually incredible`}\n\nLink in bio to shop 👆`,
      hashtags: "",
    },
    {
      platform: "LinkedIn",
      icon: "💼",
      text: `Collaborated with ${brand} on a campaign for ${prod}.\n\nWhat made this stand out: ${description ? description.slice(0, 150) : `authentic storytelling that connects with real people`}.\n\nThe creator economy is evolving — and brands that lean into authentic UGC are winning. Here's what I learned from this campaign:`,
      hashtags: `#creatorseconomy #ugcmarketing #contentcreator #${nic}`,
    },
  ];

  const schedule = [
    { day: "Monday", platform: "TikTok", time: "6–9 PM", tip: "Best reach for discovery content — algorithm favours new posts at start of week" },
    { day: "Tuesday", platform: "Instagram Reels", time: "11 AM–1 PM", tip: "Lunch scroll peak. Reels get highest saves mid-week" },
    { day: "Wednesday", platform: "Instagram Story", time: "7–9 PM", tip: "Story views spike Wednesday evening — great for link-in-bio CTAs" },
    { day: "Friday", platform: "TikTok", time: "3–6 PM", tip: "End-of-week entertainment mindset = higher watch time and shares" },
    { day: "Sunday", platform: "Instagram Reels", time: "6–8 PM", tip: "Sunday evening browsing = impulse purchase window. Include a clear CTA" },
  ];

  const adScript = `[0-3 SEC HOOK]
"${hooks[2]}"

[3-8 SEC PROBLEM]
Show the before: the frustration, the gap, the need.

[8-20 SEC SOLUTION]  
Introduce ${prod} naturally — in use, in context, not staged.
Show ${description ? description.slice(0, 80) : "real results in real life"}.

[20-25 SEC PROOF]
Quick reaction shot. Real emotion. Don't over-edit.

[25-30 SEC CTA]
"${brand} — link in bio. You're welcome."`;

  const briefSummary = `✅ 5 platform-optimised hooks ready\n✅ 4 captions across Instagram, TikTok, LinkedIn\n✅ 5-day posting schedule with timing rationale\n✅ 30-second ad script ready to brief your creator\n\nEstimated reach potential: 15,000–80,000 organic impressions across platforms`;

  return { hooks, captions, schedule, adScript, briefSummary };
}

// ── Copy button ──
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded">
      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
    </button>
  );
};

// ── Main component ──
const ContentActivation = () => {
  const [step, setStep] = useState<"form" | "result">("form");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActivationResult | null>(null);
  const [expanded, setExpanded] = useState<string | null>("hooks");

  // Form state
  const [brandName, setBrandName] = useState("");
  const [product, setProduct] = useState("");
  const [niche, setNiche] = useState("fashion");
  const [description, setDescription] = useState("");

  const handleGenerate = async () => {
    if (!product.trim()) { toast.error("Add a product name first"); return; }
    setLoading(true);
    const res = await generateActivation(description, brandName, product, niche);
    setResult(res);
    setLoading(false);
    setStep("result");
  };

  const niches = ["Fashion", "Beauty", "Wellness", "Food", "Tech", "Travel", "Fitness", "Home"];

  return (
    <div className="container py-16 max-w-2xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-5">
          <Zap size={12} />
          AI Content Activation
        </div>
        <h1 className="text-4xl font-normal">
          Turn UGC into<br />
          <span className="italic text-primary/80">ready-to-run ads.</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          Describe your content. Get 5 hooks, 4 platform captions, a posting schedule and a 30-second ad script — instantly.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            {/* Brand */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Brand Name</label>
              <Input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="e.g. GlowCo, Patagonia, NA-KD..." />
            </div>

            {/* Product */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Product / Campaign *</label>
              <Input value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. Vitamin C serum, Summer collection, Protein powder..." />
            </div>

            {/* Niche */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Niche</label>
              <div className="flex flex-wrap gap-2">
                {niches.map(n => (
                  <button
                    key={n}
                    onClick={() => setNiche(n.toLowerCase())}
                    className={`rounded-full border px-3 py-1 text-xs transition-all ${
                      niche === n.toLowerCase()
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Content description */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Describe the UGC content <span className="normal-case text-muted-foreground/60">(optional)</span></label>
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Creator films herself using the serum in a morning routine, shows before/after skin texture, honest review tone..."
                className="min-h-[80px] resize-none text-sm"
              />
            </div>

            <Button
              className="w-full rounded-full gap-2"
              size="lg"
              onClick={handleGenerate}
              disabled={!product.trim() || loading}
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Activating content…</>
              ) : (
                <><Zap size={16} /> Generate Activation Pack</>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Takes ~2 seconds · No signup required
            </p>
          </motion.div>
        )}

        {step === "result" && result && (
          <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Summary bar */}
            <div className="rounded-xl bg-primary/5 border border-primary/15 p-4 text-xs text-muted-foreground whitespace-pre-line">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={13} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Activation Pack Ready</span>
              </div>
              {result.briefSummary}
            </div>

            {/* Section: Hooks */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === "hooks" ? null : "hooks")}
                className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Zap size={15} className="text-primary" />
                  <span className="text-sm font-medium">5 Ad Hooks</span>
                  <span className="text-[10px] text-muted-foreground bg-accent px-2 py-0.5 rounded-full">First 3 seconds</span>
                </div>
                {expanded === "hooks" ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
              {expanded === "hooks" && (
                <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                  {result.hooks.map((hook, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 rounded-lg bg-accent/40 px-3 py-2.5">
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-muted-foreground mt-0.5 shrink-0">#{i + 1}</span>
                        <p className="text-sm leading-relaxed">{hook}</p>
                      </div>
                      <CopyButton text={hook} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section: Captions */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === "captions" ? null : "captions")}
                className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText size={15} className="text-primary" />
                  <span className="text-sm font-medium">4 Platform Captions</span>
                  <span className="text-[10px] text-muted-foreground bg-accent px-2 py-0.5 rounded-full">Instagram · TikTok · LinkedIn</span>
                </div>
                {expanded === "captions" ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
              {expanded === "captions" && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                  {result.captions.map((c, i) => (
                    <div key={i} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium flex items-center gap-1.5">{c.icon} {c.platform}</span>
                        <CopyButton text={`${c.text}\n\n${c.hashtags}`} />
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{c.text}</p>
                      {c.hashtags && <p className="text-xs text-primary/70 mt-2">{c.hashtags}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section: Ad Script */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === "script" ? null : "script")}
                className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Play size={15} className="text-primary" />
                  <span className="text-sm font-medium">30-Second Ad Script</span>
                  <span className="text-[10px] text-muted-foreground bg-accent px-2 py-0.5 rounded-full">Brief-ready</span>
                </div>
                {expanded === "script" ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
              {expanded === "script" && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <div className="flex items-start justify-between gap-3">
                    <pre className="text-xs leading-relaxed whitespace-pre-wrap text-foreground/80 font-mono">{result.adScript}</pre>
                    <CopyButton text={result.adScript} />
                  </div>
                </div>
              )}
            </div>

            {/* Section: Schedule */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === "schedule" ? null : "schedule")}
                className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-primary" />
                  <span className="text-sm font-medium">5-Day Posting Schedule</span>
                  <span className="text-[10px] text-muted-foreground bg-accent px-2 py-0.5 rounded-full">Optimal timing</span>
                </div>
                {expanded === "schedule" ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
              {expanded === "schedule" && (
                <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
                  {result.schedule.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-accent/40 px-3 py-2.5">
                      <div className="shrink-0 text-center">
                        <p className="text-xs font-medium">{s.day}</p>
                        <p className="text-[10px] text-muted-foreground">{s.time}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-primary">{s.platform}</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{s.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 rounded-full" onClick={() => { setStep("form"); setResult(null); }}>
                ← New Campaign
              </Button>
              <Button className="flex-1 rounded-full gap-1.5" onClick={() => {
                const all = `LUMEYA CONTENT ACTIVATION PACK\n\nHOOKS:\n${result.hooks.map((h,i) => `${i+1}. ${h}`).join("\n")}\n\nCAPTIONS:\n${result.captions.map(c => `${c.platform}:\n${c.text}\n${c.hashtags}`).join("\n\n")}\n\nAD SCRIPT:\n${result.adScript}\n\nSCHEDULE:\n${result.schedule.map(s => `${s.day} — ${s.platform} at ${s.time}`).join("\n")}`;
                navigator.clipboard.writeText(all);
                toast.success("Full pack copied to clipboard!");
              }}>
                <Copy size={14} /> Copy Full Pack
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentActivation;
