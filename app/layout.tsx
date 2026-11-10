import type { Metadata } from "next";
import { Cormorant, Manrope } from "next/font/google";
import { Footer, Nav } from "@/components/chrome";
import { JsonLd } from "@/components/ui";
import { company } from "@/content/company";
import "./globals.css";

// next/font downloads these at build time and serves them from our own domain.
const cormorant = Cormorant({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-cormorant" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: { default: "Ankur Worldwide — Manufacturer and Exporter, India", template: "%s — Ankur Worldwide" },
  description:
    "Ankur Worldwide is the fourth generation of a Gujarat trading family, manufacturing and exporting incense sticks from India to buyers worldwide.",
  openGraph: { siteName: company.name, type: "website", locale: "en" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-bg font-body text-fg antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:bg-action focus:px-4 focus:py-2 focus:text-action-fg">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
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
            founder: { "@type": "Person", name: company.proprietor },
            address: { "@type": "PostalAddress", addressRegion: "Gujarat", addressCountry: "IN" },
          }}
        />
      </body>
    </html>
  );
}
