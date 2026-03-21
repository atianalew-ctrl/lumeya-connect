import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Save, Upload, Loader2, Users, Star, Instagram, ImageIcon, Video, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const REGIONS = ["Scandinavia", "Europe", "North America", "Latin America", "Asia Pacific", "Southeast Asia", "Middle East", "Africa", "Global"];
const LANGUAGES = ["English", "Danish", "Swedish", "Norwegian", "French", "German", "Spanish", "Italian", "Dutch", "Portuguese", "Japanese", "Korean", "Arabic", "Chinese"];
const UGC_TYPES = ["Product Review", "Product Demo", "Testimonial", "Unboxing", "Lifestyle Content", "Problem → Solution Ad", "Voiceover / B-roll", "Vlog / Day-in-the-life", "TikTok Trend / Social Trend", "Social Media Management"];

const GRADIENTS = [
  { label: "Violet Pink", value: "from-violet-200 to-pink-100" },
  { label: "Rose Pink", value: "from-pink-300 to-rose-200" },
  { label: "Amber Orange", value: "from-amber-200 to-orange-200" },
  { label: "Emerald Teal", value: "from-emerald-200 to-teal-200" },
  { label: "Cyan Blue", value: "from-cyan-200 to-blue-200" },
  { label: "Violet Indigo", value: "from-violet-200 to-indigo-200" },
  { label: "Sky Cyan", value: "from-sky-200 to-cyan-200" },
  { label: "Yellow Amber", value: "from-yellow-200 to-amber-200" },
  { label: "Rose Gold", value: "from-rose-100 to-pink-200" },
  { label: "Mint Green", value: "from-green-100 to-emerald-200" },
];

type Creator = {
  id: string;
  display_name: string;
  tagline: string;
  location: string;
  country?: string;
  region?: string;
  languages?: string[];
  content_types?: string[];
  available_for_remote?: boolean;
  followers?: number;
  engagement_rate?: number;
  bio: string;
  instagram: string;
  tiktok?: string;
  rates: string;
  tags: string[];
  avatar_url: string | null;
  portfolio_images?: string[];
  video_url?: string | null;
  video_urls?: string[];
  videos_meta?: { caption?: string; collab?: string }[];
  brands?: string[];
  color?: string;
  is_verified?: boolean;
  is_trending?: boolean;
  availability?: string;
  response_time?: string;
  packages?: { name: string; price: string; desc: string }[];
  rating: number;
  created_at?: string;
};

const EMPTY: Omit<Creator, "id" | "created_at"> = {
  display_name: "", tagline: "UGC Creator", location: "", bio: "",
  country: "", region: "Europe", languages: ["English"], content_types: [],
  available_for_remote: true, followers: 0, engagement_rate: 5.0,
  instagram: "", tiktok: "", rates: "", tags: [], avatar_url: null,
  portfolio_images: [], video_url: null, video_urls: [], videos_meta: [], brands: [], color: "from-violet-200 to-pink-100",
  is_verified: false, is_trending: false, availability: "available", response_time: "Same day",
  packages: [
    { name: "Basic", price: "", desc: "" },
    { name: "Standard", price: "", desc: "" },
    { name: "Premium", price: "", desc: "" },
  ],
  rating: 5.0,
};

// Call admin edge function (for DB operations only)
const api = async (action: string, data?: object, id?: string) => {
  const { data: result, error } = await supabase.functions.invoke("admin-creators", { body: { action, data, id } });
  if (error) throw error;
  if (!result?.ok) throw new Error(result?.error || "Error");
  return result;
};

