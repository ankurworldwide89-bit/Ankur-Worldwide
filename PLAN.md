# PLAN — ankurworldwide.com

Status: **draft, waiting for owner approval.** No site code is written until this is approved.

## 1. Facts on record

Only these facts may appear on the site. Anything not listed here is left off the page.

| Fact | Value | Shown on site |
|---|---|---|
| Company | Ankur Worldwide, a proprietorship | Yes |
| Heritage | Ankur Novelty Store, Bagasara, Gujarat. Family has traded for 50+ years; the store still operates | Yes, worded as family trading history, never as export history |
| Proprietor | Mufaddal Akil Kapadiya | Yes. No other generation is named |
| Launch product | Incense sticks (agarbatti), manufactured by Ankur Worldwide | Yes, as "manufacturer and exporter" |
| Imports | To be announced | One line only |
| Markets | Worldwide | Yes, as "we ship worldwide". No country counts or lists |
| Email | ankurworldwide89@gmail.com | Yes (also careers line and security.txt) |
| Phone / WhatsApp | +91 88662 53153 | Yes |
| Hours | 8:00 to 20:00 IST | Yes |
| Group concerns | Ankur Novelty Store only | Yes |

Not supplied yet, so **omitted**: store founding year, registered address, IEC, GSTIN, other registrations,
product variants, packaging, MOQ, HS code, private-label terms. See section 8.

Hard rules from the brief stay in force: no 1989 date, no invented clients, numbers, awards or certificates.

## 2. Sitemap

| Path | Page | Notes |
|---|---|---|
| `/` | Home | Hero, what we trade, heritage in brief, compliance strip, how an order works, final call to action |
| `/about` | About Us | Four-chapter scroll story, one chapter per generation. Reads fully with motion off |
| `/products` | Products | Catalogue generated from content files |
| `/products/[slug]` | Product | Description, specs, packaging, MOQ, HS code, private label, pre-filled inquiry button |
| `/group` | Group Concern | Ankur Novelty Store |
| `/compliance` | Certifications and Compliance | Registration numbers as text with links to government verification portals |
| `/contact` | Contact Us | Inquiry form, email, phone/WhatsApp, hours, careers line |
| `/privacy`, `/terms` | Legal | Marked as drafts for a lawyer |
| `/api/inquiry` | Inquiry endpoint | The only server code |
| `/sitemap.xml`, `/robots.txt`, `/.well-known/security.txt` | Generated | |

No blog, no careers page.

Sections whose facts are missing do not render. Example: the compliance strip on Home and the registration
list on `/compliance` stay hidden until IEC or GSTIN is supplied. Until then `/compliance` explains that
documents are available on request through the inquiry form.

Translations later: pages live under one route group, so adding a `[lang]` folder is a folder move, not a rewrite.

## 3. Content model

Everything editable lives in `/content`, checked by Zod when the site builds. A wrong or missing required
field stops the build instead of reaching visitors.

- `content/company.ts` — name, proprietor, contact, hours, optional address, optional registrations
  (`{ label, number, verifyUrl }`).
- `content/products/*.ts` — one file per product: `slug`, `name`, `summary`, `description`,
  `manufacturedInHouse`, and optional `specs`, `packaging`, `moq`, `hsCode`, `privateLabel`, `images`.
  Optional fields that are empty hide their block on the page.
- `content/about.ts` — the four chapters.
- `content/images/` + `manifest.ts` — every image slot with a fixed aspect ratio. Replacing a photo means
  replacing a file and one manifest line.

Adding product number 100 is the same step as adding product number 2: add one file.

## 4. Components

`Logo` (single SVG wordmark, swapped later for the AW monogram), `Button`, `Section`, `Nav`, `Footer`,
`ImageSlot`, `SpecTable`, `ProcessSteps`, `Chapter`, `InquiryForm`, `JsonLd`. Nothing else until a page needs it.

## 5. Tech stack

Versions checked on 2026-11-11.

| Package | Version | Why it is needed |
|---|---|---|
| next | 16.4.6 | Framework, static pages, image optimisation, self-hosted fonts |
| react / react-dom | 19.3.1 | Required by Next.js |
| typescript | latest | Strict type checking |
| tailwindcss | 4.3.5 | Styling |
| zod | 4.6.7 | Validates content at build time and inquiry input on the server |
| vitest (dev only) | latest | Tests for validation, rate limiting, database rules |

Deliberately not added:

