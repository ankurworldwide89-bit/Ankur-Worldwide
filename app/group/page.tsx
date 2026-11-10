import type { Metadata } from "next";
import { ImageSlot, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Group Concern",
  description: "Ankur Novelty Store, Bagasara, Gujarat: the family shop where the Ankur name began.",
  alternates: { canonical: "/group" },
};

export default function Group() {
  return (
    <>
      <PageHeader eyebrow="Group concern" title="Where the name began." />
      <div className="mx-auto grid max-w-7xl gap-12 border-t border-line px-6 pb-24 pt-16 md:grid-cols-2 md:gap-20 md:px-10 md:pb-36">
        <ImageSlot name="store" />
        <div>
          <h2 className="display text-4xl md:text-5xl">Ankur Novelty Store</h2>
          <p className="mt-3 text-sm text-accent">Bagasara, Gujarat, India</p>
          <div className="mt-8 max-w-md space-y-5 text-lg leading-relaxed text-muted">
            <p>The family shop where the Ankur name began. It has traded for more than fifty years and is open today.</p>
            <p>
              Ankur Worldwide is a separate, new venture by the same family. The store is its origin, not its
              export record.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
