// Languages the site is published in. English is the main one and lives at the plain addresses
// (/about); every other language lives under its code (/ar/about). See next.config.ts for the rewrite.
export const locales = ["en", "ar", "es", "fr", "de", "ru", "pt", "zh"] as const;
export type Locale = (typeof locales)[number];

// Each language named in itself, for the language menu.
export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ru: "Русский",
  pt: "Português",
  zh: "中文",
};

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);
export const isRtl = (lang: Locale) => lang === "ar";

// The public address of a page in a language: href("en", "/about") = "/about", href("ar", "/about") = "/ar/about".
export const href = (lang: Locale, path: string) => (lang === "en" ? path : `/${lang}${path === "/" ? "" : path}`);

// Canonical + hreflang links for a page that exists in every language.
export const alternates = (lang: Locale, path: string) => ({
  canonical: href(lang, path),
  languages: { ...Object.fromEntries(locales.map((l) => [l, href(l, path)])), "x-default": href("en", path) },
});
