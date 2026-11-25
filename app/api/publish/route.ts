import { fetchWithTimeout } from "@/lib/http";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase-public";

// Rebuilds the live site so new or changed blog posts appear. Only a blog admin who has signed in with
// two-factor authentication can trigger it. The deploy hook URL stays on the server: anyone holding it could
// trigger rebuilds, so it is never sent to the browser.

const reply = (status: number, ok = false) => Response.json({ ok }, { status, headers: { "Cache-Control": "no-store" } });

function claims(token: string): Record<string, unknown> {
  const part = token.split(".")[1];
  if (!part) return {};
  try {
    return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
  } catch {
    return {};
  }
}

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin");
    if (origin && !origin.endsWith(`://${req.headers.get("host")}`)) return reply(403);

    const token = req.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
    if (!token || token.length > 4096) return reply(401);
    const auth = { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${token}` };

    // Supabase checks the token's signature and expiry; a 200 means it is a real, current session.
    const user = await fetchWithTimeout(`${SUPABASE_URL}/auth/v1/user`, { headers: auth });
    if (!user.ok) return reply(401);
    const { id } = (await user.json()) as { id?: string };
    // The token was just verified by Supabase, so its claims can be trusted.
    if (!id || claims(token).aal !== "aal2" || claims(token).sub !== id) return reply(403);

    // Row Level Security lets a user see only their own admin row, so this proves admin status.
    const admin = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/blog_admins?select=user_id&user_id=eq.${encodeURIComponent(id)}`, { headers: auth });
    if (!admin.ok || ((await admin.json()) as unknown[]).length !== 1) return reply(403);

    const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
    if (!hook) return reply(503);
    const build = await fetchWithTimeout(hook, { method: "POST" });
    if (!build.ok) throw new Error(`Deploy hook responded ${build.status}`);
    return reply(200, true);
  } catch (err) {
    console.error("Publish endpoint error:", err instanceof Error ? err.message : err);
    return reply(500);
  }
}
