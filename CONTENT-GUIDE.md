# Content guide

Everything you will normally change lives in the `content/` folder. After any change, run `npm run build`.
If you made a mistake (a missing field, a duplicate product address), the build stops and tells you which
field is wrong. Then commit and push; Vercel publishes automatically.

Rule for every edit: **only confirmed facts.** If you do not know a value, leave the line out.

## Add registration numbers (IEC, GSTIN)

Open `content/company.ts` and fill the `registrations` list:

```ts
registrations: [
  { label: "Importer Exporter Code (IEC)", number: "YOUR-IEC", verifyUrl: "https://www.dgft.gov.in/CP/?opt=view-any-ice" },
  { label: "GSTIN", number: "YOUR-GSTIN", verifyUrl: "https://services.gst.gov.in/services/searchtp" },
],
```

The compliance strip on the home page and the list on the Compliance page appear automatically.
Open each `verifyUrl` yourself first and confirm it is the official portal page where your number can be searched.

Never put PAN, Aadhaar, bank details, signatures or certificate scans in this repository.

## Add the registered address

In `content/company.ts` add one line, copied exactly from the GST certificate:

```ts
address: "…",
```

## Complete a product

Open `content/products/incense-sticks.ts` and add any of these. Each one adds a row to the product page.

```ts
specs: [
  ["Stick length", "…"],
  ["Burn time", "…"],
  ["Fragrances", "…"],
],
packaging: ["…", "…"],
moq: "…",
hsCode: "…",
privateLabel: true,
```

## Add a new product

1. Copy `content/products/incense-sticks.ts` to a new file, for example `content/products/dhoop-cones.ts`.
2. Change every field. `slug` becomes the web address (`/products/dhoop-cones`): lowercase letters, numbers and hyphens only.
3. Set `manufacturedInHouse: true` **only** if Ankur Worldwide makes the product itself. Otherwise `false`;
   the page then says "Exporter" instead of "Manufacturer and exporter".
4. Add an image slot for it in `content/images/manifest.ts` and put that key in the product's `image` field.
5. In `content/products/index.ts`, import the file and add it to the list.

The product then appears on the home page, the Products page, the inquiry form and the sitemap.

## Replace a photo placeholder

1. Save the photo in `content/images/`, for example `incense-sticks.jpg`. Use the slot's shape
   (4:5 portrait for products, 3:2 landscape for the store), about 1600 to 2400 px on the long side.
2. In `content/images/manifest.ts`:

```ts
import incense from "./incense-sticks.jpg";

"incense-sticks": { alt: "Describe what the photo shows", ratio: "4/5", src: incense },
```

The site converts it to modern formats and sizes automatically.

Do not use AI-generated pictures of the real shop, real people or real certificates.

Technical note for whoever adds the first photo: the image component adds a small inline style, which the
strict security policy may log as a blocked style. Check the browser console on a production build; if it
appears, see "Known limits" in SECURITY.md.

## Swap in the final logo

The logo is defined once, in `components/Logo.tsx`. Replace the `<svg>…</svg>` there with the monogram's SVG.
Keep `role="img"`, `aria-label="Ankur Worldwide"`, `className={className}` and `fill="currentColor"` so it
keeps its size and colour in the header and footer. Then update the two other places that draw it by hand:
`app/icon.svg` (browser tab icon) and `app/opengraph-image.tsx` (link preview image).

## Change text on a page

All page wording, including the About chapters, is in `content/i18n/en.ts` and its translations
(see "Languages" below). The page layouts are in `app/[lang]/`.

## After a lawyer approves the legal pages

Set `legalReviewed: true` in `content/company.ts`. The "Draft" notice disappears.

## Languages

The site is published in English (main), Arabic, Spanish, French, German, Russian, Portuguese and Chinese.

- English pages are at the plain address (`/about`). Other languages add their code (`/ar/about`, `/zh/about`).
- All page text lives in `content/i18n/`, one file per language. `en.ts` is the source; every other file must
  have exactly the same keys. `npm test` fails if a language is missing a line or a list item.
- **To change wording**, edit `en.ts` and the same line in each other file. If you cannot translate it, ask for
  the translation rather than leaving English inside another language's file.
- **Product text**: English comes from `content/products/*.ts`; translations are under `products` in each
  language file, keyed by the product's address (`incense-sticks`, `dhoop`). A new product needs an entry in
  every language file, with one `range` line per collection.
- Fragrance names, the shop name and the company name are proper names and are not translated.
- Privacy Policy and Terms are English only, on purpose: legal text should not be machine-translated.
- Arabic reads right to left. The layout flips automatically; check new sections in Arabic before publishing.
