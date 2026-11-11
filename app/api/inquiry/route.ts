import { createHmac } from "node:crypto";
import { Inquiry } from "@/lib/inquiry";

// The only server code on the site. Order: size and origin checks, validation, honeypot,
// Turnstile, rate limit + insert (one database call), then email. Errors sent to the visitor are generic.
// The inquiry is accepted if it is saved OR emailed, so a sleeping database never loses one.

const MAX_CHARS = 10_000;

const reply = (status: number, ok = false) =>
  Response.json({ ok }, { status, headers: { "Cache-Control": "no-store" } });

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

export async function POST(req: Request) {
  try {
    if (!req.headers.get("content-type")?.startsWith("application/json")) return reply(415);

    // Browsers always send Origin on cross-site POSTs. Reject other sites posting to this endpoint.
    const origin = req.headers.get("origin");
    if (origin && !origin.endsWith(`://${req.headers.get("host")}`)) return reply(403);

    const raw = await req.text();
    if (raw.length > MAX_CHARS) return reply(413);

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return reply(400);
    }
    const parsed = Inquiry.safeParse(body);
    if (!parsed.success) return reply(400);
    const { website, token, consent: _consent, ...inquiry } = parsed.data;

    // Honeypot filled: a bot. Report success so it does not learn to adapt.
    if (website) return reply(200, true);

    // shortcut: cf-connecting-ip can be forged by calling the *.vercel.app address directly,
    // upgrade by restricting Vercel to Cloudflare traffic (see SECURITY.md) if abuse appears.
    const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

    const check = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: env("TURNSTILE_SECRET_KEY"), response: token, ...(ip && { remoteip: ip }) }),
    });
    if (!check.ok || (await check.json()).success !== true) return reply(403);

    // The IP is stored only as a keyed hash, so it can be counted but not read back.
    const ipHash = createHmac("sha256", env("IP_HASH_SALT"))
      .update(ip ?? "unknown")
      .digest("hex");
    // Save and email are independent: the inquiry survives if either one works.
    // (Supabase's free plan pauses an idle database; the owner must still get the email.)
    let saved = false;
    try {
      const key = env("SUPABASE_SERVICE_ROLE_KEY");
      const db = await fetch(`${env("SUPABASE_URL")}/rest/v1/rpc/submit_inquiry`, {
        method: "POST",
        headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ p: inquiry, p_ip_hash: ipHash }),
      });
      if (!db.ok) throw new Error(`Supabase responded ${db.status}`);
      if ((await db.json()) !== true) return reply(429); // rate limit reached, nothing stored or sent
      saved = true;
    } catch (err) {
      // shortcut: with the database down there is no per-IP limit (Turnstile and the Cloudflare rule
      // still apply), upgrade to a second rate-limit store if this window is ever abused.
      console.error("Inquiry NOT saved to database:", err instanceof Error ? err.message : err);
    }

    let emailed = false;
    try {
      const mail = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env("RESEND_API_KEY")}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: env("INQUIRY_FROM"),
          to: env("INQUIRY_TO"),
          reply_to: inquiry.email,
          subject: `Inquiry: ${inquiry.product} — ${inquiry.company} (${inquiry.country})`,
          // Plain text only: nothing the visitor typed is ever interpreted as HTML.
          text: [
            ...(saved ? [] : ["WARNING: this inquiry was NOT saved to the database. This email is the only copy.", "Check that the Supabase project is not paused.", ""]),
            `Name: ${inquiry.name}`,
            `Company: ${inquiry.company}`,
            `Email: ${inquiry.email}`,
            `Phone: ${inquiry.phone ?? "-"}`,
            `Country: ${inquiry.country}`,
            `Product: ${inquiry.product}`,
            `Quantity: ${inquiry.quantity}`,
            `Documents requested: ${inquiry.documents ? "YES" : "no"}`,
            "",
            inquiry.message ?? "(no message)",
          ].join("\n"),
        }),
      });
      if (!mail.ok) throw new Error(`Resend responded ${mail.status}`);
      emailed = true;
    } catch (err) {
      console.error("Inquiry email NOT sent:", err instanceof Error ? err.message : err);
    }

    // Only tell the visitor it failed if the inquiry reached neither place.
    if (!saved && !emailed) return reply(500);
    return reply(200, true);
  } catch (err) {
    console.error("Inquiry endpoint error:", err instanceof Error ? err.message : err);
    return reply(500);
  }
}
