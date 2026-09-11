import type { Metadata } from "next";
import Link from "next/link";
import ContentShell from "@/components/content-shell";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "LeadHubData Source and Verification Methodology",
  description:
    "See LeadHubData's Florida public-record sources, filtering logic, contact-research process, quality checks, update practices, and known data limitations.",
  path: "/methodology",
});

export default function MethodologyPage() {
  return (
    <ContentShell
      eyebrow="Data methodology"
      title="Where each field comes from—and where it does not."
      intro="This page documents the current source, transformation, contact-research, and quality-control approach behind LeadHubData's public products."
      updatedAt="September 10, 2026"
    >
      <h2>Florida active-contractor dataset</h2>
      <p>
        The license backbone comes from the Florida Department of Business and Professional Regulation&apos;s <a href="https://www2.myfloridalicense.com/construction-industry/public-records/" target="_blank" rel="noreferrer">Construction Industry public-record files</a>. LeadHubData includes certified licenses marked Current and Active, with a Florida address and an unexpired license date at refresh. It preserves the license number and state-supplied business and location fields, and calculates convenience fields such as days until expiration from the source date.
      </p>
      <p>
        The contractor extract does not supply phone and email coverage for the full population. We research business websites and match published phone numbers, emails and contact forms to the licensed business. Customer lists include only records with at least one of those contact methods. The complete license source is retained internally for further research, but records without a contact method are excluded from advertised counts, samples and downloads.
      </p>
      <p>Research checks the business name and Florida location before retaining a website contact. Contacts can be shared across licenses only when the business name, street address and ZIP match. Source links and contact-check dates are included where recorded; these are separate from the license-source date and are not mailbox-delivery verification.</p>

      <h2>Florida food-business dataset</h2>
      <p>
        The food-business product begins with Florida DBPR&apos;s <a href="https://www2.myfloridalicense.com/hotels-restaurants/public-records/" target="_blank" rel="noreferrer">Restaurant and Food Service public records</a>, specifically plan-review data. The state layout includes business, facility, contact, application, facility-type, and status fields.
      </p>
      <p>
        A plan-review record is treated as evidence of a filing, not proof that the business is open. Email values are filing contacts and can belong to an owner, operator, consultant, attorney, landlord, or another representative. Repeated inboxes can occur when one contact appears on multiple applications.
      </p>

      <h2>Food-truck prospects</h2>
      <p>The food-truck list contains filings classified as Mobile MFDV. It is a subset of the full food-business archive, not additional inventory. Vehicle configuration and insurance needs are not established by the filing.</p>
      <h2>Normalization and quality controls</h2>
      <ul>
        <li>Preserve stable identifiers and source values needed for verification.</li>
        <li>Normalize whitespace and CSV-safe output without silently inventing missing values.</li>
        <li>Keep date fields in documented, parseable columns.</li>
        <li>Report contact coverage separately from total source-record count.</li>
        <li>Review duplicates at record, business, location, phone, and email levels.</li>
        <li>Test delivered headers, row counts, download behavior, and a source sample before release.</li>
      </ul>

      <h2>Freshness and historical records</h2>
      <p>
        Sources are checked weekly and product-page counts come from the fulfilled database. Food records are matched by normalized business name, address, ZIP and application date; changing a contact email does not create a new record. Current source values update matching filings, while missing filings remain in the archive. Denied filings are excluded from the prospect products. The CSV shows when each food record was last matched to the current state source; blank values indicate older archived records not matched since this tracking began. Product pages state the latest successful source check. Source files can change after extraction, and a government agency may correct or remove records. LeadHubData may retain an archived record for a purchased dataset, but the source date should remain visible so historical information is not mistaken for a current agency determination.
      </p>

      <h2>Known limitations</h2>
      <ul>
        <li>Government records can contain errors, delays, or later corrections.</li>
        <li>Contact details can change or be associated with a representative rather than an owner.</li>
        <li>A public event does not establish consent, purchase intent, or a guaranteed business need.</li>
        <li>Counts can change when the source refreshes or the matching process improves.</li>
        <li>High-value decisions should be verified against the current first-party source.</li>
      </ul>

      <h2>Corrections and responsible use</h2>
      <p>
        LeadHubData provides a <Link href="/contact">correction and privacy-request channel</Link>. Buyers are responsible for applying relevant email, telephone, privacy, licensing, suppression, and do-not-contact requirements. Public availability alone is not permission to contact a person through every channel.
      </p>
    </ContentShell>
  );
}
