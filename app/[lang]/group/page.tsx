import type { Metadata } from "next";
import { Arch, Rings } from "@/components/art";
import { Button, Gilt, ImageSlot, PageHeader, Section } from "@/components/ui";
import { type LangParams, page } from "@/content/i18n";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { t, alt } = await page(params);
  return { title: t.group.title, description: t.group.description, alternates: alt("/group") };
}

export default async function Group({ params }: LangParams) {
  const { t, L } = await page(params);
  const g = t.group;
  return (
    <>
      <PageHeader eyebrow={g.eyebrow} title={<Gilt h={g.h} />} />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-2 lg:gap-24">
        <div className="reveal">
          <ImageSlot name="store" fallback={<Arch className="absolute inset-0 m-auto h-4/5 text-accent" />} />
        </div>
        <div className="reveal">
          <p className="eyebrow">{g.place}</p>
          {/* The shop's name is a proper name and stays in English. */}
          <h2 className="display mt-6 text-6xl md:text-7xl" dir="ltr">
            Ankur <span className="gilt">Novelty Store</span>
          </h2>
          <div className="mt-8 max-w-md space-y-5 text-lg leading-relaxed text-muted">
            <p>{g.p1}</p>
            <p>{g.p2}</p>
          </div>
        </div>
      </div>
      <Section tone="sand">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="reveal">
            <p className="eyebrow">{g.twoEyebrow}</p>
            <h2 className="display mt-6 text-5xl md:text-7xl">
              <Gilt h={g.twoH} />
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">{g.twoP}</p>
            <div className="mt-10">
              <Button href={L("/about")}>{g.cta}</Button>
            </div>
          </div>
          <Rings className="scroll-turn mx-auto w-full max-w-80 text-accent" />
        </div>
      </Section>
    </>
  );
}
