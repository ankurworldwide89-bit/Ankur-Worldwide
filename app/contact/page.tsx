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
        title="Send an inquiry."
        intro="Tell us the product, the quantity and the destination country. We reply by email."
      />
      <div className="mx-auto grid max-w-7xl gap-16 border-t border-line px-6 pb-24 pt-16 md:px-10 md:pb-36 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <InquiryForm products={products.map(({ slug, name }) => ({ slug, name }))} email={company.email} />
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <h2 className="eyebrow">Or reach us directly</h2>
          <dl className="mt-6 border-t border-line">
            {rows.map(([k, v, href]) => (
              <div key={k} className="border-b border-line py-4">
                <dt className="text-sm text-muted">{k}</dt>
                <dd className="mt-1 break-words">
                  <a href={href} className="hover:text-accent">
                    {v}
                  </a>
                </dd>
              </div>
            ))}
            <div className="border-b border-line py-4">
              <dt className="text-sm text-muted">Hours</dt>
              <dd className="mt-1">{company.hours}</dd>
            </div>
            <div className="border-b border-line py-4">
              <dt className="text-sm text-muted">Location</dt>
              <dd className="mt-1">{company.address ?? company.region}</dd>
            </div>
          </dl>
          <p className="mt-8 text-sm text-muted">
            Careers: write to{" "}
            <a href={`mailto:${company.email}`} className="text-fg underline underline-offset-4">
              {company.email}
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
