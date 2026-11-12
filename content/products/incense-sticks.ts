import type { ProductInput } from "../schema";

// Range, pack formats and net weights are taken from the manufacturing partner's printed catalogue.
// Retail prices (M.R.P.) are deliberately left out: export prices are quoted per inquiry.
export default {
  slug: "incense-sticks",
  name: "Incense sticks",
  localName: "Agarbatti",
  summary: "Agarbatti made for Ankur Worldwide in Bagasara, Gujarat, and exported to buyers worldwide.",
  description: [
    "Agarbatti made for Ankur Worldwide by our manufacturing partner in Bagasara, Gujarat, and exported to importers, distributors and wholesalers around the world.",
    "More than thirty fragrances across pouches, zipper packs and boxes, from 15 g retail packs to 400 g family packs. Tell us what your market needs and we will reply with a specification and a price.",
  ],
  manufacturedInHouse: false,
  madeBy: "Our manufacturing partner in Bagasara, Gujarat, for Ankur Worldwide",
  origin: "India",
  specs: [
    ["Type", "Bamboo-core incense sticks"],
    ["Stick formats", "Regular sticks and 19 inch premium long sticks"],
    ["Net weights", "15 g to 400 g per pack; long sticks in packs of 10"],
  ],
  packaging: ["Small and medium pouches", "zipper pouches", "jumbo zipper pouches", "small, economy and premium boxes"],
  moq: "Confirmed with your quotation",
  hsCode: "3307.41.00",
  showAnatomy: true,
  range: [
    { name: "Small pouch", pack: "20 g to 25 g", items: ["Kasturi", "Asiatic", "Royal Pineapple", "Rose", "Jasmine", "Mogra", "Gugal", "Loban", "Sandal"] },
    { name: "Medium pouch", pack: "65 g", items: ["Ramlala", "Velar"] },
    { name: "Small box", pack: "15 g to 20 g", items: ["Evoke", "Asiatic", "Royal Pineapple", "Rose", "Woody's"] },
    {
      name: "Zipper pouch",
      pack: "110 g to 140 g",
      items: ["Evoke", "Netram", "Royal Collection 3 in 1", "The Monk", "Kapoor Gugal", "Royal Pineapple", "Asiatic", "Blue Edition", "Kasturi", "Defender", "Sandal", "Bella", "Rose", "Bharat Varsh", "Loban", "Arabian Oudh", "Ronald"],
    },
    { name: "Jumbo zipper pouch", pack: "300 g to 400 g", items: ["Shivalay 4 in 1", "Luv Kush 2 in 1", "Special 3 in 1", "Vande Bharat", "5 in 1"] },
    { name: "Economy box", pack: "100 g", items: ["Gold Collection 2 in 1", "Kapoor Gugal", "Himalayan Aqua", "Sandal"] },
    { name: "Premium box", pack: "100 g", items: ["Kesar Chandan", "Sandal Flora", "Evoke", "Kasturi", "Woody's"] },
    { name: "Premium long sticks, 19 inch", pack: "10 sticks", items: ["Evoke", "Sandal", "Kasturi", "Kapoor Gugal"] },
  ],
  image: "incense-sticks",
} satisfies ProductInput;
