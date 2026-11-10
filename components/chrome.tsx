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
    <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
      <Link href="/">
        <Logo className="h-3.5 w-auto md:h-4" />
      </Link>
      <nav aria-label="Main" className="hidden items-center gap-8 text-sm md:flex">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="text-muted hover:text-fg">
            {l.label}
          </Link>
        ))}
      </nav>
      {/* Mobile menu with no JavaScript: a native disclosure element. */}
      <details className="md:hidden">
        <summary className="cursor-pointer list-none border-b border-accent pb-0.5 text-sm [&::-webkit-details-marker]:hidden">
          Menu
        </summary>
        <nav aria-label="Main" className="absolute inset-x-0 top-full z-10 border-y border-line bg-bg px-6 py-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block py-3 text-lg">
              {l.label}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 text-sm text-muted md:grid-cols-3 md:px-10">
        <div>
          <Logo className="h-3.5 w-auto text-fg" />
          <p className="mt-4">{company.region}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-y-2">
          {[...links, { href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }].map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-fg">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2">
          <p>
            <a href={`mailto:${company.email}`} className="hover:text-fg">
              {company.email}
            </a>
          </p>
          <p>
            <a href={`tel:${company.phone}`} className="hover:text-fg">
              {company.phoneDisplay}
            </a>
          </p>
          <p>
            © {new Date().getFullYear()} {company.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
