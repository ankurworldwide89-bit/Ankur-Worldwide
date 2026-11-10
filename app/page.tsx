import Link from "next/link";
import { Button, Section } from "@/components/ui";
import { company } from "@/content/company";
import { products } from "@/content/products";

const arc = [
  { step: "One", line: "shop counter in Bagasara, Gujarat." },
  { step: "Four", line: "generations of the same family behind it." },
  { step: "Now", line: "manufacturing in India, shipping worldwide." },
];

const order = [
  ["Inquiry", "Tell us the product, the quantity and the destination country."],
  ["Sample", "We send samples so you can check quality before you commit."],
  ["Quote", "You receive a written price, specification and delivery terms."],
  ["Production", "We manufacture and pack your order to the agreed specification."],
  ["Shipment", "We dispatch with the export documents your customs need."],
] as const;

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:px-10 md:pb-40 md:pt-36">
        <p className="eyebrow">Import · Export · {company.region}</p>
        <h1 className="display mt-8 max-w-5xl text-[clamp(2.75rem,8vw,7rem)]">From one shop counter to the world.</h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
          A Gujarat family that has traded for more than fifty years. Ankur Worldwide is its fourth generation,
          manufacturing and exporting incense sticks to buyers everywhere.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-8">
          <Button href="/contact">Send an inquiry</Button>
          <Button href="/about" variant="text">
            Read our story
          </Button>
        </div>
      </section>

      <Section eyebrow="What we trade" title="Made by us. Exported by us.">
        <ul className="mt-16 border-t border-line">
          {products.map((p) => (
            <li key={p.slug} className="border-b border-line">
              <Link href={`/products/${p.slug}`} className="group grid gap-2 py-8 md:grid-cols-2 md:items-baseline">
                <span className="display text-3xl md:text-5xl">
                  {p.name} <span aria-hidden="true" className="text-accent transition-transform group-hover:translate-x-1 inline-block">→</span>
                </span>
                <span className="text-muted">{p.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">Import categories will be announced.</p>
      </Section>

      <section aria-label="Our story in brief" className="border-t border-line">
        <ol className="mx-auto grid max-w-7xl md:grid-cols-3">
          {arc.map((a) => (
            <li key={a.step} className="border-b border-line px-6 py-12 md:border-b-0 md:border-r md:px-10 md:py-16 md:last:border-r-0">
              <span className="display block text-5xl text-accent md:text-6xl">{a.step}</span>
              <span className="mt-4 block max-w-xs text-muted">{a.line}</span>
            </li>
          ))}
        </ol>
      </section>

      {company.registrations.length > 0 && (
        <Section eyebrow="Compliance" title="Check us yourself.">
          <dl className="mt-12 grid gap-8 md:grid-cols-3">
            {company.registrations.map((r) => (
              <div key={r.label}>
                <dt className="text-sm text-muted">{r.label}</dt>
                <dd className="mt-2 text-xl">{r.number}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10">
            <Button href="/compliance" variant="text">
              How to verify these numbers
            </Button>
          </p>
        </Section>
      )}

      <Section eyebrow="How an order works" title="Five steps, in writing.">
        <ol className="mt-16 grid gap-10 md:grid-cols-5 md:gap-6">
          {order.map(([name, line], i) => (
            <li key={name} className="border-t border-accent pt-5">
              <span className="text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-3 text-2xl">{name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{line}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <h2 className="display max-w-4xl text-[clamp(2.25rem,6vw,5rem)]">Tell us what your market needs.</h2>
        <p className="mt-6 max-w-xl text-lg text-muted">Product, quantity and destination country are enough to start.</p>
        <div className="mt-10">
          <Button href="/contact">Send an inquiry</Button>
        </div>
      </Section>
    </>
  );
}
