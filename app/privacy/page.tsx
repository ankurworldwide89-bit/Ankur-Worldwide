import type { Metadata } from "next";
import { Legal } from "@/components/Legal";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What personal data Ankur Worldwide collects through this website, why, and your rights.",
  alternates: { canonical: "/privacy" },
};

// DRAFT for the owner's lawyer. Written for India's DPDP Act 2023 and EU/UK GDPR.
export default function Privacy() {
  const mail = <a href={`mailto:${company.email}`}>{company.email}</a>;
  return (
    <Legal title="Privacy Policy" updated="11 November 2026">
      <h2>Who we are</h2>
      <p>
        {company.name} is a {company.legalForm.toLowerCase()} based in {company.region}, owned by{" "}
        {company.proprietor}. We decide how the personal data described here is used. Contact: {mail}.
      </p>

      <h2>What we collect</h2>
      <p>We collect personal data only when you send us an inquiry:</p>
      <ul>
        <li>your name, company, email address and country;</li>
        <li>your phone number, if you choose to give it;</li>
        <li>the product, quantity and message you write;</li>
        <li>whether you asked for company documents.</li>
      </ul>
      <p>
        To stop spam and abuse we also process your IP address when you submit the form. We store it only in
        a scrambled (hashed) form that we cannot turn back into the address.
      </p>
      <p>This website has no accounts, sets no cookies and does not track you across other websites.</p>

      <h2>Why we use it</h2>
      <p>
        We use your inquiry to reply to you, prepare a quotation and, if you order, to supply you. We do this
        with your consent, given when you submit the form, and to take steps you asked for before a contract.
        We do not sell your data and do not use it for advertising.
      </p>

      <h2>Who processes it for us</h2>
      <ul>
        <li>Vercel: website hosting and cookieless visit statistics.</li>
        <li>Cloudflare: network security and the anti-spam check on the form (Turnstile).</li>
        <li>Supabase: storage of inquiries.</li>
        <li>Resend: delivery of the inquiry to our mailbox.</li>
      </ul>
      <p>
        These providers may process data outside your country, including outside India, the EU and the UK. We
        use them only under their standard data-protection terms.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep inquiries for 24 months after our last contact with you, then delete them. Records of actual
        orders are kept for as long as Indian tax and trade law requires.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us for a copy of your data, to correct it, or to delete it, and you can withdraw your
        consent at any time. Write to {mail} and we will answer within 30 days. If you are in India you may
        also name another person to exercise these rights for you, and you may complain to the Data Protection
        Board of India. If you are in the EU or UK you may complain to your local data protection authority.
      </p>

      <h2>Children</h2>
      <p>This website is for businesses. We do not knowingly collect data from anyone under 18.</p>

      <h2>Changes</h2>
      <p>If this policy changes, we will publish the new version here with a new date.</p>
    </Legal>
  );
}
