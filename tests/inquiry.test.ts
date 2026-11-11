import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/inquiry/route";
import { Inquiry } from "@/lib/inquiry";

const valid = {
  name: "Jane Buyer",
  company: "Example Imports GmbH",
  email: "jane@example.com",
  country: "Germany",
  product: "incense-sticks",
  quantity: "1 x 20ft container",
  consent: true,
  token: "turnstile-token",
};

describe("inquiry validation", () => {
  const rejects = (patch: object) => expect(Inquiry.safeParse({ ...valid, ...patch }).success).toBe(false);

  it("accepts a valid inquiry", () => expect(Inquiry.safeParse(valid).success).toBe(true));
  it("rejects a missing email", () => rejects({ email: undefined }));
  it("rejects a malformed email", () => rejects({ email: "not-an-email" }));
  it("rejects over-long fields", () => rejects({ name: "x".repeat(101) }));
  it("rejects an over-long message", () => rejects({ message: "x".repeat(2001) }));
  it("rejects line breaks in single-line fields", () => rejects({ company: "Acme\r\nBcc: victim@example.com" }));
  it("rejects an unknown product", () => rejects({ product: "<script>" }));
  it("rejects unknown fields", () => rejects({ admin: true }));
  it("rejects missing consent", () => rejects({ consent: false }));
  it("rejects a missing Turnstile token", () => rejects({ token: "" }));
});

describe("POST /api/inquiry", () => {
  // Fake the three outside services. `rpc` is what the database function returns: false = rate limited.
  const outside = (o: { turnstile?: boolean; rpc?: boolean; dbStatus?: number; mailStatus?: number } = {}) =>
    vi.fn(async (url: string | URL | Request, _init?: RequestInit) => {
      const u = String(url);
      if (u.includes("turnstile")) return Response.json({ success: o.turnstile ?? true });
      if (u.includes("/rpc/submit_inquiry")) return Response.json(o.rpc ?? true, { status: o.dbStatus ?? 200 });
      if (u.includes("resend")) return Response.json({ id: "1" }, { status: o.mailStatus ?? 200 });
      throw new Error(`Unexpected request to ${u}`);
    });

  const post = (body: unknown, headers: Record<string, string> = {}) =>
    POST(
      new Request("https://ankurworldwide.com/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json", host: "ankurworldwide.com", ...headers },
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
    );

  const calls = (f: ReturnType<typeof outside>, part: string) => f.mock.calls.filter(([u]) => String(u).includes(part));

  beforeEach(() => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "ts-secret");
    vi.stubEnv("SUPABASE_URL", "https://db.example");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-key");
    vi.stubEnv("RESEND_API_KEY", "resend-key");
    vi.stubEnv("INQUIRY_FROM", "site@ankurworldwide.com");
    vi.stubEnv("INQUIRY_TO", "owner@example.com");
    vi.stubEnv("IP_HASH_SALT", "salt");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("stores and emails a valid inquiry, without the token or the raw IP", async () => {
    const f = outside();
    vi.stubGlobal("fetch", f);
    const res = await post(valid, { "cf-connecting-ip": "203.0.113.7" });
    expect(res.status).toBe(200);
    const sent = String(calls(f, "/rpc/")[0]![1]!.body);
    expect(sent).not.toContain("turnstile-token");
    expect(sent).not.toContain("203.0.113.7");
    expect(JSON.parse(sent).p_ip_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(calls(f, "resend")).toHaveLength(1);
  });

  it("returns 429 and sends no email when the rate limit is reached", async () => {
    const f = outside({ rpc: false });
    vi.stubGlobal("fetch", f);
    expect((await post(valid)).status).toBe(429);
    expect(calls(f, "resend")).toHaveLength(0);
  });

  it("returns 403 and stores nothing when Turnstile fails", async () => {
    const f = outside({ turnstile: false });
    vi.stubGlobal("fetch", f);
    expect((await post(valid)).status).toBe(403);
    expect(calls(f, "/rpc/")).toHaveLength(0);
  });

  it("silently drops honeypot submissions", async () => {
    const f = outside();
    vi.stubGlobal("fetch", f);
    expect((await post({ ...valid, website: "http://spam.example" })).status).toBe(200);
    expect(f).not.toHaveBeenCalled();
  });

  it("rejects invalid input, oversized bodies, wrong content types and other origins before any outside call", async () => {
    const f = outside();
    vi.stubGlobal("fetch", f);
    expect((await post({ ...valid, email: "nope" })).status).toBe(400);
    expect((await post("{not json")).status).toBe(400);
    expect((await post({ ...valid, message: "x".repeat(20_000) })).status).toBe(413);
    expect((await post(valid, { "content-type": "text/plain" })).status).toBe(415);
    expect((await post(valid, { origin: "https://evil.example" })).status).toBe(403);
    expect(f).not.toHaveBeenCalled();
  });

  it("still emails the inquiry, with a warning, when the database is down", async () => {
    const f = outside({ dbStatus: 500 });
    vi.stubGlobal("fetch", f);
    expect((await post(valid)).status).toBe(200);
    expect(String(calls(f, "resend")[0]![1]!.body)).toContain("NOT saved to the database");
  });

  it("still succeeds when the inquiry is saved but the email fails", async () => {
    vi.stubGlobal("fetch", outside({ mailStatus: 500 }));
    expect((await post(valid)).status).toBe(200);
  });

  it("returns only a generic error when both the database and the email fail", async () => {
    vi.stubGlobal("fetch", outside({ dbStatus: 500, mailStatus: 500 }));
    const res = await post(valid);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ ok: false });
  });
});
