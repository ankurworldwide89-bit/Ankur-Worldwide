# Deploying ankurworldwide.com

Follow the steps in order. Allow two to three hours the first time. Menu names on these services change
from time to time; if a label differs slightly, look for the closest match.

You will collect eight values along the way. Keep them in your password manager, not in a file in this folder.

| Name | Comes from |
|---|---|
| `SUPABASE_URL` | Step 3 |
| `SUPABASE_SERVICE_ROLE_KEY` | Step 3 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Step 4 |
| `TURNSTILE_SECRET_KEY` | Step 4 |
| `RESEND_API_KEY` | Step 5 |
| `INQUIRY_FROM` | Step 5 |
| `INQUIRY_TO` | The inbox that receives inquiries, for example ankurworldwide89@gmail.com |
| `IP_HASH_SALT` | Step 6 |

Before you start, do the "Accounts" section of SECURITY-CHECKLIST.md.

## 1. Push the code to GitHub

In a terminal in this folder:

```bash
git push -u origin main
```

A browser window asks you to sign in to GitHub. Afterwards, refresh
https://github.com/ankurworldwide89-bit/Ankur-Worldwide and confirm the files are there.

Then check the **Actions** tab. Two workflows, "CI" and "CodeQL", should run and turn green. If one is red,
open it and read the failing step before continuing.

## 2. Protect the main branch

GitHub → the repository → **Settings → Branches → Add branch ruleset** (or "Add rule"):

- Target branch: `main`
- Require a pull request before merging
- Require status checks to pass: select `check` and `analyze`
- Block force pushes

Then **Settings → Code security**: turn on Dependabot alerts, Dependabot security updates, secret scanning
and push protection.

From now on, changes go in through a pull request rather than a direct push.

## 3. Supabase: create the table

1. Open your project at https://supabase.com/dashboard.
2. **SQL Editor → New query.** Open `supabase/schema.sql` from this folder, copy all of it, paste, press **Run**.
   It should say "Success". If you already had an `inquiries` table, it is kept as `inquiries_legacy` and locked.
3. **Table Editor**: confirm `inquiries` exists and shows "RLS enabled".
4. **Project Settings → API** (or "API Keys"): copy
   - the **Project URL** → `SUPABASE_URL`
   - the **secret** key (older projects call it `service_role`) → `SUPABASE_SERVICE_ROLE_KEY`

The secret key can read and write everything in the database. Never paste it anywhere except Vercel (step 6).

## 4. Cloudflare Turnstile: the anti-spam check

1. Cloudflare dashboard → **Turnstile → Add widget**.
2. Name: `ankurworldwide.com`. Hostnames: `ankurworldwide.com` and `www.ankurworldwide.com`. Mode: Managed.
3. Copy the **Site key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and the **Secret key** → `TURNSTILE_SECRET_KEY`.

## 5. Resend: the email that tells you about each inquiry

1. Create an account at https://resend.com with ankurworldwide89@gmail.com.
2. **Domains → Add domain** → `ankurworldwide.com`. Resend shows several DNS records. Leave this page open;
   you add them in step 8.
3. **API Keys → Create API key**, permission "Sending access" → `RESEND_API_KEY`.
4. `INQUIRY_FROM` is `Ankur Worldwide Website <inquiries@ankurworldwide.com>`. This address only sends; it
   does not need a mailbox.

Emails will not send until the domain shows "Verified" in Resend (after step 8). Inquiries are still saved
in Supabase in the meantime.

## 6. Vercel: publish the site

1. https://vercel.com → **Add New → Project** → import `ankurworldwide89-bit/Ankur-Worldwide`.
2. Framework: Next.js (detected). Leave the build settings as they are.
3. Open **Environment Variables** and add all eight values from the table at the top. For `IP_HASH_SALT`,
   generate a random value by running this and copying the output:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Press **Deploy**. After a few minutes you get an address like `ankur-worldwide.vercel.app`. Open it and
   click through every page.
5. **Project → Analytics → Enable** Web Analytics.

The inquiry form will not pass its check on the `vercel.app` address, because the Turnstile key is tied to
`ankurworldwide.com`. Test the form in step 10.

## 7. Cloudflare and GoDaddy: connect the domain

**Add the site to Cloudflare**

1. Cloudflare dashboard → **Add a domain** → `ankurworldwide.com` → Free plan.
2. Cloudflare lists any existing DNS records. Continue.
3. Cloudflare shows **two nameservers**, for example `xxx.ns.cloudflare.com`. Copy both.

**Change the nameservers at GoDaddy**

4. GoDaddy → **My Products → Domains → ankurworldwide.com → DNS → Nameservers → Change**.
5. Choose "I'll use my own nameservers", enter Cloudflare's two, save.
6. Wait. It usually takes under an hour and can take up to 24. Cloudflare emails you when the domain is active.

The domain stays registered at GoDaddy. Only the "who answers DNS questions" part moves to Cloudflare.

**Point the domain at Vercel**

