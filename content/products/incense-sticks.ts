import type { ProductInput } from "../schema";

// GENERIC DETAILS, added at the owner's request until the real specification is supplied.
// Everything in `specs`, `packaging`, `moq` and `hsCode` must be replaced or confirmed by the owner.
export default {
  slug: "incense-sticks",
  name: "Incense sticks",
  localName: "Agarbatti",
  summary: "Agarbatti made by Ankur Worldwide in India and exported to buyers worldwide.",
  description: [
    "Agarbatti made by Ankur Worldwide in India and shipped to importers, distributors and wholesalers around the world.",
    "Fragrances, stick sizes and packaging are quoted to your requirement. Tell us what your market needs and we will reply with a specification and a price.",
  ],
  manufacturedInHouse: true,
  origin: "India",
  specs: [
    ["Type", "Hand-rolled and machine-made bamboo-core incense sticks"],
    ["Fragrances", "Floral, woody, herbal and traditional fragrances, or your own"],
    ["Stick length", "Common export sizes such as 8 inch and 9 inch, or to your requirement"],
    ["Burn time", "Depends on stick size and blend; confirmed with your sample"],
    ["Use", "Prayer, meditation, home fragrance"],
  ],
  packaging: ["Pouches", "printed boxes", "hexagonal tubes", "bulk export cartons"],
  moq: "Confirmed with your quotation",
  hsCode: "3307.41.00",
  image: "incense-sticks",
} satisfies ProductInput;
