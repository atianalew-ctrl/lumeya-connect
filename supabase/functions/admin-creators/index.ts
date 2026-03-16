import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { action, data, id } = await req.json();

    // Ensure table exists
    await supabase.rpc("exec_sql", { sql: `
      CREATE TABLE IF NOT EXISTS lumeya_creators (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        display_name text NOT NULL,
        tagline text DEFAULT 'UGC Creator',
        location text,
        bio text,
        instagram text,
        rates text,
        tags text[],
        avatar_url text,
        portfolio_images text[],
        video_url text,
        rating numeric DEFAULT 5.0,
        created_at timestamptz DEFAULT now()
      );
      ALTER TABLE lumeya_creators ENABLE ROW LEVEL SECURITY;
      DO $$ BEGIN
        CREATE POLICY "public_all" ON lumeya_creators FOR ALL USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    ` }).catch(() => null); // ignore if RPC doesn't exist, table may already exist

    if (action === "list") {
      const { data: rows, error } = await supabase.from("lumeya_creators").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true, data: rows }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "insert") {
      const { error } = await supabase.from("lumeya_creators").insert(data);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "update") {
      const { error } = await supabase.from("lumeya_creators").update(data).eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "delete") {
      const { error } = await supabase.from("lumeya_creators").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    throw new Error("Unknown action");
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
