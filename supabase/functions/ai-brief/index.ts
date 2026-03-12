import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  generate: `You are an expert UGC campaign brief writer for a creator marketplace called Lumeya. 
Given minimal product/brand info, generate a professional campaign brief. Return ONLY a JSON object with these fields:
{
  "title": "opportunity title",
  "description": "short description (2-3 sentences for search results)",
  "overview": "detailed project overview (3-5 paragraphs covering goals, target audience, brand voice, and expectations)",
  "deliverables": "deliverables as a newline-separated list",
  "timeline": "suggested timeline with key milestones"
}
Be specific, actionable, and professional. Use a warm but business-appropriate tone.`,

  scripts: `You are a creative director at a top UGC agency. Generate 3 compelling script/hook ideas for a UGC campaign.
Return ONLY a JSON object:
{
  "scripts": [
    { "hook": "opening hook line", "concept": "brief concept description (2-3 sentences)", "style": "e.g. talking head, lifestyle, unboxing" }
  ]
}
Make hooks attention-grabbing and platform-native (TikTok/Reels style). Keep them authentic and relatable.`,

  refine: `You are a professional copywriter and campaign strategist. The user will provide draft text from a campaign brief.
Polish it: improve clarity, fix grammar, strengthen the call-to-action, and make it more compelling for creators.
Return ONLY the improved text as a plain string — no JSON, no markdown formatting, no quotes around it.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, input } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = SYSTEM_PROMPTS[action];
    if (!systemPrompt) throw new Error(`Unknown action: ${action}`);

    let userMessage = "";
    if (action === "generate") {
      userMessage = `Product/Brand: ${input.brand || "N/A"}
Category: ${input.category || "N/A"}
Goal: ${input.goal || "N/A"}
Platform: ${input.platform || "TikTok & Instagram Reels"}
Additional notes: ${input.notes || "None"}`;
    } else if (action === "scripts") {
      userMessage = `Campaign: ${input.title || "N/A"}
Product/Brand: ${input.brand || "N/A"}
Category: ${input.category || "N/A"}
Brief: ${input.description || "N/A"}`;
    } else if (action === "refine") {
      userMessage = `Please refine this text:\n\n${input.text}`;
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-brief error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
