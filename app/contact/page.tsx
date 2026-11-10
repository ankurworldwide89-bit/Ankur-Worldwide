import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { company } from "@/content/company";

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
      <div className="mx-auto max-w-7xl border-t border-line px-6 pb-24 pt-16 md:px-10 md:pb-36">
        <dl className="max-w-2xl">
          {rows.map(([k, v, href]) => (
            <div key={k} className="grid grid-cols-5 gap-4 border-b border-line py-5">
              <dt className="col-span-2 text-sm text-muted">{k}</dt>
              <dd className="col-span-3 break-words">
                <a href={href} className="hover:text-accent">
                  {v}
                </a>
              </dd>
            </div>
          ))}
          <div className="grid grid-cols-5 gap-4 border-b border-line py-5">
            <dt className="col-span-2 text-sm text-muted">Hours</dt>
            <dd className="col-span-3">{company.hours}</dd>
          </div>
          <div className="grid grid-cols-5 gap-4 border-b border-line py-5">
            <dt className="col-span-2 text-sm text-muted">Location</dt>
            <dd className="col-span-3">{company.address ?? company.region}</dd>
          </div>
        </dl>
        <p className="mt-10 text-sm text-muted">
          Careers: write to{" "}
          <a href={`mailto:${company.email}`} className="text-fg underline underline-offset-4">
            {company.email}
          </a>
          .
        </p>
      </div>
    </>
  );
}
