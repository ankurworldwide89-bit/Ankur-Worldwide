# Security

No website can be guaranteed unbreakable. The approach here is to leave very little to attack, harden what
remains, and write down honestly what was and was not checked.

**Report a vulnerability:** ankurworldwide89@gmail.com (also in `/.well-known/security.txt`).

## Design

```
Visitor → Cloudflare (TLS, WAF, bot rules, rate limit) → Vercel → static pages
                                                               → /api/inquiry → Cloudflare Turnstile (verify)
                                                                              → Supabase (insert only)
                                                                              → Resend (email to owner)
```

- **Nothing to log in to.** No accounts, admin panel, sessions, cookies or file uploads.
- **Pages are static files.** No code runs when a page is viewed.
- **One endpoint**, `POST /api/inquiry` (`app/api/inquiry/route.ts`). In order: content-type check, origin
  check, 10,000-character limit, strict schema validation (`lib/inquiry.ts`), honeypot, Turnstile
  verification, rate limit and insert in a single database call, then a plain-text email.
- **Database.** Row Level Security is on with no policies, and all rights are revoked from the public roles.
  The browser never talks to Supabase. Only the server, with the secret key, can call `submit_inquiry()`.
- **Rate limit.** 5 inquiries per hour per network address, enforced inside the database, with a Cloudflare
  rule in front.
- **Personal data.** IP addresses are stored only as a keyed hash. Inquiries are kept 24 months.
- **Secrets.** Only in Vercel environment variables. `.env*` files are ignored by git. gitleaks scans
  commits locally (if installed) and in CI.
- **Third-party code in the browser.** Only Cloudflare Turnstile, and only on the Contact page. Analytics
  is served from the site's own address.
- **Supply chain.** Lockfile committed; `npm audit`, CodeQL and gitleaks run in GitHub Actions; Dependabot
  proposes updates weekly.

## Response headers

Set in `next.config.ts` for every response.

| Header | Value |
|---|---|
| Content-Security-Policy | `default-src 'self'`; scripts from own site, Turnstile, and hash-listed inline scripts only; no `unsafe-inline`, no `unsafe-eval`; `frame-ancestors 'none'`; `object-src 'none'`; `base-uri 'self'`; `form-action 'self'` |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | camera, microphone, geolocation, payment and others disabled |
| Cross-Origin-Opener-Policy | `same-origin` |
| Cross-Origin-Resource-Policy | `same-origin` |

The CSP uses hashes instead of nonces so that pages can stay static. This was a decision approved in PLAN.md.
README.md explains how the build generates and verifies the hashes.

## What was verified, and how

| Check | Result |
|---|---|
| Headers present on a production build (`npm run start`, inspected with curl) | Pass |
| Pages load and run under the CSP in a browser, including the Turnstile widget | Pass |
| A script injected into the page at runtime is blocked by the CSP | Pass |
| Endpoint rejects invalid input, oversized bodies, wrong content types, other origins (automated tests) | Pass, 16 tests |
| Endpoint stores nothing when Turnstile fails; sends no email when rate limited (automated tests) | Pass |
| Endpoint error replies contain no details (automated test and live request) | Pass |
| The raw IP address and the Turnstile token are never sent to the database (automated test) | Pass |
| `npm audit` | 0 known vulnerabilities on 11 November 2026 |

## What could NOT be verified yet

All of these need the live deployment or accounts only the owner can open. DEPLOY.md says when to do each.

1. **A real inquiry end to end** (Turnstile → Supabase → email).
2. **Database permissions against the real project.** The tests exist (`tests/rls.test.ts`) but skip until
   `SUPABASE_URL` and `SUPABASE_ANON_KEY` are provided.
3. **The SQL script itself** has not been run against a database.
4. **Whether Supabase's newer `sb_secret_…` keys work** with the endpoint as written (it sends the key in
   both the `apikey` and `Authorization` headers).