7. Vercel → Project → **Settings → Domains** → add `ankurworldwide.com` and `www.ankurworldwide.com`.
   Choose to redirect `www` to the main domain. Vercel shows the exact DNS records it wants.
8. Cloudflare → **DNS → Records** → add exactly the records Vercel shows (typically one `A` record for `@`
   and one `CNAME` for `www`). Set each to **DNS only** (grey cloud) for now.
9. Wait until Vercel shows both domains as "Valid". Open https://ankurworldwide.com and check it loads.
10. Back in Cloudflare, switch both records to **Proxied** (orange cloud).

**Cloudflare settings**

| Where | Setting |
|---|---|
| SSL/TLS → Overview | Encryption mode: **Full (strict)** |
| SSL/TLS → Edge Certificates | Always Use HTTPS: on. Minimum TLS version: **1.2**. TLS 1.3: on |
| SSL/TLS → Edge Certificates | Leave Cloudflare's own HSTS setting off; the site already sends the header |
| DNS → Settings | **Enable DNSSEC.** Cloudflare shows a DS record: add it at GoDaddy under Domain → DNSSEC |
| Security → WAF | Managed rules: on (the free managed ruleset) |
| Security → Bots | Bot Fight Mode: on |
| Security → WAF → Rate limiting rules | New rule: URI path equals `/api/inquiry`, 10 requests per 1 minute per IP, action Block |
| Speed → Optimization | **Rocket Loader: off.** Any "Auto Minify" option: off |
| Scrape Shield | **Email Address Obfuscation: off** |

The last two rows matter: those features rewrite the page's scripts, and the site's security policy would
then block them and the pages would stop working.

## 8. DNS records for email and certificates

All added in Cloudflare → **DNS → Records**. Set every record here to **DNS only**.

**Resend (so inquiry emails are delivered).** Add every record Resend showed in step 5, exactly as shown.
Then press **Verify** in Resend.

**SPF for the main domain.** While no mailbox uses `@ankurworldwide.com`, this tells the world that nothing
else may send as you:

| Type | Name | Content |
|---|---|---|
| TXT | `@` | `v=spf1 -all` |

If you set up business mailboxes (step 9), replace this with the value your mailbox provider gives you.

**DMARC.** Start in report-only mode:

| Type | Name | Content |
|---|---|---|
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:ankurworldwide89@gmail.com` |

After two weeks of inquiry emails arriving normally, change `p=none` to `p=quarantine`, and two weeks later
to `p=reject`. At `p=reject`, email that pretends to be from ankurworldwide.com is refused by receiving servers.

**CAA (which companies may issue certificates for the domain).** Vercel and Cloudflare each choose their own
certificate authority, and the list changes. Look up the current CAA values in both the Vercel and Cloudflare
documentation before adding these. A wrong CAA record stops certificates renewing and takes the site offline,
so if you are unsure, skip this until someone can check it with you.

## 9. Optional: business mailboxes

An address like `info@ankurworldwide.com` needs a mailbox provider (Google Workspace, Zoho Mail and
Microsoft 365 are common). The provider gives you MX, SPF and DKIM records to add in Cloudflare DNS.
When done, change the email in `content/company.ts`, the `INQUIRY_TO` variable in Vercel, and the SPF record
from step 8.

## 10. Check everything

- [ ] https://ankurworldwide.com loads, and `http://` and `www.` both redirect to it.
- [ ] Open the browser's developer console (F12) on the home page and the Contact page: no red
      "Content Security Policy" errors.
- [ ] Send a test inquiry from the Contact page. It appears in Supabase → Table Editor → `inquiries`, and an
      email arrives.
- [ ] Send six inquiries within an hour. The sixth is refused.
- [ ] Run the database permission tests from this folder (the anon key is in Supabase → Project Settings → API):

```bash
$env:SUPABASE_URL="https://YOUR-PROJECT.supabase.co"; $env:SUPABASE_ANON_KEY="YOUR-ANON-KEY"; npm test
```

      All tests pass and none are skipped.
- [ ] https://securityheaders.com → target A+.
- [ ] https://www.ssllabs.com/ssltest → target A+.
- [ ] https://developer.mozilla.org/en-US/observatory → target: pass.
- [ ] https://pagespeed.web.dev → record the mobile scores in README.md.
- [ ] https://search.google.com/search-console → add the domain and submit `https://ankurworldwide.com/sitemap.xml`.
- [ ] Only after everything has worked for a few weeks: submit the domain at https://hstspreload.org.
      This is very slow to undo, so do it last.

If any check fails, write down exactly what you saw and record it under "What could NOT be verified yet"
in SECURITY.md.

## Updating the site later

Edit files (see CONTENT-GUIDE.md), then:

```bash
git checkout -b my-change
```

```bash
git add -A
```

```bash
git commit -m "Describe the change"
```

```bash
git push -u origin my-change
```

Open the pull request link GitHub prints, wait for the green checks, and merge. Vercel publishes the change
within a few minutes.
