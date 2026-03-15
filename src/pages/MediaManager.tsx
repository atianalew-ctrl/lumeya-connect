import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image, Video, Check, X, Loader2, Camera, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { creators } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type MediaType = "avatar" | "video";

interface UploadJob {
  creatorId: number;
  creatorName: string;
  type: MediaType;
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  url?: string;
  progress: number;
}

const MediaManager = () => {
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const [dragOver, setDragOver] = useState<{ id: number; type: MediaType } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingSlot, setPendingSlot] = useState<{ id: number; type: MediaType } | null>(null);

  const openPicker = (creatorId: number, type: MediaType) => {
    setPendingSlot({ id: creatorId, type });
    if (inputRef.current) {
      inputRef.current.accept = type === "avatar" ? "image/*" : "video/*";
      inputRef.current.click();
    }
  };

  const handleFile = async (file: File, creatorId: number, type: MediaType) => {
    const creator = creators.find(c => c.id === creatorId);
    if (!creator) return;

    // Size limits
    const maxMB = type === "avatar" ? 5 : 50;
    if (file.size > maxMB * 1024 * 1024) {
      toast.error(`File too large. Max ${maxMB}MB.`);
      return;
    }

    const job: UploadJob = {
      creatorId,
      creatorName: creator.name,
      type,
      file,
      status: "uploading",
      progress: 10,
    };

    setJobs(prev => [job, ...prev.filter(j => !(j.creatorId === creatorId && j.type === type))]);

    try {
      const ext = file.name.split(".").pop();
      const bucket = type === "avatar" ? "creator-avatars" : "creator-videos";
      const path = `${creatorId}/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
        contentType: file.type,
        upsert: true,
      });

      if (upErr) throw upErr;

      setJobs(prev => prev.map(j =>
        j.creatorId === creatorId && j.type === type ? { ...j, progress: 70 } : j
      ));

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);

      if (type === "video") {
        await supabase.from("creator_videos").insert({
          creator_id: creatorId,
          video_url: data.publicUrl,
          title: file.name.replace(/\.[^/.]+$/, ""),
          is_featured: true,
        });
      }

      setJobs(prev => prev.map(j =>
        j.creatorId === creatorId && j.type === type
          ? { ...j, status: "done", progress: 100, url: data.publicUrl }
          : j
      ));

      toast.success(`${creator.name}'s ${type === "avatar" ? "photo" : "video"} updated!`);
    } catch (err: any) {
      setJobs(prev => prev.map(j =>
        j.creatorId === creatorId && j.type === type ? { ...j, status: "error", progress: 0 } : j
      ));
      const msg = err?.message?.includes("row-level security")
        ? "Run the SQL fix in Supabase first (check WhatsApp)"
        : err?.message || "Upload failed";
      toast.error(msg);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pendingSlot) {
      handleFile(file, pendingSlot.id, pendingSlot.type);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent, creatorId: number, type: MediaType) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file, creatorId, type);
  };

  const getJob = (creatorId: number, type: MediaType) =>
    jobs.find(j => j.creatorId === creatorId && j.type === type);

  return (
    <div className="container max-w-4xl py-12">
      <input ref={inputRef} type="file" className="hidden" onChange={handleInputChange} />

      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">Media Manager</p>
        <h1 className="text-4xl font-display font-normal mb-2">
          Update creator
          <em className="text-primary/60"> photos & videos</em>
        </h1>
        <p className="text-sm text-muted-foreground">
          Tap any slot to upload from your phone. Drag & drop also works. Changes go live immediately.
        </p>
      </div>

      {/* Creator grid */}
      <div className="space-y-4">
        {creators.map(creator => {
          const avatarJob = getJob(creator.id, "avatar");
          const videoJob = getJob(creator.id, "video");

          return (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={avatarJob?.url || creator.avatar}
                  alt={creator.name}
                  className="h-12 w-12 rounded-full object-cover bg-accent"
                />
                <div>
                  <p className="font-medium">{creator.name}</p>
                  <p className="text-xs text-muted-foreground">{creator.role} · {creator.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Avatar slot */}
                <UploadSlot
                  label="Profile Photo"
                  icon={<Camera size={16} />}
                  accept="image/*"
                  job={avatarJob}
                  isDragOver={dragOver?.id === creator.id && dragOver?.type === "avatar"}
                  onDragOver={() => setDragOver({ id: creator.id, type: "avatar" })}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={e => handleDrop(e, creator.id, "avatar")}
                  onClick={() => openPicker(creator.id, "avatar")}
                  previewUrl={avatarJob?.url || creator.avatar}
                  isImage
                />

                {/* Video slot */}
                <UploadSlot
                  label="Creator Video"
                  icon={<Film size={16} />}
                  accept="video/*"
                  job={videoJob}
                  isDragOver={dragOver?.id === creator.id && dragOver?.type === "video"}
                  onDragOver={() => setDragOver({ id: creator.id, type: "video" })}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={e => handleDrop(e, creator.id, "video")}
                  onClick={() => openPicker(creator.id, "video")}
                  previewUrl={videoJob?.url || creator.videoUrl}
                  isImage={false}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Upload size={14} className="text-primary" /> How to upload from your iPhone
        </h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li><span className="font-medium text-foreground">1.</span> Tap any photo or video slot above</li>
          <li><span className="font-medium text-foreground">2.</span> Choose "Photo Library" or "Files"</li>
          <li><span className="font-medium text-foreground">3.</span> Select your file — it uploads instantly</li>
          <li><span className="font-medium text-foreground">4.</span> Green checkmark = it's live on the platform ✓</li>
        </ol>
        <p className="text-xs text-muted-foreground/60 mt-4">
          Max: 5MB for photos · 50MB for videos · MP4, MOV, JPG, PNG, WEBP
        </p>
      </div>
    </div>
  );
};

interface SlotProps {
  label: string;
  icon: React.ReactNode;
  accept: string;
  job?: UploadJob;
  isDragOver: boolean;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  previewUrl: string;
  isImage: boolean;
}

const UploadSlot = ({ label, icon, job, isDragOver, onDragOver, onDragLeave, onDrop, onClick, previewUrl, isImage }: SlotProps) => {
  const status = job?.status;

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
        isDragOver ? "border-primary bg-primary/5 scale-[1.02]" :
        status === "done" ? "border-emerald-400/40 bg-emerald-50" :
        status === "error" ? "border-red-400/40 bg-red-50" :
        "border-border hover:border-primary/40 hover:bg-accent/30"
      }`}
      style={{ minHeight: 100 }}
      onDragOver={e => { e.preventDefault(); onDragOver(); }}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
    >
      {/* Background preview */}
      {isImage && previewUrl && (
        <img src={previewUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      )}

      <div className="relative z-10 flex flex-col items-center justify-center gap-2 p-4 text-center h-full" style={{ minHeight: 100 }}>
        {status === "uploading" ? (
          <>
            <Loader2 size={20} className="animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Uploading…</p>
            <div className="w-full h-1 bg-border rounded-full overflow-hidden mt-1">
              <motion.div className="h-full bg-primary rounded-full" style={{ width: `${job?.progress || 0}%` }} />
            </div>
          </>
        ) : status === "done" ? (
          <>
            <Check size={20} className="text-emerald-500" />
            <p className="text-xs font-medium text-emerald-600">Updated ✓</p>
            <p className="text-[10px] text-muted-foreground">Tap to replace</p>
          </>
        ) : status === "error" ? (
          <>
            <X size={20} className="text-red-500" />
            <p className="text-xs text-red-600">Failed — tap to retry</p>
          </>
        ) : (
          <>
            <div className="text-muted-foreground">{icon}</div>
            <p className="text-xs font-medium">{label}</p>
            <p className="text-[10px] text-muted-foreground">Tap or drag</p>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaManager;