5. **CSP hashes on Vercel.** The build verifies them, but if Vercel or Cloudflare changes the HTML after the
   build (for example Cloudflare's email obfuscation, Rocket Loader or automatic script injection), pages
   would break. DEPLOY.md turns those features off; check the browser console after deploying.
6. **securityheaders.com, SSL Labs and Mozilla Observatory grades.** Targets are A+, A+ and a pass.
7. **Cloudflare settings** (TLS mode, WAF, bot protection, rate-limit rule), **DNSSEC, CAA, SPF, DKIM, DMARC.**
8. **GitHub Actions workflows** have not run yet; they run on the first push.
9. **Vercel Web Analytics** loading and counting page changes correctly.

## Known limits

- **Rate limit can be weakened by calling the `*.vercel.app` address directly.** There, the
  `cf-connecting-ip` header can be forged, giving an attacker a fresh identity per request. Turnstile still
  applies to every request. To close this fully, restrict the Vercel deployment to Cloudflare traffic.
- **A paused database removes the per-address rate limit.** Supabase's free plan pauses an idle project.
  The endpoint then skips saving and still emails the inquiry, marked "NOT saved to the database". While that
  lasts, only Turnstile and the Cloudflare rule limit abuse. Un-pause the project when such an email arrives.
- **The rate-limit count is not atomic.** Several simultaneous requests can slightly exceed 5 per hour.
- **`style-src 'self'` is strict.** When the first real photo is added, the image component's inline style
  may be blocked and logged. It is cosmetic. If it appears, add `style-src-attr 'unsafe-inline'` to the CSP
  in `next.config.ts`; that allows style attributes only, not style or script blocks.
- **HSTS preload** takes effect only after the domain is submitted at hstspreload.org, and is slow to undo.
- **Email goes to a Gmail inbox.** Its security is the security of that Google account.

## Self-audit: OWASP Top 10 (2025)

| Risk | Status | Notes |
|---|---|---|
| A01 Broken access control | Addressed | No user accounts. Database denies everything to public roles. Live check pending (item 2 above) |
| A02 Security misconfiguration | Addressed in code | Headers set, `X-Powered-By` removed, generic errors. Cloudflare and DNS settings pending |
| A03 Software supply chain failures | Addressed | Lockfile, 5 runtime packages, audit + CodeQL + Dependabot. Workflows not yet run |
| A04 Cryptographic failures | Addressed | HTTPS only with HSTS; IPs stored as HMAC-SHA256; no passwords stored. TLS grade pending |
| A05 Injection | Addressed | Strict schema; database values passed as parameters, never built into SQL; email is plain text; control characters rejected; CSP as a second layer |
| A06 Insecure design | Addressed | Minimal design: static pages, one write-only endpoint |
| A07 Authentication failures | Not applicable on the site | There is no login. Owner account security is in SECURITY-CHECKLIST.md |
| A08 Software or data integrity failures | Mostly addressed | Deploys only from the protected `main` branch. Turnstile's script cannot use Subresource Integrity because Cloudflare changes it without notice |
| A09 Logging and alerting failures | Partly addressed | Errors are logged in Vercel without personal data. No alerting is set up; the owner must look at Vercel logs and Cloudflare events |
| A10 Mishandling of exceptional conditions | Addressed | Every failure path returns a generic reply; saving and emailing are independent, so one failing never loses an inquiry; missing configuration fails closed |

## Self-audit: OWASP ASVS Level 2 (v4.0.3 chapters)

This is a self-assessment by the author of the code, not an independent audit.

| Chapter | Status | Notes |
|---|---|---|
| V1 Architecture | Met | Documented here and in PLAN.md; single trust boundary at the endpoint |
| V2 Authentication | Not applicable | No authentication on the site |
| V3 Session management | Not applicable | No sessions or cookies |
| V4 Access control | Met in design | Deny-by-default in the database. Live verification pending |
| V5 Validation, sanitisation, encoding | Met | Allow-list schema on the server, length limits, unknown fields rejected, database constraints repeat the limits |
| V6 Stored cryptography | Met | Keyed hash for IPs; secret held outside the code |
| V7 Error handling and logging | Partly met | No sensitive data in logs or replies. No log monitoring or alerting (Level 2 expects it) |
| V8 Data protection | Mostly met | Minimal data, stated retention, `no-store` on endpoint replies. Deleting old inquiries is manual |
| V9 Communication | Pending | HSTS set in code. TLS configuration is verified only after Cloudflare is set up |
| V10 Malicious code | Met | Small dependency set, automated scanning, no dynamic code loading except Turnstile |
| V11 Business logic | Mostly met | Anti-automation by Turnstile, honeypot and rate limit. Limits noted above |
| V12 Files and resources | Not applicable | No uploads; no user-controlled file paths or URLs fetched |
| V13 API | Met | One JSON endpoint, content type enforced, origin checked, schema validated |
| V14 Configuration | Mostly met | Headers, secrets handling and build verification done. Edge configuration pending |

## Recommendation

Before the site is used for anything beyond receiving inquiries (payments, customer accounts, document
downloads), commission an **independent penetration test**. A self-audit cannot replace one.
