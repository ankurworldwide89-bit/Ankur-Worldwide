import { notFound } from "next/navigation";
import { alternates, href, isLocale, type Locale } from "@/lib/i18n";
import ar from "./ar";
import de from "./de";
import en, { type Dict } from "./en";
import es from "./es";
import fr from "./fr";
import pt from "./pt";
import ru from "./ru";
import zh from "./zh";

const all: Record<Locale, Dict> = { en, ar, es, fr, de, ru, pt, zh };

export const dict = (lang: Locale) => all[lang];

export type LangParams = { params: Promise<{ lang: string }> };

// What every page needs: its language, that language's text, and a link builder.
export async function page(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return {
    lang,
    t: all[lang],
    L: (path: string) => href(lang, path),
    alt: (path: string) => alternates(lang, path),
  };
}
