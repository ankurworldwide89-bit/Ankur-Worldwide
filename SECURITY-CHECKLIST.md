# Security checklist for the owner

These steps protect the accounts that control the website and the domain. Only you can do them.
Most real website takeovers happen through a stolen account password, not through the website's code.

## Accounts

Do all of this for **each** of: GoDaddy, Cloudflare, GitHub, Vercel, Supabase, Resend, and the Gmail account
(ankurworldwide89@gmail.com). The Gmail account matters most: it can reset every other password.

- [ ] A unique, long password, saved in a password manager (for example Bitwarden or 1Password).
- [ ] Two-factor authentication turned on, using an authenticator app or a hardware key. Not SMS.
- [ ] Recovery codes printed or written down and kept somewhere safe offline. Not in email, not in this repository.
- [ ] No account shared by password. If someone else needs access, invite them as a member.

## Domain (GoDaddy)

- [ ] Domain lock (transfer lock) is on.
- [ ] Auto-renew is on, with a working payment card.
- [ ] Contact email on the domain is one you read. Renewal and transfer warnings go there.

## GitHub

- [ ] Branch protection on `main` (DEPLOY.md, step 2).
- [ ] Settings → Code security: Dependabot alerts, Dependabot security updates, secret scanning and push
      protection are all on.
- [ ] Review and merge Dependabot pull requests when CI is green.

## Your computer

- [ ] Install gitleaks so every commit is scanned for passwords and keys before it leaves your machine:

```bash
winget install Gitleaks.Gitleaks
```

- [ ] Never paste a key into a file other than `.env.local`. That file is ignored by git.
- [ ] If a key is ever committed or shared by mistake, treat it as stolen: create a new one in that service,
      update it in Vercel, delete the old one.

## Every year

- [ ] Update the `Expires` date in `public/.well-known/security.txt` (currently 1 November 2027).
- [ ] Replace the Supabase secret key, Resend key and Turnstile secret with new ones.
- [ ] Delete inquiries older than 24 months (the command is at the bottom of `supabase/schema.sql`).
- [ ] Check https://securityheaders.com, https://www.ssllabs.com/ssltest and
      https://developer.mozilla.org/en-US/observatory for the live domain.
