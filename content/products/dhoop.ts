import type { ProductInput } from "../schema";

// From the manufacturing partner's printed catalogue. Retail prices are left out on purpose.
export default {
  slug: "dhoop",
  name: "Dhoop cups and sticks",
  localName: "Dhoop",
  summary: "Dhoop cups and bamboo-free dhoop sticks made for Ankur Worldwide in Bagasara, Gujarat.",
  description: [
    "Dhoop is incense without a bamboo core: the whole piece is fragrant paste, so it burns with a fuller, denser smoke. Made for Ankur Worldwide by our manufacturing partner in Bagasara, Gujarat.",
    "Supplied as cups in boxes of twelve and as sticks in 100 g jars. Fragrance and packing are quoted to your requirement.",
  ],
  manufacturedInHouse: false,
  madeBy: "Our manufacturing partner in Bagasara, Gujarat, for Ankur Worldwide",
  origin: "India",
  specs: [["Type", "Bamboo-free dhoop cups and dhoop sticks"]],
  packaging: ["Boxes of 12 cups", "100 g jars of sticks"],
  moq: "Confirmed with your quotation",
  range: [
    { name: "Dhoop cups", pack: "Box of 12 cups", items: ["Guggal", "Kalash", "Kasturi"] },
    { name: "Dhoop sticks", pack: "100 g jar", items: ["Kasturi", "Kapoor Gugal", "Sandal", "Netram", "Evoke", "Rose"] },
  ],
  image: "incense-sticks",
} satisfies ProductInput;
