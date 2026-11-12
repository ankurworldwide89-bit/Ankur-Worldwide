import type { Metadata } from "next";
import Link from "next/link";
import { IncenseBundle } from "@/components/art";
import { Button, PageHeader, Section } from "@/components/ui";
import { products } from "@/content/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Incense sticks and dhoop made in Gujarat, India, and exported by Ankur Worldwide.",
  alternates: { canonical: "/products" },
};

export default function Products() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title={<>What we <span className="gilt">export.</span></>}
        intro="We list a product only when we are ready to supply it. The catalogue will grow."
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-24 md:grid-cols-2 md:px-10 md:py-32">
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="card3d group relative overflow-hidden rounded-[2rem] border border-line bg-surface"
          >
            <div data-tone="dark" className="relative aspect-[4/3] overflow-hidden bg-bg">
              <div className="glow absolute inset-0 m-auto size-4/5" aria-hidden="true" />
              <IncenseBundle className="absolute inset-0 size-full p-8 transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="border-t border-line p-8">
              <p className="eyebrow">{p.manufacturedInHouse ? "Manufacturer and exporter" : "Exporter"}</p>
              <h2 className="display mt-5 flex items-baseline justify-between text-5xl">
                {p.name}
                <span aria-hidden="true" className="font-body text-2xl text-accent transition-transform group-hover:translate-x-1">
                  →
                </span>
              </h2>
              <p className="mt-4 leading-relaxed text-muted">{p.summary}</p>
            </div>
          </Link>
        ))}
        <div className="reveal flex min-h-80 flex-col justify-end rounded-[2rem] border border-dashed border-line p-8">
          <p className="display text-4xl text-muted">More products are on the way.</p>
          <p className="mt-4 max-w-sm leading-relaxed text-muted">
            Looking for something that is not listed? Tell us, and we will say honestly whether we can supply it.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="ghost">
              Ask us
            </Button>
          </div>
        </div>
      </div>
      <Section tone="sand" eyebrow="Imports" title={<>Import categories <span className="gilt">to be announced.</span></>}>
        <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-muted">
          Ankur Worldwide trades in both directions. Overseas suppliers are welcome to introduce themselves through the
          inquiry form.
        </p>
      </Section>
    </>
  );
}
