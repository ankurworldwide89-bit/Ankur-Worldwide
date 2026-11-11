import { company } from "./company";

// DRAFT for the family to correct. Every sentence must stay true: no dates, names or events that were not supplied.
export const chapters = [
  {
    numeral: "I",
    title: "The counter",
    body: "The Ankur name began behind a single shop counter: Ankur Novelty Store, in the town of Bagasara, Gujarat.",
  },
  {
    numeral: "II",
    title: "The handover",
    body: "The trade passed from one generation of the family to the next, and then again. The name on the shop stayed the same.",
  },
  {
    numeral: "III",
    title: "Fifty years on",
    body: "More than fifty years later, Ankur Novelty Store is still open and still trading in Bagasara.",
  },
  {
    numeral: "IV",
    title: "The world",
    body: `${company.name} is the family's fourth generation, led by ${company.signatory}. It is a new venture in import and export, beginning with incense sticks it manufactures in India for buyers abroad.`,
  },
];
