import type { Metadata } from "next";
import { Legal } from "@/components/Legal";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using the Ankur Worldwide website.",
  alternates: { canonical: "/terms" },
};

// DRAFT for the owner's lawyer. Governing-law and jurisdiction wording in particular needs their decision.
export default function Terms() {
  return (
    <Legal title="Terms of Use" updated="11 November 2026">
      <h2>This website</h2>
      <p>
        This website is published by {company.name}, a {company.legalForm.toLowerCase()} based in{" "}
        {company.region}. By using it you accept these terms.
      </p>

      <h2>Information, not an offer</h2>
      <p>
        Product information here is a general description. It is not an offer to sell. Specifications, prices,
        quantities and delivery terms are binding only when we confirm them to you in writing in a quotation
        or contract.
      </p>

      <h2>Inquiries</h2>
      <p>
        Sending an inquiry does not create a contract. Please give accurate information and do not use the form
        to send unlawful, abusive or automated content.
      </p>

      <h2>Ownership</h2>
      <p>
        The {company.name} name, wordmark, text and design of this website belong to {company.name}. You may
        not copy them for commercial use without written permission.
      </p>

      <h2>Liability</h2>
      <p>
        We take care to keep this website accurate, but we provide it as it is and do not promise that it is
        free of errors or always available. To the extent the law allows, we are not liable for loss arising
        from use of the website. Nothing here limits liability that cannot be limited by law.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. The courts of Gujarat, India have jurisdiction.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${company.email}`}>{company.email}</a>.
      </p>
    </Legal>
  );
}
