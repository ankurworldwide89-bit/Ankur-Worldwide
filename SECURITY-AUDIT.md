# Security and reliability check (25 November 2026)

**Fixed** = changed in this branch. **Done** = already in place, checked. **Not needed** = does not apply to
this site (static pages on Vercel's free plan, one form, one admin page), with the reason.

## B. Security checklist

| Item | Result | Note |
|---|---|---|
| SQL injection | Done | No SQL is built from text. The form goes through `submit_inquiry()`, which takes each field by name; the blog uses the Supabase API. |
| Prompt injection | Not needed | The site uses no AI. |
| RLS policies | Done | RLS on every table. Inquiries: no policies, all rights revoked, only the server key can call the function. Posts: anyone reads published posts, only a 2-factor admin writes. |
| Mass assignment | Done | The form schema is strict (`z.strictObject`): unknown fields are rejected. The database function copies only named fields. |
| Privilege escalation | Done | Admin = a row in `blog_admins` that no one can write through the API, plus 2-factor (aal2), checked by the database and by `/api/publish`. |
| Open redirects | Done | No redirect takes an address from the visitor. Blog links allow only http(s), mailto and same-site. |
| Command injection | Done | No server code runs shell commands. |
| Audit logging | **Fixed** | New `supabase/blog-audit.sql`: the database records who added, changed or removed each blog post. **Owner step: paste it once into Supabase > SQL Editor.** |
| Hardcoded secrets | Done | Only the public Supabase key is in the code (designed to be public). Secrets are in Vercel; `.env*` is ignored by git; gitleaks runs in CI. |
| Weak hashing | Done | IPs are stored as HMAC-SHA256 with a secret salt. Passwords are handled by Supabase (bcrypt). |
| Slopsquatting (fake packages) | Done | Only 5 runtime packages (next, react, react-dom, @supabase/supabase-js, zod) and 7 dev ones, all the real official ones. Lockfile committed; CI uses `npm ci`. |
| Dependency CVEs | Done | `npm audit`: 0 vulnerabilities. CI fails on high ones; Dependabot runs weekly. |
| SRI hashes | Not needed | Every script is served from the site itself. The one outside script, Cloudflare Turnstile, changes without notice, and Cloudflare says not to pin it; the CSP allows only that one address. |
| CSP headers | Done | Strict CSP with a hash for each inline script, no `unsafe-inline` or `unsafe-eval`. The build fails if the hashes do not match. The new scroll effects are pure CSS, so nothing had to be loosened. |
| Clickjacking | Done | `frame-ancestors 'none'` and `X-Frame-Options: DENY`. |
| Public storage buckets | Not needed | The site uses no Supabase storage. |
| Debug mode | Done | Production build only; no browser source maps; `X-Powered-By` header off. |
| Token expiry | Done | Supabase sessions expire (1-hour access token) and live in sessionStorage, so closing the tab signs out. `/api/publish` asks Supabase to verify each token. |
| Insecure deserialization | Done | Only JSON is read, and it is checked against the strict schema before use. |
| Stack traces leaking | Done | API errors return only `{ ok: false }` and a status code; details go to the Vercel log only. |

## C. Reliability and setup checklist

| Item | Result | Note |
|---|---|---|
| Load balancing | Not needed | Vercel and Cloudflare spread traffic automatically. |
| Rate limiting | Done | 5 inquiries per hour per network, in the database, plus Turnstile and a Cloudflare rule. |
| Env vars | Done | All 8 set in Vercel (fixed earlier today); `.env.example` lists them. |
| Secrets management | Done | Vercel environment variables; yearly key change in SECURITY-CHECKLIST.md. |
| Authentication | Done | Only the blog admin signs in: Supabase password plus required 2-factor; public sign-up off. |
| Authorization | Done | Enforced by the database (RLS), not only the page. |
| Input validation | Done | Strict schema, length limits, no control characters, product from a fixed list. |
| HTTP status codes | Done | 200, 400, 401, 403, 413, 415, 429, 500, 503 used correctly. |
| Error handling | Done | An inquiry is accepted if it is saved OR emailed, so a sleeping database never loses one. |
| Automated tests | **Fixed** | 5 new tests: retry with backoff, time limits, same email key for the same inquiry. 51 tests pass. |
| DB indexing | Done | Index on (ip_hash, created_at) for the rate limit; posts are found by their unique slug. New audit table has its own index. |
| DB migrations | Done | `supabase/schema.sql`, `blog.sql`, `blog-audit.sql`, all safe to run again. |
| Backups | Done (limited) | The free plan has no automatic backups you can restore. Every inquiry is also emailed, and posts are small; export the tables from Supabase now and then. |
| Caching | Done | Pages are static and cached by Vercel's CDN; API answers say `no-store`. |
| CDNs | Done | Vercel's CDN, with Cloudflare in front. |
| Logging | Done | Server errors go to the Vercel log; no personal data is logged. |
| Monitoring | Done (free) | Vercel shows function errors and Web Analytics. Optional: a free uptime check such as UptimeRobot. |
| Timeouts | **Fixed** | Every outside call now stops after 8 seconds (Turnstile, Supabase, Resend, deploy hook); the build's blog fetch after 30. |
| Exponential backoff | **Fixed** | The email is tried again once after a short wait if Resend is busy or down. |
| Idempotency | **Fixed** | Each email carries an Idempotency-Key, so the same inquiry is never emailed twice. Turnstile tokens work only once, so a double click cannot save twice. |
| Circuit breakers | Not needed | One form with time limits; nothing to break a chain. |
| Reverse proxies | Not needed | Cloudflare already sits in front of Vercel. |
| API gateways | Not needed | Two small endpoints. |
| Docker | Not needed | Vercel builds and runs the site. |
| CI/CD | Done | GitHub Actions: types, tests, build, npm audit, gitleaks, CodeQL. Vercel deploys from `main`. |
| Message queues | Not needed | One inquiry at a time; email is the backup path. |
| HTTPS/TLS | Done | Forced by Vercel and Cloudflare; HSTS with preload. |
| Session management | Done | Only for the admin: sessionStorage, short-lived tokens, sign-out button. |
| XSS / CSRF | Done | React escapes all text; blog Markdown cannot add HTML; strict CSP. The form checks the Origin header and needs a Turnstile token; there are no cookies to steal. |
