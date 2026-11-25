import { describe, expect, it, vi } from "vitest";
import { retry, retryable } from "@/lib/http";

describe("retry with backoff", () => {
  const replies = (...statuses: number[]) => {
    const f = vi.fn();
    for (const s of statuses) f.mockResolvedValueOnce(new Response(null, { status: s }));
    return f;
  };

  it("retries a temporary failure and returns the success", async () => {
    const f = replies(503, 200);
    expect((await retry(f, 3, 1)).status).toBe(200);
    expect(f).toHaveBeenCalledTimes(2);
  });
  it("never retries a client error", async () => {
    const f = replies(400, 200);
    expect((await retry(f, 3, 1)).status).toBe(400);
    expect(f).toHaveBeenCalledTimes(1);
  });
  it("stops after the last attempt", async () => {
    const f = replies(500, 500, 500, 200);
    expect((await retry(f, 3, 1)).status).toBe(500);
    expect(f).toHaveBeenCalledTimes(3);
  });
  it("retries a network error, then gives up by throwing", async () => {
    const f = vi.fn().mockRejectedValue(new Error("timeout"));
    await expect(retry(f, 2, 1)).rejects.toThrow("timeout");
    expect(f).toHaveBeenCalledTimes(2);
  });
  it("treats 429 and 5xx as worth retrying", () => {
    expect([429, 500, 502, 503].every(retryable)).toBe(true);
    expect([200, 400, 401, 403, 404].some(retryable)).toBe(false);
  });
});
