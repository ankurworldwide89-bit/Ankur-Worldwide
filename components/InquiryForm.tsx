"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/content/i18n/en";

type Turnstile = {
  render(el: HTMLElement, options: { sitekey: string; theme: "light" }): string;
  getResponse(id: string): string | undefined;
  reset(id: string): void;
  remove(id: string): void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const field = "mt-2 w-full border-b border-muted bg-transparent py-3 text-base text-fg [&>option]:bg-surface";

export function InquiryForm({ t, products, email }: { t: Dict["form"]; products: { slug: string; name: string }[]; email: string }) {
  if (!siteKey) throw new Error("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set (see .env.example)");

  const [state, setState] = useState<"idle" | "sending" | "sent" | "verify" | "limited" | "error">("idle");
  const [product, setProduct] = useState("");
  const [documents, setDocuments] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);

  // Pre-fill from links such as /contact?product=incense-sticks or /contact?documents=1.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const wanted = q.get("product");
    if (wanted && products.some((p) => p.slug === wanted)) setProduct(wanted);
    if (q.has("documents")) setDocuments(true);
    return () => {
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, [products]);

  function mountTurnstile() {
    if (window.turnstile && box.current && !widget.current) {
      widget.current = window.turnstile.render(box.current, { sitekey: siteKey!, theme: "light" });
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = widget.current && window.turnstile?.getResponse(widget.current);
    if (!token) return setState("verify");

    const f = new FormData(e.currentTarget);
    const text = (name: string) => String(f.get(name) ?? "").trim() || undefined;
    setState("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: text("name"),
          company: text("company"),
          email: text("email"),
          phone: text("phone"),
          country: text("country"),
          product,
          quantity: text("quantity"),
          message: text("message"),
          documents,
          consent: f.has("consent"),
          website: text("website"),
          token,
        }),
      });
      if (res.ok) return setState("sent");
      setState(res.status === 429 ? "limited" : "error");
    } catch {
      setState("error");
    }
    if (widget.current) window.turnstile?.reset(widget.current); // a token works only once
  }

  if (state === "sent") {
    return (
      <div role="status" className="rounded-[2rem] border border-accent p-8">
        <h2 className="display text-3xl">{t.thanksH}</h2>
        <p className="mt-4 text-muted">{t.thanksP}</p>
      </div>
    );
  }

  const problem = state === "verify" || state === "limited" || state === "error" ? t[state] : null;

  return (
    <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-2">
      <label className="text-sm text-muted">
        {t.name}
        <input name="name" required maxLength={100} autoComplete="name" className={field} />
      </label>
      <label className="text-sm text-muted">
        {t.company}
        <input name="company" required maxLength={150} autoComplete="organization" className={field} />
      </label>
      <label className="text-sm text-muted">
        {t.email}
        <input name="email" type="email" dir="ltr" required maxLength={254} autoComplete="email" className={field} />
      </label>
      <label className="text-sm text-muted">
        {t.phone}
        <input name="phone" type="tel" dir="ltr" maxLength={30} pattern="[+\d][\d\s().\-]*" autoComplete="tel" className={field} />
      </label>
      <label className="text-sm text-muted">
        {t.country}
        <input name="country" required maxLength={80} autoComplete="country-name" className={field} />
      </label>
      <label className="text-sm text-muted">
        {t.product}
        <select name="product" required value={product} onChange={(e) => setProduct(e.target.value)} className={field}>
          <option value="" disabled>
            {t.select}
          </option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
          <option value="other">{t.other}</option>
        </select>
      </label>
      <label className="text-sm text-muted md:col-span-2">
        {t.quantity}
        <input name="quantity" required maxLength={100} placeholder={t.quantityPh} className={`${field} placeholder:text-muted/70`} />
      </label>
      <label className="text-sm text-muted md:col-span-2">
        {t.message}
        <textarea name="message" rows={4} maxLength={2000} className={field} />
      </label>

      <div hidden>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm md:col-span-2">
        <input type="checkbox" checked={documents} onChange={(e) => setDocuments(e.target.checked)} className="mt-1 size-4 accent-accent" />
        {t.docs}
      </label>
      <label className="flex items-start gap-3 text-sm md:col-span-2">
        <input type="checkbox" name="consent" required className="mt-1 size-4 accent-accent" />
        <span>
          {t.consent}{" "}
          {/* The policy exists in English only. */}
          <a href="/privacy" className="underline underline-offset-4">
            {t.privacy}
          </a>
          .
        </span>
      </label>

      <div ref={box} className="min-h-[65px] md:col-span-2" />
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={mountTurnstile} />

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className="press rounded-full bg-action px-8 py-4 text-sm font-bold tracking-wide text-action-fg disabled:opacity-60"
        >
          {state === "sending" ? t.sending : t.send}
        </button>
        <p role="alert" className="mt-4 min-h-6 text-sm text-accent">
          {problem && (
            <>
              {problem}{" "}
              {state !== "verify" && (
                <a href={`mailto:${email}`} className="underline underline-offset-4">
                  {email}
                </a>
              )}
            </>
          )}
        </p>
      </div>
    </form>
  );
}
