import type { Metadata } from "next";
import Link from "next/link";
import { Button, JsonLd } from "@/components/ui";
import { company } from "@/content/company";
import { Markdown } from "@/lib/markdown";
import { formatDate, getPosts } from "@/lib/posts";

type Props = { params: Promise<{ lang: string; slug: string }> };

// One static page per published post, English only. New posts appear after the next rebuild.
export const dynamicParams = false;
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  if (params.lang !== "en") return [];
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

async function load({ params }: Props) {
  const { slug } = await params;
  const post = (await getPosts()).find((p) => p.slug === slug);
  if (!post) throw new Error(`No post "${slug}"`); // unreachable: dynamicParams is false
  return post;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const p = await load(props);
  return { title: p.title, description: p.excerpt, alternates: { canonical: `/blog/${p.slug}` }, openGraph: { type: "article", publishedTime: p.published_at } };
}

export default async function BlogPost(props: Props) {
  const p = await load(props);
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-14 md:px-10 md:pb-36 md:pt-20">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/blog" className="hover:text-fg">
          Blog
        </Link>
      </nav>
      <time dateTime={p.published_at} className="eyebrow mt-10">
        {formatDate(p.published_at)}
      </time>
      <h1 className="display mt-6 text-[clamp(2.75rem,6vw,5rem)]">{p.title}</h1>
      <p className="mt-6 text-xl leading-relaxed text-muted">{p.excerpt}</p>
      <div className="prose-blog mt-12 border-t border-line pt-10">
        <Markdown source={p.body} />
      </div>
      <div className="mt-16 rounded-[2rem] border border-line bg-surface p-8">
        <p className="display text-3xl">Looking for a supplier?</p>
        <p className="mt-3 text-muted">Tell us the product, quantity and destination country.</p>
        <div className="mt-6">
          <Button href="/contact">Send an inquiry</Button>
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: p.title,
          description: p.excerpt,
          datePublished: p.published_at,
          dateModified: p.updated_at,
          url: `${company.url}/blog/${p.slug}`,
          author: { "@type": "Organization", name: company.name },
          publisher: { "@type": "Organization", name: company.name },
        }}
      />
    </article>
  );
}
