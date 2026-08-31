import type { Metadata } from "next";
import ContentShell from "@/components/content-shell";
import { createMetadata, SUPPORT_EMAIL } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "Read how LeadHubData handles customer, account, analytics, transaction, support, sample-request, and public-record information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ContentShell
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="This policy explains the information LeadHubData handles when someone visits the site, requests a sample, creates an account, makes a purchase, subscribes, or contacts support."
      updatedAt="August 30, 2026"
    >
      <h2>Information we collect</h2>
      <h3>Information you provide</h3>
      <p>
        We may receive your email address, account authentication information, product and territory selections, support messages, privacy requests, and other information you choose to provide. Checkout information is sent to our payment provider. LeadHubData does not receive or store your complete payment-card number.
      </p>

      <h3>Transaction and account information</h3>
      <p>
        We maintain records needed to confirm purchases, provide download access, deliver subscription files, prevent duplicate fulfillment, support billing questions, and maintain required financial or operational records.
      </p>

      <h3>Device, referral, and analytics information</h3>
      <p>
        The site may collect IP address, browser and device information, pages viewed, referring URL, campaign parameters, approximate location, and interaction events through hosting logs and analytics tools. ChatGPT and other referring services may add campaign parameters to outbound links; these can appear in our analytics and checkout attribution records.
      </p>

      <h3>Public-record and business information</h3>
      <p>
        LeadHubData products are built from public government records and, for some fields, public business contact sources. These records may include business names, license or application identifiers, mailing or facility addresses, dates, statuses, phone numbers, email addresses, and related business information. Product methodology and source links are described on the relevant product and methodology pages.
      </p>

      <h2>How we use information</h2>
      <ul>
        <li>Provide samples, purchases, subscriptions, accounts, downloads, and support.</li>
        <li>Process payments and maintain transaction records.</li>
        <li>Secure the service, detect abuse, and troubleshoot failures.</li>
        <li>Understand acquisition sources and improve pages, products, and customer experience.</li>
        <li>Send transactional messages and, where permitted, service or marketing communications.</li>
        <li>Review corrections, removals, opt-outs, and legal or privacy requests.</li>
        <li>Comply with applicable law and enforce our terms.</li>
      </ul>

      <h2>Service providers and disclosures</h2>
      <p>
        We use service providers for hosting, database infrastructure, analytics, authentication, email delivery, payments, and related operations. They may process information on our behalf under their own terms and privacy commitments. We may also disclose information when reasonably necessary to comply with law, protect rights or security, investigate misuse, complete a business transaction, or act with your direction.
      </p>

      <h2>Cookies and similar technologies</h2>
      <p>
        Hosting, analytics, authentication, checkout attribution, and account features may use cookies, browser storage, URL parameters, or similar technologies. Browser controls can limit some of these technologies, but doing so may affect sign-in, attribution, or other functionality.
      </p>

      <h2>Retention and security</h2>
      <p>
        We retain information for as long as reasonably needed for the purposes above, including fulfillment, account access, fraud prevention, dispute handling, legal obligations, and source-history documentation. No security method is perfect; we use reasonable technical and organizational measures but cannot guarantee absolute security.
      </p>

      <h2>Your choices and requests</h2>
      <p>
        Depending on where you live and which laws apply, you may have rights to request access, correction, deletion, restriction, objection, or information about certain disclosures. You may also unsubscribe from non-transactional email using the provided method and may request that a business contact record be reviewed. Some information may be retained when required for transactions, security, legal obligations, or other permitted purposes.
      </p>
      <p>
        Send privacy requests to <a href={`mailto:${SUPPORT_EMAIL}?subject=Privacy%20Request`}>{SUPPORT_EMAIL}</a> with the subject “Privacy Request.” We may take reasonable steps to verify identity or authority before fulfilling a request.
      </p>

      <h2>Children</h2>
      <p>
        The service is intended for business users and is not directed to children. Do not use the service to provide personal information about a child.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy as the service, providers, or legal requirements change. The date above identifies the current posted version.
      </p>
    </ContentShell>
  );
}
