import { z } from "zod";

const text = z.string().trim().min(1);

export const Registration = z.object({
  label: text, // e.g. "Importer Exporter Code (IEC)"
  number: text,
  verifyUrl: z.url(), // official government portal where a buyer can check the number
  how: text.optional(), // one sentence: how to look the number up on that portal
});

export const Company = z.object({
  name: text,
  url: z.url(),
  legalForm: text,
  signatory: text, // the person named as signatory on the IEC certificate
  region: text,
  address: text.optional(), // registered address, exactly as on the GST certificate
  email: z.email(),
  phone: z.string().regex(/^\+\d{8,15}$/), // international format, digits only
  phoneDisplay: text,
  hours: text,
  registrations: z.array(Registration),
  legalReviewed: z.boolean(), // set true once a lawyer has approved /privacy and /terms
});

export const Product = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  name: text,
  localName: text.optional(),
  summary: text.max(160),
  description: z.array(text).min(1),
  manufacturedInHouse: z.boolean(), // true only when Ankur Worldwide itself is the manufacturer
  madeBy: text.optional(), // who makes it, when that is not Ankur Worldwide itself
  showAnatomy: z.boolean().optional(), // show the clickable 3D incense stick on the product page
  range: z.array(z.object({ name: text, pack: text, items: z.array(text).min(1) })).default([]), // collections: pack format and fragrances
  origin: text,
  specs: z.array(z.tuple([text, text])).default([]),
  packaging: z.array(text).default([]),
  moq: text.optional(),
  hsCode: text.optional(),
  privateLabel: z.boolean().optional(),
  image: text, // key in content/images/manifest.ts
});

export type Product = z.infer<typeof Product>;
export type ProductInput = z.input<typeof Product>;
