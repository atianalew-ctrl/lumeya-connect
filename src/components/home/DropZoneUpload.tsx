import { useState, useRef, useCallback } from "react";
import { Upload, Film, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { creators } from "@/lib/data";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

const DropZoneUpload = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [done, setDone] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (f.size > 20 * 1024 * 1024) {
      toast.error("Max 20MB. Try a shorter clip.");
      return;
    }
    if (!f.type.startsWith("video/")) {
      toast.error("Please drop a video file.");
      return;
    }
    setFile(f);
    setDone(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleUpload = async () => {
    if (!file || !creatorId) {
      toast.error("Pick a creator and a video file.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${creatorId}/${Date.now()}.${ext}`;

      // Create an AbortController with a 60s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const { error: uploadError } = await supabase.storage
        .from("creator-videos")
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
          // @ts-ignore - signal is supported but not in types
          signal: controller.signal,
        });

      clearTimeout(timeoutId);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("creator-videos")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("creator_videos").insert({
        creator_id: Number(creatorId),
        video_url: urlData.publicUrl,
        title: title || file.name,
        is_featured: true,
      });
      if (dbError) throw dbError;

      setDone(true);
      setFile(null);
      setTitle("");
      toast.success("Video uploaded!");
      queryClient.invalidateQueries({ queryKey: ["creator-videos-all"] });
      queryClient.invalidateQueries({ queryKey: ["creator-videos"] });
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Upload failed — try a smaller file.");
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setTitle("");
    setCreatorId("");
    setDone(false);
  };

  return (
    <div className="container mt-10">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : file
            ? "border-primary/30 bg-card"
            : "border-border bg-muted/20 hover:border-primary/30 hover:bg-muted/40 cursor-pointer"
        } p-6`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Check size={22} className="text-primary" />
              </div>
              <p className="text-sm font-medium">Video uploaded successfully!</p>
              <Button size="sm" variant="outline" onClick={reset}>Upload another</Button>
            </motion.div>
          ) : !file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 py-4"
            >
              <Upload size={24} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Drop a video here</span> or click to browse
              </p>
              <p className="text-xs text-muted-foreground">MP4, MOV, WEBM · Max 20MB</p>
            </motion.div>
          ) : (
            <motion.div
              key="selected"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Film size={20} className="text-primary" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={reset}>
                  <X size={14} />
                </Button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Select value={creatorId} onValueChange={setCreatorId}>
                  <SelectTrigger className="sm:w-[200px]">
                    <SelectValue placeholder="Select creator" />
                  </SelectTrigger>
                  <SelectContent>
                    {creators.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Title (optional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1"
                />

                <Button onClick={handleUpload} disabled={uploading || !creatorId}>
                  {uploading ? (
                    <><Loader2 size={14} className="mr-2 animate-spin" />Uploading...</>
                  ) : (
                    <><Upload size={14} className="mr-2" />Upload</>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DropZoneUpload;
