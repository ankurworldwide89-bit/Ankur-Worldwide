import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabase-public";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  published_at: string;
  updated_at: string;
};

// Published posts, read at build time with the public key (the database only returns published rows to it).
// Blog pages are static files: the admin page's "Publish" button rebuilds the site to pick up changes.
// If the database cannot be reached the build fails on purpose, so the live site keeps its previous posts
// instead of being replaced by a version with an empty blog. Set BLOG_OFFLINE=1 to build without posts.
let cache: Promise<Post[]> | undefined;

export function getPosts(): Promise<Post[]> {
  if (process.env.BLOG_OFFLINE === "1") return Promise.resolve([]);
  cache ??= (async () => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?select=slug,title,excerpt,body,published_at,updated_at&published=eq.true&order=published_at.desc`,
      { headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}` }, cache: "no-store" },
    );
    if (!res.ok) throw new Error(`Could not load blog posts: Supabase responded ${res.status}`);
    return (await res.json()) as Post[];
  })();
  return cache;
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
