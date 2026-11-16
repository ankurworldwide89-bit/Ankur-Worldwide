"use client";

import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { Markdown } from "@/lib/markdown";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase-public";

// Blog admin. Everything here is enforced again by the database: the browser holds only the public key,
// and Row Level Security lets a session write posts only after two-factor login by a listed admin.

type Row = { id: string; slug: string; title: string; excerpt: string; body: string; published: boolean; published_at: string | null; updated_at: string };
type Draft = Omit<Row, "id" | "published_at" | "updated_at"> & { id?: string };
type Stage = "loading" | "signedOut" | "enroll" | "challenge" | "notAdmin" | "ready";

const empty: Draft = { slug: "", title: "", excerpt: "", body: "", published: false };
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

let client: SupabaseClient | undefined;
// Session lives in sessionStorage: closing the browser tab signs you out.
const sb = () => (client ??= createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: { storage: window.sessionStorage, storageKey: "aw-admin" } }));

const input = "mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-base text-fg";
const btn = "press rounded-full bg-action px-6 py-3 text-sm font-bold text-action-fg disabled:opacity-50";
const ghost = "press rounded-full border border-fg/30 px-6 py-3 text-sm font-semibold disabled:opacity-50";

export function Admin() {
  const [stage, setStage] = useState<Stage>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [qr, setQr] = useState<{ factorId: string; svg: string; secret: string } | null>(null);
  const [factorId, setFactorId] = useState("");
  const [posts, setPosts] = useState<Row[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const loadPosts = useCallback(async () => {
    const { data, error } = await sb().from("posts").select("*").order("updated_at", { ascending: false });
    if (error) return setMsg(`Could not load posts: ${error.message}`);
    setPosts(data as Row[]);
  }, []);

  // Decide what to show from the current session: sign in, set up 2FA, enter code, or the editor.
  const route = useCallback(async () => {
    const { data: s } = await sb().auth.getSession();
    setSession(s.session);
    if (!s.session) return setStage("signedOut");
    const { data: aal } = await sb().auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel !== "aal2") {
      const { data: f } = await sb().auth.mfa.listFactors();
      const verified = f?.totp.find((x) => x.status === "verified");
      if (verified) {
        setFactorId(verified.id);
        return setStage("challenge");
      }
      return setStage("enroll");
    }
    const { data: admin } = await sb().from("blog_admins").select("user_id").eq("user_id", s.session.user.id).maybeSingle();
    if (!admin) return setStage("notAdmin");
    setStage("ready");
    await loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    void route();
  }, [route]);

  async function run(work: () => Promise<void>) {
    setBusy(true);
    setMsg("");
    try {
      await work();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const signIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    return run(async () => {
      const { error } = await sb().auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
      if (error) throw new Error("Sign-in failed. Check the email and password.");
      await route();
    });
  };

  const startEnroll = () =>
    run(async () => {
      // Remove any half-finished setup from an earlier attempt before starting a new one.
      const { data: f } = await sb().auth.mfa.listFactors();
      for (const x of f?.all ?? []) if (x.status !== "verified") await sb().auth.mfa.unenroll({ factorId: x.id });
      const { data, error } = await sb().auth.mfa.enroll({ factorType: "totp", friendlyName: "Ankur Worldwide admin" });
      if (error) throw new Error(`Could not start two-factor setup: ${error.message}`);
      setQr({ factorId: data.id, svg: data.totp.qr_code, secret: data.totp.secret });
    });

  const verify = (id: string) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("code")).replace(/\s/g, "");
    return run(async () => {
      const { error } = await sb().auth.mfa.challengeAndVerify({ factorId: id, code });
      if (error) throw new Error("That code did not work. Codes change every 30 seconds; try the current one.");
      setQr(null);
      await route();
    });
  };

  const signOut = () =>
    run(async () => {
      await sb().auth.signOut();
      setDraft(null);
      setPosts([]);
      await route();
    });

  const save = () =>
    run(async () => {
      if (!draft) return;
      const row = { ...draft, slug: slugify(draft.slug), title: draft.title.trim(), excerpt: draft.excerpt.trim() };
      if (!row.slug || !row.title || !row.excerpt) throw new Error("Title, address and summary are required.");
      const q = draft.id ? sb().from("posts").update(row).eq("id", draft.id) : sb().from("posts").insert(row);
      const { error } = await q;
      if (error) throw new Error(error.code === "23505" ? "Another post already uses that address." : `Could not save: ${error.message}`);
      setDraft(null);
      await loadPosts();
      setMsg("Saved. Click “Update the live site” when you are ready for visitors to see it.");
    });

  const remove = (p: Row) =>
    run(async () => {
      if (!window.confirm(`Delete “${p.title}” permanently? This cannot be undone.`)) return;
      const { error } = await sb().from("posts").delete().eq("id", p.id);
      if (error) throw new Error(`Could not delete: ${error.message}`);
      setDraft(null);
      await loadPosts();
      setMsg("Deleted. Click “Update the live site” to remove it from the public blog.");
    });

  const publishSite = () =>
    run(async () => {
      const { data: s } = await sb().auth.getSession();
      const res = await fetch("/api/publish", { method: "POST", headers: { Authorization: `Bearer ${s.session?.access_token ?? ""}` } });
      if (!res.ok) throw new Error(res.status === 503 ? "Publishing is not set up yet (missing deploy hook)." : "Could not start the update. Sign out, sign in again and retry.");
      setMsg("Update started. The live blog changes in about two minutes.");
    });

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-14 md:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="display text-5xl">Blog admin</h1>
        {session && (
          <button type="button" onClick={signOut} className={ghost} disabled={busy}>
            Sign out
          </button>
        )}
      </div>
      <p role="status" className="mt-4 min-h-6 text-sm font-semibold text-accent">
        {msg}
      </p>

      {stage === "loading" && <p className="mt-10 text-muted">Loading…</p>}

      {stage === "signedOut" && (
        <form onSubmit={signIn} className="mt-8 grid max-w-md gap-6 rounded-[2rem] border border-line bg-surface p-8">
          <label className="text-sm text-muted">
            Email
            <input name="email" type="email" required autoComplete="username" className={input} />
          </label>
          <label className="text-sm text-muted">
            Password
            <input name="password" type="password" required autoComplete="current-password" className={input} />
          </label>
          <button className={btn} disabled={busy}>
            Sign in
          </button>
        </form>
      )}

      {stage === "enroll" && (
        <div className="mt-8 max-w-xl rounded-[2rem] border border-line bg-surface p-8">
          <h2 className="display text-3xl">Set up two-factor sign-in</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Writing posts needs a code from an authenticator app (Google Authenticator, Microsoft Authenticator or 1Password) every time you
            sign in. This is a one-time setup.
          </p>
          {!qr ? (
            <button type="button" onClick={startEnroll} className={`${btn} mt-6`} disabled={busy}>
              Start setup
            </button>
          ) : (
            <form onSubmit={verify(qr.factorId)} className="mt-6 grid gap-5">
              <p className="text-sm">1. In the app, add an account and scan this code.</p>
              {/* eslint-disable-next-line @next/next/no-img-element -- a data: URI from Supabase, not a site image */}
              <img src={qr.svg} alt="QR code for your authenticator app" width={200} height={200} className="rounded-xl bg-white p-3" />
              <p className="text-sm text-muted">
                Can’t scan? Type this key instead: <code className="break-all font-mono text-fg">{qr.secret}</code>
              </p>
              <label className="text-sm">
                2. Enter the 6-digit code the app shows
                <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" required className={input} />
              </label>
              <button className={btn} disabled={busy}>
                Confirm
              </button>
            </form>
          )}
        </div>
      )}

      {stage === "challenge" && (
        <form onSubmit={verify(factorId)} className="mt-8 grid max-w-md gap-6 rounded-[2rem] border border-line bg-surface p-8">
          <label className="text-sm text-muted">
            6-digit code from your authenticator app
            <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" required autoFocus className={input} />
          </label>
          <button className={btn} disabled={busy}>
            Continue
          </button>
        </form>
      )}

      {stage === "notAdmin" && session && (
        <div className="mt-8 max-w-xl rounded-[2rem] border border-line bg-surface p-8">
          <h2 className="display text-3xl">This account cannot write posts yet</h2>
          <p className="mt-3 leading-relaxed text-muted">Add it as a blog admin in Supabase (DEPLOY.md, “Blog”). Your user id is:</p>
          <code className="mt-4 block break-all rounded-xl bg-bg p-4 font-mono text-sm">{session.user.id}</code>
        </div>
      )}

      {stage === "ready" && !draft && (
        <div className="mt-8">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={btn}
              onClick={() => {
                setDraft(empty);
                setSlugTouched(false);
              }}
            >
              New post
            </button>
            <button type="button" className={ghost} onClick={publishSite} disabled={busy}>
              Update the live site
            </button>
          </div>
          <ul className="mt-8 grid gap-4">
            {posts.length === 0 && <li className="text-muted">No posts yet.</li>}
            {posts.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5">
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-muted">
                    /blog/{p.slug} · {p.published ? "Published" : "Draft"}
                  </p>
                </div>
                <button
                  type="button"
                  className={ghost}
                  onClick={() => {
                    setDraft(p);
                    setSlugTouched(true);
                  }}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stage === "ready" && draft && (
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="grid content-start gap-5">
            <label className="text-sm text-muted">
              Title
              <input
                value={draft.title}
                maxLength={140}
                className={input}
                onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: slugTouched ? draft.slug : slugify(e.target.value) })}
              />
            </label>
            <label className="text-sm text-muted">
              Address (ankurworldwide.com/blog/…)
              <input
                value={draft.slug}
                maxLength={80}
                className={input}
                onChange={(e) => {
                  setSlugTouched(true);
                  setDraft({ ...draft, slug: e.target.value });
                }}
              />
            </label>
            <label className="text-sm text-muted">
              Summary (shown in the list and in Google)
              <textarea value={draft.excerpt} maxLength={300} rows={3} className={input} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />
            </label>
            <label className="text-sm text-muted">
              Post
              <textarea value={draft.body} maxLength={40000} rows={18} className={`${input} font-mono text-sm`} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
            </label>
            <p className="text-xs text-muted">
              Formatting: <code>## Heading</code>, <code>- list item</code>, <code>**bold**</code>, <code>*italic*</code>, <code>[link](https://…)</code>. Leave a
              blank line between paragraphs.
            </p>
            <label className="flex items-center gap-3 text-sm font-semibold">
              <input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} className="size-4 accent-accent" />
              Published (visible to visitors after the next site update)
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="button" className={btn} onClick={save} disabled={busy}>
                Save
              </button>
              <button type="button" className={ghost} onClick={() => setDraft(null)} disabled={busy}>
                Cancel
              </button>
              {draft.id && (
                <button type="button" className={ghost} onClick={() => remove(draft as Row)} disabled={busy}>
                  Delete
                </button>
              )}
            </div>
          </div>
          <div className="rounded-[2rem] border border-line bg-surface p-8">
            <p className="eyebrow">Preview</p>
            <h2 className="display mt-4 text-4xl">{draft.title || "Title"}</h2>
            <p className="mt-3 text-muted">{draft.excerpt}</p>
            <div className="prose-blog mt-6 border-t border-line pt-6">
              <Markdown source={draft.body} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
