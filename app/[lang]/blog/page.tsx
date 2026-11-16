import type { Metadata } from "next";
import Link from "next/link";
import { Button, Gilt, PageHeader } from "@/components/ui";
import { formatDate, getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes from Ankur Worldwide on incense, fragrance and exporting from India.",
  alternates: { canonical: "/blog" },
};

// The blog is in English only.
export const dynamicParams = false;
export const generateStaticParams = () => [{ lang: "en" }];

export default async function Blog() {
  const posts = await getPosts();
  return (
    <>
      <PageHeader eyebrow="Blog" title={<Gilt h={{ a: "Notes on incense", b: "and export." }} />} intro="Fragrance, materials, packaging and shipping, from a family that has traded for more than fifty years." />
      <div className="mx-auto max-w-5xl px-6 py-20 md:px-10 md:py-28">
        {posts.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-line p-10">
            <p className="display text-4xl text-muted">The first posts are on their way.</p>
            <div className="mt-8">
              <Button href="/contact" variant="ghost">
                Send an inquiry meanwhile
              </Button>
            </div>
          </div>
        ) : (
          <ul className="grid gap-6">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="card3d group block rounded-[2rem] border border-line bg-surface p-8 md:p-10">
                  <time dateTime={p.published_at} className="eyebrow">
                    {formatDate(p.published_at)}
                  </time>
                  <h2 className="display mt-5 text-4xl md:text-5xl">{p.title}</h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-muted">{p.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Read the post <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
