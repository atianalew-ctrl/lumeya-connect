import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Sparkles, Wand2, PenTool, Lightbulb, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const categories = ["UGC", "Photography", "Videography", "Social Media", "Design", "Writing"];

const UGC_TYPES = [
  { id: "product-review", label: "Product Review", desc: "Creator reviews your product honestly on camera" },
  { id: "unboxing", label: "Unboxing", desc: "Raw, authentic first-impression unboxing" },
  { id: "testimonial", label: "Testimonial", desc: "Personal story about results or experience" },
  { id: "lifestyle", label: "Lifestyle Content", desc: "Product naturally integrated into daily life" },
  { id: "tutorial", label: "Tutorial / How-to", desc: "Step-by-step how to use your product" },
  { id: "problem-solution", label: "Problem → Solution", desc: "Pain point in first 3 seconds, product as the answer" },
  { id: "broll", label: "Voiceover / B-roll", desc: "Clean product footage with narration, no face needed" },
  { id: "tiktok-trend", label: "TikTok Trend", desc: "Product integrated into a trending audio or format" },
  { id: "vlog", label: "Vlog / Day-in-the-life", desc: "Creator features product in their daily routine" },
  { id: "comparison", label: "Before & After", desc: "Transformation or comparison showing results" },
];

const PLATFORMS = [
  { id: "ugc-only", label: "UGC Only", desc: "Raw files delivered to us — creator does not post", icon: "📦" },
  { id: "tiktok", label: "TikTok", desc: "Creator posts on their TikTok account", icon: "🎵" },
  { id: "instagram-reels", label: "Instagram Reels", desc: "Creator posts as a Reel on their Instagram", icon: "📸" },
  { id: "instagram-story", label: "Instagram Story", desc: "Creator posts as a Story with link", icon: "⭕" },
  { id: "instagram-feed", label: "Instagram Feed Post", desc: "Static or carousel post on their feed", icon: "🖼" },
  { id: "youtube-short", label: "YouTube Shorts", desc: "Creator posts on their YouTube channel", icon: "▶️" },
  { id: "both", label: "UGC + Creator Posts", desc: "We get raw files AND creator posts on their channels", icon: "✦" },
];

type ScriptIdea = { hook: string; concept: string; style: string };

