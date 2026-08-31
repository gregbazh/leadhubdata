import type { Metadata } from "next";
import ContentShell from "@/components/content-shell";
import { createMetadata, SUPPORT_EMAIL } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact LeadHubData",
  description:
    "Contact LeadHubData for purchase support, download access, billing questions, source corrections, privacy requests, or product details.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <ContentShell
      eyebrow="Contact"
      title="Reach the right inbox."
      intro="Use the support address for purchases, downloads, billing, data corrections, privacy requests, and pre-purchase questions."
    >
      <h2>Email support</h2>
      <p>
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
      </p>
      <p>
        Include the checkout email and product name for purchase or download questions. Do not send full payment-card numbers, passwords, or other sensitive credentials.
      </p>

      <h2>Data correction or removal request</h2>
      <p>
        Identify the record, the field you believe is incorrect, the source URL or evidence supporting the correction, and a safe way to follow up. LeadHubData may need to verify identity or authority before changing information tied to a person or business.
      </p>

      <h2>Privacy request</h2>
      <p>
        Use the subject line “Privacy Request” and describe whether you are requesting access, correction, deletion, or another applicable privacy right. We may ask for information reasonably necessary to verify the request.
      </p>

      <h2>Government-record questions</h2>
      <p>
        LeadHubData can explain how its files were prepared but cannot change an agency&apos;s official record. If the underlying Florida record is incorrect, contact the responsible agency as well.
      </p>
    </ContentShell>
  );
}
