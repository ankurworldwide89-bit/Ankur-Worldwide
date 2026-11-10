import Link from "next/link";

// Only owner-confirmed facts. Unconfirmed details are quoted per inquiry, never guessed.
const specs = [
  ["Product", "Incense sticks (agarbatti)"],
  ["Supplied by", "Ankur Worldwide, manufacturer and exporter"],
  ["Origin", "India"],
  ["Fragrances, sizes, packaging", "Quoted to your requirement"],
  ["Ships to", "Worldwide"],
] as const;

export default async function ProductMockup({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pb-36 md:pt-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href={`/mockups/${theme}`} className="hover:text-fg">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        Products
        <span aria-hidden="true"> / </span>
        <span className="text-fg">Incense sticks</span>
      </nav>

      <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-20">
        <div className="flex aspect-[4/5] items-end border border-line p-6 text-xs uppercase tracking-[0.2em] text-muted">
          Photography coming soon
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Manufacturer and exporter</p>
          <h1 className="display mt-6 text-[clamp(2.5rem,6vw,5rem)]">Incense sticks</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Agarbatti made by Ankur Worldwide in India and shipped to importers, distributors and wholesalers
            around the world.
          </p>

          <dl className="mt-12 border-t border-line">
            {specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-5 gap-4 border-b border-line py-4 text-sm">
                <dt className="col-span-2 text-muted">{k}</dt>
                <dd className="col-span-3">{v}</dd>
              </div>
            ))}
          </dl>

          <Link
            href="#"
            className="mt-12 inline-block bg-action px-8 py-4 text-sm font-medium text-action-fg transition-opacity hover:opacity-85"
          >
            Inquire about this product
          </Link>
        </div>
      </div>
    </div>
  );
}
