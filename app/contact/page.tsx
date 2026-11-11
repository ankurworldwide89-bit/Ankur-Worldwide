import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHeader } from "@/components/ui";
import { company } from "@/content/company";
import { products } from "@/content/products";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Send an inquiry to Ankur Worldwide: product, quantity and destination country.",
  alternates: { canonical: "/contact" },
};

const whatsapp = `https://wa.me/${company.phone.slice(1)}`;

export default function Contact() {
  const rows = [
    ["Email", company.email, `mailto:${company.email}`],
    ["Phone", company.phoneDisplay, `tel:${company.phone}`],
    ["WhatsApp", company.phoneDisplay, whatsapp],
  ] as const;
  return (
    <>
      <PageHeader
        eyebrow="Contact us"
        title={<>Send <span className="gilt">an inquiry.</span></>}
        intro="Tell us the product, the quantity and the destination country. We reply by email."
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:px-10 md:py-28 lg:grid-cols-12">
        <div className="reveal rounded-[2rem] border border-line bg-surface p-6 shadow-xl md:p-12 lg:col-span-8">
          <h2 className="display mb-10 text-4xl md:text-5xl">Your requirement</h2>
          <InquiryForm products={products.map(({ slug, name }) => ({ slug, name }))} email={company.email} />
        </div>
        <aside className="lg:col-span-4">
          <h2 className="eyebrow">Or reach us directly</h2>
          <dl className="mt-8 space-y-4">
            {rows.map(([k, v, href]) => (
              <div key={k} className="card3d rounded-3xl border border-line bg-surface p-6">
                <dt className="text-sm text-muted">{k}</dt>
                <dd className="mt-1 break-words text-lg font-semibold">
                  <a href={href}>{v}</a>
                </dd>
              </div>
            ))}
            <div className="rounded-3xl border border-line p-6">
              <dt className="text-sm text-muted">Hours</dt>
              <dd className="mt-1 text-lg font-semibold">{company.hours}</dd>
            </div>
            <div className="rounded-3xl border border-line p-6">
              <dt className="text-sm text-muted">Location</dt>
              <dd className="mt-1 text-lg font-semibold">{company.address ?? company.region}</dd>
            </div>
          </dl>
          <p className="mt-8 text-sm text-muted">
            Careers: write to{" "}
            <a href={`mailto:${company.email}`} className="text-fg underline underline-offset-4">
              {company.email}
            </a>
            .
          </p>
        </aside>
      </div>
    </>
  );
}
