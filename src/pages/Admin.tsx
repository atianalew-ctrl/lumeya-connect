import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Save, Upload, Loader2, Users, Star, Instagram, ImageIcon, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Creator = {
  id: string;
  display_name: string;
  tagline: string;
  location: string;
  bio: string;
  instagram: string;
  rates: string;
  tags: string[];
  avatar_url: string | null;
  portfolio_images?: string[];
  video_url?: string | null;
  rating: number;
  created_at?: string;
};

const EMPTY: Omit<Creator, "id" | "created_at"> = {
  display_name: "",
  tagline: "UGC Creator",
  location: "",
  bio: "",
  instagram: "",
  rates: "",
  tags: [],
  avatar_url: null,
  portfolio_images: [],
  video_url: null,
  rating: 5.0,
};

// Convert file to base64
const toBase64 = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

const CreatorForm = ({ initial, onSave, onCancel }: {
  initial: Omit<Creator, "id" | "created_at">;
  onSave: (d: Omit<Creator, "id" | "created_at">) => Promise<void>;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [tagInput, setTagInput] = useState(initial.tags?.join(", ") || "");
  const avatarRef = useRef<HTMLInputElement>(null);
  const portfolioRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleAvatar = async (file: File) => {
    setUploading(true);
    try { set("avatar_url", await toBase64(file)); toast.success("Profile photo ready!"); }
    catch { toast.error("Failed to read image."); }
    finally { setUploading(false); }
  };

  const handlePortfolio = async (files: FileList) => {
    setUploadingPortfolio(true);
    try {
      const current = form.portfolio_images || [];
      const newOnes = await Promise.all(Array.from(files).slice(0, 6 - current.length).map(toBase64));
      set("portfolio_images", [...current, ...newOnes]);
      toast.success(`${newOnes.length} photo${newOnes.length > 1 ? "s" : ""} added!`);
    } catch { toast.error("Failed to read images."); }
    finally { setUploadingPortfolio(false); }
  };

  const removePortfolioImg = (idx: number) => {
    set("portfolio_images", (form.portfolio_images || []).filter((_, i) => i !== idx));
  };

  const handleVideo = async (file: File) => {
    setUploadingVideo(true);
    try { set("video_url", await toBase64(file)); toast.success("Video ready!"); }
    catch { toast.error("Failed to read video."); }
    finally { setUploadingVideo(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...form, tags: tagInput.split(",").map(t => t.trim()).filter(Boolean) });
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Profile photo + name */}
      <div className="flex items-start gap-4">
        <div
          className="relative w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/40 transition-colors bg-muted/30 flex-shrink-0"
          onClick={() => avatarRef.current?.click()}
        >
          {form.avatar_url
            ? <img src={form.avatar_url} alt="" className="w-full h-full object-cover" />
            : uploading
              ? <Loader2 size={20} className="animate-spin text-muted-foreground" />
              : <div className="text-center p-2"><ImageIcon size={18} className="mx-auto text-muted-foreground mb-1" /><p className="text-[10px] text-muted-foreground">Profile photo</p></div>
          }
          {form.avatar_url && <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"><Upload size={16} className="text-white" /></div>}
        </div>
        <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleAvatar(e.target.files[0])} />
        <div className="flex-1 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Full name *</label>
            <Input required placeholder="e.g. Nelly" value={form.display_name} onChange={e => set("display_name", e.target.value)} />
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
          <label className="text-xs text-muted-foreground uppercase tracking-widest">Portfolio Photos (up to 6)</label>
          {(form.portfolio_images?.length || 0) < 6 && (
            <button type="button" onClick={() => portfolioRef.current?.click()}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
              {uploadingPortfolio ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              Add photos
            </button>
          )}
        </div>
        <input ref={portfolioRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => e.target.files && e.target.files.length > 0 && handlePortfolio(e.target.files)} />
        <div className="grid grid-cols-3 gap-2">
          {(form.portfolio_images || []).map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removePortfolioImg(idx)}
                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}
          {(form.portfolio_images?.length || 0) < 6 && (
            <div onClick={() => portfolioRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/40 transition-colors bg-muted/20">
              {uploadingPortfolio
                ? <Loader2 size={18} className="animate-spin text-muted-foreground" />
                : <Plus size={18} className="text-muted-foreground" />}
            </div>
          )}
        </div>
      </div>

      {/* Intro video */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-2">Intro Video</label>
        {form.video_url ? (
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
            <video src={form.video_url} className="w-full h-full object-cover" controls muted />
            <button type="button" onClick={() => set("video_url", null)}
              className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors">
              <X size={13} className="text-white" />
            </button>
          </div>
        ) : (
          <div onClick={() => videoRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-colors bg-muted/20">
            {uploadingVideo
              ? <><Loader2 size={20} className="animate-spin text-muted-foreground mb-2" /><p className="text-xs text-muted-foreground">Processing video...</p></>
              : <><Video size={20} className="text-muted-foreground mb-2" /><p className="text-xs text-muted-foreground">Tap to upload intro video</p><p className="text-[10px] text-muted-foreground/60 mt-1">MP4, MOV up to 50MB</p></>}
          </div>
        )}
        <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={e => e.target.files?.[0] && handleVideo(e.target.files[0])} />
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Location</label>
          <Input placeholder="Copenhagen, Denmark" value={form.location} onChange={e => set("location", e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Instagram handle</label>
          <Input placeholder="@handle" value={form.instagram} onChange={e => set("instagram", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground block mb-1.5">Bio</label>
        <textarea rows={3} placeholder="Tell brands about this creator..." value={form.bio}
          onChange={e => set("bio", e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Rate / pricing</label>
          <Input placeholder="€200–€500 per video" value={form.rates} onChange={e => set("rates", e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Tags (comma separated)</label>
          <Input placeholder="Beauty, Lifestyle, UGC" value={tagInput} onChange={e => setTagInput(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground block mb-1.5">Rating (0–5)</label>
        <Input type="number" step="0.1" min="0" max="5" placeholder="4.9"
          value={form.rating || ""} onChange={e => set("rating", Number(e.target.value))} className="w-32" />
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
      ? <img src={creator.avatar_url} alt={creator.display_name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
      : <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0"><Users size={20} className="text-muted-foreground" /></div>
    }
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="font-medium text-sm">{creator.display_name}</p>
        {(creator.portfolio_images?.length || 0) > 0 && <span className="text-[10px] text-muted-foreground border border-border rounded px-1">{creator.portfolio_images?.length} photos</span>}
        {creator.video_url && <span className="text-[10px] text-primary border border-primary/30 rounded px-1">video</span>}
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
    const { data } = await supabase.from("creator_profiles")
      .select("id,display_name,tagline,location,bio,instagram,rates,tags,avatar_url,rating,created_at")
      .order("created_at", { ascending: false });
    if (data) setCreators(data as Creator[]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const buildPayload = (data: Omit<Creator, "id" | "created_at">) => ({
    display_name: data.display_name,
    tagline: data.tagline,
    location: data.location,
    bio: data.bio,
    instagram: data.instagram,
    rates: data.rates,
    tags: data.tags,
    avatar_url: data.avatar_url,
    rating: data.rating,
  });

  const handleAdd = async (data: Omit<Creator, "id" | "created_at">) => {
    const { error } = await supabase.from("creator_profiles").insert(buildPayload(data));
    if (error) { toast.error("Failed: " + error.message); return; }
    toast.success("Creator added! 🎉");
    setShowForm(false);
    fetchAll();
  };

  const handleEdit = async (data: Omit<Creator, "id" | "created_at">) => {
    if (!editingId) return;
    const { error } = await supabase.from("creator_profiles").update(buildPayload(data)).eq("id", editingId);
    if (error) { toast.error("Failed: " + error.message); return; }
    toast.success("Updated!");
    setEditingId(null); setEditInitial(null);
    fetchAll();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("creator_profiles").delete().eq("id", id);
    toast.success("Removed");
    fetchAll();
  };

  const startEdit = (c: Creator) => {
    setEditingId(c.id);
    setEditInitial({ display_name: c.display_name, tagline: c.tagline, location: c.location, bio: c.bio, instagram: c.instagram, rates: c.rates, tags: c.tags, avatar_url: c.avatar_url, portfolio_images: c.portfolio_images || [], video_url: c.video_url || null, rating: c.rating });
    setShowForm(false);
  };

  return (
    <div className="container max-w-3xl py-16 px-6">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Lumeya Admin</p>
          <h1 className="text-3xl font-display">Creator Profiles</h1>
          <p className="text-sm text-muted-foreground mt-1">Add real creators with photos & videos — live instantly</p>
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
