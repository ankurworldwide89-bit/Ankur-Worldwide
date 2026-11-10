import type { MetadataRoute } from "next";
import { company } from "@/content/company";
import { products } from "@/content/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/products",
    ...products.map((p) => `/products/${p.slug}`),
    "/about",
    "/group",
    "/compliance",
    "/contact",
    "/privacy",
    "/terms",
  ];
  return paths.map((p) => ({ url: `${company.url}${p}` }));
}
