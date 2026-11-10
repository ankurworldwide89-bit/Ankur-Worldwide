# Still needed from the owner

The site works without these. Each missing item is simply left off the page, never guessed.
CONTENT-GUIDE.md explains where each value goes.

## Facts

| Item | Where it appears | Why it matters |
|---|---|---|
| IEC number | Home, Compliance | The main thing an overseas buyer can verify |
| GSTIN | Home, Compliance | Same |
| Registered address (as on GST certificate) | Compliance, Contact | Buyers and banks check it |
| Other registrations actually held (Udyam, RCMC, FSSAI, ISO) | Compliance | Only if held |
| Incense sticks: fragrances, stick length, burn time | Product page | Buyers ask first |
| Incense sticks: pack sizes, carton sizes | Product page | |
| Incense sticks: minimum order quantity | Product page | |
| Incense sticks: HS code used on your shipping documents (commonly 3307.41.00, to be confirmed by you) | Product page | |
| Incense sticks: private label yes or no | Product page | |
| Business days for the 8 am to 8 pm hours | Contact | |
| Store founding year, if the family wants it shown | About, Group | Optional |

## To read and correct

- The four About chapters in `content/about.ts`. They are deliberately brief because no dates or names were supplied.
- Confirm that Mufaddal Akil Kapadiya is to be shown as proprietor of Ankur Worldwide.
- Privacy policy: the 24-month retention period for inquiries.
- Terms: "courts of Gujarat, India" as jurisdiction.

## Photos

- Incense sticks (portrait, 4:5), at least 1600 px wide.
- Ankur Novelty Store (landscape, 3:2), if the family agrees.

## Reviews

- A lawyer must review `/privacy` and `/terms`. Both show a "Draft" notice until `legalReviewed` is set to
  `true` in `content/company.ts`.
- An independent penetration test is recommended before the site does anything beyond collecting inquiries.

## Recommended

- A mailbox on the domain (for example `info@ankurworldwide.com`). A Gmail address looks less established
  to overseas buyers. See DEPLOY.md, step 9.
- The final AW monogram, as an SVG file.
