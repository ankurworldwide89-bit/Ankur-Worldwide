import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { products } from "@/content/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Products manufactured and exported from India by Ankur Worldwide.",
  alternates: { canonical: "/products" },
};

export default function Products() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="What we make and export."
        intro="We list a product only when we are ready to supply it. More will follow."
      />
      <ul className="mx-auto max-w-7xl border-t border-line px-6 pb-24 md:px-10 md:pb-36">
        {products.map((p) => (
          <li key={p.slug} className="border-b border-line">
            <Link href={`/products/${p.slug}`} className="group grid gap-2 py-10 md:grid-cols-2 md:items-baseline">
              <span className="display text-4xl md:text-6xl">
                {p.name} <span aria-hidden="true" className="inline-block text-accent transition-transform group-hover:translate-x-1">→</span>
              </span>
              <span className="text-muted">
                {p.manufacturedInHouse ? "Manufacturer and exporter. " : "Exporter. "}
                {p.summary}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
