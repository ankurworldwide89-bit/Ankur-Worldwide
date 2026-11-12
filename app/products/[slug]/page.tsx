import type { Metadata } from "next";
import Link from "next/link";
import { IncenseBundle } from "@/components/art";
import { StickAnatomy } from "@/components/StickAnatomy";
import { Button, ImageSlot, JsonLd, Section } from "@/components/ui";
import { company } from "@/content/company";
import { products } from "@/content/products";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

async function load({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) throw new Error(`No product "${slug}"`); // unreachable: dynamicParams is false
  const role = product.manufacturedInHouse ? "Manufacturer and Exporter" : "Exporter";
  return { product, role };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { product, role } = await load(props);
  const local = product.localName ? ` (${product.localName})` : "";
  return {
    title: `${product.name}${local} ${role}, India`,
    description: product.summary,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductPage(props: Props) {
  const { product: p, role } = await load(props);
  const specs: [string, string][] = [
    ["Product", p.localName ? `${p.name} (${p.localName})` : p.name],
    ["Supplied by", `${company.name}, ${role.toLowerCase()}`],
    ...(p.madeBy ? [["Made by", p.madeBy] as [string, string]] : []),
    ["Origin", p.origin],
    ...p.specs,
    ...(p.packaging.length ? [["Packaging", p.packaging.join(", ")] as [string, string]] : []),
    ...(p.moq ? [["Minimum order", p.moq] as [string, string]] : []),
    ...(p.hsCode ? [["HS code", p.hsCode] as [string, string]] : []),
    ...(p.privateLabel !== undefined ? [["Private label", p.privateLabel ? "Available" : "Not available"] as [string, string]] : []),
    ["Ships to", "Worldwide"],
  ];
  const url = `${company.url}/products/${p.slug}`;

  return (
    <>
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pb-36 md:pt-14">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="hover:text-fg">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <Link href="/products" className="hover:text-fg">
          Products
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
          <h1 className="display mt-6 text-[clamp(3.5rem,8vw,7rem)]">
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
            <Button href={`/contact?product=${p.slug}`}>Inquire about this product</Button>
            <Button href="/contact?documents=1" variant="ghost">
              Request documents
            </Button>
          </div>
        </div>
      </div>

    </div>

      {p.range.length > 0 && (
        <Section tone="sand" eyebrow="The range" title={<>Every pack, <span className="gilt">every fragrance.</span></>}>
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {p.range.map((c) => (
              <li key={c.name} className="card3d reveal rounded-[2rem] border border-line bg-surface p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="display text-3xl md:text-4xl">{c.name}</h3>
                  <span className="rounded-full border border-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">{c.pack}</span>
                </div>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {c.items.map((item) => (
                    <li key={item} className="rounded-full bg-bg px-4 py-2 text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="reveal mt-10 max-w-xl leading-relaxed text-muted">
            Fragrance names are those used by our manufacturing partner. Private-label and custom packs are quoted on request.
          </p>
        </Section>
      )}

      {p.showAnatomy && (
        <Section tone="dark" eyebrow="Inside an incense stick" title={<>Open it up. <span className="gilt">See how it works.</span></>}>
          <div className="mt-10">
            <StickAnatomy />
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
          countryOfOrigin: p.origin,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: company.url },
            { "@type": "ListItem", position: 2, name: "Products", item: `${company.url}/products` },
            { "@type": "ListItem", position: 3, name: p.name, item: url },
          ],
        }}
      />
    </>
  );
}
