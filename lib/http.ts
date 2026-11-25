// Outgoing requests from the server. Every call gets a time limit, so a stuck service cannot keep the
// visitor waiting until Vercel kills the function. `retry` tries again only on errors that are worth it.

export const TIMEOUT_MS = 8_000;

export function fetchWithTimeout(url: string, init: RequestInit = {}, ms = TIMEOUT_MS): Promise<Response> {
  return fetch(url, { ...init, signal: AbortSignal.timeout(ms) });
}

// Worth retrying: rate-limited (429) or a temporary server fault (5xx). Never a 4xx: that would fail again.
export const retryable = (status: number) => status === 429 || status >= 500;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Exponential backoff: waits 400 ms, then 800 ms. Kept short because a visitor is waiting for the reply.
// Only use it for calls that are safe to repeat (idempotent), such as an email sent with an Idempotency-Key.
export async function retry(call: () => Promise<Response>, attempts = 3, baseMs = 400): Promise<Response> {
  for (let i = 1; ; i++) {
    try {
      const res = await call();
      if (i >= attempts || !retryable(res.status)) return res;
    } catch (err) {
      if (i >= attempts) throw err;
    }
    await wait(baseMs * 2 ** (i - 1));
  }
}
