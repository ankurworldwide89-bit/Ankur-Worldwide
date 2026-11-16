import type { Metadata } from "next";
import { Button, Gilt, PageHeader, Section } from "@/components/ui";
import { company } from "@/content/company";
import { type LangParams, page } from "@/content/i18n";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { t, alt } = await page(params);
  return { title: t.compliance.title, description: t.compliance.description, alternates: alt("/compliance") };
}

export default async function Compliance({ params }: LangParams) {
  const { t, L } = await page(params);
  const c = t.compliance;
  const regs = company.registrations;
  const business = [
    [c.business.tradingName, company.name],
    [c.business.legalForm, c.business.legalFormValue],
    [c.business.signatory, company.signatory],
    [c.business.address, company.address ?? t.region],
  ];
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={<Gilt h={c.h} />} intro={c.intro} />

      <Section tone="sand" eyebrow={c.business.eyebrow} title={<Gilt h={c.business.h} />}>
        <dl className="reveal mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line sm:grid-cols-2">
          {business.map(([k, v]) => (
            <div key={k} className="bg-surface p-8">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="display mt-3 text-2xl md:text-3xl">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {regs.length > 0 && (
        <Section tone="light" eyebrow={c.regs.eyebrow} title={<Gilt h={c.regs.h} />}>
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {regs.map((r) => {
              // The IEC has translated wording; any other registration shows as entered in content/company.ts.
              const iec = r.label.includes("IEC");
              const how = iec ? c.regs.iecHow : r.how;
              return (
                <li key={r.label} className="card3d reveal rounded-[2rem] border border-line bg-surface p-8">
                  <p className="text-sm text-muted">{iec ? c.regs.iec : r.label}</p>
                  <p className="mt-3 break-words text-3xl font-bold tracking-wider" dir="ltr">
                    {r.number}
                  </p>
                  {how && <p className="mt-4 leading-relaxed text-muted">{how}</p>}
                  <a href={r.verifyUrl} rel="noopener noreferrer" target="_blank" className="mt-6 inline-block border-b border-accent pb-0.5 text-sm font-semibold">
                    {c.regs.verify}
                    <span className="sr-only"> {c.regs.newTab}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <Section tone="sand" eyebrow={c.promises.eyebrow} title={<Gilt h={c.promises.h} />}>
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {c.promises.items.map((p, i) => (
            <li key={p.name} className="card3d reveal rounded-[2rem] border border-line bg-surface p-8">
              <span aria-hidden="true" className="display outline-text text-6xl leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-6 text-3xl">{p.name}</h3>
              <p className="mt-3 leading-relaxed text-muted">{p.line}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="dark" eyebrow={c.docs.eyebrow} title={<Gilt h={c.docs.h} />}>
        <div className="reveal mt-8 max-w-xl space-y-5 text-lg leading-relaxed text-muted">
          <p>{c.docs.p1}</p>
          <p>{c.docs.p2}</p>
        </div>
        <div className="reveal mt-10">
          <Button href={`${L("/contact")}?documents=1`}>{t.product.requestDocs}</Button>
        </div>
      </Section>
    </>
  );
}
