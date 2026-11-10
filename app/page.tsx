import Link from "next/link";

const pages = [
  { href: "/mockups/a", label: "Direction A — Counter: home" },
  { href: "/mockups/a/product", label: "Direction A — Counter: product page" },
  { href: "/mockups/b", label: "Direction B — Ledger: home" },
  { href: "/mockups/b/product", label: "Direction B — Ledger: product page" },
] as const;

// Temporary chooser for the design review. Replaced by the real home page once a direction is picked.
export default function Chooser() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 font-sans">
      <h1 className="text-2xl font-semibold">Ankur Worldwide — design directions</h1>
      <ul className="mt-8 space-y-3">
        {pages.map((p) => (
          <li key={p.href}>
            <Link href={p.href} className="underline underline-offset-4">
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
