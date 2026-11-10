import type { Metadata } from "next";
import { Button, PageHeader, Section } from "@/components/ui";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Certifications and Compliance",
  description: "How to verify Ankur Worldwide's registrations and request company documents.",
  alternates: { canonical: "/compliance" },
};

const promises = [
  ["Verify, don't trust", "Every registration number we publish links to the official government portal, so you can check it without asking us."],
  ["Documents on request", "Copies of registrations go by email to verified buyers. We never post scans online, where they are copied for fraud."],
  ["Written terms", "Specification, price and delivery are fixed in a written quotation before any production begins."],
] as const;

export default function Compliance() {
  const regs = company.registrations;
  const business = [
    ["Trading name", company.name],
    ["Legal form", company.legalForm],
    ["Proprietor", company.proprietor],
    ["Based in", company.address ?? company.region],
  ];
  return (
    <>
      <PageHeader
        eyebrow="Certifications and compliance"
        title={<>Do not take <span className="gilt">our word for it.</span></>}
        intro="A buyer should be able to check a supplier independently. Here is what we are and how to verify it."
      />

      <Section eyebrow="The business" title={<>Who you are <span className="gilt">dealing with.</span></>}>
        <dl className="reveal mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line sm:grid-cols-2">
          {business.map(([k, v]) => (
            <div key={k} className="bg-surface p-8">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="display mt-3 text-3xl md:text-4xl">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {regs.length > 0 && (
        <Section tone="light" eyebrow="Registrations" title={<>Numbers you <span className="gilt">can check.</span></>}>
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {regs.map((r) => (
              <li key={r.label} className="reveal rounded-[2rem] border border-line bg-surface p-8">
                <p className="text-sm text-muted">{r.label}</p>
                <p className="display mt-3 break-words text-4xl">{r.number}</p>
                <a href={r.verifyUrl} rel="noopener noreferrer" target="_blank" className="mt-6 inline-block border-b border-accent pb-0.5 text-sm font-semibold">
                  Verify on the government portal<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section tone="light" eyebrow="How we work" title={<>Three promises <span className="gilt">to every buyer.</span></>}>
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {promises.map(([name, line], i) => (
            <li key={name} className="reveal rounded-[2rem] border border-line bg-surface p-8">
              <span aria-hidden="true" className="display outline-text text-6xl leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-6 text-3xl">{name}</h3>
              <p className="mt-3 leading-relaxed text-muted">{line}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Documents" title={<>Copies <span className="gilt">on request.</span></>}>
        <div className="reveal mt-8 max-w-xl space-y-5 text-lg leading-relaxed text-muted">
          <p>We do not publish scans of licences or certificates. Published scans are routinely copied and used for fraud.</p>
          <p>If you are evaluating us as a supplier, ask for documents with your inquiry. We send copies by email to verified buyers.</p>
        </div>
        <div className="reveal mt-10">
          <Button href="/contact?documents=1">Request documents</Button>
        </div>
      </Section>
    </>
  );
}
