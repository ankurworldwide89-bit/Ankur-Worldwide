import type { Metadata } from "next";
import { IncenseBundle, Smoke } from "@/components/art";
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
        <Smoke className="pointer-events-none absolute -right-24 bottom-0 hidden h-[92%] w-auto opacity-25 lg:block" />
        <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-6 px-6 py-16 md:px-10 lg:grid-cols-2 lg:py-24">
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

      {/* Facts */}
      <section data-tone="sand" className="bg-bg text-fg">
        <dl className="mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
          {h.facts.map((f) => (
            <div key={f.big} className="reveal border-b border-line px-6 py-14 md:px-10 lg:border-b-0 lg:border-e lg:last:border-e-0">
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
          <div data-tone="dark" className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface text-fg">
            <IncenseBundle className="absolute inset-0 size-full p-10" />
            <p className="absolute start-6 top-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
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
                <li key={point} className="line-reveal border-b border-line py-5">
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
      <Section eyebrow={h.anatomy.eyebrow} title={<Gilt h={h.anatomy.h} />}>
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
                <span aria-hidden="true" className="w-8 shrink-0 pt-2 text-sm font-semibold text-accent">
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
      <section data-tone="light" className="relative overflow-hidden border-t border-line bg-bg text-fg">
        <div className="relative mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-44">
          <p className="eyebrow reveal">{h.heritage.eyebrow}</p>
          <p className="display reveal mt-8 max-w-5xl text-[clamp(2.75rem,6vw,5.5rem)]">
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
          <dl className="mt-12 grid gap-8 md:grid-cols-3">
            {company.registrations.map((r) => (
              <div key={r.label} className="reveal rounded-2xl border border-line bg-surface p-8">
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
        <ol className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-3 lg:grid-cols-5 lg:gap-8">
          {h.process.steps.map((s, i) => (
            <li key={s.name} className="reveal">
              <span className="text-sm font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-3 text-3xl">{s.name}</h3>
              <p className="mt-3 leading-relaxed text-muted">{s.line}</p>
            </li>
          ))}
        </ol>
      </Section>

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
        <div className="relative mx-auto max-w-4xl px-6 py-32 text-center md:py-52">
          <h2 className="display reveal text-[clamp(2.75rem,6vw,5.5rem)]">
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
