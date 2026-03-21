import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, ChevronRight, ChevronLeft, Check, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUPABASE_URL = "https://xbgdynlutmosupfqafap.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZ2R5bmx1dG1vc3VwZnFhZmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDkzODQsImV4cCI6MjA4OTA4NTM4NH0.TFModn0Tm_eZDR9NpDTzxn7Yq1aAiNCc-qSAnMtADys";

type AICreator = {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  style: string;
  niche: string[];
  avatar_url: string;
  sample_images: string[];
  ethnicity: string;
  age_range: string;
  hair: string;
  vibe: string;
  color_palette: string;
};

type UploadedFile = { file: File; preview: string; url?: string };

const STYLE_PRESETS = [
  { key: "product_shot", label: "Product Shot", desc: "Clean, focused on the product" },
  { key: "lifestyle", label: "Lifestyle", desc: "Natural setting, real-life feel" },
  { key: "editorial", label: "Editorial", desc: "High fashion, magazine aesthetic" },
  { key: "ugc_style", label: "UGC Style", desc: "Authentic, creator-feels content" },
];

async function uploadToStorage(file: File, bucket: string): Promise<string | null> {
  const fname = `ai-studio/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "_")}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${fname}`, {
    method: "POST",
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fname}`;
}

function ImageUploadZone({ label, hint, files, onFiles }: {
  label: string; hint: string;
  files: UploadedFile[]; onFiles: (f: UploadedFile[]) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const added = Array.from(e.target.files || []).map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    onFiles([...files, ...added]);
  };
  const remove = (i: number) => onFiles(files.filter((_, idx) => idx !== i));

  return (
    <div>
      <p className="text-xs font-medium mb-1">{label}</p>
      <p className="text-[11px] text-muted-foreground mb-3">{hint}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {files.map((f, i) => (
          <div key={i} className="relative group">
            <img src={f.preview} className="h-20 w-20 rounded-xl object-cover border border-border" />
            <button onClick={() => remove(i)}
              className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={10} />
            </button>
          </div>
        ))}
        <label className="h-20 w-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground cursor-pointer hover:border-primary/40 transition-colors">
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
          <Upload size={16} />
          <span className="text-[10px]">Add</span>
        </label>
      </div>
    </div>
  );
}

export default function AIStudio() {
  const [creators, setCreators] = useState<AICreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<AICreator | null>(null);
  const [stylePreset, setStylePreset] = useState("lifestyle");
  const [productFiles, setProductFiles] = useState<UploadedFile[]>([]);
  const [modelRefFiles, setModelRefFiles] = useState<UploadedFile[]>([]);
  const [settingFiles, setSettingFiles] = useState<UploadedFile[]>([]);
  const [promptNotes, setPromptNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [filterStyle, setFilterStyle] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/ai_creators?select=*&is_active=eq.true&order=name`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    }).then(r => r.json()).then(d => { setCreators(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const filtered = filterStyle ? creators.filter(c => c.style === filterStyle) : creators;

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);

    const uploadAll = async (files: UploadedFile[]) => {
      const urls: string[] = [];
      for (const f of files) {
        const url = await uploadToStorage(f.file, "creator-portfolio");
        if (url) urls.push(url);
      }
      return urls;
    };

    const [productUrls, modelUrls, settingUrls] = await Promise.all([
      uploadAll(productFiles),
      uploadAll(modelRefFiles),
      uploadAll(settingFiles),
    ]);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/ai_generation_jobs`, {
      method: "POST",
      headers: {
        apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`,
        "Content-Type": "application/json", Prefer: "return=representation",
      },
      body: JSON.stringify({
        ai_creator_id: selected.id,
        status: "pending",
        product_images: productUrls,
        model_reference_images: modelUrls,
        setting_images: settingUrls,
        prompt_notes: promptNotes,
        style_preset: stylePreset,
      }),
    });

    const [job] = await res.json();
    setJobId(job?.id || null);
    setStep(4);
    setSubmitting(false);
  };

  const steps = [
    { n: 1, label: "Choose model" },
    { n: 2, label: "Upload inputs" },
    { n: 3, label: "Style & notes" },
    { n: 4, label: "Generate" },
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">AI Studio</p>
          <h1 className="font-display text-4xl md:text-5xl font-normal mb-3">
            AI Creator <em className="text-primary/60">Studio.</em>
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Choose an AI model, upload your product and references — we generate studio-quality content in minutes. No shoots. No scheduling.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`h-7 px-3 rounded-full flex items-center justify-center text-xs font-medium transition-all gap-1 ${step === s.n ? "bg-foreground text-background" : step > s.n ? "bg-emerald-500 text-white" : "bg-accent text-muted-foreground"}`}>
                {step > s.n ? <Check size={11} /> : s.n} <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`h-px w-4 ${step > s.n ? "bg-emerald-500" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

            {/* STEP 1: Choose AI model */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <p className="text-sm font-medium">Filter by style:</p>
                  {["editorial", "lifestyle", "urban", "luxury"].map(s => (
                    <button key={s} onClick={() => setFilterStyle(filterStyle === s ? null : s)}
                      className={`rounded-full px-3 py-1 text-xs border transition-colors capitalize ${filterStyle === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-muted-foreground/60"}`}>
                      {s}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filtered.map(creator => (
                      <motion.button key={creator.id} onClick={() => setSelected(creator)}
                        whileHover={{ y: -2 }} transition={{ duration: 0.15 }}
                        className={`text-left rounded-2xl border overflow-hidden transition-all ${selected?.id === creator.id ? "border-foreground ring-2 ring-foreground/20" : "border-border hover:border-muted-foreground/40"}`}>
                        {/* Photo */}
                        <div className="relative aspect-[3/4] bg-accent">
                          <img src={creator.avatar_url} alt={creator.name} className="w-full h-full object-cover" />
                          {selected?.id === creator.id && (
                            <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-foreground flex items-center justify-center">
                              <Check size={12} className="text-background" />
                            </div>
                          )}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                            <p className="text-white font-medium text-sm">{creator.name}</p>
                            <p className="text-white/70 text-[10px] capitalize">{creator.style}</p>
                          </div>
                        </div>
                        {/* Info */}
                        <div className="p-3">
                          <p className="text-xs text-muted-foreground line-clamp-2">{creator.tagline}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(creator.niche || []).slice(0, 3).map(n => (
                              <span key={n} className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground">{n}</span>
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Sample images for selected */}
                {selected && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-5 rounded-2xl border border-border bg-accent/30">
                    <p className="text-xs font-medium mb-3">Sample outputs from {selected.name}</p>
                    <div className="flex gap-3">
                      {(selected.sample_images || []).map((img, i) => (
                        <img key={i} src={img} className="h-32 w-24 rounded-xl object-cover" />
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
                      <div><span className="text-muted-foreground">Vibe: </span><span>{selected.vibe}</span></div>
                      <div><span className="text-muted-foreground">Age: </span><span>{selected.age_range}</span></div>
                      <div><span className="text-muted-foreground">Hair: </span><span>{selected.hair}</span></div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* STEP 2: Upload inputs */}
            {step === 2 && selected && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-accent/20">
                  <img src={selected.avatar_url} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-sm">{selected.name}</p>
                    <p className="text-xs text-muted-foreground">{selected.tagline}</p>
                  </div>
                </div>

                <ImageUploadZone
                  label="🛍️ Product images *"
                  hint="Upload clear photos of your product — multiple angles if possible. The AI will attach these to the model."
                  files={productFiles} onFiles={setProductFiles}
                />
                <ImageUploadZone
                  label="🧑 Model reference images (optional)"
                  hint="Add inspiration images for how you want the model to look — pose, expression, styling."
                  files={modelRefFiles} onFiles={setModelRefFiles}
                />
                <ImageUploadZone
                  label="🏡 Setting / background images (optional)"
                  hint="Where should the shoot take place? A specific interior, outdoor setting, or aesthetic you want."
                  files={settingFiles} onFiles={setSettingFiles}
                />
              </div>
            )}

            {/* STEP 3: Style & notes */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-4">Choose content style</p>
                  <div className="grid grid-cols-2 gap-3">
                    {STYLE_PRESETS.map(p => (
                      <button key={p.key} onClick={() => setStylePreset(p.key)}
                        className={`text-left rounded-2xl border p-4 transition-all ${stylePreset === p.key ? "border-foreground bg-foreground/5" : "border-border hover:border-muted-foreground/40"}`}>
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium">{p.label}</p>
                          {stylePreset === p.key && <Check size={14} className="text-foreground mt-0.5" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Additional notes (optional)</label>
                  <textarea rows={4} value={promptNotes} onChange={e => setPromptNotes(e.target.value)}
                    placeholder="e.g. 'Show the necklace close up', 'Soft morning light', 'Holding the product naturally', 'Wearing all black outfit'..."
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>

                {/* Summary */}
                <div className="rounded-2xl border border-border p-5 bg-accent/20">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Job summary</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex gap-2"><span className="text-muted-foreground w-32">AI Model</span><span className="font-medium">{selected?.name}</span></div>
                    <div className="flex gap-2"><span className="text-muted-foreground w-32">Style</span><span className="font-medium capitalize">{stylePreset.replace("_", " ")}</span></div>
                    <div className="flex gap-2"><span className="text-muted-foreground w-32">Product images</span><span className="font-medium">{productFiles.length} uploaded</span></div>
                    <div className="flex gap-2"><span className="text-muted-foreground w-32">Model refs</span><span className="font-medium">{modelRefFiles.length} uploaded</span></div>
                    <div className="flex gap-2"><span className="text-muted-foreground w-32">Settings</span><span className="font-medium">{settingFiles.length} uploaded</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Submitted */}
            {step === 4 && (
              <div className="text-center py-10">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
                  <div className="h-20 w-20 rounded-full bg-foreground/5 border-2 border-foreground flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={32} className="text-foreground" />
                  </div>
                  <h2 className="font-display text-3xl mb-3">Job submitted!</h2>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-2">
                    Your AI generation job is queued. {selected?.name} will be rendered with your product references.
                  </p>
                  {jobId && (
                    <p className="text-[11px] text-muted-foreground font-mono mt-2 mb-6">
                      Job ID: {jobId}
                    </p>
                  )}
                  <div className="rounded-2xl border border-border bg-accent/30 p-5 max-w-sm mx-auto text-left mb-6">
                    <p className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">What happens next</p>
                    {[
                      "Your inputs are processed by ComfyUI",
                      "The AI model is placed with your product",
                      "Results delivered to your dashboard",
                      "Download, share or request revisions",
                    ].map((s, i) => (
                      <div key={i} className="flex items-start gap-2.5 mb-2">
                        <span className="h-4 w-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        <p className="text-xs text-muted-foreground">{s}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" className="rounded-full" onClick={() => { setStep(1); setSelected(null); setProductFiles([]); setModelRefFiles([]); setSettingFiles([]); setPromptNotes(""); setJobId(null); }}>
                      New generation
                    </Button>
                    <Button className="rounded-full" onClick={() => window.location.href = "/brand-dashboard"}>
                      Go to dashboard →
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-10">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft size={16} /> Back
              </button>
            ) : <span />}

            <Button onClick={() => {
              if (step === 3) handleSubmit();
              else setStep(s => s + 1);
            }}
              disabled={(step === 1 && !selected) || (step === 2 && productFiles.length === 0) || submitting}
              className="rounded-full gap-1.5">
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> :
                step === 3 ? <><Sparkles size={14} /> Generate content</> : <>Continue <ChevronRight size={14} /></>}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
