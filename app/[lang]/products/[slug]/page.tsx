import type { Metadata } from "next";
import Link from "next/link";
import { IncenseBundle } from "@/components/art";
import { StickAnatomy } from "@/components/StickAnatomy";
import { Button, Gilt, ImageSlot, JsonLd, Section } from "@/components/ui";
import { company } from "@/content/company";
import { page } from "@/content/i18n";
import { products } from "@/content/products";
import { locales } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((lang) => products.map((p) => ({ lang, slug: p.slug })));

async function load({ params }: Props) {
  const { slug } = await params;
  const ctx = await page(params);
  const base = products.find((p) => p.slug === slug);
  if (!base) throw new Error(`No product "${slug}"`); // unreachable: dynamicParams is false
  const text = ctx.t.products[slug];
  // Product text in this language, falling back to the English product file.
  const p = {
    ...base,
    ...text,
    specs: text ? text.specs.map((s) => [s.k, s.v] as [string, string]) : base.specs,
    range: base.range.map((c, i) => ({ ...c, ...text?.range[i] })),
  };
  return { ...ctx, p, role: base.manufacturedInHouse ? ctx.t.roles.maker : ctx.t.roles.exporter };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { p, role, t, alt } = await load(props);
  const local = p.localName ? ` (${p.localName})` : "";
  return { title: `${p.name}${local} ${role}, ${t.product.india}`, description: p.summary, alternates: alt(`/products/${p.slug}`) };
}

export default async function ProductPage(props: Props) {
  const { p, role, t, L } = await load(props);
  const l = t.product.labels;
  const row = (k: string, v: string | undefined) => (v ? [[k, v] as [string, string]] : []);
  const specs: [string, string][] = [
    [l.product, p.localName ? `${p.name} (${p.localName})` : p.name],
    [l.suppliedBy, `${company.name}, ${role}`],
    ...row(l.madeBy, p.madeBy),
    [l.origin, p.origin],
    ...p.specs,
    ...row(l.packaging, p.packaging.join(", ")),
    ...row(l.moq, p.moq),
    ...row(l.hs, p.hsCode),
    ...row(l.privateLabel, p.privateLabel === undefined ? undefined : p.privateLabel ? l.available : l.notAvailable),
    [l.shipsTo, l.worldwide],
  ];
  const url = `${company.url}${L(`/products/${p.slug}`)}`;

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pb-36 md:pt-14">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href={L("/")} className="hover:text-fg">
            {t.nav.home}
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href={L("/products")} className="hover:text-fg">
            {t.nav.products}
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page" className="text-fg">
            {p.name}
          </span>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ImageSlot name={p.image} priority fallback={<IncenseBundle className="absolute inset-0 size-full p-10" />} />
          </div>
          <div>
            <p className="eyebrow">{role}</p>
            <h1 className="display mt-6 text-[clamp(3rem,7vw,6.5rem)]">
              {p.name}
              {p.localName && <span className="gilt block text-[0.55em]">{p.localName}</span>}
            </h1>
            {p.description.map((para) => (
              <p key={para} className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                {para}
              </p>
            ))}
            <dl className="mt-12 overflow-hidden rounded-3xl border border-line bg-surface px-6">
              {specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-5 gap-4 border-b border-line py-5 text-sm last:border-b-0">
                  <dt className="col-span-2 text-muted">{k}</dt>
                  <dd className="col-span-3">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-12 flex flex-wrap gap-4">
              <Button href={`${L("/contact")}?product=${p.slug}`}>{t.product.inquire}</Button>
              <Button href={`${L("/contact")}?documents=1`} variant="ghost">
                {t.product.requestDocs}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {p.range.length > 0 && (
        <Section tone="sand" eyebrow={t.product.range.eyebrow} title={<Gilt h={t.product.range.h} />}>
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {p.range.map((c) => (
              <li key={c.name} className="card3d reveal rounded-[2rem] border border-line bg-surface p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="display text-3xl md:text-4xl">{c.name}</h3>
                  <span className="rounded-full border border-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">{c.pack}</span>
                </div>
                {/* Fragrance names are product names, so they are not translated. */}
                <ul className="mt-6 flex flex-wrap gap-2" dir="ltr">
                  {c.items.map((item) => (
                    <li key={item} className="rounded-full bg-bg px-4 py-2 text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="reveal mt-10 max-w-xl leading-relaxed text-muted">{t.product.range.note}</p>
        </Section>
      )}

      {p.showAnatomy && (
        <Section tone="dark" eyebrow={t.home.anatomy.eyebrow} title={<Gilt h={t.home.anatomy.h} />}>
          <div className="mt-10">
            <StickAnatomy t={t.anatomy} />
          </div>
        </Section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          alternateName: p.localName,
          description: p.summary,
          url,
          brand: { "@type": "Brand", name: company.name },
          ...(p.manufacturedInHouse && { manufacturer: { "@type": "Organization", name: company.name } }),
          countryOfOrigin: "India",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: t.nav.home, item: `${company.url}${L("/")}` },
            { "@type": "ListItem", position: 2, name: t.nav.products, item: `${company.url}${L("/products")}` },
            { "@type": "ListItem", position: 3, name: p.name, item: url },
          ],
        }}
      />
    </>
  );
}
