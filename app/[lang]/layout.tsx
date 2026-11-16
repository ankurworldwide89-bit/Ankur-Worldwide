import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer, Nav } from "@/components/chrome";
import { JsonLd } from "@/components/ui";
import { company } from "@/content/company";
import { dict } from "@/content/i18n";
import { isLocale, isRtl, locales } from "@/lib/i18n";
import { fontClasses } from "../fonts";
import "../globals.css";

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

// Only the listed languages exist; any other first path segment is not a language.
export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = dict(lang);
  return {
    metadataBase: new URL(company.url),
    title: { default: t.meta.title, template: "%s — Ankur Worldwide" },
    description: t.meta.description,
    openGraph: { siteName: company.name, type: "website", locale: lang },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dict(lang);
  return (
    <html lang={lang} dir={isRtl(lang) ? "rtl" : "ltr"} className={fontClasses}>
      <body className="min-h-screen bg-bg font-body text-fg antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:bg-action focus:px-4 focus:py-2 focus:text-action-fg">
          {t.nav.skip}
        </a>
        <div className="progress" aria-hidden="true" />
        <Nav lang={lang} t={t} />
        <main id="main">{children}</main>
        <Footer lang={lang} t={t} />
        {/* Vercel Web Analytics: cookieless, served from our own domain. Only exists on Vercel. */}
        {process.env.VERCEL && <script defer src="/_vercel/insights/script.js" />}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: company.name,
            url: company.url,
            email: company.email,
            telephone: company.phone,
            address: { "@type": "PostalAddress", addressRegion: "Gujarat", addressCountry: "IN" },
          }}
        />
      </body>
    </html>
  );
}
