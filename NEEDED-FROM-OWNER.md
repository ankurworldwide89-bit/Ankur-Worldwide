# Still needed from the owner

The site works without these. CONTENT-GUIDE.md explains where each value goes.

## Received

- IEC: ACPFA4509F (from the DGFT certificate, 25 August 2026).
- Registered address and legal form (Partnership), copied from the same certificate.
- Hours: open 24 hours for orders and inquiries.

## To confirm

The IEC certificate says the firm is a **Partnership**. The owner had earlier described it as a
proprietorship. The site follows the certificate and shows Mufaddal Akil Kapadiya as "Authorised signatory".
Tell us if the wording should be different (for example "Partner").

An IEC number is the same as the firm's PAN. It is published because IECs are public and buyers verify them,
but it is never labelled as a PAN on the site. No personal PAN, Aadhaar, bank detail or certificate scan is
in this repository.

## Generic product details to replace

At the owner's request the incense sticks page currently shows **generic** details. Replace each with the
real value in `content/products/incense-sticks.ts`:

| Field | Shown now |
|---|---|
| Type | Hand-rolled and machine-made bamboo-core incense sticks |
| Fragrances | Floral, woody, herbal and traditional fragrances, or your own |
| Stick length | Common export sizes such as 8 inch and 9 inch, or to your requirement |
| Burn time | Depends on stick size and blend; confirmed with your sample |
| Packaging | Pouches, printed boxes, hexagonal tubes, bulk export cartons |
| Minimum order | Confirmed with your quotation |
| HS code | 3307.41.00 (confirm against your shipping documents) |
| Private label | Not shown until confirmed |

## Still missing

| Item | Where it appears |
|---|---|
| GSTIN | Home, Compliance |
| Other registrations actually held (Udyam, RCMC, FSSAI, ISO) | Compliance |
| Store founding year, if the family wants it shown | About, Group |

## To read and correct

- The four About chapters in `content/about.ts`.
- The promises on the home page: samples before quotation, everything confirmed in writing, fragrance and
  packaging to the buyer's specification.
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

- A mailbox on the domain (for example `info@ankurworldwide.com`). See DEPLOY.md, step 9.
- The final AW monogram, as an SVG file.

## Catalogue range (added from the manufacturing partner's catalogue)

The owner confirmed that SWARA Agarbati Works manufactures for Ankur Worldwide. The site therefore says
"made for Ankur Worldwide by our manufacturing partner in Bagasara, Gujarat" and "Exporter". It does **not**
say "manufactured by Ankur Worldwide", because that would be untrue and a buyer or customs officer can check it.

Please confirm or supply:

- **Written permission from SWARA Agarbati Works** to list their fragrance names (Evoke, Asiatic, Velar,
  Netram, The Monk and the others) on this site. Until then the partner is not named and no pack artwork is shown.
- **Which brand is printed on export packs**: SWARA, Ankur Worldwide, or the buyer's own (private label).
- Two packs named "Ponds" were left off the site. "Pond's" is another company's registered trademark.
- Retail prices (M.R.P.) were left off on purpose. Export prices are quoted per inquiry.
- HS code 3307.41.00 and "minimum order confirmed with your quotation" are still unconfirmed placeholders.
- The four-part description of an incense stick (bamboo core, base paste, fragrance layer, ember) is a
  general description of a bamboo-core agarbatti. Correct it if your partner's sticks are made differently.
