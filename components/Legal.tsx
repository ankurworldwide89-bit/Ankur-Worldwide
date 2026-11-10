import { PageHeader } from "@/components/ui";
import { company } from "@/content/company";

// Shared frame for /privacy and /terms. The draft notice disappears when company.legalReviewed is true.
export function Legal({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} />
      <div className="prose-legal mx-auto max-w-3xl px-6 pb-24 text-muted md:px-10 md:pb-36">
        <p>Last updated: {updated}</p>
        {!company.legalReviewed && (
          <p role="note" className="border border-accent p-4 text-fg">
            Draft. This text is awaiting review by our legal adviser and may change.
          </p>
        )}
        {children}
      </div>
    </>
  );
}
