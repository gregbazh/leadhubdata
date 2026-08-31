import type { Metadata } from "next";
import Link from "next/link";
import ContentShell from "@/components/content-shell";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About LeadHubData",
  description:
    "Learn how LeadHubData turns documented Florida public records into practical business datasets with visible sources, fields, dates, and limitations.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <ContentShell
      eyebrow="About"
      title="Public records made practical—and explainable."
      intro="LeadHubData packages documented Florida business and licensing records into usable CSV files without hiding where the data came from or what it cannot prove."
    >
      <h2>What we do</h2>
      <p>
        State agencies publish valuable records, but the files can be difficult to locate, interpret, filter, and use. LeadHubData organizes selected records around a specific business event, preserves useful identifiers, and documents the delivered fields and limitations.
      </p>
      <p>
        Current products focus on Florida contractor-license renewal records and food-service plan-review filings. Each product page identifies the record count, price, source, delivered columns, contact coverage, and material caveats before checkout.
      </p>

      <h2>Our standard for a useful list</h2>
      <ul>
        <li>The original government source should be named and linked.</li>
        <li>The inclusion rule and relevant date range should be understandable.</li>
        <li>Government fields and separately researched contact fields should not be blended together.</li>
        <li>Blank fields, repeats, and contact limitations should be disclosed.</li>
        <li>A buyer should be able to inspect a sample before committing.</li>
      </ul>

      <h2>What we do not claim</h2>
      <p>
        A public filing does not prove purchase intent, consent to contact, an insurance need, or a future sale. Contact data can change, government records can be corrected, and a business can change status after a file is produced. Buyers should verify important records and follow the rules that apply to their outreach.
      </p>

      <h2>Independent from the source agencies</h2>
      <p>
        LeadHubData is an independent business. It is not affiliated with, sponsored by, or endorsed by the State of Florida, the Florida Department of Business and Professional Regulation, or any other government agency referenced on this site.
      </p>

      <h2>Go deeper</h2>
      <p>
        Read the <Link href="/methodology">data methodology</Link> for the source-by-source workflow, or visit the <Link href="/resources">resource library</Link> for field guides and buyer checklists.
      </p>
    </ContentShell>
  );
}
