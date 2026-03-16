import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TABLE = "lumeya_creators";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const db = createClient(
    "https://xbgdynlutmosupfqafap.supabase.co",
    Deno.env.get("SERVICE_KEY")!
  );

  const ok = (data: unknown) => new Response(JSON.stringify({ ok: true, data }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const err = (msg: string) => new Response(JSON.stringify({ ok: false, error: msg }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const { action, data, id } = await req.json();

    if (action === "list") {
      const { data: rows, error } = await db.from(TABLE).select("*").order("created_at", { ascending: false });
      if (error) return err(error.message);
      return ok(rows);
    }

    if (action === "insert") {
      const { error } = await db.from(TABLE).insert(data);
      if (error) return err(error.message);
      return ok(null);
    }

    if (action === "update") {
      const { error } = await db.from(TABLE).update(data).eq("id", id);
      if (error) return err(error.message);
      return ok(null);
    }

    if (action === "delete") {
      const { error } = await db.from(TABLE).delete().eq("id", id);
      if (error) return err(error.message);
      return ok(null);
    }

    return err("Unknown action: " + action);
  } catch (e) {
    return err(String(e));
  }
});
