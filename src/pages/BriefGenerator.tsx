import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileText, Copy, Check, ChevronDown, ChevronUp, Loader2, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Brief {
  title: string;
  objective: string;
  audience: string;
  tone: string[];
  deliverables: { format: string; quantity: number; platform: string; notes: string }[];
  doList: string[];
  dontList: string[];
  timeline: string;
  budget: string;
  hook: string;
  examplePrompt: string;
}

function buildBrief(brand: string, product: string, goal: string, audience: string, budget: string, niche: string): Brief {
  const b = brand || "Your Brand";
  const p = product || "your product";
  const aud = audience || "18-35 year olds interested in " + niche;

  const toneMap: Record<string, string[]> = {
    fashion: ["Aspirational", "Authentic", "Minimal", "Aesthetic"],
    beauty: ["Warm", "Educational", "Glowy", "Real-skin friendly"],
    wellness: ["Calm", "Empowering", "Natural", "Honest"],
    food: ["Joyful", "Appetising", "Casual", "Community-driven"],
    tech: ["Smart", "Clear", "Modern", "Confident"],
    travel: ["Adventurous", "Wanderlust", "Visual", "Inspiring"],
    default: ["Authentic", "Relatable", "On-brand", "Engaging"],
  };

  const deliverableMap: Record<string, Brief["deliverables"]> = {
    "brand awareness": [
      { format: "Short-form video", quantity: 2, platform: "TikTok", notes: "Focus on hook and visual storytelling, 15-30 seconds" },
      { format: "Reel", quantity: 2, platform: "Instagram", notes: "Show product in context of daily life" },
      { format: "Story sequence", quantity: 1, platform: "Instagram", notes: "3-frame story with CTA to link in bio" },
    ],
    "product launch": [
      { format: "Unboxing video", quantity: 1, platform: "TikTok", notes: "Raw, authentic unboxing reaction — no script feel" },
      { format: "Product demo Reel", quantity: 2, platform: "Instagram", notes: "Show key feature/benefit clearly" },
      { format: "Review video", quantity: 1, platform: "TikTok", notes: "Honest first-impression review, 45-60 seconds" },
    ],
    "sales conversion": [
      { format: "Problem/Solution video", quantity: 2, platform: "TikTok", notes: "Pain point in first 3 seconds, product as answer" },
      { format: "Testimonial clip", quantity: 2, platform: "Instagram", notes: "Genuine reaction shot, mention specific benefit" },
      { format: "Ad-ready video", quantity: 1, platform: "Meta Ads", notes: "16:9 and 9:16 versions, no music for ad use" },
    ],
    default: [
      { format: "Lifestyle video", quantity: 2, platform: "TikTok + Instagram", notes: "Natural integration of product in everyday context" },
      { format: "Static photo", quantity: 3, platform: "Instagram", notes: "Clean, well-lit, on-brand aesthetic" },
    ],
  };

  const goalKey = Object.keys(deliverableMap).find(k => goal.toLowerCase().includes(k)) || "default";

  return {
    title: `${b} × Creator Campaign — ${p}`,
    objective: `Drive ${goal || "brand awareness and authentic content"} for ${b}'s ${p}. We want real, unfiltered content that feels native to the platform and resonates with our target audience.`,
    audience: aud,
    tone: toneMap[niche.toLowerCase()] || toneMap.default,
    deliverables: deliverableMap[goalKey],
    doList: [
      "Film in natural light when possible",
      "Show the product being used, not just held",
      "Speak naturally — we prefer unscripted content",
      "Include your genuine reaction or opinion",
      "Ensure brand name is mentioned at least once",
      "Use your own style — don't over-produce",
    ],
    dontList: [
      "Don't use stock music — use trending or original audio",
      "Don't read from a script — it shows",
      "Don't hide or downplay product features",
      "Don't film in dark or cluttered environments",
      "No competitor brand mentions or logos visible",
    ],
    timeline: "Content due within 10 business days of receiving product",
    budget: budget || "To be discussed — please share your rate card",
    hook: `I tried ${p} for 2 weeks and here's what actually happened — no filter, no script.`,
    examplePrompt: `Open with: close-up of ${p} in hand or in use. First words: "${`POV: ${b} just sent me their ${p} and I have thoughts.`}" Then give your honest first impression. End with your genuine recommendation.`,
  };
}

const CopyBtn = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-muted-foreground hover:text-foreground transition-colors p-1">
      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
    </button>
  );
};

const Section = ({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{title}</span>
          {badge && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{badge}</span>}
        </div>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="px-4 pb-4 border-t border-border pt-3">{children}</div>}
    </div>
  );
};

