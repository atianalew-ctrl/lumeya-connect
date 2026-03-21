import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronRight, ChevronLeft, Upload, Instagram } from "lucide-react";

const SUPABASE_URL = "https://xbgdynlutmosupfqafap.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZ2R5bmx1dG1vc3VwZnFhZmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDkzODQsImV4cCI6MjA4OTA4NTM4NH0.TFModn0Tm_eZDR9NpDTzxn7Yq1aAiNCc-qSAnMtADys";
const SVC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZ2R5bmx1dG1vc3VwZnFhZmFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUwOTM4NCwiZXhwIjoyMDg5MDg1Mzg0fQ.zfdL0QkL_5nmZeuC-LAsd50-UsAIgqiCsJiDY5rklXs";

const REGIONS = ["Scandinavia", "Europe", "North America", "Latin America", "Asia Pacific", "Southeast Asia", "Middle East", "Africa", "Global"];
const CONTENT_TYPES = ["Product Review", "Product Demo", "Testimonial", "Unboxing", "Lifestyle Content", "Problem → Solution Ad", "Voiceover / B-roll", "Vlog / Day-in-the-life", "TikTok Trend / Social Trend", "Social Media Management", "Personal Profile Post"];
const NICHES = ["Fashion", "Beauty", "Skincare", "Fitness", "Food", "Travel", "Lifestyle", "Tech", "Gaming", "Parenting", "Finance", "Wellness", "Luxury", "Sustainability"];

type CreatorType = "ugc" | "influencer" | "both";

