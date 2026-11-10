import { Company } from "./schema";

// Only owner-confirmed facts go here. Leave a field out rather than guess it.
export const company = Company.parse({
  name: "Ankur Worldwide",
  url: "https://ankurworldwide.com",
  legalForm: "Proprietorship",
  proprietor: "Mufaddal Akil Kapadiya",
  region: "Gujarat, India",
  email: "ankurworldwide89@gmail.com",
  phone: "+918866253153",
  phoneDisplay: "+91 88662 53153",
  hours: "8:00 am to 8:00 pm IST",
  // Add entries when the owner supplies the numbers, e.g.
  // { label: "Importer Exporter Code (IEC)", number: "...", verifyUrl: "https://www.dgft.gov.in/CP/?opt=view-any-ice" },
  // { label: "GSTIN", number: "...", verifyUrl: "https://services.gst.gov.in/services/searchtp" },
  registrations: [],
  legalReviewed: false,
});
