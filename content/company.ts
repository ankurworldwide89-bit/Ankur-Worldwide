import { Company } from "./schema";

// Only owner-confirmed facts go here. Leave a field out rather than guess it.
// Legal form, address and IEC are copied from the DGFT Importer-Exporter Code certificate.
export const company = Company.parse({
  name: "Ankur Worldwide",
  url: "https://ankurworldwide.com",
  legalForm: "Partnership firm",
  signatory: "Mufaddal Akil Kapadiya",
  region: "Gujarat, India",
  address: "First Floor, 101, Raj Apartment, City Survey No 2250, Bagasara, Rajkot, Amreli, Gujarat 365440, India",
  email: "ankurworldwide89@gmail.com",
  phone: "+917861053153",
  phoneDisplay: "+91 78610 53153",
  hours: "Open 24 hours, every day, for orders and inquiries",
  registrations: [
    {
      label: "Importer Exporter Code (IEC)",
      number: "ACPFA4509F",
      verifyUrl: "https://www.dgft.gov.in",
      how: "On the DGFT website choose Services, then View Any IEC. Enter the IEC and the firm name ANKUR WORLDWIDE.",
    },
    // Add when supplied:
    // { label: "GSTIN", number: "...", verifyUrl: "https://services.gst.gov.in/services/searchtp" },
  ],
  legalReviewed: false,
});
