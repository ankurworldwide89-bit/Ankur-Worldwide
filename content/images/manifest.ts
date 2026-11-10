import type { StaticImageData } from "next/image";

type Slot = { alt: string; ratio: "4/5" | "3/2"; src?: StaticImageData };

// To replace a placeholder: put the photo in this folder, then
//   import incense from "./incense-sticks.jpg";
// and add `src: incense` to the slot below.
export const images: Record<string, Slot> = {
  "incense-sticks": { alt: "Incense sticks made by Ankur Worldwide", ratio: "4/5" },
  store: { alt: "Ankur Novelty Store in Bagasara, Gujarat", ratio: "3/2" },
};
