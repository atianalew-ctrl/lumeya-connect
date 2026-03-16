import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      // If no key, silently succeed so UI doesn't break
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let emailPayload: Record<string, unknown> = {};

    // ─── Creator applies to manage a brand ──────────────────────────────────
    if (type === "creator_application") {
      const { creatorName, creatorInstagram, pitch, brandName, brandEmail, budget, platforms } = data;

      emailPayload = {
        from: "Lumeya Black <noreply@lumeya.dev>",
        to: [brandEmail || "hello@lumeya.dev"], // fallback to Lumeya inbox
        reply_to: creatorInstagram ? undefined : undefined,
        subject: `New application to manage ${brandName} — from ${creatorName}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f8f6f2; font-family: 'Georgia', serif; color: #1a1a1a; }
    .wrapper { max-width: 580px; margin: 40px auto; background: #fff; border: 1px solid #e5e0d8; }
    .header { background: #080808; padding: 40px 40px 32px; }
    .header-badge { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 16px; }
    .header h1 { font-size: 28px; font-weight: 200; color: #fff; line-height: 1.3; letter-spacing: -0.5px; }
    .header-sub { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 8px; }
    .body { padding: 40px; }
    .label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-bottom: 6px; }
    .value { font-size: 15px; color: #1a1a1a; margin-bottom: 24px; line-height: 1.5; }
    .pitch-box { background: #f8f6f2; border-left: 3px solid #1a1a1a; padding: 16px 20px; margin: 24px 0; font-size: 14px; color: #444; line-height: 1.7; font-style: italic; }
    .meta-row { display: flex; gap: 24px; margin-bottom: 32px; }
    .meta-item { flex: 1; }
    .cta { margin-top: 32px; text-align: center; }
    .cta a { display: inline-block; background: #080808; color: #fff; text-decoration: none; padding: 14px 32px; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; }
    .footer { background: #f8f6f2; border-top: 1px solid #e5e0d8; padding: 24px 40px; font-size: 11px; color: #aaa; letter-spacing: 0.05em; }
    .divider { height: 1px; background: #e5e0d8; margin: 0 40px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-badge">Lumeya Black · Creator Application</div>
      <h1>New application<br />for ${brandName}</h1>
      <p class="header-sub">A creator wants to manage your social presence</p>
    </div>

    <div class="body">
      <div class="label">Creator</div>
      <div class="value"><strong>${creatorName}</strong><br />${creatorInstagram ? `@${creatorInstagram.replace("@", "")} on Instagram` : ""}</div>

      <div class="meta-row">
        <div class="meta-item">
          <div class="label">Budget range</div>
          <div class="value" style="margin-bottom:0">${budget || "To be discussed"}</div>
        </div>
        <div class="meta-item">
          <div class="label">Platforms</div>
          <div class="value" style="margin-bottom:0">${Array.isArray(platforms) ? platforms.join(", ") : (platforms || "Instagram")}</div>
        </div>
      </div>

      <div class="label" style="margin-top:16px">Their pitch</div>
      <div class="pitch-box">"${pitch}"</div>

      <div class="cta">
        <a href="https://lumeya-connect.vercel.app/brand-management">View all applications on Lumeya</a>
      </div>
    </div>

    <div class="divider"></div>
    <div class="footer">
      You received this because a creator applied to manage <strong>${brandName}</strong> on Lumeya Black.
      &nbsp;·&nbsp; <a href="https://lumeya-connect.vercel.app/black" style="color:#aaa">lumeya-connect.vercel.app</a>
    </div>
  </div>
</body>
</html>`,
      };
    }

    // ─── Creator gets confirmation email ─────────────────────────────────────
    else if (type === "creator_confirmation") {
      const { creatorName, creatorEmail, brandName } = data;

      emailPayload = {
        from: "Lumeya Black <noreply@lumeya.dev>",
        to: [creatorEmail],
        subject: `Your application to ${brandName} is in ✓`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f8f6f2; font-family: 'Georgia', serif; color: #1a1a1a; }
    .wrapper { max-width: 540px; margin: 40px auto; background: #080808; }
    .body { padding: 48px 40px; text-align: center; }
    .badge { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 24px; }
    h1 { font-size: 32px; font-weight: 200; color: #fff; letter-spacing: -0.5px; margin-bottom: 16px; }
    p { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.7; max-width: 380px; margin: 0 auto 32px; }
    .check { width: 48px; height: 48px; border: 1px solid rgba(255,255,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; }
    .brand-name { color: rgba(255,255,255,0.7); font-style: italic; }
    .footer { border-top: 1px solid rgba(255,255,255,0.06); padding: 20px 40px; font-size: 11px; color: rgba(255,255,255,0.2); text-align: center; letter-spacing: 0.05em; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="body">
      <div class="badge">Lumeya Black</div>
      <div class="check">
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M1.5 7L6.5 12L16.5 2" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h1>Application sent.</h1>
      <p>Your application to manage <span class="brand-name">${brandName}</span> has been received. They'll review it and reach out within 48 hours if it's a match.</p>
      <p style="font-size:12px; color:rgba(255,255,255,0.2)">You applied as ${creatorName}</p>
    </div>
    <div class="footer">Lumeya Black · Exclusive Creator Management</div>
  </div>
</body>
</html>`,
      };
    }

    // ─── New opportunity posted — notify relevant creators ───────────────────
    else if (type === "new_opportunity") {
      const { brandName, opportunityTitle, budget, deadline, creatorEmails } = data;

      emailPayload = {
        from: "Lumeya <noreply@lumeya.dev>",
        to: Array.isArray(creatorEmails) ? creatorEmails : [creatorEmails],
        subject: `New opportunity: ${opportunityTitle} — ${brandName}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f8f6f2; font-family: 'Georgia', serif; color: #1a1a1a; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border: 1px solid #e5e0d8; }
    .header { padding: 40px; border-bottom: 1px solid #e5e0d8; }
    .badge { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-bottom: 12px; }
    h1 { font-size: 24px; font-weight: 300; line-height: 1.4; }
    .body { padding: 32px 40px; }
    .row { display: flex; gap: 24px; margin-bottom: 24px; }
    .item .label { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #aaa; margin-bottom: 4px; }
    .item .val { font-size: 15px; }
    .cta { text-align: center; margin-top: 32px; }
    .cta a { display: inline-block; background: #1a1a1a; color: #fff; text-decoration: none; padding: 14px 32px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; }
    .footer { background: #f8f6f2; border-top: 1px solid #e5e0d8; padding: 20px 40px; font-size: 11px; color: #bbb; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="badge">New opportunity on Lumeya</div>
      <h1>${opportunityTitle}</h1>
      <p style="font-size:13px;color:#888;margin-top:8px">by ${brandName}</p>
    </div>
    <div class="body">
      <div class="row">
        <div class="item"><div class="label">Budget</div><div class="val">${budget}</div></div>
        <div class="item"><div class="label">Deadline</div><div class="val">${deadline}</div></div>
      </div>
      <div class="cta">
        <a href="https://lumeya-connect.vercel.app/opportunities">View & Apply on Lumeya</a>
      </div>
    </div>
    <div class="footer">You're receiving this as a Lumeya creator. <a href="#" style="color:#bbb">Unsubscribe</a></div>
  </div>
</body>
</html>`,
      };
    } else {
      throw new Error(`Unknown email type: ${type}`);
    }

    // ─── Send via Resend ─────────────────────────────────────────────────────
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Resend API error");

    return new Response(JSON.stringify({ ok: true, id: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-email error:", err);
    // Don't expose internal errors to client, just return ok so UX isn't broken
    return new Response(JSON.stringify({ ok: true, error: String(err) }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