- **Supabase and Resend SDKs.** Each is one HTTPS call from the server, done with built-in `fetch`.
- **Animation library.** CSS handles the planned motion. One is added only if a specific effect needs it.
- **CMS, auth, admin panel.** None exist, so none can be attacked.

Analytics: **Vercel Web Analytics**. It is cookieless, so no cookie banner, and it needs no extra account.

## 6. Security architecture

```
Visitor → Cloudflare (TLS, WAF, bot rules, rate limit) → Vercel (static pages)
                                                       → /api/inquiry → Supabase (insert only)
                                                                      → Resend (email to owner)
```

- **Pages are static files.** No login, no uploads, no database reads from the browser.
- **Inquiry endpoint**, in order: size limit → honeypot → Zod validation with length limits → Turnstile
  check → rate limit per IP → insert → email. Errors returned to the visitor are generic.
- **Rate limiting** uses a Postgres function in the same Supabase project (counts recent requests per
  hashed IP), plus a Cloudflare rule on the route. No extra service.
- **Supabase**: Row Level Security on. The existing public-insert policy is removed. The anonymous role
  has no access at all. Only the server, holding the service-role key, can insert. IP addresses are stored
  hashed.
- **Secrets** live only in Vercel environment variables. gitleaks runs before each commit.
- **Headers**: CSP, HSTS with preload, X-Content-Type-Options, Referrer-Policy, Permissions-Policy,
  frame-ancestors 'none', COOP, CORP.
- **Supply chain**: committed lockfile, `npm audit` and CodeQL in GitHub Actions, Dependabot, branch protection.
- **DNS and email**: DNSSEC, CAA, SPF, DKIM, DMARC.

### One conflict in the brief that needs a decision

The brief asks for both "static generation for every page" and "CSP with nonces". A nonce must be new on
every request, which forces every page to be generated on the server each time. That makes the site slower
and adds server code to attack.

**Recommended:** keep pages static and use a **hash-based** CSP. It still bans `unsafe-inline` and
`unsafe-eval`, which is what the nonce rule is there to achieve. I will confirm it scores A+ on
securityheaders.com after deployment and record the result. If it cannot be made strict enough, I will
report that rather than loosen the policy quietly.

## 7. Design directions (step 3)

Two running mockups of the hero and one product page, then the owner chooses.

- **A — "Counter".** Deep forest green background, warm off-white serif headlines, brass hairline accents.
  Feels like heritage and craft.
- **B — "Ledger".** Warm off-white background, charcoal grotesk headlines set large and tight, forest green
  for actions, brass used once per screen. Feels like precision and modern trade.

Both use the typographic wordmark, no stock imagery, no 3D, no carousels.

## 8. Still needed from the owner

Blocking for launch quality (site builds without them, but the sections stay hidden):

1. **IEC and GSTIN.** Both are printed on the IEC certificate and GST certificate. Without them the
   compliance page has nothing a buyer can verify, which is the main trust signal on the site.
2. **Registered address**, copied from the GST certificate.
3. **Incense stick details**: fragrances or variants, stick length, burn time, pack sizes, carton sizes,
   MOQ, private label yes/no. The HS code commonly used for agarbatti is 3307.41.00; confirm this is what
   your shipping documents use before it is published.
4. **Business days** for the 8:00 to 20:00 hours (assumed Monday to Saturday until confirmed).
5. **Confirm** that Mufaddal Akil Kapadiya is shown as proprietor of Ankur Worldwide (the fourth generation).
6. **Photos** of products, and of the store if the family agrees.
7. **Lawyer review** of the privacy policy and terms.

Accounts only the owner can create or sign in to (I cannot create accounts or enter passwords):
GitHub repository, Vercel, Supabase, Cloudflare, Resend, each under ankurworldwide89@gmail.com.
DEPLOY.md will walk through each one step by step. Until then the repository lives locally in this folder.

Recommendation, not a blocker: a mailbox on the domain (for example `info@ankurworldwide.com`) looks far
more credible to overseas buyers than a Gmail address. DEPLOY.md will cover how to set one up.

## 9. Build order after approval

1. Two design directions as running pages. Owner chooses.
2. Design system, then Home, Products, Compliance, About, Contact, Group, legal.
3. Inquiry pipeline with tests.
4. Performance, accessibility and SEO pass with measured results in README.
5. Security self-audit: SECURITY.md, SECURITY-CHECKLIST.md.
6. DEPLOY.md and CONTENT-GUIDE.md.
