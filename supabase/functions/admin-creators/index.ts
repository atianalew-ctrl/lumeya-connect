import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = "https://xbgdynlutmosupfqafap.supabase.co";
const SERVICE_KEY = Deno.env.get("SERVICE_KEY")!;
const TABLE = "lumeya_creators";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const db = createClient(SUPABASE_URL, SERVICE_KEY);

  const ok = (data: unknown) => new Response(
    JSON.stringify({ ok: true, data }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
  const fail = (msg: string) => new Response(
    JSON.stringify({ ok: false, error: msg }),
    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );

  try {
    const body = await req.json();
    const { action, data, id } = body;

    // ── List ─────────────────────────────────────────────────────────────────
    if (action === "list") {
      const { data: rows, error } = await db
        .from(TABLE).select("*").order("created_at", { ascending: false });
      if (error) return fail(error.message);
      return ok(rows);
    }

    // ── Insert ────────────────────────────────────────────────────────────────
    if (action === "insert") {
      const { error } = await db.from(TABLE).insert(data);
      if (error) return fail(error.message);
      return ok(null);
    }

    // ── Update ────────────────────────────────────────────────────────────────
    if (action === "update") {
      const { error } = await db.from(TABLE).update(data).eq("id", id);
      if (error) return fail(error.message);
      return ok(null);
    }

    // ── Delete ────────────────────────────────────────────────────────────────
    if (action === "delete") {
      const { error } = await db.from(TABLE).delete().eq("id", id);
      if (error) return fail(error.message);
      return ok(null);
    }

    // ── Upload file to storage ────────────────────────────────────────────────
    if (action === "upload") {
      // data.file = base64 data URL, data.bucket, data.filename
      const { file, bucket, filename } = data;
      const base64 = file.split(",")[1];
      const mimeMatch = file.match(/data:([^;]+);/);
      const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
      const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

      const { error: upErr } = await db.storage
        .from(bucket)
        .upload(filename, bytes, { contentType: mime, upsert: true });

      if (upErr) {
        // Bucket may not exist — return base64 as fallback
        return ok({ url: file, fallback: true });
      }

      const { data: urlData } = db.storage.from(bucket).getPublicUrl(filename);
      return ok({ url: urlData.publicUrl, fallback: false });
    }

    return fail("Unknown action: " + action);
  } catch (e) {
    return fail(String(e));
  }
});
