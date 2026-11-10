import Image from "next/image";
import Link from "next/link";
import { images } from "@/content/images/manifest";

const buttonStyles = {
  primary:
    "inline-block bg-action px-8 py-4 text-sm font-medium text-action-fg transition-opacity hover:opacity-85",
  text: "border-b border-accent pb-0.5 text-sm",
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
    </Link>
  );
}

export function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-32">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && <h2 className="display mt-6 max-w-3xl text-4xl md:text-6xl">{title}</h2>}
        {children}
      </div>
    </section>
  );
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-28">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display mt-8 max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)]">{title}</h1>
      {intro && <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

const ratios = { "4/5": "aspect-[4/5]", "3/2": "aspect-[3/2]" };

// Fixed-ratio image slot. Shows the photo from the manifest, or a quiet placeholder until one exists.
export function ImageSlot({ name, priority }: { name: string; priority?: boolean }) {
  const slot = images[name];
  if (!slot) throw new Error(`Unknown image slot "${name}" (see content/images/manifest.ts)`);
  if (slot.src) {
    return (
      <div className={`relative overflow-hidden ${ratios[slot.ratio]}`}>
        <Image src={slot.src} alt={slot.alt} fill priority={priority} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </div>
    );
  }
  return (
    <div
      aria-hidden="true"
      className={`flex items-end border border-line bg-line/30 p-6 text-xs uppercase tracking-[0.2em] text-muted ${ratios[slot.ratio]}`}
    >
      {process.env.NODE_ENV !== "production" && "Photography coming soon"}
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
