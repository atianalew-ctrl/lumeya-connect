import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Upload, Sparkles, X, Shield, Coins, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUPABASE_URL = "https://xbgdynlutmosupfqafap.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZ2R5bmx1dG1vc3VwZnFhZmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDkzODQsImV4cCI6MjA4OTA4NTM4NH0.TFModn0Tm_eZDR9NpDTzxn7Yq1aAiNCc-qSAnMtADys";
const SVC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZ2R5bmx1dG1vc3VwZnFhZmFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUwOTM4NCwiZXhwIjoyMDg5MDg1Mzg0fQ.zfdL0QkL_5nmZeuC-LAsd50-UsAIgqiCsJiDY5rklXs";

type RefPhoto = { file: File; preview: string };

const RESTRICTIONS = [
  "Adult / explicit content",
  "Competitor brands",
  "Alcohol & tobacco",
  "Political content",
  "Weight loss / diet brands",
  "Gambling",
];

export default function AILikeness() {
  const [step, setStep] = useState(0); // 0 = landing
  const [photos, setPhotos] = useState<RefPhoto[]>([]);
  const [aiRate, setAiRate] = useState("");
  const [restrictions, setRestrictions] = useState<string[]>(["Adult / explicit content"]);
  const [creatorName, setCreatorName] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const toggleRestriction = (r: string) =>
    setRestrictions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const added = Array.from(e.target.files || []).slice(0, 10 - photos.length).map(f => ({
      file: f, preview: URL.createObjectURL(f),
    }));
    setPhotos(prev => [...prev, ...added]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const uploadedUrls: string[] = [];
    for (const p of photos) {
      const fname = `ai-likeness/${Date.now()}-${p.file.name.replace(/[^a-z0-9.]/gi, "_")}`;
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/creator-avatars/${fname}`, {
        method: "POST",
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, "Content-Type": p.file.type },
        body: p.file,
      });
      if (res.ok) uploadedUrls.push(`${SUPABASE_URL}/storage/v1/object/public/creator-avatars/${fname}`);
    }

    await fetch(`${SUPABASE_URL}/rest/v1/ai_likeness_applications`, {
      method: "POST",
      headers: { apikey: SVC_KEY, Authorization: `Bearer ${SVC_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        creator_name: creatorName,
        email: creatorEmail,
        instagram: instagramHandle,
        ai_rate: parseFloat(aiRate.replace(",", ".")) || null,
        restrictions,
        reference_photos: uploadedUrls,
        consent_given: agreed,
        status: "pending_review",
      }),
    });

    setDone(true);
    setSubmitting(false);
  };

  // Landing page
  if (step === 0) return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-foreground text-background py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-background/40 mb-6">For Creators</p>
          <h1 className="font-display text-5xl md:text-6xl font-normal mb-6">
            Earn while<br />you sleep.
          </h1>
          <p className="text-background/60 text-lg mb-10 leading-relaxed">
            Let brands use your AI likeness to create content — on your terms, at your rate. You set the rules. You earn every time.
          </p>
          <Button onClick={() => setStep(1)} size="lg"
            className="rounded-full bg-background text-foreground hover:bg-background/90 gap-2 px-8 py-6 text-base">
            Apply now <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground text-center mb-12">How it works</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Upload size={22} />, title: "Upload your references", desc: "Share 5–10 photos of yourself — different angles, lighting, expressions. These train your AI version." },
              { icon: <Shield size={22} />, title: "Set your rules", desc: "Choose which brand categories can use your likeness. You stay in full control of your image." },
              { icon: <Coins size={22} />, title: "Earn per generation", desc: "Set your AI rate. Every time a brand generates content with your likeness, you get paid automatically." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4 text-foreground">{icon}</div>
                <p className="font-medium mb-2">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Numbers */}
      <div className="border-y border-border py-14 px-6">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[["€50–200", "per AI generation"], ["100%", "you control who uses you"], ["0 hrs", "of your time after setup"]].map(([v, l]) => (
            <div key={l}>
              <p className="font-display text-4xl font-light mb-1">{v}</p>
              <p className="text-xs text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-10">Questions</p>
          {[
            { q: "Can I say no to specific brands?", a: "Yes. You choose which categories are off-limits. We enforce it — no brand can use your likeness if you've blocked their category." },
            { q: "Can I opt out at any time?", a: "Absolutely. You can pause or revoke your AI likeness at any time. We delete your reference data within 30 days." },
            { q: "How much will I earn?", a: "You set your own rate per generation. Most creators charge €50–150. Lumeya takes 20% — the rest is yours." },
            { q: "Is this GDPR compliant?", a: "Yes. This is fully opt-in, you control your data, and you can request deletion at any time. Your consent is logged." },
            { q: "What if I don't like a result?", a: "You have the right to flag any output that misrepresents you. We review and remove it within 24 hours." },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-border py-5">
              <p className="font-medium text-sm mb-2">{q}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-accent/40 py-16 px-6 text-center">
        <h2 className="font-display text-3xl mb-4">Ready to earn passively?</h2>
        <p className="text-muted-foreground text-sm mb-8">Takes 5 minutes to set up. You stay in control.</p>
        <Button onClick={() => setStep(1)} className="rounded-full gap-2 px-8 py-5">
          Apply as AI Creator <Sparkles size={14} />
        </Button>
      </div>
    </div>
  );

  // Done state
  if (done) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-emerald-600" />
        </div>
        <h2 className="font-display text-3xl mb-3">Application received!</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          We'll review your application and set up your AI model within 3–5 days. You'll hear from us at <strong>{creatorEmail}</strong>.
        </p>
        <div className="rounded-2xl border border-border bg-accent/20 p-4 text-left text-sm space-y-2 mb-6">
          <div className="flex gap-2"><span className="text-muted-foreground">Your AI rate:</span><span className="font-medium">€{aiRate}/generation</span></div>
          <div className="flex gap-2"><span className="text-muted-foreground">Reference photos:</span><span className="font-medium">{photos.length} uploaded</span></div>
          <div className="flex gap-2"><span className="text-muted-foreground">Restrictions:</span><span className="font-medium">{restrictions.length} categories blocked</span></div>
        </div>
        <Button variant="outline" className="rounded-full" onClick={() => window.location.href = "/creators"}>Browse creators</Button>
      </motion.div>
    </div>
  );

  const steps = [
    { n: 1, label: "About you" },
    { n: 2, label: "Photos" },
    { n: 3, label: "Your terms" },
    { n: 4, label: "Consent" },
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">AI Likeness Program</p>
          <h1 className="font-display text-4xl font-normal">Apply as an AI Creator</h1>
          <p className="text-sm text-muted-foreground mt-2">Set up your AI likeness in 4 quick steps.</p>
        </div>

        {/* Steps */}
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
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>

            {/* Step 1 — About you */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-center mb-6">Who are you?</h2>
                <Input placeholder="Your full name *" value={creatorName} onChange={e => setCreatorName(e.target.value)} />
                <Input type="email" placeholder="Email address *" value={creatorEmail} onChange={e => setCreatorEmail(e.target.value)} />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                  <Input placeholder="Instagram handle" value={instagramHandle} onChange={e => setInstagramHandle(e.target.value)} className="pl-7" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-2">Your AI rate per generation (€)</label>
                  <Input placeholder="e.g. 75" value={aiRate} onChange={e => setAiRate(e.target.value)} inputMode="decimal" />
                  <p className="text-[11px] text-muted-foreground mt-1.5">This is what brands pay each time your likeness is used. Lumeya takes 20%, you keep 80%.</p>
                </div>
              </div>
            )}

            {/* Step 2 — Reference photos */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-medium text-center mb-2">Upload reference photos</h2>
                <p className="text-sm text-muted-foreground text-center mb-6">Upload 5–10 photos of yourself. Different angles, lighting, and expressions give the best results.</p>

                <div className="flex flex-wrap gap-3 mb-4">
                  {photos.map((p, i) => (
                    <div key={i} className="relative group">
                      <img src={p.preview} className="h-24 w-24 rounded-2xl object-cover border border-border" />
                      <button onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {photos.length < 10 && (
                    <label className="h-24 w-24 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground cursor-pointer hover:border-primary/40 transition-colors">
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
                      <Upload size={18} />
                      <span className="text-[10px]">Add photos</span>
                    </label>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground">{photos.length}/10 photos — {photos.length < 5 ? `add at least ${5 - photos.length} more` : "✓ good to go"}</p>

                <div className="mt-6 rounded-2xl bg-accent/40 p-4 space-y-2">
                  <p className="text-xs font-medium">Tips for best results:</p>
                  {["Clear face — no sunglasses or heavy filters", "Mix of close-up and 3/4 shots", "Different outfits and backgrounds", "Natural lighting works best"].map(t => (
                    <div key={t} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check size={11} className="text-emerald-500 shrink-0" /> {t}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 — Restrictions */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-medium text-center mb-2">Set your boundaries</h2>
                <p className="text-sm text-muted-foreground text-center mb-6">Block any category you don't want your likeness used for. We enforce this — automatically.</p>

                <div className="space-y-2 mb-6">
                  {RESTRICTIONS.map(r => {
                    const blocked = restrictions.includes(r);
                    return (
                      <button key={r} onClick={() => toggleRestriction(r)}
                        className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 transition-all text-left ${blocked ? "border-red-200 bg-red-50" : "border-border hover:border-muted-foreground/40"}`}>
                        <span className="text-sm">{r}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${blocked ? "bg-red-100 text-red-600" : "bg-accent text-muted-foreground"}`}>
                          {blocked ? "Blocked" : "Allowed"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-border p-4 text-sm">
                  <p className="font-medium mb-1">Want to add a custom restriction?</p>
                  <p className="text-xs text-muted-foreground">Email us at creators@lumeya.com after applying and we'll add it to your profile.</p>
                </div>
              </div>
            )}

            {/* Step 4 — Consent */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-medium text-center mb-6">Review & consent</h2>

                <div className="rounded-2xl border border-border p-5 space-y-3 mb-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Your application summary</p>
                  <div className="text-sm space-y-2">
                    <div className="flex gap-3"><span className="text-muted-foreground w-36">Name</span><span className="font-medium">{creatorName}</span></div>
                    <div className="flex gap-3"><span className="text-muted-foreground w-36">Instagram</span><span className="font-medium">{instagramHandle ? `@${instagramHandle}` : "—"}</span></div>
                    <div className="flex gap-3"><span className="text-muted-foreground w-36">AI rate</span><span className="font-medium">€{aiRate}/generation</span></div>
                    <div className="flex gap-3"><span className="text-muted-foreground w-36">You earn (80%)</span><span className="font-medium text-emerald-600">€{(parseFloat(aiRate || "0") * 0.8).toFixed(0)}/generation</span></div>
                    <div className="flex gap-3"><span className="text-muted-foreground w-36">Reference photos</span><span className="font-medium">{photos.length} uploaded</span></div>
                    <div className="flex gap-3"><span className="text-muted-foreground w-36">Blocked categories</span><span className="font-medium">{restrictions.length}</span></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 mb-6">
                  <p className="text-xs font-medium text-amber-800 mb-2">By applying you agree that:</p>
                  {[
                    "You own the rights to all photos you upload",
                    "Lumeya may use your reference images to train your AI likeness",
                    "Brands within your approved categories may use your AI likeness",
                    "You can revoke consent and request data deletion at any time",
                    "Lumeya takes 20% commission on each generation",
                  ].map(t => (
                    <div key={t} className="flex items-start gap-2 text-xs text-amber-700 mb-1.5">
                      <Check size={11} className="text-amber-600 shrink-0 mt-0.5" /> {t}
                    </div>
                  ))}
                </div>

                <button onClick={() => setAgreed(!agreed)}
                  className={`w-full flex items-center gap-3 rounded-xl border p-4 transition-all text-left ${agreed ? "border-foreground bg-foreground/5" : "border-border hover:border-muted-foreground/40"}`}>
                  <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${agreed ? "bg-foreground border-foreground" : "border-muted-foreground/40"}`}>
                    {agreed && <Check size={12} className="text-background" />}
                  </div>
                  <span className="text-sm">I understand and consent to the above terms</span>
                </button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button onClick={() => setStep(s => s <= 1 ? 0 : s - 1)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={16} /> Back
          </button>

          <Button onClick={() => { if (step === 4) handleSubmit(); else setStep(s => s + 1); }}
            disabled={
              (step === 1 && (!creatorName || !creatorEmail || !aiRate)) ||
              (step === 2 && photos.length < 5) ||
              (step === 4 && (!agreed || submitting))
            }
            className="rounded-full gap-1.5">
            {submitting ? "Submitting..." :
              step === 4 ? <><Sparkles size={14} /> Submit application</> :
              <>Continue <ChevronRight size={14} /></>}
          </Button>
        </div>
      </div>
    </div>
  );
}
