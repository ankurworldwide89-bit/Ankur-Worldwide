import type { Dict } from "@/content/i18n/en";
import { Gilt } from "./ui";

// A picture of the inquiry form that fills itself in as the visitor scrolls: the section stays pinned
// while each field fills, the button presses and the thank-you line appears (scroll-effects.css, ".demo").
// It is decoration only: the real form is on the Contact page. All text comes from the language files.
export function ScrollDemo({ t, product }: { t: Dict; product: string }) {
  const f = t.form;
  const fields = [
    { label: f.name, fill: "w-2/5" },
    { label: f.company, fill: "w-3/5" },
    { label: f.country, fill: "w-1/3" },
    { label: f.product, text: product },
    { label: f.quantity, fill: "w-1/2" },
  ];
  return (
    <section data-tone="sand" className="demo relative bg-bg text-fg">
      <div className="demo-pin mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:px-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <h2 className="display mt-6 text-5xl md:text-7xl">
            <Gilt h={t.contact.h} />
          </h2>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">{t.contact.intro}</p>
        </div>
        <div className="demo-card" aria-hidden="true">
          <p className="eyebrow">{t.contact.formTitle}</p>
          <div className="mt-4">
            {fields.map((x) => (
              <span key={x.label} className="demo-field">
                <span className="text-sm text-muted">{x.label}</span>
                {x.text ? <span className="demo-text">{x.text}</span> : <span className={`demo-fill ${x.fill}`} />}
              </span>
            ))}
          </div>
          <span className="demo-send mt-8 inline-flex rounded-full bg-action px-8 py-4 text-sm font-bold tracking-wide text-action-fg">{f.send}</span>
          <p className="demo-done mt-6 flex items-center gap-3 font-semibold text-accent">
            <span className="grid size-7 place-items-center rounded-full border border-accent">✓</span>
            {f.thanksH}
          </p>
        </div>
      </div>
    </section>
  );
}
