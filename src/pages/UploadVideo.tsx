import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Film, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { creators } from "@/lib/data";
import { toast } from "sonner";

const UploadVideo = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 20 * 1024 * 1024) {
        toast.error("File too large. Max 20MB.");
        return;
      }
      if (!selected.type.startsWith("video/")) {
        toast.error("Please select a video file.");
        return;
      }
      setFile(selected);
    }
  };

  const handleUpload = async () => {
    if (!file || !creatorId) {
      toast.error("Please select a creator and a video file.");
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${creatorId}/${Date.now()}.${ext}`;

      setProgress(30);

      const { error: uploadError } = await supabase.storage
        .from("creator-videos")
        .upload(fileName, file, { contentType: file.type, upsert: false });

      if (uploadError) throw uploadError;

      setProgress(70);

      const { data: urlData } = supabase.storage
        .from("creator-videos")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("creator_videos").insert({
        creator_id: Number(creatorId),
        video_url: urlData.publicUrl,
        title: title || file.name,
        is_featured: isFeatured,
      });

      // If RLS blocks it, show helpful message
      if (dbError) {
        if (dbError.message?.includes("row-level security")) {
          throw new Error("Please run the SQL fix in Supabase dashboard first — check your WhatsApp for instructions.");
        }
        throw dbError;
      }

      setProgress(100);
      setDone(true);
      toast.success("Video uploaded successfully!");
    } catch (err: any) {
      console.error("Upload error details:", err);
      toast.error(err.message || "Upload failed — try a smaller file or check your connection.");
    } finally {
      setUploading(false);
    }
  };

  if (done) {
    return (
      <div className="container max-w-lg py-24 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Check size={28} className="text-primary" />
          </div>
          <h2 className="mt-4 text-2xl font-display">Video Uploaded!</h2>
          <p className="mt-2 text-sm text-muted-foreground">Your video is now live on the creator's profile.</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button variant="outline" onClick={() => { setDone(false); setFile(null); setTitle(""); setProgress(0); }}>
              Upload Another
            </Button>
            <Button onClick={() => navigate(`/creators/${creatorId}`)}>
              View Profile
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-lg py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display">Upload Video</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a video to a creator's profile. It will appear in Discover and on their profile page.
        </p>

        <div className="mt-8 space-y-5">
          {/* Creator select */}
          <div className="space-y-2">
            <Label>Creator</Label>
            <Select value={creatorId} onValueChange={setCreatorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a creator" />
              </SelectTrigger>
              <SelectContent>
                {creators.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name} — {c.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Title (optional)</Label>
            <Input placeholder="e.g. Summer skincare routine" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* File drop zone */}
          <div className="space-y-2">
            <Label>Video File</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary/40 hover:bg-muted/50"
            >
              {file ? (
                <>
                  <Film size={28} className="text-primary" />
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </>
              ) : (
                <>
                  <Upload size={28} className="text-muted-foreground" />
                   <p className="text-sm text-muted-foreground">Click to select a video (max 20MB)</p>
                  <p className="text-xs text-muted-foreground">MP4, MOV, WEBM</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="space-y-1">
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">{progress}%</p>
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={uploading || !file || !creatorId}
          >
            {uploading ? (
              <><Loader2 size={16} className="mr-2 animate-spin" />Uploading...</>
            ) : (
              <><Upload size={16} className="mr-2" />Upload Video</>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadVideo;
