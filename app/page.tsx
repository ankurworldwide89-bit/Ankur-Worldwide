import { IncenseBundle, Mandala, Routes, Smoke } from "@/components/art";
import { StickAnatomy } from "@/components/StickAnatomy";
import { Button, Section } from "@/components/ui";
import { company } from "@/content/company";
import { products } from "@/content/products";

// Every statement on this page is either an owner-confirmed fact or a commitment about how we work.
const facts = [
  ["50+", "years", "The family behind the name has traded in Gujarat for more than fifty years."],
  ["4th", "generation", "Ankur Worldwide is the family's fourth generation, taking the name abroad."],
  ["Made", "in Gujarat", "Our incense is made for us by a manufacturing partner in Bagasara, the family's home town."],
  ["World", "wide", "We take inquiries from every country and ship to your destination port."],
] as const;

const reasons = [
  ["Close to the source", "Our incense is made for us in Bagasara, the family's own town, not bought through a chain of traders."],
  ["Built for your market", "Fragrance, stick size and packaging are quoted to your specification, not picked from a fixed list."],
  ["Everything in writing", "Price, specification and delivery terms are confirmed in a written quotation before production starts."],
  ["A name with a history", "Behind the company stands a family that has kept one shop trading for more than fifty years."],
] as const;

const order = [
  ["Inquiry", "Tell us the product, the quantity and the destination country."],
  ["Sample", "We send samples so you can check quality before you commit."],
  ["Quote", "You receive a written price, specification and delivery terms."],
  ["Production", "Your order is made and packed to the agreed specification."],
  ["Shipment", "We dispatch with the export documents your customs need."],
] as const;

const faqs = [
  ["What do you export?", "Incense sticks (agarbatti) and dhoop, made for us by a manufacturing partner in Bagasara, Gujarat. More products will be listed as each one is ready to supply."],
  ["Can you match my fragrance, size and packaging?", "Yes, tell us what your market needs. We quote fragrances, stick sizes and packaging to each buyer's specification."],
  ["Can I see samples first?", "Yes. Samples come before the quotation is final, so you can judge the quality before you commit to an order."],
  ["What is the minimum order?", "It depends on the product and the packaging you choose. We confirm it in writing with your quotation."],
  ["Which countries do you ship to?", "We accept inquiries from every country. Shipping terms are agreed with you in the quotation."],
  ["Is Ankur Worldwide a new company?", "Yes. Ankur Worldwide is a new venture in import and export. The family behind it has traded in Gujarat for more than fifty years, and its original shop is still open today."],
  ["How can I verify the company?", "See our Compliance page, or tick \"send me your registration documents\" on the inquiry form. We share copies by email with verified buyers."],
] as const;

