import type { Metadata } from "next";
import { IncenseBundle, Mandala, Routes, Smoke } from "@/components/art";
import { ScrollDemo } from "@/components/ScrollDemo";
import { StickAnatomy } from "@/components/StickAnatomy";
import { Button, Gilt, Section } from "@/components/ui";
import { company } from "@/content/company";
import { type LangParams, page } from "@/content/i18n";
import { products } from "@/content/products";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { alt } = await page(params);
  return { alternates: alt("/") };
}

// Every statement on this page is either an owner-confirmed fact or a commitment about how we work.
export default async function Home({ params }: LangParams) {
  const { t, L } = await page(params);
  const h = t.home;
  const base = products[0]!;
  const product = { ...base, ...t.products[base.slug] };
  return (
    <>
      {/* Hero */}
      <section data-tone="dark" className="relative overflow-hidden bg-bg text-fg">
        <div className="glow depth-slow absolute -right-40 top-1/4 size-[52rem]" aria-hidden="true" />
        <Smoke className="depth-fast pointer-events-none absolute -right-24 bottom-0 hidden h-[92%] w-auto opacity-25 lg:block" />
        <div className="recede relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-6 px-6 py-16 md:px-10 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="eyebrow">
              {h.eyebrow} · {t.region}
            </p>
            <h1 className="display mt-8 text-[clamp(3.25rem,7.2vw,7rem)]">
              <Gilt h={h.h} />
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl">{h.intro}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href={L("/contact")}>{t.nav.inquire}</Button>
              <Button href={L("/about")} variant="ghost">
                {h.story}
              </Button>
            </div>
          </div>
          <StickAnatomy t={t.anatomy} compact />
        </div>
      </section>

      {/* Ticker */}
      <div className="marquee overflow-hidden border-y border-line bg-surface py-5" aria-hidden="true" dir="ltr">
        <div className="flex w-max">
          {[0, 1].map((copy) => (
            <p key={copy} className="display flex shrink-0 items-center text-2xl italic text-muted md:text-3xl">
              {h.ticker.map((word) => (
                <span key={word} className="flex items-center">
                  <span className="px-8">{word}</span>
                  <span className="text-accent">◆</span>
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>

      {/* Facts */}
      <section data-tone="sand" className="bg-bg text-fg">
        <dl className="focus-track mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
          {h.facts.map((f) => (
            <div key={f.big} className="focus-card border-b border-line px-6 py-14 md:px-10 lg:border-b-0 lg:border-e lg:last:border-e-0">
              <dt className="display text-6xl md:text-7xl">
                {f.big} <span className="gilt text-4xl md:text-5xl">{f.small}</span>
              </dt>
              <dd className="mt-5 max-w-xs leading-relaxed text-muted">{f.line}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Product */}
      <Section eyebrow={h.product.eyebrow} title={<Gilt h={h.product.h} />}>
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div data-tone="dark" className="tilt-in relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-surface text-fg shadow-2xl">
            <div className="glow absolute inset-0 m-auto size-4/5" aria-hidden="true" />
            <IncenseBundle className="absolute inset-0 size-full p-10" />
            <p className="absolute start-6 top-6 rounded-full border border-line bg-bg/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {t.roles.exporter}
            </p>
          </div>
          <div className="reveal">
            <h3 className="display text-5xl md:text-6xl">
              {product.name} <span className="text-muted">/ {base.localName}</span>
            </h3>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">{product.description[0]}</p>
            <ul className="mt-10 border-t border-line">
              {h.product.bullets.map((point) => (
                <li key={point} className="line-reveal flex items-baseline gap-4 border-b border-line py-5">
                  <span aria-hidden="true" className="text-accent">
                    ◆
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href={L(`/products/${base.slug}`)}>{h.product.view}</Button>
              <Button href={L("/products")} variant="ghost">
                {h.product.all}
              </Button>
            </div>
            <p className="mt-8 text-sm text-muted">{h.product.imports}</p>
          </div>
        </div>
      </Section>

      {/* Anatomy */}
      <Section tone="dark" eyebrow={h.anatomy.eyebrow} title={<Gilt h={h.anatomy.h} />}>
        <div className="mt-10">
          <StickAnatomy t={t.anatomy} />
        </div>
      </Section>

      {/* Why us: pinned heading on the left, reason cards stacking on the right */}
      <section data-tone="sand" className="relative overflow-clip bg-bg text-fg">
        <div className="why-grid mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-36">
          <div className="pin-heading">
            <p className="eyebrow">{h.why.eyebrow}</p>
            <h2 className="display mt-6 text-5xl md:text-7xl">
              <Gilt h={h.why.h} />
            </h2>
          </div>
          <ol className="stack">
            {h.why.items.map((r, i) => (
              <li key={r.name} className="flex gap-8">
                <span aria-hidden="true" className="display outline-text text-7xl leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="display text-3xl md:text-4xl">{r.name}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-muted">{r.line}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Heritage */}
      <section data-tone="dark" className="relative overflow-hidden bg-bg text-fg">
        <Routes className="parallax pointer-events-none absolute -bottom-6 right-0 w-[min(60rem,90%)] text-accent opacity-50" />
        <div className="relative mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-44">
          <p className="eyebrow reveal">{h.heritage.eyebrow}</p>
          <p className="display reveal mt-8 max-w-5xl text-[clamp(3rem,8vw,7.5rem)]">
            <Gilt h={h.heritage.h} />
          </p>
          <p className="reveal mt-10 max-w-xl text-lg leading-relaxed text-muted">{h.heritage.p}</p>
          <div className="reveal mt-10">
            <Button href={L("/about")} variant="ghost">
              {h.heritage.cta}
            </Button>
          </div>
        </div>
      </section>

      {company.registrations.length > 0 && (
        <Section tone="sand" eyebrow={h.compliance.eyebrow} title={<Gilt h={h.compliance.h} />}>
          <dl className="zoom-stage mt-12 grid gap-8 md:grid-cols-3">
            {company.registrations.map((r) => (
              <div key={r.label} className="card3d card-zoom rounded-3xl border border-line bg-surface p-8">
                <dt className="text-sm text-muted">{r.label.includes("IEC") ? t.compliance.regs.iec : r.label}</dt>
                <dd className="mt-3 text-2xl font-bold tracking-wider" dir="ltr">
                  {r.number}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-10">
            <Button href={L("/compliance")} variant="text">
              {h.compliance.cta}
            </Button>
          </p>
        </Section>
      )}

      {/* Process */}
      <Section tone="light" eyebrow={h.process.eyebrow} title={<Gilt h={h.process.h} />}>
        <ol className="arc-track -mx-6 mt-12 md:-mx-10" tabIndex={0} aria-label={h.process.eyebrow}>
          {h.process.steps.map((s, i) => (
            <li key={s.name}>
              <span className="display flex size-14 items-center justify-center rounded-full border border-accent bg-bg text-2xl text-accent">{i + 1}</span>
              <h3 className="display mt-8 text-4xl">{s.name}</h3>
              <p className="mt-3 leading-relaxed text-muted">{s.line}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Sideways text */}
      <div className="overflow-clip border-y border-line bg-bg py-10 text-fg" aria-hidden="true" dir="ltr">
        {["slide-left", "slide-right outline-text"].map((cls) => (
          <p key={cls} className={`slide-row display w-max italic ${cls}`}>
            {h.ticker.join("  ◆  ")}
          </p>
        ))}
      </div>

      {/* FAQ */}
      <Section tone="sand" eyebrow={h.faq.eyebrow} title={<Gilt h={h.faq.h} />}>
        <div className="mt-14 max-w-4xl border-t border-line">
          {h.faq.items.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="display flex cursor-pointer items-center justify-between gap-6 py-7 text-2xl md:text-4xl">
                {f.q}
                <span aria-hidden="true" className="font-body text-2xl text-accent transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-8 text-lg leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* Scroll-triggered demo of the inquiry form */}
      <ScrollDemo t={t} product={product.name} />

      {/* Call to action */}
      <section data-tone="dark" className="relative overflow-hidden bg-bg text-fg">
        <div className="glow absolute inset-0 m-auto size-[60rem]" aria-hidden="true" />
        <Mandala className="scroll-turn pointer-events-none absolute inset-0 m-auto size-[62rem] max-w-none text-accent opacity-25" />
        <div className="relative mx-auto max-w-4xl px-6 py-32 text-center md:py-52">
          <h2 className="display reveal text-[clamp(3rem,9vw,8rem)]">
            <Gilt h={h.cta.h} />
          </h2>
          <p className="reveal mx-auto mt-8 max-w-md text-lg text-muted">{h.cta.p}</p>
          <div className="reveal mt-12 flex justify-center">
            <Button href={L("/contact")}>{t.nav.inquire}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
