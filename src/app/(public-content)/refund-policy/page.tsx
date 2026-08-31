import type { Metadata } from "next";
import ContentShell from "@/components/content-shell";
import { createMetadata, SUPPORT_EMAIL } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Refund and Cancellation Policy",
  description:
    "Review LeadHubData's policy for digital CSV purchases, duplicate charges, inaccessible files, product mismatches, subscriptions, and cancellations.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <ContentShell
      eyebrow="Purchases"
      title="Refund and Cancellation Policy"
      intro="LeadHubData sells digital CSV products that can be accessed immediately. This policy explains when we will correct delivery and billing problems and how subscription cancellation works."
      updatedAt="August 30, 2026"
    >
      <h2>Digital one-time purchases</h2>
      <p>
        Because a downloadable dataset cannot be returned in the same way as a physical product, completed digital purchases are generally final after access is provided. This does not limit rights that cannot be waived under applicable law.
      </p>

      <h2>Problems we will review</h2>
      <p>Contact us promptly if:</p>
      <ul>
        <li>You were charged more than once for the same intended purchase.</li>
        <li>The delivered file is corrupt, inaccessible, or materially different from the product identified at checkout.</li>
        <li>A technical failure prevented delivery and support cannot restore access.</li>
        <li>An unauthorized charge appears on your account.</li>
      </ul>
      <p>
        We may first repair the file, restore access, replace the download, or correct the billing error. When that does not resolve a covered problem, we may issue an appropriate full or partial refund.
      </p>

      <h2>Data expectations</h2>
      <p>
        A refund is not ordinarily available because a campaign did not produce replies or sales, because public information changed after extraction, or because disclosed blanks, duplicates, filing contacts, or other stated limitations were present. Review the product page, sample, fields, counts, and methodology before purchase.
      </p>

      <h2>Subscriptions</h2>
      <p>
        Canceling a subscription stops future renewals. It does not ordinarily refund the current paid period or a delivery already provided. Duplicate charges, incorrect billing intervals, or service failures will be reviewed. Access and future delivery after cancellation follow the terms displayed for the subscription and billing period.
      </p>

      <h2>How to request help</h2>
      <p>
        Email <a href={`mailto:${SUPPORT_EMAIL}?subject=Purchase%20Support`}>{SUPPORT_EMAIL}</a> with the checkout email, product name, date, and a concise description of the issue. Do not send full card numbers. We may request information needed to locate and verify the transaction.
      </p>
    </ContentShell>
  );
}