const BriefGenerator = () => {
  const [step, setStep] = useState<"form" | "result">("form");
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [goal, setGoal] = useState("brand awareness");
  const [audience, setAudience] = useState("");
  const [budget, setBudget] = useState("");
  const [niche, setNiche] = useState("fashion");

  const goals = ["Brand Awareness", "Product Launch", "Sales Conversion", "Community Growth", "Seasonal Campaign"];
  const niches = ["Fashion", "Beauty", "Wellness", "Food", "Tech", "Travel", "Fitness", "Home"];

  const generate = async () => {
    if (!brand.trim() || !product.trim()) { toast.error("Brand name and product are required"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    setBrief(buildBrief(brand, product, goal, audience, budget, niche));
    setLoading(false);
    setStep("result");
  };

  const copyAll = () => {
    if (!brief) return;
    const text = `
CREATOR BRIEF — ${brief.title}
================================

OBJECTIVE
${brief.objective}

TARGET AUDIENCE
${brief.audience}

TONE & VIBE
${brief.tone.join(", ")}

DELIVERABLES
${brief.deliverables.map(d => `- ${d.quantity}x ${d.format} for ${d.platform}\n  ${d.notes}`).join("\n")}

DO THIS
${brief.doList.map(d => `✓ ${d}`).join("\n")}

AVOID THIS
${brief.dontList.map(d => `✗ ${d}`).join("\n")}

SUGGESTED HOOK
"${brief.hook}"

EXAMPLE OPENING
${brief.examplePrompt}

TIMELINE
${brief.timeline}

BUDGET
${brief.budget}
    `.trim();
    navigator.clipboard.writeText(text);
    toast.success("Full brief copied!");
  };

  return (
    <div className="container py-16 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-5">
          <FileText size={12} />
          AI Brief Generator
        </div>
        <h1 className="text-4xl font-normal">
          Brief your creator<br />
          <span className="italic text-primary/80">perfectly. Every time.</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          Bad briefs = bad content. Tell us about your campaign and we'll write a complete, professional creator brief in seconds.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Brand Name *</label>
                <Input value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. GlowCo" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Product / Campaign *</label>
                <Input value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. Vitamin C Serum" />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Campaign Goal</label>
              <div className="flex flex-wrap gap-2">
                {goals.map(g => (
                  <button key={g} onClick={() => setGoal(g.toLowerCase())}
                    className={`rounded-full border px-3 py-1 text-xs transition-all ${goal === g.toLowerCase() ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Niche</label>
              <div className="flex flex-wrap gap-2">
                {niches.map(n => (
                  <button key={n} onClick={() => setNiche(n.toLowerCase())}
                    className={`rounded-full border px-3 py-1 text-xs transition-all ${niche === n.toLowerCase() ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Target Audience <span className="normal-case text-muted-foreground/60">(optional)</span></label>
              <Input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. Women 25-35, interested in clean beauty, based in Scandinavia" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Budget Range <span className="normal-case text-muted-foreground/60">(optional)</span></label>
              <Input value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. €200-500 per video" />
            </div>

            <Button className="w-full rounded-full gap-2" size="lg" onClick={generate} disabled={!brand.trim() || !product.trim() || loading}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Writing brief…</> : <><Sparkles size={16} /> Generate Creator Brief</>}
            </Button>
          </motion.div>
        )}

        {step === "result" && brief && (
          <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Header */}
            <div className="rounded-xl bg-primary/5 border border-primary/15 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{brief.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Complete brief ready to send to your creator</p>
              </div>
              <Sparkles size={16} className="text-primary shrink-0" />
            </div>

            <Section title="Objective">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-foreground/80 leading-relaxed">{brief.objective}</p>
                <CopyBtn text={brief.objective} />
              </div>
            </Section>

            <Section title="Target Audience">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-foreground/80">{brief.audience}</p>
                <CopyBtn text={brief.audience} />
              </div>
            </Section>

            <Section title="Tone & Vibe" badge={`${brief.tone.length} descriptors`}>
              <div className="flex flex-wrap gap-2">
                {brief.tone.map(t => <span key={t} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs">{t}</span>)}
              </div>
            </Section>

            <Section title="Deliverables" badge={`${brief.deliverables.reduce((s, d) => s + d.quantity, 0)} pieces`}>
              <div className="space-y-3">
                {brief.deliverables.map((d, i) => (
                  <div key={i} className="rounded-lg bg-accent/50 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{d.quantity}× {d.format}</span>
                      <span className="text-[10px] bg-background border border-border px-2 py-0.5 rounded-full">{d.platform}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{d.notes}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Do This ✓" badge="Guidelines">
              <ul className="space-y-1.5">
                {brief.doList.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                    <Check size={11} className="text-emerald-500 mt-0.5 shrink-0" /> {d}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Avoid This ✗">
              <ul className="space-y-1.5">
                {brief.dontList.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                    <span className="text-red-400 shrink-0 mt-0.5">✗</span> {d}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Suggested Hook">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm italic text-foreground/80">"{brief.hook}"</p>
                <CopyBtn text={brief.hook} />
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Opening guidance:</p>
                <p className="text-xs text-foreground/70 leading-relaxed">{brief.examplePrompt}</p>
              </div>
            </Section>

            <Section title="Timeline & Budget">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Timeline</span>
                  <span className="text-xs">{brief.timeline}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Budget</span>
                  <span className="text-xs">{brief.budget}</span>
                </div>
              </div>
            </Section>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 rounded-full" onClick={() => { setStep("form"); setBrief(null); }}>
                ← New Brief
              </Button>
              <Button className="flex-1 rounded-full gap-1.5" onClick={copyAll}>
                <Copy size={14} /> Copy Full Brief
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">Ready to send directly to your creator 📤</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BriefGenerator;
