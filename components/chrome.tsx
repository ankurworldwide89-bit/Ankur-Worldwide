import Link from "next/link";
import { company } from "@/content/company";
import { Logo } from "./Logo";

const links = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/group", label: "Group" },
  { href: "/compliance", label: "Compliance" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/">
          <Logo className="h-3.5 w-auto md:h-4" />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 text-sm font-medium lg:flex">
          {links.slice(0, 4).map((l) => (
            <Link key={l.href} href={l.href} className="text-muted transition-colors hover:text-accent">
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-full bg-action px-5 py-2.5 font-bold text-action-fg transition-shadow hover:shadow-[0_0_30px_-6px_var(--accent)]"
          >
            Send an inquiry
          </Link>
        </nav>
        {/* Mobile menu with no JavaScript: a native disclosure element. */}
        <details className="lg:hidden">
          <summary className="cursor-pointer rounded-full border border-line px-4 py-2 text-sm font-semibold">Menu</summary>
          <nav aria-label="Main" className="absolute inset-x-0 top-full border-y border-line bg-bg px-6 py-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="display block py-3 text-3xl">
                {l.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-line">
      <div className="jaali" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-10 pt-20 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <Logo className="h-4 w-auto" />
          <p className="display mt-8 max-w-sm text-3xl text-muted">
            One shop counter. Four generations. <span className="gilt">Now the world.</span>
          </p>
        </div>
        <nav aria-label="Footer" className="grid content-start gap-3 text-sm md:col-span-3">
          <p className="eyebrow mb-3">Explore</p>
          {[...links, { href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }].map((l) => (
            <Link key={l.href} href={l.href} className="text-muted transition-colors hover:text-accent">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="grid content-start gap-3 text-sm md:col-span-4">
          <p className="eyebrow mb-3">Reach us</p>
          <a href={`mailto:${company.email}`} className="break-words text-muted transition-colors hover:text-accent">
            {company.email}
          </a>
          <a href={`tel:${company.phone}`} className="text-muted transition-colors hover:text-accent">
            {company.phoneDisplay}
          </a>
          <p className="text-muted">{company.hours}</p>
          <p className="text-muted">{company.region}</p>
        </div>
      </div>
      <p aria-hidden="true" className="display outline-text select-none whitespace-nowrap text-center text-[15vw] leading-none opacity-40">
        Ankur Worldwide
      </p>
      <p className="mx-auto max-w-7xl px-6 py-8 text-xs text-muted md:px-10">
        © {new Date().getFullYear()} {company.name}. {company.legalForm}, {company.region}.
      </p>
    </footer>
  );
}
