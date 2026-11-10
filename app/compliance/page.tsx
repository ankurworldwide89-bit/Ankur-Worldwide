import type { Metadata } from "next";
import { Button, PageHeader, Section } from "@/components/ui";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Certifications and Compliance",
  description: "How to verify Ankur Worldwide's registrations and request company documents.",
  alternates: { canonical: "/compliance" },
};

export default function Compliance() {
  const regs = company.registrations;
  return (
    <>
      <PageHeader
        eyebrow="Certifications and compliance"
        title="Do not take our word for it."
        intro="A buyer should be able to check a supplier independently. Here is what we are and how to verify it."
      />

      <Section eyebrow="The business">
        <dl className="mt-10 max-w-2xl border-t border-line text-sm">
          {[
            ["Trading name", company.name],
            ["Legal form", company.legalForm],
            ["Proprietor", company.proprietor],
            ...(company.address ? [["Registered address", company.address]] : []),
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-5 gap-4 border-b border-line py-4">
              <dt className="col-span-2 text-muted">{k}</dt>
              <dd className="col-span-3">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {regs.length > 0 && (
        <Section eyebrow="Registrations" title="Numbers you can check.">
          <ul className="mt-12 max-w-3xl border-t border-line">
            {regs.map((r) => (
              <li key={r.label} className="grid gap-2 border-b border-line py-6 md:grid-cols-3 md:items-baseline">
                <span className="text-sm text-muted">{r.label}</span>
                <span className="text-xl">{r.number}</span>
                <a href={r.verifyUrl} rel="noopener noreferrer" target="_blank" className="border-b border-accent pb-0.5 text-sm md:justify-self-end">
                  Verify on the government portal<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section eyebrow="Documents" title="Copies on request.">
        <div className="mt-8 max-w-xl space-y-5 text-lg leading-relaxed text-muted">
          <p>
            We do not publish scans of licences or certificates. Published scans are routinely copied and used
            for fraud.
          </p>
          <p>
            If you are evaluating us as a supplier, ask for documents with your inquiry. We send copies by email
            to verified buyers.
          </p>
        </div>
        <div className="mt-10">
          <Button href="/contact?documents=1">Request documents</Button>
        </div>
      </Section>
    </>
  );
}
