import Image from "next/image";
import Link from "next/link";
import { images } from "@/content/images/manifest";
import { Mandala } from "./art";

const buttonStyles = {
  primary:
    "inline-flex items-center gap-3 rounded-full bg-action px-8 py-4 text-sm font-bold tracking-wide text-action-fg transition-shadow hover:shadow-[0_0_44px_-6px_var(--accent)]",
  ghost:
    "inline-flex items-center gap-3 rounded-full border border-line px-8 py-4 text-sm font-semibold tracking-wide transition-colors hover:border-accent hover:text-accent",
  text: "border-b border-accent pb-0.5 text-sm font-semibold transition-colors hover:text-accent",
};

export function Button({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: keyof typeof buttonStyles;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={buttonStyles[variant]}>
      {children}
      {variant !== "text" && <span aria-hidden="true">→</span>}
    </Link>
  );
}

// A full-width band. `tone` flips the whole colour scheme for that band.
export function Section({
  tone = "dark",
  eyebrow,
  title,
  children,
  id,
}: {
  tone?: "dark" | "light";
  eyebrow?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} data-tone={tone} className="relative overflow-hidden bg-bg text-fg">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-36">
        {eyebrow && <p className="eyebrow reveal">{eyebrow}</p>}
        {title && <h2 className="display reveal mt-6 max-w-4xl text-5xl md:text-7xl">{title}</h2>}
        {children}
      </div>
    </section>
  );
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: React.ReactNode; intro?: string }) {
  return (
    <div className="relative overflow-hidden">
      <div className="glow absolute -right-40 -top-40 size-[44rem]" aria-hidden="true" />
      <Mandala className="absolute -right-48 -top-48 size-[46rem] text-accent opacity-25 md:-right-32" />
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:px-10 md:pb-36 md:pt-32">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-8 max-w-4xl text-[clamp(3.25rem,9vw,7.5rem)]">{title}</h1>
        {intro && <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl">{intro}</p>}
      </div>
      <div className="jaali" aria-hidden="true" />
    </div>
  );
}

const ratios = { "4/5": "aspect-[4/5]", "3/2": "aspect-[3/2]" };

// Fixed-ratio image slot. Shows the photo from the manifest; until one exists, shows `fallback` art.
export function ImageSlot({ name, priority, fallback }: { name: string; priority?: boolean; fallback: React.ReactNode }) {
  const slot = images[name];
  if (!slot) throw new Error(`Unknown image slot "${name}" (see content/images/manifest.ts)`);
  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-line bg-surface ${ratios[slot.ratio]}`}>
      {slot.src ? (
        <Image src={slot.src} alt={slot.alt} fill priority={priority} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      ) : (
        <>
          <div className="glow absolute inset-0 m-auto size-4/5" aria-hidden="true" />
          {fallback}
        </>
      )}
    </div>
  );
}

// Structured data for search engines. "<" is escaped so content can never close the script tag.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
