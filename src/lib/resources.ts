export type ResourceSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ResourceArticle = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  eyebrow: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  relatedProduct?: "/fl-contractors" | "/fl-restaurants";
  relatedProductLabel?: string;
  sections: ResourceSection[];
  sources: { label: string; url: string }[];
};

export const resources: ResourceArticle[] = [
  {
    slug: "florida-contractor-license-data",
    title: "What Florida Contractor License Data Actually Contains",
    seoTitle: "Florida Contractor License Data Explained",
    description:
      "A field-by-field explanation of Florida DBPR contractor license data, its renewal dates, missing contact fields, and practical limits for business research.",
    excerpt:
      "The state file is authoritative for licenses and dates, but it is not a ready-made contact database. Here is what the fields do—and do not—tell you.",
    eyebrow: "Contractor data guide",
    publishedAt: "2026-08-30",
    updatedAt: "2026-08-30",
    readingMinutes: 7,
    relatedProduct: "/fl-contractors",
    relatedProductLabel: "Review the Florida contractor CSV",
    sections: [
      {
        heading: "Start with the source, not the spreadsheet vendor",
        paragraphs: [
          "Florida contractor licensing records are published by the Department of Business and Professional Regulation, commonly called DBPR. The Construction Industry Licensing Board portion of the site publishes downloadable records and documentation describing the fields. That first-party source should be the reference point for license status, license number, classification, business name, location, original license date, and expiration date.",
          "A repackaged CSV can save filtering and cleanup time, but it should not replace the source. A credible vendor should identify the exact government source, explain its filters, date the output, and separate source fields from anything researched elsewhere.",
        ],
      },
      {
        heading: "The most useful contractor-license fields",
        paragraphs: [
          "License number is the stable key for checking an individual record. Trade or license class shows the work category. Licensee and doing-business-as fields identify the person or company connected to the credential. City, ZIP, and county support territory filtering. Original licensure and expiration dates support tenure and timing analysis.",
          "Status deserves special attention. A file can contain records that are current, inactive, delinquent, or otherwise not suitable for the same campaign. Never infer current eligibility from a business name alone; preserve the license number and verify high-value records against DBPR when status matters.",
        ],
        bullets: [
          "Use license number as the verification key.",
          "Keep the original state value before normalizing labels.",
          "Treat expiration as a date field, not proof of a specific buying need.",
          "Filter by status before calculating an addressable market.",
        ],
      },
      {
        heading: "Why phone and email coverage is incomplete",
        paragraphs: [
          "The contractor source does not supply a phone or email on every row. Business contacts require separate research. LeadHubData's customer list includes only records with a researched phone number, email or business contact form; records without a contact method remain outside the offered list.",
          "A website, phone or mailbox can change ownership. Published contacts are labeled as researched data, with source links and check dates where recorded. Buyers should distinguish those checks from mailbox verification and review duplicate businesses or licenses before outreach.",
        ],
      },
      {
        heading: "How the renewal cycle should be interpreted",
        paragraphs: [
          "Florida's official contractor guidance says certified contractor licenses expire on August 31 in even-numbered years. The state lists continuing education and payment of the renewal fee among renewal requirements. Registered contractors follow a different odd-year cycle.",
          "A renewal date is a legitimate timing signal, but it is not evidence that every contractor needs the same product. Insurance, bonding, staffing, software, and financing situations vary. Responsible outreach uses the date to make a message timely, then asks a relevant question instead of asserting a need that has not been verified.",
        ],
      },
      {
        heading: "A practical quality check before use",
        paragraphs: [
          "Open a sample and verify that dates parse correctly, ZIP codes retain leading zeroes, rows have a license identifier, and the documented count matches the delivered file. Check a small random sample against DBPR and confirm that each record has a phone number, email or business contact form.",
          "Those checks will not make a file perfect. They do reveal whether the vendor has preserved provenance and whether the list is suitable for the decision you are making.",
        ],
      },
    ],
    sources: [
      {
        label: "Florida DBPR — Construction Industry",
        url: "https://www2.myfloridalicense.com/construction-industry/",
      },
      {
        label: "Florida DBPR — Construction public records",
        url: "https://www2.myfloridalicense.com/construction-industry/public-records/",
      },
      {
        label: "Florida DBPR — Construction FAQs",
        url: "https://www2.myfloridalicense.com/construction-industry/faqs/",
      },
    ],
  },
  {
    slug: "florida-contractor-renewal-leads",
    title: "How to Use Florida Contractor Renewal Leads Without Overstating Intent",
    seoTitle: "Florida Contractor Renewal Leads Guide",
    description:
      "A responsible workflow for segmenting Florida contractor renewal records, verifying businesses, and writing relevant outreach without assuming purchase intent.",
    excerpt:
      "Renewal dates make outreach timely. They do not prove that every contractor needs the same policy, bond, loan, or service.",
    eyebrow: "Outreach field guide",
    publishedAt: "2026-08-30",
    updatedAt: "2026-08-30",
    readingMinutes: 6,
    relatedProduct: "/fl-contractors",
    relatedProductLabel: "See the 2026 contractor renewal list",
    sections: [
      {
        heading: "A deadline is context, not consent",
        paragraphs: [
          "A license renewal date can answer two useful questions: which businesses belong to a defined cohort, and when that cohort is likely to review its administrative requirements. It cannot tell you whether a business wants a call, whether its insurance is changing, or whether it is currently shopping for a vendor.",
          "That difference is the foundation of a durable campaign. Use public-record data to make the message more relevant, then follow applicable calling, email, privacy, and opt-out requirements. Public availability does not erase those obligations.",
        ],
      },
      {
        heading: "Segment before contacting anyone",
        paragraphs: [
          "A statewide file should rarely become one statewide message. Separate contractors by trade, geography, license class, business tenure, and available contact channel. A roofing contractor and a pool contractor may share a date but not a useful opening line. A local agency may also want to exclude territories it cannot service.",
        ],
        bullets: [
          "Filter to the license types your offer genuinely serves.",
          "Separate phone, email, website-only, and postal-address records.",
          "Remove existing customers, prior opt-outs, and internal blocklists.",
          "Verify high-value businesses against the current state record.",
          "Keep the source date with every exported campaign segment.",
        ],
      },
      {
        heading: "Write the message around a verifiable fact",
        paragraphs: [
          "A strong opening references the public renewal cycle without pretending to know the recipient's private situation. For example, an agency might say it is reaching out because Florida certified contractor licenses renew on the even-year August 31 cycle, then ask whether the business wants a second opinion on coverage or bonding. The recipient can quickly understand why the message arrived and decide whether it is relevant.",
          "Avoid claims such as 'you must replace your policy' or 'your bond is expiring' unless you have actually verified those facts. The state license date does not establish either one.",
        ],
      },
      {
        heading: "Measure the list and the offer separately",
        paragraphs: [
          "Delivery rate and connected-call rate indicate contact-data quality. Reply rate and appointment rate reflect the combined effect of targeting, timing, copy, sender reputation, and offer. Closed business depends on qualification and sales execution as well. A clean list can still produce a weak campaign, and a promising campaign can be harmed by poor contact data.",
          "Keep those layers separate in reporting. It makes vendor evaluation fairer and shows where the next improvement should happen.",
        ],
      },
      {
        heading: "Stop using the urgency when it is no longer current",
        paragraphs: [
          "Date-based content has an expiration date of its own. Once the 2026 renewal deadline passes, update campaign language and landing pages so they describe a historical cohort or the next valid cycle. Leaving a countdown at zero damages trust and can confuse both people and search systems.",
        ],
      },
    ],
    sources: [
      {
        label: "Florida DBPR — Certified contractor renewal information",
        url: "https://www2.myfloridalicense.com/construction-industry/",
      },
      {
        label: "FTC — CAN-SPAM Act compliance guide",
        url: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business",
      },
      {
        label: "FCC — Telephone Consumer Protection Act resources",
        url: "https://www.fcc.gov/general/telemarketing-and-robocalls",
      },
    ],
  },
  {
    slug: "new-florida-restaurant-leads",
    title: "What a Florida Restaurant Plan-Review Record Tells You",
    seoTitle: "New Florida Restaurant Leads Explained",
    description:
      "Learn what Florida food-service plan-review records mean, which fields are public, why emails repeat, and how to use the data as an early business signal.",
    excerpt:
      "A plan-review filing can identify a new or changing food business before many directories do, but it is not the same thing as a confirmed opening.",
    eyebrow: "Food-business data guide",
    publishedAt: "2026-08-30",
    updatedAt: "2026-08-30",
    readingMinutes: 7,
    relatedProduct: "/fl-restaurants",
    relatedProductLabel: "Review the Florida food-business CSV",
    sections: [
      {
        heading: "Why plan review is an early signal",
        paragraphs: [
          "Florida DBPR explains that food-service plan review is required when an establishment is newly built, converted from another use, remodeled, or reopened after being closed for at least 18 months. That makes the public file useful for identifying businesses during a period of operational change.",
          "It is still only one step in a larger licensing process. A filing does not guarantee that the establishment opened, that the applicant remains the operator, or that every service decision is still pending. Treat it as a documented event and keep the plan-review status with the record.",
        ],
      },
      {
        heading: "The fields that make the file useful",
        paragraphs: [
          "The public-record layout includes the business name, facility address, city, ZIP code, phone and email when available, plan-review status, application and review dates, application type, facility type, identifiers, and mailing/contact fields. Those columns support several distinct filters instead of one generic 'restaurant lead' label.",
        ],
        bullets: [
          "Application date helps sort the newest filings first.",
          "Facility type separates seating locations, non-seating operations, caterers, and mobile units.",
          "Status prevents an in-process application from being described as an open restaurant.",
          "County and city make local-territory filtering straightforward.",
          "Application identifiers help distinguish multiple filings tied to one operator.",
        ],
      },
      {
        heading: "Why the number of emails differs from the number of people",
        paragraphs: [
          "A delivered file can have an email value on every row and still have fewer unique inboxes than rows. One operator may file for several locations. A consultant, attorney, landlord, or other representative may also appear on more than one application. The email should therefore be described as a filing contact, not automatically as the owner.",
          "Deduplicate according to the campaign. A location-based service may intentionally keep multiple locations. An owner-level offer may prefer one record per unique business or mailbox.",
        ],
      },
      {
        heading: "Match the offer to the stage",
        paragraphs: [
          "New and remodeled food businesses may evaluate insurance, equipment, payments, payroll, marketing, waste services, pest control, technology, and other operating needs. The public filing does not prove that any particular need exists. A useful campaign narrows to one service and asks a stage-appropriate question.",
          "For example, a local vendor can filter by county and facility type, reference the plan-review filing accurately, and ask whether the location is still preparing to open. That is more credible than announcing that the business is open or claiming that it must buy a specific product.",
        ],
      },
      {
        heading: "Keep the file fresh",
        paragraphs: [
          "The value of an early-stage signal falls as the application ages. Preserve the application date, sort newest first, and refresh the source on a documented schedule. When a government source removes older rows, retain the original source date so an archived record is not mistaken for a current state listing.",
        ],
      },
    ],
    sources: [
      {
        label: "Florida DBPR — Restaurant and food-service public records",
        url: "https://www2.myfloridalicense.com/hotels-restaurants/public-records/",
      },
      {
        label: "Florida DBPR — Food-service plan review",
        url: "https://www2.myfloridalicense.com/hotels-restaurants/licensing/plan-review/",
      },
      {
        label: "Florida DBPR — Permanent food-service licensing guide",
        url: "https://www2.myfloridalicense.com/hotels-restaurants/licensing/foodservice-guide/",
      },
    ],
  },
  {
    slug: "public-record-business-leads",
    title: "Public-Record Business Leads vs. Scraped Contact Lists",
    seoTitle: "Public-Record vs. Scraped Business Leads",
    description:
      "Compare public-record business lead lists with web-scraped contact databases across provenance, freshness, intent, coverage, and campaign risk.",
    excerpt:
      "One type begins with a documented government event. The other begins with a discoverable web presence. Neither is automatically better for every job.",
    eyebrow: "Lead-data comparison",
    publishedAt: "2026-08-30",
    updatedAt: "2026-08-30",
    readingMinutes: 6,
    sections: [
      {
        heading: "The real difference is the starting signal",
        paragraphs: [
          "A public-record list starts with a government filing, license, permit, registration, or other documented event. A scraped list starts with information found on websites, directories, social profiles, maps, or data aggregators. Public records tend to provide stronger provenance for the event; scraped data often provides broader contact coverage.",
          "The right choice depends on the question. If you need every licensed contractor in a state, an official license file is the stronger backbone. If you need a phone number for established businesses in one neighborhood, a current directory may provide better coverage.",
        ],
      },
      {
        heading: "Compare provenance before record count",
        paragraphs: [
          "A million-row file is not useful if the buyer cannot tell where its fields came from. Ask for the named source, extraction date, filtering rule, delivered columns, blank-rate disclosure, and whether contact details are first-party, government-provided, or separately researched.",
        ],
        bullets: [
          "Public-record strength: documented source and event date.",
          "Public-record weakness: contact fields may be sparse or absent.",
          "Scraped-data strength: broader phone, website, and email coverage.",
          "Scraped-data weakness: identity matching and freshness can be difficult to audit.",
          "Hybrid strength: official population plus clearly labeled enrichment.",
        ],
      },
      {
        heading: "Do not confuse a signal with purchase intent",
        paragraphs: [
          "A new filing or renewal date can make a business more relevant to a particular offer, but it does not prove that the business requested a quote. A website visit or directory category also does not prove intent. The most defensible description is the observable fact: the business filed, renewed, received a permit, or appeared at a public business location.",
          "That wording is important in product pages, structured data, outreach, and analytics. It reduces the gap between what the dataset establishes and what marketing wishes it established.",
        ],
      },
      {
        heading: "Use channel-specific hygiene",
        paragraphs: [
          "Email validation, suppression lists, role-account handling, telephone do-not-call screening, consent rules, and local calling restrictions are separate from source quality. A public record does not create blanket permission to use every channel. Buyers remain responsible for applying the rules that fit their location, audience, technology, and message.",
        ],
      },
      {
        heading: "The best dataset is the one whose limitations are visible",
        paragraphs: [
          "Look for honest blank counts, duplicate explanations, source links, update dates, a sample, and a correction path. Those details make a smaller file more usable than a larger file sold through unsupported accuracy claims.",
        ],
      },
    ],
    sources: [
      {
        label: "Florida DBPR — Public records portal",
        url: "https://www2.myfloridalicense.com/",
      },
      {
        label: "FTC — CAN-SPAM Act compliance guide",
        url: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business",
      },
      {
        label: "FCC — Telemarketing and robocalls",
        url: "https://www.fcc.gov/general/telemarketing-and-robocalls",
      },
    ],
  },
  {
    slug: "business-lead-list-quality-checklist",
    title: "A 12-Point Checklist for Evaluating a Business Lead List",
    seoTitle: "Business Lead List Quality Checklist",
    description:
      "Use this practical 12-point checklist to evaluate a business lead list's source, freshness, identity matching, contact coverage, duplicates, and legal-use limits.",
    excerpt:
      "Before buying a lead list, ask questions that can be answered from the file and its source—not from a marketing percentage alone.",
    eyebrow: "Buyer checklist",
    publishedAt: "2026-08-30",
    updatedAt: "2026-08-30",
    readingMinutes: 5,
    sections: [
      {
        heading: "1–3: Verify the population",
        paragraphs: [
          "First, name the original source. Second, record when that source was downloaded. Third, write down the exact filter that turned the source population into the product. Those three facts should explain why each row belongs in the file.",
        ],
        bullets: [
          "1. Is the original source named and linked?",
          "2. Is the extraction or update date visible?",
          "3. Is the inclusion rule specific enough to reproduce?",
        ],
      },
      {
        heading: "4–6: Inspect the fields",
        paragraphs: [
          "Ask for a complete column list and a real sample. Then distinguish authoritative source fields from researched additions. Finally, calculate blank rates by field instead of relying on a single blended accuracy claim.",
        ],
        bullets: [
          "4. Does the sample use the same columns as the paid file?",
          "5. Are source fields and enrichment fields labeled separately?",
          "6. Are phone, email, website, and address coverage reported individually?",
        ],
      },
      {
        heading: "7–9: Test identity and freshness",
        paragraphs: [
          "Check a random sample against the named source and against current public business pages. Look for repeated inboxes, shared phone numbers, businesses with similar names, and records whose status changed after extraction. No file will be perfect, but the vendor should be able to explain its matching and correction process.",
        ],
        bullets: [
          "7. Can each high-value row be traced to a stable identifier?",
          "8. Are duplicates defined at the person, business, location, and contact levels?",
          "9. Is there a documented correction or removal channel?",
        ],
      },
      {
        heading: "10–12: Confirm commercial fit",
        paragraphs: [
          "A technically accurate list can still be a poor commercial fit. Compare the population with your actual territory and buyer profile, confirm that the allowed use matches your workflow, and decide which metric will determine whether the purchase worked.",
        ],
        bullets: [
          "10. Does the list match the industries and locations you can serve?",
          "11. Can your intended outreach comply with channel-specific laws and opt-outs?",
          "12. Will you measure contact quality separately from replies, appointments, and sales?",
        ],
      },
      {
        heading: "A simple acceptance test",
        paragraphs: [
          "Before loading the full file into a CRM, validate its row count, headers, encoding, required identifiers, date formats, and a random source sample. Deduplicate for the campaign's goal, apply suppression lists, and start with a small segment. That process catches more practical problems than a polished landing page can.",
        ],
      },
    ],
    sources: [
      {
        label: "FTC — CAN-SPAM Act compliance guide",
        url: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business",
      },
      {
        label: "FCC — Telemarketing and robocalls",
        url: "https://www.fcc.gov/general/telemarketing-and-robocalls",
      },
      {
        label: "Florida DBPR — Public records portal",
        url: "https://www2.myfloridalicense.com/",
      },
    ],
  },
];

export function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}
