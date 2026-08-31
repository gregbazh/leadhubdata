import type { Metadata } from "next";
import Link from "next/link";
import ContentShell from "@/components/content-shell";
import { createMetadata, SUPPORT_EMAIL } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Use and Data License",
  description:
    "Review LeadHubData's website terms, dataset license, acceptable use, billing, subscription, accuracy, outreach, and limitation provisions.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ContentShell
      eyebrow="Terms"
      title="Terms of Use and Data License"
      intro="These terms govern use of the LeadHubData website, samples, downloadable datasets, accounts, one-time purchases, and subscriptions."
      updatedAt="August 30, 2026"
    >
      <h2>Agreement and business use</h2>
      <p>
        By accessing or purchasing through LeadHubData, you agree to these terms and the posted policies incorporated by reference. You must be legally able to enter this agreement and use the service for lawful business purposes. If you use the service for an organization, you represent that you have authority to act for it.
      </p>

      <h2>Product descriptions and delivery</h2>
      <p>
        Product pages describe the source, cohort, approximate or measured record count, included fields, price, delivery method, and material limitations. Counts and contact coverage can change when public sources update, records are corrected, or matching improves. Your purchase covers the product described at checkout and any update access expressly stated on that page.
      </p>

      <h2>Limited data license</h2>
      <p>
        Unless a separate written agreement says otherwise, a paid dataset is licensed to the purchasing person or organization for its own internal business research, analysis, and lawful outreach. The license is non-exclusive, non-transferable, and does not transfer ownership of LeadHubData&apos;s compilation, organization, enrichment, or delivery work.
      </p>
      <p>You may not:</p>
      <ul>
        <li>Resell, sublicense, publicly post, republish, or distribute the dataset or a substantial portion of it.</li>
        <li>Share the file outside the purchasing organization except with a service provider acting for that organization under appropriate confidentiality and use restrictions.</li>
        <li>Use the data for unlawful discrimination, harassment, impersonation, fraud, surveillance, or harm.</li>
        <li>Misrepresent LeadHubData information as a government determination, endorsement, or statement of private purchase intent.</li>
        <li>Attempt to bypass checkout, account, download, security, or access controls.</li>
      </ul>

      <h2>Responsible outreach</h2>
      <p>
        Public availability does not constitute consent to receive every form of outreach. You are responsible for your message, channel, timing, calling technology, sender identity, suppression lists, opt-outs, and compliance with laws and industry rules that apply to your audience and location. This can include email, telephone, privacy, licensing, and do-not-contact requirements.
      </p>

      <h2>Accounts and security</h2>
      <p>
        Keep account and download access secure and provide accurate information. You are responsible for activity using your access unless you promptly report unauthorized use. We may restrict access when reasonably necessary to investigate abuse, protect the service, comply with law, or enforce these terms.
      </p>

      <h2>Payments, subscriptions, and cancellation</h2>
      <p>
        Prices and billing intervals are shown before checkout. One-time products are charged once. Subscriptions renew at the disclosed interval until canceled. You may cancel future subscription renewals through an available billing-management method or by contacting <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Cancellation does not ordinarily reverse a charge already completed or extend access beyond the paid period.
      </p>
      <p>
        Refund handling is described in the <Link href="/refund-policy">Refund Policy</Link>. Taxes may be added where required. Payment processing is provided by a third party and may be subject to its terms.
      </p>

      <h2>No guaranteed results</h2>
      <p>
        LeadHubData does not guarantee replies, appointments, sales, revenue, regulatory outcomes, or that every contact value remains current. Government and public business sources can contain errors or change after extraction. Verify information before relying on it for high-value, regulated, or time-sensitive decisions.
      </p>

      <h2>Service availability and changes</h2>
      <p>
        We may maintain, modify, suspend, or discontinue features or products. We will use reasonable efforts to preserve access owed for completed purchases, but uninterrupted or error-free operation is not guaranteed.
      </p>

      <h2>Disclaimer and limitation</h2>
      <p>
        To the extent permitted by law, the service and datasets are provided on an “as available” basis without warranties not expressly stated in writing. LeadHubData is not liable for indirect, incidental, special, consequential, exemplary, or lost-profit damages arising from use of the service. To the extent permitted by law, aggregate liability for a claim will not exceed the amount paid for the product or service giving rise to that claim during the twelve months before the event.
      </p>

      <h2>Changes and contact</h2>
      <p>
        We may update these terms as the service changes. The posted date identifies the current version. Material changes apply prospectively unless applicable law requires otherwise. Questions can be sent to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </ContentShell>
  );
}
