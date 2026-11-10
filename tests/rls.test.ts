import { describe, expect, it } from "vitest";

// Live check against the real Supabase project: the public (anon) key must be able to do nothing.
// Skipped unless both variables are set. Run with:
//   $env:SUPABASE_URL="https://xxxx.supabase.co"; $env:SUPABASE_ANON_KEY="..."; npm test
const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;

describe.skipIf(!url || !anon)("Supabase row level security (anon key)", () => {
  const call = (path: string, init: RequestInit = {}) =>
    fetch(`${url}/rest/v1/${path}`, {
      ...init,
      headers: { apikey: anon!, Authorization: `Bearer ${anon}`, "Content-Type": "application/json" },
    });

  it("cannot read inquiries", async () => {
    const res = await call("inquiries?select=*");
    const rows = res.ok ? await res.json() : [];
    expect(rows).toEqual([]);
  });

  it("cannot insert an inquiry", async () => {
    const res = await call("inquiries", { method: "POST", body: JSON.stringify({ name: "x" }) });
    expect(res.ok).toBe(false);
  });

  it("cannot update or delete inquiries", async () => {
    for (const method of ["PATCH", "DELETE"]) {
      const res = await call("inquiries?id=not.is.null", { method, body: method === "PATCH" ? JSON.stringify({ name: "x" }) : undefined });
      expect(res.ok).toBe(false);
    }
  });

  it("cannot call submit_inquiry", async () => {
    const res = await call("rpc/submit_inquiry", { method: "POST", body: JSON.stringify({ p: {}, p_ip_hash: "0".repeat(64) }) });
    expect(res.ok).toBe(false);
  });
});
