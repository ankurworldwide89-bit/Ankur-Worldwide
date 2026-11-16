import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { Button, Gilt } from "@/components/ui";
import en from "@/content/i18n/en";
import { fontClasses } from "./fonts";
import "./globals.css";

export const metadata: Metadata = { title: "Page not found — Ankur Worldwide", robots: { index: false } };

// The 404 page for any address that matches no page. It is a complete document of its own (no layout),
// built once as a static file so the strict security policy can allow its scripts. English only.
export default function GlobalNotFound() {
  const t = en.notFound;
  return (
    <html lang="en" className={fontClasses}>
      <body className="min-h-screen bg-bg font-body text-fg antialiased">
        <header className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <a href="/">
            <Logo className="h-4 w-auto" />
          </a>
        </header>
        <main className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:px-10 md:pt-32">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="display mt-8 max-w-4xl text-[clamp(3.25rem,9vw,7.5rem)]">
            <Gilt h={t.h} />
          </h1>
          <p className="mb-12 mt-8 max-w-xl text-lg leading-relaxed text-muted">{t.intro}</p>
          <Button href="/">{t.back}</Button>
        </main>
      </body>
    </html>
  );
}
