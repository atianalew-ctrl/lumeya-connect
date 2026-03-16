import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Edit2, Save, X, Upload, Loader2,
  Users, Star, Instagram, MapPin, ChevronDown, ChevronUp, Video, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type Creator = {
  id: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  instagram: string;
  rates: string;
  tags: string[];
  avatar_url: string | null;
  video_url: string | null;
  followers: number;
  engagement_rate: number;
  rating: number;
  created_at?: string;
};

const EMPTY_CREATOR: Omit<Creator, "id" | "created_at"> = {
  name: "",
  role: "UGC Creator",
  location: "",
  bio: "",
  instagram: "",
  rates: "",
  tags: [],
  avatar_url: null,
  video_url: null,
  followers: 0,
  engagement_rate: 0,
  rating: 5.0,
};

// ─── Creator Form ─────────────────────────────────────────────────────────────

const CreatorForm = ({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<Creator, "id" | "created_at">;
  onSave: (data: Omit<Creator, "id" | "created_at">) => Promise<void>;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [tagInput, setTagInput] = useState(initial.tags?.join(", ") || "");
  const avatarRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof form, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const uploadFile = async (
    file: File,
    bucket: string,
    setLoading: (v: boolean) => void,
    field: "avatar_url" | "video_url"
  ) => {
    setLoading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      set(field, data.publicUrl);
      toast.success(`${field === "avatar_url" ? "Photo" : "Video"} uploaded!`);
    } catch (e) {
      console.error(e);
      toast.error("Upload failed. Check Supabase storage buckets are set up.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, tags: tagInput.split(",").map((t) => t.trim()).filter(Boolean) };
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Photo & Video upload */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Profile Photo</p>
          <div
            className="relative aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/40 transition-colors bg-muted/30"
            onClick={() => avatarRef.current?.click()}
          >
            {form.avatar_url ? (
              <img src={form.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                {uploadingAvatar ? <Loader2 className="mx-auto animate-spin text-muted-foreground" size={20} /> : <><ImageIcon size={20} className="mx-auto text-muted-foreground mb-1" /><p className="text-xs text-muted-foreground">Tap to upload</p></>}
              </div>
            )}
            {form.avatar_url && (
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload size={18} className="text-white" />
              </div>
            )}
          </div>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "creator-avatars", setUploadingAvatar, "avatar_url")} />
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Intro Video</p>
          <div
            className="relative aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/40 transition-colors bg-muted/30"
            onClick={() => videoRef.current?.click()}
          >
            {form.video_url ? (
              <video src={form.video_url} className="w-full h-full object-cover" muted />
            ) : (
              <div className="text-center p-4">
                {uploadingVideo ? <Loader2 className="mx-auto animate-spin text-muted-foreground" size={20} /> : <><Video size={20} className="mx-auto text-muted-foreground mb-1" /><p className="text-xs text-muted-foreground">Tap to upload</p></>}
              </div>
            )}
            {form.video_url && (
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload size={18} className="text-white" />
              </div>
            )}
          </div>
          <input ref={videoRef} type="file" accept="video/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "creator-videos", setUploadingVideo, "video_url")} />
        </div>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Full name *</label>
          <Input required placeholder="e.g. Ronja Aaslund" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Role</label>
          <Input placeholder="UGC Creator" value={form.role} onChange={(e) => set("role", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Location</label>
          <Input placeholder="Copenhagen, Denmark" value={form.location} onChange={(e) => set("location", e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Instagram handle</label>
          <Input placeholder="@handle" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground block mb-1.5">Bio</label>
        <textarea
          rows={3}
          placeholder="Tell brands about this creator..."
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Rate / pricing</label>
          <Input placeholder="€200–€500 per video" value={form.rates} onChange={(e) => set("rates", e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Tags (comma separated)</label>
          <Input placeholder="Beauty, Lifestyle, UGC" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Followers</label>
          <Input type="number" placeholder="42000" value={form.followers || ""} onChange={(e) => set("followers", Number(e.target.value))} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Engagement %</label>
          <Input type="number" step="0.1" placeholder="5.2" value={form.engagement_rate || ""} onChange={(e) => set("engagement_rate", Number(e.target.value))} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Rating (0–5)</label>
          <Input type="number" step="0.1" min="0" max="5" placeholder="4.9" value={form.rating || ""} onChange={(e) => set("rating", Number(e.target.value))} />
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

// ─── Creator Card ─────────────────────────────────────────────────────────────

const CreatorCard = ({
  creator,
  onEdit,
  onDelete,
}: {
  creator: Creator;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="flex items-center gap-4 p-4 border border-border rounded-xl bg-card hover:border-primary/20 transition-all">
    {creator.avatar_url ? (
      <img src={creator.avatar_url} alt={creator.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
    ) : (
      <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <Users size={20} className="text-muted-foreground" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="font-medium text-sm">{creator.name}</p>
        {creator.video_url && <Video size={12} className="text-primary" />}
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">{creator.role} · {creator.location}</p>
      <div className="flex items-center gap-3 mt-1">
        {creator.instagram && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Instagram size={10} />@{creator.instagram.replace("@", "")}
          </span>
        )}
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star size={10} className="text-primary" />{creator.rating}
        </span>
      </div>
    </div>
    <div className="flex gap-2">
      <button onClick={onEdit} className="p-2 rounded-lg border border-border hover:border-primary/30 text-muted-foreground hover:text-foreground transition-colors">
        <Edit2 size={14} />
      </button>
      <button onClick={onDelete} className="p-2 rounded-lg border border-border hover:border-red-300 text-muted-foreground hover:text-red-500 transition-colors">
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);

// ─── Main Admin Page ──────────────────────────────────────────────────────────

const Admin = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInitial, setEditInitial] = useState<Omit<Creator, "id" | "created_at"> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCreators = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lumeya_creators")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setCreators(data as Creator[]);
    setLoading(false);
  };

  useEffect(() => { fetchCreators(); }, []);

  const handleAdd = async (data: Omit<Creator, "id" | "created_at">) => {
    const { error } = await supabase.from("lumeya_creators").insert(data);
    if (error) { toast.error("Failed to save: " + error.message); return; }
    toast.success("Creator added!");
    setShowForm(false);
    fetchCreators();
  };

  const handleEdit = async (data: Omit<Creator, "id" | "created_at">) => {
    if (!editingId) return;
    const { error } = await supabase.from("lumeya_creators").update(data).eq("id", editingId);
    if (error) { toast.error("Failed to update: " + error.message); return; }
    toast.success("Creator updated!");
    setEditingId(null);
    setEditInitial(null);
    fetchCreators();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("lumeya_creators").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); }
    else { toast.success("Creator removed"); fetchCreators(); }
    setDeletingId(null);
  };

  const startEdit = (c: Creator) => {
    setEditingId(c.id);
    setEditInitial({
      name: c.name,
      role: c.role,
      location: c.location,
      bio: c.bio,
      instagram: c.instagram,
      rates: c.rates,
      tags: c.tags,
      avatar_url: c.avatar_url,
      video_url: c.video_url,
      followers: c.followers,
      engagement_rate: c.engagement_rate,
      rating: c.rating,
    });
    setShowForm(false);
  };

  return (
    <div className="container max-w-3xl py-16 px-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Lumeya Admin</p>
          <h1 className="text-3xl font-display">Creator Profiles</h1>
          <p className="text-sm text-muted-foreground mt-1">Add, edit, and manage real creator profiles</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); setEditInitial(null); }} disabled={showForm}>
          <Plus size={14} className="mr-2" />Add Creator
        </Button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="border border-primary/20 bg-card rounded-2xl p-6">
              <h2 className="text-base font-semibold mb-6">New Creator</h2>
              <CreatorForm
                initial={EMPTY_CREATOR}
                onSave={handleAdd}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creators list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-muted-foreground" size={24} />
        </div>
      ) : creators.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
          <Users size={32} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">No creators yet.</p>
          <p className="text-muted-foreground text-xs mt-1">Click "Add Creator" to add your first real profile.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {creators.map((c) => (
            <div key={c.id}>
              <CreatorCard
                creator={c}
                onEdit={() => startEdit(c)}
                onDelete={() => handleDelete(c.id)}
              />
              <AnimatePresence>
                {editingId === c.id && editInitial && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-primary/20 bg-card rounded-2xl p-6 mt-2">
                      <h2 className="text-base font-semibold mb-6">Edit — {c.name}</h2>
                      <CreatorForm
                        initial={editInitial}
                        onSave={handleEdit}
                        onCancel={() => { setEditingId(null); setEditInitial(null); }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Setup reminder */}
      <div className="mt-12 p-5 rounded-xl bg-muted/40 border border-border">
        <p className="text-xs font-medium mb-2">⚡ First time setup</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Before adding creators, run the SQL below in your Supabase SQL Editor, and create two storage buckets named <strong>creator-avatars</strong> and <strong>creator-videos</strong> (set to public).
        </p>
        <pre className="mt-3 text-[10px] bg-background border border-border rounded-lg p-3 overflow-x-auto text-muted-foreground whitespace-pre-wrap">{`create table if not exists lumeya_creators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text default 'UGC Creator',
  location text,
  bio text,
  instagram text,
  rates text,
  tags text[],
  avatar_url text,
  video_url text,
  followers int default 0,
  engagement_rate numeric default 0,
  rating numeric default 5.0,
  created_at timestamptz default now()
);
alter table lumeya_creators enable row level security;
create policy "Public read" on lumeya_creators for select using (true);
create policy "Public insert" on lumeya_creators for insert with check (true);
create policy "Public update" on lumeya_creators for update using (true);
create policy "Public delete" on lumeya_creators for delete using (true);`}</pre>
      </div>
    </div>
  );
};

export default Admin;
