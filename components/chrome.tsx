import Link from "next/link";
import { company } from "@/content/company";
import type { Dict } from "@/content/i18n/en";
import { href, type Locale } from "@/lib/i18n";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";

type Props = { lang: Locale; t: Dict };

const pages = (lang: Locale, t: Dict) => [
  { href: href(lang, "/products"), label: t.nav.products },
  { href: href(lang, "/about"), label: t.nav.about },
  { href: href(lang, "/group"), label: t.nav.group },
  { href: href(lang, "/compliance"), label: t.nav.compliance },
  { href: "/blog", label: lang === "en" ? t.nav.blog : `${t.nav.blog} (EN)` }, // the blog is in English only
  { href: href(lang, "/contact"), label: t.nav.contact },
];

export function Nav({ lang, t }: Props) {
  const links = pages(lang, t);
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 sm:px-6 md:px-10">
        <Link href={href(lang, "/")} dir="ltr" className="shrink-0">
          <Logo className="h-2.5 w-auto sm:h-3.5 md:h-4" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-7">
          <nav aria-label={t.nav.menu} className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            {links.slice(0, 5).map((l) => (
              <Link key={l.href} href={l.href} className="text-muted transition-colors hover:text-accent">
                {l.label}
              </Link>
            ))}
            <Link href={href(lang, "/contact")} className="press rounded-full bg-action px-5 py-2.5 font-bold text-action-fg">
              {t.nav.inquire}
            </Link>
          </nav>
          <LangSwitch lang={lang} label={t.nav.language} />
          {/* Mobile menu with no JavaScript: a native disclosure element. */}
          <details className="lg:hidden">
            <summary className="cursor-pointer rounded-full border border-fg/30 px-4 py-2 text-sm font-semibold">{t.nav.menu}</summary>
            <nav aria-label={t.nav.menu} className="absolute inset-x-0 top-full border-y border-line bg-bg px-6 py-4">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="display block py-3 text-3xl">
                  {l.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function Footer({ lang, t }: Props) {
  // Legal pages exist in English only.
  const legal = [
    { href: "/privacy", label: lang === "en" ? t.footer.privacy : `${t.footer.privacy} (EN)` },
    { href: "/terms", label: lang === "en" ? t.footer.terms : `${t.footer.terms} (EN)` },
  ];
  return (
    <footer data-tone="dark" className="overflow-hidden bg-bg text-fg">
      <div className="jaali" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-10 pt-20 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <Logo className="h-4 w-auto" />
          <p className="display mt-8 max-w-sm text-3xl text-muted">
            {t.footer.tagline.a} <span className="gilt">{t.footer.tagline.b}</span>
          </p>
        </div>
        <nav aria-label={t.footer.explore} className="grid content-start gap-3 text-sm md:col-span-3">
          <p className="eyebrow mb-3">{t.footer.explore}</p>
          {[...pages(lang, t), ...legal].map((l) => (
            <Link key={l.href} href={l.href} className="text-muted transition-colors hover:text-accent">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="grid content-start gap-3 text-sm md:col-span-4">
          <p className="eyebrow mb-3">{t.footer.reach}</p>
          <a href={`mailto:${company.email}`} className="break-words text-muted transition-colors hover:text-accent">
            {company.email}
          </a>
          <a href={`tel:${company.phone}`} dir="ltr" className="text-muted transition-colors hover:text-accent">
            {company.phoneDisplay}
          </a>
          <p className="text-muted">{t.hours}</p>
          <p className="text-muted">{company.address ?? t.region}</p>
        </div>
      </div>
      <p aria-hidden="true" className="display outline-text reveal select-none whitespace-nowrap text-center text-[15vw] leading-none opacity-50">
        Ankur Worldwide
      </p>
      <p className="mx-auto max-w-7xl px-6 py-8 text-xs text-muted md:px-10">
        © {new Date().getFullYear()} {company.name}. {t.compliance.business.legalFormValue}, {t.region}.
      </p>
    </footer>
  );
}
