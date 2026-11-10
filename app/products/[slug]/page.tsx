import type { Metadata } from "next";
import Link from "next/link";
import { Button, ImageSlot, JsonLd } from "@/components/ui";
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
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pb-36 md:pt-16">
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

      <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-20">
        <ImageSlot name={p.image} priority />
        <div>
          <p className="eyebrow">{role}</p>
          <h1 className="display mt-6 text-[clamp(2.5rem,6vw,5rem)]">{p.name}</h1>
          {p.description.map((para) => (
            <p key={para} className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              {para}
            </p>
          ))}
          <dl className="mt-12 border-t border-line">
            {specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-5 gap-4 border-b border-line py-4 text-sm">
                <dt className="col-span-2 text-muted">{k}</dt>
                <dd className="col-span-3">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12">
            <Button href={`/contact?product=${p.slug}`}>Inquire about this product</Button>
          </div>
        </div>
      </div>

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
    </div>
  );
}