export default function CreatorSignup() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    display_name: "",
    tagline: "",
    bio: "",
    location: "",
    country: "",
    region: "Europe",
    instagram: "",
    tiktok: "",
    followers: "",
    tiktok_followers: "",
    engagement_rate: "",
    rates: "",
    creator_type: "" as CreatorType | "",
    tags: [] as string[],
    content_types: [] as string[],
    available_for_remote: true,
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const toggleArr = (k: string, v: string) => {
    const arr = (form as any)[k] as string[];
    set(k, arr.includes(v) ? arr.filter((x: string) => x !== v) : [...arr, v]);
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    const r = new FileReader();
    r.onload = ev => setAvatarPreview(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let avatarUrl = null;
      if (avatarFile) {
        const fname = `creator-signup/${Date.now()}-${avatarFile.name.replace(/[^a-z0-9.]/gi, "_")}`;
        const res = await fetch(`${SUPABASE_URL}/storage/v1/object/creator-avatars/${fname}`, {
          method: "POST",
          headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, "Content-Type": avatarFile.type },
          body: avatarFile,
        });
        if (res.ok) avatarUrl = `${SUPABASE_URL}/storage/v1/object/public/creator-avatars/${fname}`;
      }

      const payload = {
        display_name: form.display_name,
        tagline: form.tagline,
        bio: form.bio,
        location: form.location,
        country: form.country,
        region: form.region,
        instagram: form.instagram,
        tiktok: form.tiktok,
        followers: parseInt(form.followers.replace(/[^0-9]/g, "")) || 0,
        tiktok_followers: parseInt(form.tiktok_followers.replace(/[^0-9]/g, "")) || 0,
        engagement_rate: parseFloat(form.engagement_rate.replace(",", ".")) || null,
        rates: form.rates,
        creator_type: form.creator_type || "ugc",
        tags: form.tags,
        content_types: form.content_types,
        available_for_remote: form.available_for_remote,
        avatar_url: avatarUrl,
        rating: 5.0,
        is_verified: false,
        availability: "available",
      };

      await fetch(`${SUPABASE_URL}/rest/v1/lumeya_creators`, {
        method: "POST",
        headers: { apikey: SVC_KEY, Authorization: `Bearer ${SVC_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify(payload),
      });
      setDone(true);
    } catch { setSubmitting(false); }
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-emerald-600" />
        </div>
        <h2 className="font-display text-3xl mb-3">You're on Lumeya.</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          Your profile has been submitted for review. We'll reach out within 48 hours once you're live on the platform.
        </p>
        <Button variant="outline" className="rounded-full" onClick={() => window.location.href = "/creators"}>
          Browse creators
        </Button>
      </motion.div>
    </div>
  );

  const steps = [
    { n: 1, label: "Type" },
    { n: 2, label: "Profile" },
    { n: 3, label: "Socials" },
    { n: 4, label: "Content" },
    { n: 5, label: "Submit" },
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">Join Lumeya</p>
          <h1 className="font-display text-4xl font-normal">Apply as a Creator</h1>
          <p className="text-sm text-muted-foreground mt-2">Free to join. Get discovered by top brands.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${step === s.n ? "bg-foreground text-background" : step > s.n ? "bg-emerald-500 text-white" : "bg-accent text-muted-foreground"}`}>
                {step > s.n ? <Check size={12} /> : s.n}
              </div>
              {i < steps.length - 1 && <div className={`h-px w-6 ${step > s.n ? "bg-emerald-500" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

            {/* STEP 1: Creator type */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-center mb-6">What kind of creator are you?</h2>
                <p className="text-xs text-muted-foreground text-center -mt-4 mb-6">Choose one or both — this determines where brands can find you.</p>

                {[
                  { type: "ugc" as CreatorType, title: "UGC Creator", sub: "I create content for brands (videos, photos, ads). My follower count doesn't matter — my content quality does.", emoji: "🎬" },
                  { type: "influencer" as CreatorType, title: "Influencer", sub: "I post to my own audience. Brands pay for my reach and trust with my followers.", emoji: "📣" },
                  { type: "both" as CreatorType, title: "Both", sub: "I do both — I create content AND have an engaged audience brands can reach.", emoji: "⚡" },
                ].map(opt => (
                  <button key={opt.type} type="button" onClick={() => set("creator_type", opt.type)}
                    className={`w-full text-left rounded-2xl border p-5 transition-all ${form.creator_type === opt.type ? "border-foreground bg-foreground/5" : "border-border hover:border-muted-foreground/40"}`}>
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">{opt.emoji}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{opt.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{opt.sub}</p>
                      </div>
                      {form.creator_type === opt.type && (
                        <div className="h-5 w-5 rounded-full bg-foreground flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={11} className="text-background" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 2: Profile */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-center mb-6">Tell us about yourself</h2>

                {/* Avatar */}
                <div className="flex justify-center mb-2">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                    {avatarPreview ? (
                      <img src={avatarPreview} className="h-24 w-24 rounded-full object-cover border-4 border-border hover:border-primary/40 transition-colors" />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-accent border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/40 transition-colors">
                        <Upload size={18} />
                        <span className="text-[10px]">Photo</span>
                      </div>
                    )}
                  </label>
                </div>

                <Input placeholder="Your full name *" value={form.display_name} onChange={e => set("display_name", e.target.value)} />
                <Input placeholder="One-line tagline (e.g. 'Minimalist UGC for beauty brands')" value={form.tagline} onChange={e => set("tagline", e.target.value)} />
                <textarea rows={3} placeholder="Bio — tell brands what makes you unique..." value={form.bio}
                  onChange={e => set("bio", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="City (e.g. Copenhagen)" value={form.location} onChange={e => set("location", e.target.value)} />
                  <Input placeholder="Country" value={form.country} onChange={e => set("country", e.target.value)} />
                </div>
                <select value={form.region} onChange={e => set("region", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            )}

            {/* STEP 3: Socials */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-center mb-6">Your social channels</h2>

                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                    <Input placeholder="Instagram handle" value={form.instagram} onChange={e => set("instagram", e.target.value)} className="pl-7" />
                  </div>
                  {(form.creator_type === "influencer" || form.creator_type === "both") && (
                    <Input placeholder="IG Followers (e.g. 25000)" value={form.followers} onChange={e => set("followers", e.target.value)} inputMode="numeric" />
                  )}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                    <Input placeholder="TikTok handle (optional)" value={form.tiktok} onChange={e => set("tiktok", e.target.value)} className="pl-7" />
                  </div>
                  {(form.creator_type === "influencer" || form.creator_type === "both") && (
                    <Input placeholder="TikTok Followers (e.g. 44500)" value={form.tiktok_followers} onChange={e => set("tiktok_followers", e.target.value)} inputMode="numeric" />
                  )}
                  {(form.creator_type === "influencer" || form.creator_type === "both") && (
                    <Input placeholder="Engagement rate % (e.g. 4.5)" value={form.engagement_rate} onChange={e => set("engagement_rate", e.target.value)} inputMode="decimal" />
                  )}
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-2">Starting rate (e.g. €200/video)</label>
                  <Input placeholder="€200/video" value={form.rates} onChange={e => set("rates", e.target.value)} />
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => set("available_for_remote", !form.available_for_remote)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.available_for_remote ? "bg-primary" : "bg-muted-foreground/30"}`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.available_for_remote ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <label className="text-sm text-muted-foreground">Available for remote work</label>
                </div>
              </div>
            )}

            {/* STEP 4: Content types + niches */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-center mb-2">What do you create?</h2>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Content types</p>
                  <div className="flex flex-wrap gap-2">
                    {CONTENT_TYPES.map(t => (
                      <button key={t} type="button" onClick={() => toggleArr("content_types", t)}
                        className={`rounded-full px-3 py-1.5 text-xs border transition-all ${form.content_types.includes(t) ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-muted-foreground/60"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Niches / tags</p>
                  <div className="flex flex-wrap gap-2">
                    {NICHES.map(n => (
                      <button key={n} type="button" onClick={() => toggleArr("tags", n)}
                        className={`rounded-full px-3 py-1.5 text-xs border transition-all ${form.tags.includes(n) ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-muted-foreground/60"}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Review + submit */}
            {step === 5 && (
              <div className="space-y-5">
                <h2 className="text-xl font-medium text-center mb-6">Almost there!</h2>

                <div className="rounded-2xl border border-border p-5 space-y-3">
                  {avatarPreview && <img src={avatarPreview} className="h-16 w-16 rounded-full object-cover mx-auto" />}
                  <div className="text-center">
                    <p className="font-medium">{form.display_name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{form.tagline}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border">
                    <div><span className="text-muted-foreground">Type: </span><span className="font-medium capitalize">{form.creator_type || "—"}</span></div>
                    <div><span className="text-muted-foreground">Location: </span><span className="font-medium">{form.location}{form.country ? `, ${form.country}` : ""}</span></div>
                    {form.instagram && <div><span className="text-muted-foreground">IG: </span><span className="font-medium">@{form.instagram}</span></div>}
                    {form.tiktok && <div><span className="text-muted-foreground">TikTok: </span><span className="font-medium">@{form.tiktok}</span></div>}
                    {form.rates && <div><span className="text-muted-foreground">Rate: </span><span className="font-medium">{form.rates}</span></div>}
                  </div>
                  {form.content_types.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                      {form.content_types.map(t => <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>)}
                    </div>
                  )}
                </div>

                <Button className="w-full rounded-full" onClick={handleSubmit} disabled={!form.display_name || !form.creator_type || submitting}>
                  {submitting ? "Submitting..." : "Submit application →"}
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">Your profile will be reviewed before going live. Usually within 48h.</p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft size={16} /> Back
            </button>
          ) : <span />}

          {step < 5 && (
            <Button onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !form.creator_type}
              className="rounded-full gap-1.5">
              Continue <ChevronRight size={14} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
