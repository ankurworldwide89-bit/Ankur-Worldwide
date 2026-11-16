import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/publish/route";
import { Markdown, safeHref } from "@/lib/markdown";

const html = (source: string) => renderToStaticMarkup(createElement(Markdown, { source }));

describe("blog post renderer", () => {
  it("renders headings, lists, emphasis and paragraphs", () => {
    const out = html("## Title\n\nSome **bold** and *soft* text.\n\n- one\n- two\n\n1. first\n2. second");
    expect(out).toContain("<h2>Title</h2>");
    expect(out).toContain("<strong>bold</strong>");
    expect(out).toContain("<em>soft</em>");
    expect(out).toContain("<ul><li>one</li><li>two</li></ul>");
    expect(out).toContain("<ol><li>first</li><li>second</li></ol>");
  });

  it("never outputs raw HTML typed into a post", () => {
    const out = html('<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">');
    expect(out).not.toContain("<script");
    expect(out).not.toContain("<img");
    expect(out).toContain("&lt;script&gt;");
  });

  it("drops dangerous links but keeps their text", () => {
    expect(html("[click](javascript:alert(1))")).not.toContain("href");
    expect(html("[click](javascript:alert(1))")).toContain("click");
    expect(safeHref("data:text/html,x")).toBeNull();
    expect(safeHref("//evil.example")).toBeNull();
    expect(safeHref("/contact")).toBe("/contact");
    expect(html("[site](https://example.com)")).toContain('href="https://example.com/"');
    expect(html("[site](https://example.com)")).toContain('rel="noopener noreferrer nofollow"');
  });
});

describe("POST /api/publish", () => {
  const token = (aal: string, sub = "user-1") => ["h", Buffer.from(JSON.stringify({ aal, sub })).toString("base64url"), "sig"].join(".");
  const outside = (o: { user?: number; admin?: readonly unknown[]; hook?: number } = {}) =>
    vi.fn(async (url: string | URL | Request) => {
      const u = String(url);
      if (u.includes("/auth/v1/user")) return Response.json({ id: "user-1" }, { status: o.user ?? 200 });
      if (u.includes("/rest/v1/blog_admins")) return Response.json(o.admin ?? [{ user_id: "user-1" }]);
      if (u.includes("deploy-hook")) return new Response("ok", { status: o.hook ?? 201 });
      throw new Error(`Unexpected request to ${u}`);
    });
  const post = (headers: Record<string, string> = {}) =>
    POST(new Request("https://ankurworldwide.com/api/publish", { method: "POST", headers: { host: "ankurworldwide.com", ...headers } }));
  const hookCalls = (f: ReturnType<typeof outside>) => f.mock.calls.filter(([u]) => String(u).includes("deploy-hook")).length;

  beforeEach(() => {
    vi.stubEnv("VERCEL_DEPLOY_HOOK_URL", "https://api.vercel.com/deploy-hook/test");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("rebuilds for a two-factor admin session", async () => {
    const f = outside();
    vi.stubGlobal("fetch", f);
    expect((await post({ authorization: `Bearer ${token("aal2")}` })).status).toBe(200);
    expect(hookCalls(f)).toBe(1);
  });

  it("refuses without a token, with an invalid token, without two-factor, or for a non-admin", async () => {
    for (const [headers, opts, status] of [
      [{}, {}, 401],
      [{ authorization: `Bearer ${token("aal2")}` }, { user: 401 }, 401],
      [{ authorization: `Bearer ${token("aal1")}` }, {}, 403],
      [{ authorization: `Bearer ${token("aal2", "someone-else")}` }, {}, 403],
      [{ authorization: `Bearer ${token("aal2")}` }, { admin: [] }, 403],
      [{ authorization: `Bearer ${token("aal2")}`, origin: "https://evil.example" }, {}, 403],
    ] as const) {
      const f = outside(opts);
      vi.stubGlobal("fetch", f);
      expect((await post(headers)).status).toBe(status);
      expect(hookCalls(f)).toBe(0);
    }
  });

  it("reports 503 when the deploy hook is not configured", async () => {
    vi.stubEnv("VERCEL_DEPLOY_HOOK_URL", "");
    vi.stubGlobal("fetch", outside());
    expect((await post({ authorization: `Bearer ${token("aal2")}` })).status).toBe(503);
  });
});