const ticker = ["Incense sticks", "Dhoop", "Exporter", "Gujarat, India", "Four generations", "Made to your specification", "Shipping worldwide"];

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const product = products[0]!;
  return (
    <>
      {/* Hero */}
      <section data-tone="dark" className="relative overflow-hidden bg-bg text-fg">
        <div className="glow absolute -right-40 top-1/4 size-[52rem]" aria-hidden="true" />
        <Smoke className="parallax pointer-events-none absolute -right-10 bottom-0 h-[92%] w-auto opacity-60 md:right-[6%] md:opacity-100" />
        <div className="recede relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-center px-6 py-24 md:px-10">
          <p className="eyebrow">Import · Export · {company.region}</p>
          <h1 className="display mt-8 max-w-4xl text-[clamp(3.75rem,11vw,10rem)]">
            From one shop counter to <span className="gilt">the world.</span>
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            A Gujarat family that has traded for more than fifty years. Ankur Worldwide is its fourth generation,
            exporting incense sticks made in Gujarat to buyers everywhere.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Button href="/contact">Send an inquiry</Button>
            <Button href="/about" variant="ghost">
              Our story
            </Button>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="marquee overflow-hidden border-y border-line bg-surface py-5" aria-hidden="true">
        <div className="flex w-max">
          {[0, 1].map((copy) => (
            <p key={copy} className="display flex shrink-0 items-center text-2xl italic text-muted md:text-3xl">
              {ticker.map((t) => (
                <span key={t} className="flex items-center">
                  <span className="px-8">{t}</span>
                  <span className="text-accent">◆</span>
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>

      {/* Facts */}
      <section data-tone="sand" className="bg-bg text-fg">
        <dl className="mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(([big, small, line]) => (
            <div key={big} className="reveal border-b border-line px-6 py-14 md:px-10 lg:border-b-0 lg:border-r lg:last:border-r-0">
              <dt className="display text-7xl">
                {big} <span className="gilt text-5xl">{small}</span>
              </dt>
              <dd className="mt-5 max-w-xs leading-relaxed text-muted">{line}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Product */}
      <Section eyebrow="What we export" title={<>Incense sticks, <span className="gilt">made in Gujarat.</span></>}>
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div data-tone="dark" className="tilt-in relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-surface text-fg shadow-2xl">
            <div className="glow absolute inset-0 m-auto size-4/5" aria-hidden="true" />
            <IncenseBundle className="absolute inset-0 size-full p-10" />
            <p className="absolute left-6 top-6 rounded-full border border-line bg-bg/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Exporter
            </p>
          </div>
          <div className="reveal">
            <h3 className="display text-5xl md:text-6xl">
              {product.name} <span className="text-muted">/ {product.localName}</span>
            </h3>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">{product.description[0]}</p>
            <ul className="mt-10 border-t border-line">
              {["Fragrance, stick size and packaging to your specification", "Packed for export and for your market's shelves", "More than thirty fragrances, from 15 g packs to 400 g"].map((point) => (
                <li key={point} className="flex items-baseline gap-4 border-b border-line py-5">
                  <span aria-hidden="true" className="text-accent">
                    ◆
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href={`/products/${product.slug}`}>View the product</Button>
              <Button href="/products" variant="ghost">
                All products
              </Button>
            </div>
            <p className="mt-8 text-sm text-muted">Import categories will be announced.</p>
          </div>
        </div>
      </Section>

      {/* Anatomy */}
      <Section tone="dark" eyebrow="Inside an incense stick" title={<>Open it up. <span className="gilt">See how it works.</span></>}>
        <div className="mt-10">
          <StickAnatomy />
        </div>
      </Section>

      {/* Why us */}
      <Section tone="sand" eyebrow="Why buyers choose us" title={<>Four reasons, <span className="gilt">no slogans.</span></>}>
        <ol className="mt-16 grid gap-x-16 md:grid-cols-2">
          {reasons.map(([name, line], i) => (
            <li key={name} className="reveal flex gap-8 border-t border-line py-10">
              <span aria-hidden="true" className="display outline-text text-7xl leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="display text-3xl md:text-4xl">{name}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-muted">{line}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Heritage */}
      <section data-tone="dark" className="relative overflow-hidden bg-bg text-fg">
        <Routes className="parallax pointer-events-none absolute -bottom-6 right-0 w-[min(60rem,90%)] text-accent opacity-50" />
        <div className="relative mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-44">
          <p className="eyebrow reveal">Our story</p>
          <p className="display reveal mt-8 max-w-5xl text-[clamp(3rem,8vw,7.5rem)]">
            One shop counter. Four generations. <span className="gilt">Now the world.</span>
          </p>
          <p className="reveal mt-10 max-w-xl text-lg leading-relaxed text-muted">
            The Ankur name began at Ankur Novelty Store in Bagasara, Gujarat. The shop is still open. Ankur Worldwide
            is the same family&apos;s new venture in international trade.
          </p>
          <div className="reveal mt-10">
            <Button href="/about" variant="ghost">
              Read the four chapters
            </Button>
          </div>
        </div>
      </section>

      {company.registrations.length > 0 && (
        <Section tone="sand" eyebrow="Compliance" title={<>Check us <span className="gilt">yourself.</span></>}>
          <dl className="mt-12 grid gap-8 md:grid-cols-3">
            {company.registrations.map((r) => (
              <div key={r.label} className="card3d reveal rounded-3xl border border-line bg-surface p-8">
                <dt className="text-sm text-muted">{r.label}</dt>
                <dd className="mt-3 text-2xl font-bold tracking-wider">{r.number}</dd>
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

      {/* Process */}
      <Section tone="light" eyebrow="How an order works" title={<>Five steps, <span className="gilt">in writing.</span></>}>
        <div className="relative mt-20">
          <div aria-hidden="true" className="absolute left-7 top-0 h-full w-px bg-line lg:left-0 lg:top-7 lg:h-px lg:w-full" />
        <ol className="relative grid gap-12 lg:grid-cols-5 lg:gap-6">
          {order.map(([name, line], i) => (
            <li key={name} className="reveal relative pl-20 lg:pl-0">
              <span className="display absolute left-0 top-0 flex size-14 items-center justify-center rounded-full border border-accent bg-bg text-2xl text-accent lg:static">
                {i + 1}
              </span>
              <h3 className="display text-4xl lg:mt-8">{name}</h3>
              <p className="mt-3 leading-relaxed text-muted">{line}</p>
            </li>
          ))}
        </ol>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="sand" eyebrow="Questions buyers ask" title={<>Straight <span className="gilt">answers.</span></>}>
        <div className="mt-14 max-w-4xl border-t border-line">
          {faqs.map(([q, a]) => (
            <details key={q} className="group border-b border-line">
              <summary className="display flex cursor-pointer items-center justify-between gap-6 py-7 text-2xl md:text-4xl">
                {q}
                <span aria-hidden="true" className="font-body text-2xl text-accent transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-8 text-lg leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* Call to action */}
      <section data-tone="dark" className="relative overflow-hidden bg-bg text-fg">
        <div className="glow absolute inset-0 m-auto size-[60rem]" aria-hidden="true" />
        <Mandala className="scroll-turn pointer-events-none absolute inset-0 m-auto size-[62rem] max-w-none text-accent opacity-25" />
        <div className="relative mx-auto max-w-4xl px-6 py-32 text-center md:py-52">
          <h2 className="display reveal text-[clamp(3rem,9vw,8rem)]">
            Tell us what your <span className="gilt">market needs.</span>
          </h2>
          <p className="reveal mx-auto mt-8 max-w-md text-lg text-muted">Product, quantity and destination country are enough to start.</p>
          <div className="reveal mt-12 flex justify-center">
            <Button href="/contact">Send an inquiry</Button>
          </div>
        </div>
      </section>
    </>
  );
}
