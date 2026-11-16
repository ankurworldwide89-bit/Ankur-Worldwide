import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { Gilt, PageHeader } from "@/components/ui";
import { company } from "@/content/company";
import { type LangParams, page } from "@/content/i18n";
import { products } from "@/content/products";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { t, alt } = await page(params);
  return { title: t.contact.title, description: t.contact.description, alternates: alt("/contact") };
}

const whatsapp = `https://wa.me/${company.phone.slice(1)}`;

export default async function Contact({ params }: LangParams) {
  const { t } = await page(params);
  const c = t.contact;
  const rows = [
    [c.email, company.email, `mailto:${company.email}`],
    [c.phone, company.phoneDisplay, `tel:${company.phone}`],
    ["WhatsApp", company.phoneDisplay, whatsapp],
  ] as const;
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={<Gilt h={c.h} />} intro={c.intro} />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:px-10 md:py-28 lg:grid-cols-12">
        <div className="reveal rounded-[2rem] border border-line bg-surface p-6 shadow-xl md:p-12 lg:col-span-8">
          <h2 className="display mb-10 text-4xl md:text-5xl">{c.formTitle}</h2>
          <InquiryForm
            t={t.form}
            products={products.map(({ slug, name }) => ({ slug, name: t.products[slug]?.name ?? name }))}
            email={company.email}
          />
        </div>
        <aside className="lg:col-span-4">
          <h2 className="eyebrow">{c.direct}</h2>
          <dl className="mt-8 space-y-4">
            {rows.map(([k, v, link]) => (
              <div key={k} className="card3d rounded-3xl border border-line bg-surface p-6">
                <dt className="text-sm text-muted">{k}</dt>
                <dd className="mt-1 break-words text-lg font-semibold" dir="ltr">
                  <a href={link}>{v}</a>
                </dd>
              </div>
            ))}
            <div className="rounded-3xl border border-line p-6">
              <dt className="text-sm text-muted">{c.hours}</dt>
              <dd className="mt-1 text-lg font-semibold">{t.hours}</dd>
            </div>
            <div className="rounded-3xl border border-line p-6">
              <dt className="text-sm text-muted">{c.location}</dt>
              <dd className="mt-1 text-lg font-semibold">{company.address ?? t.region}</dd>
            </div>
          </dl>
          <p className="mt-8 text-sm text-muted">
            {c.careers}{" "}
            <a href={`mailto:${company.email}`} className="text-fg underline underline-offset-4">
              {company.email}
            </a>
          </p>
        </aside>
      </div>
    </>
  );
}
