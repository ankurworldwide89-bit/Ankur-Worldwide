import Link from "next/link";

const arc = [
  { step: "One", line: "shop counter in Bagasara, Gujarat." },
  { step: "Four", line: "generations of the same family behind it." },
  { step: "Now", line: "manufacturing in India, shipping worldwide." },
];

export default function HomeMockup() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:px-10 md:pb-40 md:pt-36">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">Import · Export · Gujarat, India</p>
        <h1 className="display mt-8 max-w-5xl text-[clamp(2.75rem,8vw,7rem)]">
          From one shop counter to the world.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
          A Gujarat family that has traded for more than fifty years. Ankur Worldwide is its fourth generation,
          manufacturing and exporting incense sticks to buyers everywhere.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-8">
          <Link
            href="#"
            className="bg-action px-8 py-4 text-sm font-medium text-action-fg transition-opacity hover:opacity-85"
          >
            Send an inquiry
          </Link>
          <Link href="#" className="border-b border-accent pb-0.5 text-sm">
            Read our story
          </Link>
        </div>
      </section>

      <section aria-label="Our story in brief" className="border-t border-line">
        <ol className="mx-auto grid max-w-7xl md:grid-cols-3">
          {arc.map((a) => (
            <li key={a.step} className="border-b border-line px-6 py-12 md:border-b-0 md:border-r md:px-10 md:py-16 md:last:border-r-0">
              <span className="display block text-5xl text-accent md:text-6xl">{a.step}</span>
              <span className="mt-4 block max-w-xs text-muted">{a.line}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
