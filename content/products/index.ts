import { Product } from "../schema";
import dhoop from "./dhoop";
import incenseSticks from "./incense-sticks";

// To add a product: create a file next to this one, import it, add it to this list.
export const products = [incenseSticks, dhoop].map((p) => Product.parse(p));

const slugs = products.map((p) => p.slug);
if (new Set(slugs).size !== slugs.length) throw new Error("Duplicate product slug in content/products");