// Upload directly from browser to Supabase Storage
const uploadFile = async (file: File, bucket: string): Promise<string> => {
  const ext = file.name.split(".").pop() || "bin";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(filename, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;
};

const CreatorForm = ({ initial, onSave, onCancel }: {
  initial: Omit<Creator, "id" | "created_at">;
  onSave: (d: Omit<Creator, "id" | "created_at">) => Promise<void>;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [tagInput, setTagInput] = useState(initial.tags?.join(", ") || "");
  const [brandInput, setBrandInput] = useState("");
  const avatarRef = useRef<HTMLInputElement>(null);
  const portfolioRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const videosRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleAvatar = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const url = await uploadFile(file, "creator-avatars");
      set("avatar_url", url);
      toast.success("Profile photo uploaded! ✓");
    } catch { toast.error("Upload failed."); }
    finally { setUploadingAvatar(false); }
  };

  const handlePortfolio = async (files: FileList) => {
    setUploadingPortfolio(true);
    try {
      const current = form.portfolio_images || [];
      const toUpload = Array.from(files).slice(0, 6 - current.length);
      const urls = await Promise.all(toUpload.map(f => uploadFile(f, "creator-portfolio")));
      set("portfolio_images", [...current, ...urls]);
      toast.success(`${urls.length} photo${urls.length > 1 ? "s" : ""} uploaded! ✓`);
    } catch { toast.error("Upload failed."); }
    finally { setUploadingPortfolio(false); }
  };

  const handleVideo = async (file: File) => {
    setUploadingVideo(true);
    try {
      const url = await uploadFile(file, "creator-videos");
      set("video_url", url);
      toast.success("Video uploaded! ✓");
    } catch { toast.error("Video upload failed."); }
    finally { setUploadingVideo(false); }
  };

  const handleVideos = async (files: FileList) => {
    setUploadingVideo(true);
    try {
      const current = form.video_urls || [];
      const currentMeta = form.videos_meta || [];
      const toUpload = Array.from(files).slice(0, 9 - current.length);
      const urls = await Promise.all(toUpload.map(f => uploadFile(f, "creator-videos")));
      set("video_urls", [...current, ...urls]);
      set("videos_meta", [...currentMeta, ...urls.map(() => ({ caption: "", collab: "" }))]);
      toast.success(`${urls.length} video${urls.length > 1 ? "s" : ""} uploaded! ✓`);
    } catch { toast.error("Video upload failed."); }
    finally { setUploadingVideo(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave({ ...form, tags: tagInput.split(",").map(t => t.trim()).filter(Boolean) }); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Profile photo + name */}
      <div className="flex items-start gap-4">
        <div
          className="relative w-28 h-28 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/40 transition-colors bg-muted/30 flex-shrink-0"
          onClick={() => avatarRef.current?.click()}
        >
          {form.avatar_url
            ? <img src={form.avatar_url} alt="" className="w-full h-full object-cover" />
            : uploadingAvatar
              ? <Loader2 size={22} className="animate-spin text-muted-foreground" />
              : <div className="text-center p-2"><ImageIcon size={20} className="mx-auto text-muted-foreground mb-1" /><p className="text-[10px] text-muted-foreground">Profile photo</p></div>
          }
          {form.avatar_url && !uploadingAvatar && (
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <Upload size={16} className="text-white" />
              <p className="text-[10px] text-white">Change</p>
            </div>
          )}
        </div>
        <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleAvatar(e.target.files[0])} />

        <div className="flex-1 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Full name *</label>
            <Input required placeholder="e.g. Nelly Hansen" value={form.display_name} onChange={e => set("display_name", e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Role / tagline</label>
            <Input placeholder="UGC Creator" value={form.tagline} onChange={e => set("tagline", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Portfolio photos */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-muted-foreground uppercase tracking-widest">
            Portfolio Photos ({form.portfolio_images?.length || 0}/6)
          </label>
          {(form.portfolio_images?.length || 0) < 6 && (
            <button type="button" onClick={() => portfolioRef.current?.click()}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
              {uploadingPortfolio ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              {uploadingPortfolio ? "Uploading..." : "Add photos"}
            </button>
          )}
        </div>
        <input ref={portfolioRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => e.target.files && e.target.files.length > 0 && handlePortfolio(e.target.files)} />
        <div className="grid grid-cols-3 gap-2">
          {(form.portfolio_images || []).map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button type="button"
                onClick={() => set("portfolio_images", (form.portfolio_images || []).filter((_, i) => i !== idx))}
                className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}
          {(form.portfolio_images?.length || 0) < 6 && (
            <div onClick={() => portfolioRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/40 transition-colors bg-muted/20">
              {uploadingPortfolio
                ? <Loader2 size={20} className="animate-spin text-muted-foreground" />
                : <Plus size={20} className="text-muted-foreground" />}
            </div>
          )}
        </div>
      </div>

      {/* Videos — TikTok-style multi upload */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-muted-foreground uppercase tracking-widest">
            Videos ({(form.video_urls?.length || 0) + (form.video_url ? 1 : 0)}/9)
          </label>
          {((form.video_urls?.length || 0) + (form.video_url ? 1 : 0)) < 9 && (
            <label className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer">
              <input type="file" accept="video/*" multiple className="hidden"
                onChange={e => e.target.files && e.target.files.length > 0 && handleVideos(e.target.files)} />
              {uploadingVideo ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              {uploadingVideo ? "Uploading..." : "Add videos"}
            </label>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {/* Legacy single video_url */}
          {form.video_url && (
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black group">
              <video src={form.video_url} className="w-full h-full object-cover" muted playsInline />
              <button type="button" onClick={() => set("video_url", null)}
                className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-black/70 flex items-center justify-center">
                <X size={10} className="text-white" />
              </button>
            </div>
          )}
          {/* Multiple videos */}
          {(form.video_urls || []).map((vid, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black group">
                <video src={vid} className="w-full h-full object-cover" muted playsInline />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play size={18} className="text-white/80" />
                </div>
                <button type="button"
                  onClick={() => {
                    set("video_urls", (form.video_urls || []).filter((_, i) => i !== idx));
                    set("videos_meta", (form.videos_meta || []).filter((_, i) => i !== idx));
                  }}
                  className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-black/70 flex items-center justify-center">
                  <X size={10} className="text-white" />
                </button>
              </div>
              <Input placeholder="Caption..." className="text-[10px] h-7 px-2"
                value={(form.videos_meta || [])[idx]?.caption || ""}
                onChange={e => {
                  const meta = [...(form.videos_meta || [])];
                  meta[idx] = { ...meta[idx], caption: e.target.value };
                  set("videos_meta", meta);
                }} />
              <Input placeholder="Collab brand (e.g. Nike)" className="text-[10px] h-7 px-2"
                value={(form.videos_meta || [])[idx]?.collab || ""}
                onChange={e => {
                  const meta = [...(form.videos_meta || [])];
                  meta[idx] = { ...meta[idx], collab: e.target.value };
                  set("videos_meta", meta);
                }} />
            </div>
          ))}
          {/* Add more slot — label wraps input directly for mobile compatibility */}
          {((form.video_urls?.length || 0) + (form.video_url ? 1 : 0)) < 9 && (
            <label className="aspect-[9/16] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-colors bg-muted/20">
              <input type="file" accept="video/*" multiple className="hidden"
                onChange={e => e.target.files && e.target.files.length > 0 && handleVideos(e.target.files)} />
              {uploadingVideo
                ? <Loader2 size={20} className="animate-spin text-muted-foreground" />
                : <><Video size={18} className="text-muted-foreground mb-1" /><p className="text-[10px] text-muted-foreground">Add video</p></>}
            </label>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-3 gap-4">
        <div><label className="text-xs text-muted-foreground block mb-1.5">Location (city)</label>
          <Input placeholder="Copenhagen, Denmark" value={form.location} onChange={e => set("location", e.target.value)} /></div>
        <div><label className="text-xs text-muted-foreground block mb-1.5">Instagram</label>
          <Input placeholder="@handle" value={form.instagram} onChange={e => set("instagram", e.target.value)} /></div>
        <div><label className="text-xs text-muted-foreground block mb-1.5">TikTok</label>
          <Input placeholder="@handle" value={form.tiktok || ""} onChange={e => set("tiktok", e.target.value)} /></div>
      </div>

      {/* Filter fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Country</label>
          <Input placeholder="Denmark" value={form.country || ""} onChange={e => set("country", e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Region</label>
          <select value={form.region || "Europe"} onChange={e => set("region", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Languages */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-2">Languages</label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => {
            const selected = (form.languages || []).includes(lang);
            return (
              <button key={lang} type="button"
                onClick={() => set("languages", selected ? (form.languages || []).filter(l => l !== lang) : [...(form.languages || []), lang])}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${selected ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* UGC Content Types */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-2">UGC Content Types</label>
        <div className="flex flex-wrap gap-2">
          {UGC_TYPES.map(type => {
            const selected = (form.content_types || []).includes(type);
            return (
              <button key={type} type="button"
                onClick={() => set("content_types", selected ? (form.content_types || []).filter(t => t !== type) : [...(form.content_types || []), type])}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${selected ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Remote + stats */}
      <div className="grid grid-cols-3 gap-4 items-end">
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Followers</label>
          <Input type="text" inputMode="numeric" placeholder="10000" value={form.followers || ""} onChange={e => {
            const clean = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
            set("followers", clean);
          }} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Engagement %</label>
          <Input type="text" inputMode="decimal" placeholder="5.0" value={form.engagement_rate || ""} onChange={e => {
            const clean = parseFloat(e.target.value.replace(",", ".").replace(/[^0-9.]/g, "")) || 0;
            set("engagement_rate", clean);
          }} />
        </div>
        <div className="flex items-center gap-2 pb-2">
          <button type="button" onClick={() => set("available_for_remote", !form.available_for_remote)}
            className={`relative w-10 h-5 rounded-full transition-colors ${form.available_for_remote ? "bg-primary" : "bg-muted-foreground/30"}`}>
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.available_for_remote ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
          <label className="text-xs text-muted-foreground">Available remote</label>
        </div>
      </div>

      <div><label className="text-xs text-muted-foreground block mb-1.5">Bio</label>
        <textarea rows={3} placeholder="Tell brands about this creator..." value={form.bio}
          onChange={e => set("bio", e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" /></div>

      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs text-muted-foreground block mb-1.5">Rate / pricing</label>
          <Input placeholder="€200–€500 per video" value={form.rates} onChange={e => set("rates", e.target.value)} /></div>
        <div><label className="text-xs text-muted-foreground block mb-1.5">Tags (comma separated)</label>
          <Input placeholder="Beauty, Lifestyle, UGC" value={tagInput} onChange={e => setTagInput(e.target.value)} /></div>

      {/* Previous brand deals */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-2">Previous Brand Deals</label>
        <div className="flex gap-2 mb-2">
          <Input placeholder="e.g. Nike, Glossier, H&M" value={brandInput} onChange={e => setBrandInput(e.target.value)}
            onKeyDown={e => {
              if ((e.key === "Enter" || e.key === ",") && brandInput.trim()) {
                e.preventDefault();
                const brand = brandInput.trim().replace(/,$/, "");
                if (brand && !(form.brands || []).includes(brand)) {
                  set("brands", [...(form.brands || []), brand]);
                }
                setBrandInput("");
              }
            }} />
          <Button type="button" variant="outline" size="sm" onClick={() => {
            const brand = brandInput.trim();
            if (brand && !(form.brands || []).includes(brand)) {
              set("brands", [...(form.brands || []), brand]);
            }
            setBrandInput("");
          }}>Add</Button>
        </div>
        {(form.brands || []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(form.brands || []).map((brand, i) => (
              <span key={i} className="flex items-center gap-1 bg-accent px-3 py-1 rounded-full text-xs">
                {brand}
                <button type="button" onClick={() => set("brands", (form.brands || []).filter((_, idx) => idx !== i))}>
                  <X size={10} className="text-muted-foreground hover:text-foreground" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      </div>

      <div><label className="text-xs text-muted-foreground block mb-1.5">Rating (0–5)</label>
        <Input type="text" inputMode="decimal" placeholder="4.9" value={form.rating || ""}
          onChange={e => set("rating", parseFloat(e.target.value.replace(",", ".")) || 5)} className="w-32" /></div>

      {/* Status toggles */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => set("is_verified", !form.is_verified)}
            className={`relative w-10 h-5 rounded-full transition-colors ${form.is_verified ? "bg-blue-500" : "bg-muted-foreground/30"}`}>
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.is_verified ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
          <label className="text-xs text-muted-foreground">✓ Lumeya Verified</label>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => set("is_trending", !form.is_trending)}
            className={`relative w-10 h-5 rounded-full transition-colors ${form.is_trending ? "bg-orange-500" : "bg-muted-foreground/30"}`}>
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.is_trending ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
          <label className="text-xs text-muted-foreground">🔥 Trending</label>
        </div>
      </div>

      {/* Availability + response time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Availability</label>
          <select value={form.availability || "available"} onChange={e => set("availability", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="available">✅ Available</option>
            <option value="busy">🔴 Busy</option>
            <option value="limited">🟡 Limited spots</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Response Time</label>
          <Input placeholder="e.g. Same day" value={form.response_time || ""} onChange={e => set("response_time", e.target.value)} />
        </div>
      </div>

      {/* Packages */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-3">Packages</label>
        <div className="space-y-3">
          {(form.packages || []).map((pkg, i) => (
            <div key={i} className="rounded-lg border border-border p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{pkg.name}</p>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Price (e.g. €299)" value={pkg.price}
                  onChange={e => { const p = [...(form.packages||[])]; p[i] = {...p[i], price: e.target.value}; set("packages", p); }} />
                <Input placeholder="What's included..." value={pkg.desc}
                  onChange={e => { const p = [...(form.packages||[])]; p[i] = {...p[i], desc: e.target.value}; set("packages", p); }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile banner colour */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-2">Profile Banner Colour</label>
        <div className="flex flex-wrap gap-2">
          {GRADIENTS.map(g => (
            <button key={g.value} type="button" onClick={() => set("color", g.value)}
              className={`relative h-10 w-16 rounded-lg bg-gradient-to-br ${g.value} border-2 transition-all ${form.color === g.value ? "border-foreground scale-110" : "border-transparent hover:scale-105"}`}
              title={g.label}>
              {form.color === g.value && (
                <span className="absolute inset-0 flex items-center justify-center text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? <><Loader2 size={14} className="animate-spin mr-2" />Saving...</> : <><Save size={14} className="mr-2" />Save Creator</>}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

const CreatorCard = ({ creator, onEdit, onDelete }: { creator: Creator; onEdit: () => void; onDelete: () => void }) => (
  <div className="flex items-center gap-4 p-4 border border-border rounded-xl bg-card hover:border-primary/20 transition-all">
    {creator.avatar_url
      ? <img src={creator.avatar_url} alt={creator.display_name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
      : <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center flex-shrink-0"><Users size={22} className="text-muted-foreground" /></div>}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-medium text-sm">{creator.display_name}</p>
        {(creator.portfolio_images?.length || 0) > 0 &&
          <span className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">{creator.portfolio_images?.length} photos</span>}
        {creator.video_url &&
          <span className="text-[10px] text-primary border border-primary/30 rounded px-1.5 py-0.5">video ✓</span>}
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">{creator.tagline} · {creator.location}</p>
      <div className="flex items-center gap-3 mt-1">
        {creator.instagram && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Instagram size={10} />@{creator.instagram.replace("@", "")}</span>}
        <span className="flex items-center gap-1 text-xs text-muted-foreground"><Star size={10} className="text-primary" />{creator.rating}</span>
      </div>
    </div>
    <div className="flex gap-2">
      <button onClick={onEdit} className="p-2 rounded-lg border border-border hover:border-primary/30 text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={14} /></button>
      <button onClick={onDelete} className="p-2 rounded-lg border border-border hover:border-red-300 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
    </div>
  </div>
);

const Admin = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInitial, setEditInitial] = useState<Omit<Creator, "id" | "created_at"> | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const r = await api("list");
      setCreators(r.data || []);
    } catch (e) {
      toast.error("Could not load — " + String(e));
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const buildPayload = (data: Omit<Creator, "id" | "created_at">) => ({
    display_name: data.display_name,
    tagline: data.tagline,
    location: data.location,
    bio: data.bio,
    instagram: data.instagram,
    tiktok: data.tiktok || null,
    rates: data.rates,
    tags: data.tags,
    avatar_url: data.avatar_url,
    portfolio_images: data.portfolio_images || [],
    video_url: data.video_url || null,
    video_urls: data.video_urls || [],
    videos_meta: data.videos_meta || [],
    brands: data.brands || [],
    color: data.color || "from-violet-200 to-pink-100",
    is_verified: data.is_verified || false,
    is_trending: data.is_trending || false,
    availability: data.availability || "available",
    response_time: data.response_time || "Same day",
    packages: data.packages || [],
    country: data.country || null,
    region: data.region || "Europe",
    languages: data.languages || [],
    content_types: data.content_types || [],
    available_for_remote: data.available_for_remote ?? true,
    followers: data.followers || 0,
    engagement_rate: data.engagement_rate || 5.0,
    rating: data.rating,
  });

  const handleAdd = async (data: Omit<Creator, "id" | "created_at">) => {
    try { await api("insert", buildPayload(data)); toast.success("Creator added! 🎉"); setShowForm(false); fetchAll(); }
    catch (e) { toast.error("Failed: " + String(e)); }
  };

  const handleEdit = async (data: Omit<Creator, "id" | "created_at">) => {
    if (!editingId) return;
    try { await api("update", buildPayload(data), editingId); toast.success("Updated!"); setEditingId(null); setEditInitial(null); fetchAll(); }
    catch (e) { toast.error("Failed: " + String(e)); }
  };

  const handleDelete = async (id: string) => {
    try { await api("delete", undefined, id); toast.success("Removed"); fetchAll(); }
    catch { toast.error("Failed"); }
  };

  const startEdit = (c: Creator) => {
    setEditingId(c.id);
    setEditInitial({ display_name: c.display_name, tagline: c.tagline, location: c.location, bio: c.bio, instagram: c.instagram, rates: c.rates, tags: c.tags, avatar_url: c.avatar_url, portfolio_images: c.portfolio_images || [], video_url: c.video_url || null, video_urls: c.video_urls || [], videos_meta: c.videos_meta || [], brands: c.brands || [], color: c.color,
      is_verified: c.is_verified || false, is_trending: c.is_trending || false,
      availability: c.availability || "available", response_time: c.response_time || "Same day",
      packages: c.packages || [{ name: "Basic", price: "", desc: "" }, { name: "Standard", price: "", desc: "" }, { name: "Premium", price: "", desc: "" }] || "from-violet-200 to-pink-100", tiktok: c.tiktok || "", country: c.country || "", region: c.region || "Europe", languages: c.languages || [], content_types: c.content_types || [], available_for_remote: c.available_for_remote ?? true, followers: c.followers || 0, engagement_rate: c.engagement_rate || 5.0, rating: c.rating });
    setShowForm(false);
  };

  return (
    <div className="container max-w-3xl py-16 px-6">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Lumeya Admin</p>
          <h1 className="text-3xl font-display">Creator Profiles</h1>
          <p className="text-sm text-muted-foreground mt-1">Add real creators — photos & videos upload to cloud</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); setEditInitial(null); }} disabled={showForm}>
          <Plus size={14} className="mr-2" />Add Creator
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
            <div className="border border-primary/20 bg-card rounded-2xl p-6">
              <h2 className="text-base font-semibold mb-6">New Creator</h2>
              <CreatorForm initial={EMPTY} onSave={handleAdd} onCancel={() => setShowForm(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>
      ) : creators.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
          <Users size={32} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">No creators yet. Click "Add Creator" to start.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {creators.map(c => (
            <div key={c.id}>
              <CreatorCard creator={c} onEdit={() => startEdit(c)} onDelete={() => handleDelete(c.id)} />
              <AnimatePresence>
                {editingId === c.id && editInitial && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="border border-primary/20 bg-card rounded-2xl p-6 mt-2">
                      <h2 className="text-base font-semibold mb-6">Edit — {c.display_name}</h2>
                      <CreatorForm initial={editInitial} onSave={handleEdit} onCancel={() => { setEditingId(null); setEditInitial(null); }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
