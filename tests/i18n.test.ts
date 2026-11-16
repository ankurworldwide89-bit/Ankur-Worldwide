import { describe, expect, it } from "vitest";
import { dict } from "@/content/i18n";
import { products } from "@/content/products";
import { locales } from "@/lib/i18n";

// The shape of a value: same keys and same list lengths, ignoring the text itself.
const shape = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(shape) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, shape(x)])) : typeof v;

describe("translations", () => {
  const { products: _enProducts, ...english } = dict("en");

  for (const lang of locales.filter((l) => l !== "en")) {
    const { products: translated, ...rest } = dict(lang);

    it(`${lang}: has the same keys and list lengths as English`, () => {
      expect(shape(rest)).toEqual(shape(english));
    });

    it(`${lang}: translates every product, with one range entry per collection`, () => {
      for (const p of products) {
        const t = translated[p.slug];
        expect(t, `${lang} is missing product "${p.slug}"`).toBeDefined();
        expect(t!.range).toHaveLength(p.range.length);
        expect(t!.specs).toHaveLength(p.specs.length);
        expect(t!.packaging).toHaveLength(p.packaging.length);
        expect(t!.description).toHaveLength(p.description.length);
      }
    });

    it(`${lang}: has no empty text`, () => {
      const empty: string[] = [];
      const walk = (v: unknown, path: string) => {
        if (typeof v === "string") v.trim() || empty.push(path);
        else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
      };
      walk(dict(lang), lang);
      expect(empty).toEqual([]);
    });
  }
});
