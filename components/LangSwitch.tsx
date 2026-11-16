"use client";

import { usePathname } from "next/navigation";
import { href, isLocale, type Locale, localeNames, locales } from "@/lib/i18n";

// Language menu. Links to the same page in each language. A native <details>, so it opens without JavaScript.
export function LangSwitch({ lang, label }: { lang: Locale; label: string }) {
  // The address may or may not start with a language code ("/about", "/en/about", "/ar/about").
  const parts = usePathname().split("/").filter(Boolean);
  if (parts[0] && isLocale(parts[0])) parts.shift();
  const page = `/${parts.join("/")}`;
  // Legal pages and the blog exist in English only, so other languages go to their home page from there.
  const englishOnly = /^\/(privacy|terms|blog)(\/|$)/.test(page);

  return (
    <details className="relative">
      <summary aria-label={label} className="cursor-pointer rounded-full border border-fg/30 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em]">
        {lang}
      </summary>
      <ul className="absolute end-0 top-full z-50 mt-2 w-44 rounded-2xl border border-line bg-surface p-2 shadow-xl">
        {locales.map((l) => (
          <li key={l}>
            {/* A plain link on purpose: changing language reloads the page so <html lang> and direction update. */}
            <a
              href={href(l, englishOnly && l !== "en" ? "/" : page)}
              hrefLang={l}
              lang={l}
              aria-current={l === lang ? "true" : undefined}
              className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-bg aria-[current]:text-accent"
            >
              {localeNames[l]}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
