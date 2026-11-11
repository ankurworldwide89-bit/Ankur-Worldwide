"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

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
const messages = {
  verify: "Please complete the verification below, then send again.",
  limited: "Too many inquiries from your network. Please try again in an hour, or email us.",
  error: "Something went wrong and your inquiry was not sent. Please try again, or email us.",
};

export function InquiryForm({ products, email }: { products: { slug: string; name: string }[]; email: string }) {
  if (!siteKey) throw new Error("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set (see .env.example)");

  const [state, setState] = useState<"idle" | "sending" | "sent" | keyof typeof messages>("idle");
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
        <h2 className="display text-3xl">Thank you. Your inquiry is with us.</h2>
        <p className="mt-4 text-muted">We reply by email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-2">
      <label className="text-sm text-muted">
        Your name
        <input name="name" required maxLength={100} autoComplete="name" className={field} />
      </label>
      <label className="text-sm text-muted">
        Company
        <input name="company" required maxLength={150} autoComplete="organization" className={field} />
      </label>
      <label className="text-sm text-muted">
        Email
        <input name="email" type="email" required maxLength={254} autoComplete="email" className={field} />
      </label>
      <label className="text-sm text-muted">
        Phone or WhatsApp (optional)
        <input name="phone" type="tel" maxLength={30} pattern="[+\d][\d\s().\-]*" autoComplete="tel" className={field} />
      </label>
      <label className="text-sm text-muted">
        Destination country
        <input name="country" required maxLength={80} autoComplete="country-name" className={field} />
      </label>
      <label className="text-sm text-muted">
        Product
        <select name="product" required value={product} onChange={(e) => setProduct(e.target.value)} className={field}>
          <option value="" disabled>
            Select
          </option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
          <option value="other">Other</option>
        </select>
      </label>
      <label className="text-sm text-muted md:col-span-2">
        Quantity
        <input name="quantity" required maxLength={100} placeholder="For example: one 20-foot container" className={`${field} placeholder:text-muted/70`} />
      </label>
      <label className="text-sm text-muted md:col-span-2">
        Message (optional)
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
        Please also send me your company registration documents.
      </label>
      <label className="flex items-start gap-3 text-sm md:col-span-2">
        <input type="checkbox" name="consent" required className="mt-1 size-4 accent-accent" />
        <span>
          I agree that Ankur Worldwide may use these details to reply to my inquiry, as described in the{" "}
          <a href="/privacy" className="underline underline-offset-4">
            Privacy Policy
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
          {state === "sending" ? "Sending…" : "Send inquiry"}
        </button>
        <p role="alert" className="mt-4 min-h-6 text-sm text-accent">
          {state in messages && (
            <>
              {messages[state as keyof typeof messages]}{" "}
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
