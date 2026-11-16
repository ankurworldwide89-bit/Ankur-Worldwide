import type { Metadata } from "next";
import { Arch, Mandala, Rings, Routes } from "@/components/art";
import { Button, Gilt, PageHeader } from "@/components/ui";
import { type LangParams, page } from "@/content/i18n";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { t, alt } = await page(params);
  return { title: t.about.title, description: t.about.description, alternates: alt("/about") };
}

const numerals = ["I", "II", "III", "IV"];

// One illustration per chapter, in order: the shop, the handover, the years, the world.
const art = [
  <Arch key="1" className="mx-auto h-72 text-accent" />,
  <div key="2" className="relative mx-auto h-72 w-72">
    <Arch className="absolute left-0 top-6 h-64 text-accent opacity-50" />
    <Arch className="absolute right-0 top-0 h-72 text-accent" />
  </div>,
  <Rings key="3" className="scroll-turn mx-auto w-full max-w-72 text-accent" />,
  <Routes key="4" className="mx-auto w-full max-w-md text-accent" />,
];

export default async function About({ params }: LangParams) {
  const { t, L } = await page(params);
  const a = t.about;
  return (
    <>
      <PageHeader eyebrow={a.eyebrow} title={<Gilt h={a.h} />} intro={a.intro} />
      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <div aria-hidden="true" className="absolute start-6 top-0 h-full w-px bg-line md:start-1/2" />
        <ol>
          {a.chapters.map((c, i) => (
            <li key={c.title} className="reveal relative grid items-center gap-10 py-20 ps-10 md:grid-cols-2 md:gap-24 md:py-32 md:ps-0">
              <span aria-hidden="true" className="absolute left-0 top-24 size-3 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_24px_4px_var(--accent)] md:left-1/2 md:top-1/2 rtl:left-auto rtl:right-0 rtl:translate-x-1/2 md:rtl:right-1/2" />
              <div className={i % 2 ? "md:col-start-2" : "md:text-end"}>
                <span aria-hidden="true" className="display outline-text block text-8xl leading-none md:text-9xl">
                  {numerals[i]}
                </span>
                <h2 className="display mt-4 text-5xl md:text-7xl">{c.title}</h2>
                <p className={`mt-6 max-w-md text-lg leading-relaxed text-muted ${i % 2 ? "" : "md:ms-auto"}`}>{c.body}</p>
              </div>
              <div className={`tilt-in ${i % 2 ? "md:col-start-1 md:row-start-1" : ""}`}>{art[i]}</div>
            </li>
          ))}
        </ol>
      </div>
      <section data-tone="dark" className="relative overflow-hidden bg-bg text-fg">
        <Mandala className="scroll-turn pointer-events-none absolute inset-0 m-auto size-[56rem] max-w-none text-accent opacity-20" />
        <div className="relative mx-auto max-w-4xl px-6 py-32 text-center md:py-44">
          <h2 className="display reveal text-[clamp(3rem,8vw,7rem)]">
            <Gilt h={a.cta} />
          </h2>
          <div className="reveal mt-12 flex justify-center">
            <Button href={L("/contact")}>{t.nav.inquire}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