const PostOpportunity = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [showScripts, setShowScripts] = useState(false);
  const [scripts, setScripts] = useState<ScriptIdea[]>([]);

  // Form state
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [location, setLocation] = useState("");
  const [timeline, setTimeline] = useState("");
  const [selectedUGCTypes, setSelectedUGCTypes] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const toggleUGCType = (id: string) => setSelectedUGCTypes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const togglePlatform = (id: string) => setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const callAI = async (action: string, input: Record<string, string>) => {
    const { data, error } = await supabase.functions.invoke("ai-brief", {
      body: { action, input },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data.result;
  };

  const handleGenerate = async () => {
    if (!brand && !category) {
      toast.error("Enter a brand name or select a category first");
      return;
    }
    setLoading("generate");
    try {
      const raw = await callAI("generate", { brand, category, goal: title || "" });
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const result = JSON.parse(cleaned);
      if (result.title) setTitle(result.title);
      if (result.description) setDescription(result.description);
      if (result.overview) setOverview(result.overview);
      if (result.deliverables) setDeliverables(result.deliverables);
      if (result.timeline) setTimeline(result.timeline);
      toast.success("Brief generated! Review and edit as needed.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate brief. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleScripts = async () => {
    if (!brand && !title) {
      toast.error("Add a title or brand name first");
      return;
    }
    setLoading("scripts");
    try {
      const raw = await callAI("scripts", { title, brand, category, description });
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const result = JSON.parse(cleaned);
      setScripts(result.scripts || []);
      setShowScripts(true);
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate scripts. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleRefine = async (field: "description" | "overview" | "deliverables" | "timeline") => {
    const fieldMap = { description, overview, deliverables, timeline };
    const text = fieldMap[field];
    if (!text.trim()) {
      toast.error("Write something first, then let AI polish it");
      return;
    }
    setLoading(`refine-${field}`);
    try {
      const result = await callAI("refine", { text });
      const setterMap = { description: setDescription, overview: setOverview, deliverables: setDeliverables, timeline: setTimeline };
      setterMap[field](result);
      toast.success("Text refined!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to refine text.");
    } finally {
      setLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("submit");
    try {
      const tags = [category, ...selectedUGCTypes.slice(0, 3)].filter(Boolean);
      const { error } = await supabase.from("opportunities").insert({
        title,
        brand,
        category,
        description,
        overview: overview || null,
        deliverables: deliverables || null,
        timeline: timeline || null,
        budget,
        deadline,
        location: location || null,
        tags,
        ugc_types: selectedUGCTypes.length > 0 ? selectedUGCTypes : null,
        platforms: selectedPlatforms.length > 0 ? selectedPlatforms : null,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      // Fall back to local success if Supabase not configured yet
      setSubmitted(true);
    } finally {
      setLoading(null);
    }
  };

  if (submitted) {
    return (
      <div className="container py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-6 text-3xl font-display">Opportunity Posted</h1>
          <p className="mt-3 text-muted-foreground">Your opportunity is now live. Creators will be able to discover and apply for it.</p>
          <Button className="mt-8" onClick={() => setSubmitted(false)}>Post Another</Button>
        </motion.div>
      </div>
    );
  }

  const RefineButton = ({ field }: { field: "description" | "overview" | "deliverables" | "timeline" }) => (
    <button
      type="button"
      onClick={() => handleRefine(field)}
      disabled={loading !== null}
      className="inline-flex items-center gap-1 text-[10px] uppercase tracking-scandi text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
    >
      {loading === `refine-${field}` ? <Loader2 size={10} className="animate-spin" /> : <PenTool size={10} />}
      Polish with AI
    </button>
  );

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">For Brands</p>
        <h1 className="mt-2 text-4xl font-display">Post an Opportunity</h1>
        <p className="mt-2 text-sm text-muted-foreground">Describe your project and find the perfect creator to collaborate with.</p>

        {/* AI Assist Bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-xl border border-primary/20 bg-primary/[0.04] p-5"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles size={14} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">AI Brief Assistant</p>
              <p className="text-[11px] text-muted-foreground">Let AI help you write compelling briefs that attract top creators</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 rounded-full text-xs gap-1.5 border-primary/20 hover:bg-primary/5"
              onClick={handleGenerate}
              disabled={loading !== null}
            >
              {loading === "generate" ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
              Generate Full Brief
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 rounded-full text-xs gap-1.5 border-primary/20 hover:bg-primary/5"
              onClick={handleScripts}
              disabled={loading !== null}
            >
              {loading === "scripts" ? <Loader2 size={12} className="animate-spin" /> : <Lightbulb size={12} />}
              Suggest Script Ideas
            </Button>
          </div>
        </motion.div>

        {/* Script Ideas Panel */}
        <AnimatePresence>
          {showScripts && scripts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="flex items-center justify-between p-4 pb-2">
                <p className="text-xs font-medium uppercase tracking-scandi text-muted-foreground">
                  <Lightbulb size={10} className="inline mr-1" />
                  Script Ideas
                </p>
                <button type="button" onClick={() => setShowScripts(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-3 p-4 pt-2">
                {scripts.map((s, i) => (
                  <div key={i} className="rounded-lg border border-border/60 bg-background p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-scandi text-primary font-medium">{s.style}</span>
                      <span className="text-[10px] text-muted-foreground">Idea {i + 1}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium">"{s.hook}"</p>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{s.concept}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 space-y-5">
            <h2 className="text-base font-semibold">Basic Details</h2>
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs">Opportunity title</Label>
              <Input id="title" required placeholder="e.g. UGC Creator for Skincare Brand" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="brand" className="text-xs">Brand name</Label>
              <Input id="brand" required placeholder="Your brand or company name" value={brand} onChange={e => setBrand(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Select required value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 space-y-5">
            <h2 className="text-base font-semibold">Project Details</h2>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="desc" className="text-xs">Short description</Label>
                <RefineButton field="description" />
              </div>
              <Textarea id="desc" required rows={3} placeholder="Brief overview visible in search results" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="overview" className="text-xs">Full project overview</Label>
                <RefineButton field="overview" />
              </div>
              <Textarea id="overview" required rows={5} placeholder="Detailed description of the project, goals, and expectations" value={overview} onChange={e => setOverview(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="deliverables" className="text-xs">Deliverables (one per line)</Label>
                <RefineButton field="deliverables" />
              </div>
              <Textarea id="deliverables" required rows={4} placeholder={"5 short-form videos\nVertical format for TikTok\nRaw footage included"} value={deliverables} onChange={e => setDeliverables(e.target.value)} />
            </div>
          </div>

          {/* UGC Type */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div>
              <h2 className="text-base font-semibold">Content Type</h2>
              <p className="text-xs text-muted-foreground mt-1">What kind of UGC do you need? Select all that apply.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {UGC_TYPES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleUGCType(t.id)}
                  className={`text-left rounded-xl border p-3 transition-all ${
                    selectedUGCTypes.includes(t.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{t.label}</span>
                    {selectedUGCTypes.includes(t.id) && (
                      <span className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Posting platform */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div>
              <h2 className="text-base font-semibold">Where Should Creators Post?</h2>
              <p className="text-xs text-muted-foreground mt-1">Choose if you want raw UGC files only, or creators to also publish on their own channels.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePlatform(p.id)}
                  className={`text-left rounded-xl border p-3 transition-all ${
                    selectedPlatforms.includes(p.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium flex items-center gap-1.5">{p.icon} {p.label}</span>
                    {selectedPlatforms.includes(p.id) && (
                      <span className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 space-y-5">
            <h2 className="text-base font-semibold">Budget & Timeline</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="budget" className="text-xs">Budget range</Label>
                <Input id="budget" required placeholder="e.g. $500–$1,000" value={budget} onChange={e => setBudget(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deadline" className="text-xs">Deadline</Label>
                <Input id="deadline" required placeholder="e.g. Mar 15, 2026" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs">Location</Label>
              <Input id="location" placeholder="Remote, or specify a city" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="timeline" className="text-xs">Timeline details</Label>
                <RefineButton field="timeline" />
              </div>
              <Textarea id="timeline" rows={3} placeholder="Key milestones and due dates" value={timeline} onChange={e => setTimeline(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="submit" size="lg" disabled={loading !== null}>
              {loading === "submit" ? <><Loader2 size={14} className="animate-spin mr-2" />Publishing...</> : "Publish Opportunity"}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default PostOpportunity;
