# ankurworldwide.com

Website for Ankur Worldwide: a static site with one server endpoint that receives buyer inquiries.

| Document | What it is for |
|---|---|
| [PLAN.md](PLAN.md) | The approved plan: pages, content model, security design |
| [DEPLOY.md](DEPLOY.md) | Step-by-step: GitHub, Supabase, Turnstile, Resend, Vercel, Cloudflare, GoDaddy, email records |
| [CONTENT-GUIDE.md](CONTENT-GUIDE.md) | Add a product, replace a photo, swap the logo, add registration numbers |
| [SECURITY.md](SECURITY.md) | Security design and self-audit |
| [SECURITY-CHECKLIST.md](SECURITY-CHECKLIST.md) | Steps only the owner can do |
| [NEEDED-FROM-OWNER.md](NEEDED-FROM-OWNER.md) | Facts, photos and reviews still missing |

## Run it locally

```bash
npm install
```

```bash
copy .env.example .env.local
```

```bash
npm run dev
```

Open http://localhost:3000. The inquiry form shows an error locally until Supabase and Resend keys are in `.env.local`.

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build. Builds twice: see "How the CSP works" |
| `npm run start` | Serve the production build |
| `npm test` | Tests for validation, the endpoint and (with keys) database permissions |
| `npm run typecheck` | TypeScript check |

## How it is put together

- `app/` — pages. Every page is a static file. `app/api/inquiry/route.ts` is the only server code.
- `content/` — all facts, products and images. Checked by Zod at build time: a mistake stops the build.
- `components/` — `Logo`, navigation and footer (`chrome.tsx`), shared pieces (`ui.tsx`), `InquiryForm`.
- `lib/inquiry.ts` — the one definition of a valid inquiry.
- `supabase/schema.sql` — database table, permissions and rate limit.
- `scripts/csp.mjs`, `next.config.ts` — security headers.

## How the CSP works

A Content-Security-Policy tells the browser which scripts may run. Ours bans all inline scripts except the
few Next.js itself needs, identified by their SHA-256 hash. `npm run build` therefore does four things:
build, hash the inline scripts of every page, build again with those hashes in the headers, then verify the
hashes still match. If they do not match, the build fails instead of shipping a site that blocks itself.

## Dependencies and why each exists

| Package | Why |
|---|---|
| `next`, `react`, `react-dom` | The framework: static pages, routing, fonts, images |
| `zod` | Validates content at build time and inquiries on the server |
| `tailwindcss`, `@tailwindcss/postcss` (dev) | Styling |
| `typescript`, `@types/*` (dev) | Type checking |
| `vitest` (dev) | Tests |

Not used on purpose: Supabase and Resend SDKs (one `fetch` call each), animation libraries (CSS is enough),
analytics packages (one script tag for Vercel Web Analytics).

## Measured results

Lighthouse 13, mobile emulation with simulated slow 4G and 4x CPU slowdown, against `npm run start` on a
local Windows machine, 11 November 2026.

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 99 | 100 | 100 | 100 | 1.0 s | 0 | 120 ms |
| `/contact` | 97 | 100 | 100 | 100 | 0.9 s | 0 | 190 ms |
| `/about` | 92 | 100 | 100 | 100 | 0.8 s | 0 | 360 ms |
| `/products/incense-sticks` | 92 | 100 | 100 | 100 | 0.8 s | 0 | 340 ms |

What this does and does not show:

- LCP and CLS meet the targets (under 2.0 s, under 0.05) on all four pages.
- Performance is below the 95 target on two pages because of blocking time. The machine was also running
  the dev server during the test, so these numbers are noisy. **Re-measure on the deployed site** with
  https://pagespeed.web.dev and update this table.
- INP cannot be measured in a lab run. It needs real visitors (Vercel Speed Insights or PageSpeed field data).
- Pages checked by eye at 360, 1024 and 1280 px wide. 768 and 1920 px were not checked.
- No screen-reader test was done. Lighthouse checks only part of WCAG 2.2 AA.
- Product photos do not exist yet. Large or badly sized photos will lower these scores; see CONTENT-GUIDE.md.
