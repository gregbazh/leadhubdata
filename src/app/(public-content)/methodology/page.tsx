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
      updatedAt="August 30, 2026"
    >
      <h2>Florida contractor renewal dataset</h2>
      <p>
        The license backbone comes from the Florida Department of Business and Professional Regulation&apos;s <a href="https://www2.myfloridalicense.com/construction-industry/public-records/" target="_blank" rel="noreferrer">Construction Industry public-record files</a>. LeadHubData filters the source to the documented product cohort, preserves the license number and state-supplied business and location fields, and calculates convenience fields such as days until expiration from the source date.
      </p>
      <p>
        The contractor extract used here does not provide phone and email coverage for the full population. Website, phone, and email values are researched separately from public business sources and matched back to the licensed business. Those values are enrichment—not DBPR-supplied fields—and blanks remain when a sufficiently confident match is not available.
      </p>

      <h2>Florida food-business dataset</h2>
      <p>
        The food-business product begins with Florida DBPR&apos;s <a href="https://www2.myfloridalicense.com/hotels-restaurants/public-records/" target="_blank" rel="noreferrer">Restaurant and Food Service public records</a>, specifically plan-review data. The state layout includes business, facility, contact, application, facility-type, and status fields.
      </p>
      <p>
        A plan-review record is treated as evidence of a filing, not proof that the business is open. Email values are filing contacts and can belong to an owner, operator, consultant, attorney, landlord, or another representative. Repeated inboxes can occur when one contact appears on multiple applications.
      </p>

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
        Product pages state the relevant cohort or date range. Source files can change after extraction, and a government agency may correct or remove records. LeadHubData may retain an archived record for a purchased dataset, but the source date should remain visible so historical information is not mistaken for a current agency determination.
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
