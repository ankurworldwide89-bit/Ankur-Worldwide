import type { Metadata } from "next";
import { Arch, Rings } from "@/components/art";
import { Button, ImageSlot, PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Group Concern",
  description: "Ankur Novelty Store, Bagasara, Gujarat: the family shop where the Ankur name began.",
  alternates: { canonical: "/group" },
};

export default function Group() {
  return (
    <>
      <PageHeader eyebrow="Group concern" title={<>Where the name <span className="gilt">began.</span></>} />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-2 lg:gap-24">
        <div className="reveal">
          <ImageSlot name="store" fallback={<Arch className="absolute inset-0 m-auto h-4/5 text-accent" />} />
        </div>
        <div className="reveal">
          <p className="eyebrow">Bagasara, Gujarat, India</p>
          <h2 className="display mt-6 text-6xl md:text-7xl">
            Ankur <span className="gilt">Novelty Store</span>
          </h2>
          <div className="mt-8 max-w-md space-y-5 text-lg leading-relaxed text-muted">
            <p>The family shop where the Ankur name began. It has traded for more than fifty years and is open today.</p>
            <p>Ankur Worldwide is a separate, new venture by the same family. The store is its origin, not its export record.</p>
          </div>
        </div>
      </div>
      <Section tone="light">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="reveal">
            <p className="eyebrow">One family, two businesses</p>
            <h2 className="display mt-6 text-5xl md:text-7xl">
              The shop stays. <span className="gilt">The name travels.</span>
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
              More than fifty years of keeping one counter open is the habit Ankur Worldwide brings to export: turn up,
              keep your word, stay.
            </p>
            <div className="mt-10">
              <Button href="/about">Read our story</Button>
            </div>
          </div>
          <Rings className="reveal mx-auto w-full max-w-80 text-accent" />
        </div>
      </Section>
    </>
  );
}
