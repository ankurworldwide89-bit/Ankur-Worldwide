import type { Metadata } from "next";
import Link from "next/link";
import { IncenseBundle } from "@/components/art";
import { Button, Gilt, PageHeader, Section } from "@/components/ui";
import { type LangParams, page } from "@/content/i18n";
import { products } from "@/content/products";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { t, alt } = await page(params);
  return { title: t.productsPage.title, description: t.productsPage.description, alternates: alt("/products") };
}

export default async function Products({ params }: LangParams) {
  const { t, L } = await page(params);
  const pp = t.productsPage;
  return (
    <>
      <PageHeader eyebrow={pp.title} title={<Gilt h={pp.h} />} intro={pp.intro} />
      <div className="zoom-stage mx-auto grid max-w-7xl gap-8 px-6 py-24 md:grid-cols-2 md:px-10 md:py-32">
        {products.map((base) => {
          const p = { ...base, ...t.products[base.slug] };
          return (
            <Link key={p.slug} href={L(`/products/${p.slug}`)} className="card3d card-zoom group relative overflow-hidden rounded-[2rem] border border-line bg-surface">
              <div data-tone="dark" className="relative aspect-[4/3] overflow-hidden bg-bg">
                <div className="glow absolute inset-0 m-auto size-4/5" aria-hidden="true" />
                <IncenseBundle className="absolute inset-0 size-full p-8 transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="border-t border-line p-8">
                <p className="eyebrow">{p.manufacturedInHouse ? t.roles.maker : t.roles.exporter}</p>
                <h2 className="display mt-5 flex items-baseline justify-between gap-4 text-4xl md:text-5xl">
                  {p.name}
                  <span aria-hidden="true" className="arrow font-body text-2xl text-accent">
                    →
                  </span>
                </h2>
                <p className="mt-4 leading-relaxed text-muted">{p.summary}</p>
              </div>
            </Link>
          );
        })}
        <div className="reveal flex min-h-80 flex-col justify-end rounded-[2rem] border border-dashed border-line p-8">
          <p className="display text-4xl text-muted">{pp.more.h}</p>
          <p className="mt-4 max-w-sm leading-relaxed text-muted">{pp.more.p}</p>
          <div className="mt-8">
            <Button href={L("/contact")} variant="ghost">
              {pp.more.cta}
            </Button>
          </div>
        </div>
      </div>
      <Section tone="sand" eyebrow={pp.imports.eyebrow} title={<Gilt h={pp.imports.h} />}>
        <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-muted">{pp.imports.p}</p>
      </Section>
    </>
  );
}
