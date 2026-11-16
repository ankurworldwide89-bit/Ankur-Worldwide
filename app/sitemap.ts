import type { MetadataRoute } from "next";
import { company } from "@/content/company";
import { products } from "@/content/products";
import { getPosts } from "@/lib/posts";
import { alternates, href, locales } from "@/lib/i18n";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const translated = ["/", "/products", ...products.map((p) => `/products/${p.slug}`), "/about", "/group", "/compliance", "/contact"];
  const abs = (path: string) => `${company.url}${path === "/" ? "" : path}`;
  return [
    // One entry per page per language, each listing its translations.
    ...translated.flatMap((path) =>
      locales.map((lang) => ({
        url: abs(href(lang, path)),
        alternates: { languages: Object.fromEntries(Object.entries(alternates(lang, path).languages).map(([l, p]) => [l, abs(p)])) },
      })),
    ),
    // English-only pages.
    ...["/privacy", "/terms", "/blog"].map((path) => ({ url: abs(path) })),
    ...(await getPosts()).map((p) => ({ url: abs(`/blog/${p.slug}`), lastModified: p.updated_at })),
  ];
}
