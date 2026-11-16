import { Cormorant, Manrope } from "next/font/google";

// next/font downloads these at build time and serves them from our own domain.
// Arabic and Chinese fall back to the visitor's system fonts, which already cover those scripts.
const cormorant = Cormorant({ subsets: ["latin", "cyrillic"], style: ["normal", "italic"], variable: "--font-cormorant" });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope" });

export const fontClasses = `${cormorant.variable} ${manrope.variable}`;
