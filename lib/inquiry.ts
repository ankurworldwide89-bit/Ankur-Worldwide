import { z } from "zod";
import { products } from "@/content/products";

// One line of text: trimmed, length-limited, no control characters (blocks header/subject injection).
const line = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .regex(/^[^\p{Cc}]*$/u);

export const productChoices = [...products.map((p) => p.slug), "other"];

// The only shape the inquiry endpoint accepts. Unknown fields are rejected.
export const Inquiry = z.strictObject({
  name: line(100),
  company: line(150),
  email: z.email().max(254),
  phone: line(30)
    .regex(/^[+\d][\d\s().-]*$/)
    .optional(),
  country: line(80),
  product: z.enum(productChoices),
  quantity: line(100),
  message: z.string().trim().max(2000).optional(),
  documents: z.boolean().default(false),
  consent: z.literal(true),
  website: z.string().max(200).optional(), // honeypot: real visitors never see or fill this
  token: z.string().min(1).max(2048), // Cloudflare Turnstile response
});
