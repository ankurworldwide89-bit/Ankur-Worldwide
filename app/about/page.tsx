import type { Metadata } from "next";
import { Button, PageHeader, Section } from "@/components/ui";
import { chapters } from "@/content/about";

export const metadata: Metadata = {
  title: "About Us",
  description: "Four generations of a Gujarat trading family, from Ankur Novelty Store in Bagasara to Ankur Worldwide.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Four generations. One name."
        intro="The family's trading history is more than fifty years long. Ankur Worldwide is its newest chapter."
      />
      <ol>
        {chapters.map((c) => (
          <li key={c.numeral} className="border-t border-line">
            <div className="reveal mx-auto grid max-w-7xl gap-6 px-6 py-24 md:grid-cols-12 md:px-10 md:py-40">
              <span aria-hidden="true" className="display text-6xl text-accent md:col-span-3 md:text-8xl">
                {c.numeral}
              </span>
              <div className="md:col-span-8">
                <h2 className="display text-4xl md:text-6xl">{c.title}</h2>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{c.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <Section>
        <h2 className="display max-w-3xl text-4xl md:text-6xl">The next chapter is with you.</h2>
        <div className="mt-10">
          <Button href="/contact">Send an inquiry</Button>
        </div>
      </Section>
    </>
  );
}
