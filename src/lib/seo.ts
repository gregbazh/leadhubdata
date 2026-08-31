import type { Metadata } from "next";
import type { OneTimeProduct } from "@/lib/products";

export const SITE_NAME = "LeadHubData";
export const SITE_URL = "https://www.leadhubdata.com";
export const SUPPORT_EMAIL = "support@mail.leadhubdata.com";
export const SEO_UPDATED_AT = "2026-08-30";

export type FaqItem = {
  q: string;
  a: string;
};

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function createMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: "LeadHubData public-record business lead lists",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/twitter-image")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function contractorFaqs(product: OneTimeProduct): FaqItem[] {
  const reachable = product.reachableCount ?? product.verifiedContactCount;
  const phone = product.phoneCount ?? 0;
  const email = product.emailCount ?? 0;

  return [
    {
      q: "Where does the contractor data come from?",
      a: "The license records come directly from Florida DBPR public files. The list identifies current contractor licenses carrying an August 31, 2026 expiration date.",
    },
    {
      q: "How do I get the file?",
      a: "The CSV is available immediately after checkout, and the same download link is sent to the checkout email address for later access.",
    },
    {
      q: "Is this a subscription?",
      a: "No. This product is a one-time CSV purchase with no recurring charge.",
    },
    {
      q: "What exactly is included?",
      a: `${reachable.toLocaleString()} Florida contractor records have a researched phone number or email: ${phone.toLocaleString()} with a phone number and ${email.toLocaleString()} with an email. The complete ${product.leadCount.toLocaleString()}-record state license file is included for business-name, address, trade, license, and expiration analysis.`,
    },
    {
      q: "Why does not every record have a phone number?",
      a: `The Florida contractor license extract does not provide contact details. LeadHubData researches public business contact information and matches it to the licensed business, so the contactable subset is ${reachable.toLocaleString()} rather than the full ${product.leadCount.toLocaleString()} records.`,
    },
    {
      q: "Does the list get updated?",
      a: "LeadHubData may publish corrected or enriched versions. Existing purchasers can use their original download link to retrieve an available update at no additional charge.",
    },
  ];
}

export function restaurantFaqs(product: OneTimeProduct): FaqItem[] {
  return [
    {
      q: "Where does the food-business data come from?",
      a: "The records come from Florida DBPR public food-service plan-review files. The contact details and application fields are taken from those public filings.",
    },
    {
      q: "Are all of these businesses already open?",
      a: "Not necessarily. A plan-review record is an early licensing signal, not proof that a business has opened. The CSV includes plan-review status and application date so buyers can filter records appropriately.",
    },
    {
      q: "What kinds of food businesses are included?",
      a: "The file includes seating and non-seating restaurants, mobile food vehicles, caterers, hot-dog carts, and other public food-service facility types reported in the state file.",
    },
    {
      q: "Does every row contain an email?",
      a: `Every one of the ${product.leadCount.toLocaleString()} delivered rows contains an email value from the public filing. Some addresses repeat when one operator or representative is connected to multiple applications.`,
    },
    {
      q: "Is this a subscription?",
      a: "No. This product is a one-time CSV purchase with no recurring charge.",
    },
  ];
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/favicon.ico"),
      },
      email: SUPPORT_EMAIL,
      description:
        "LeadHubData turns public Florida business and licensing records into documented, downloadable CSV datasets.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SUPPORT_EMAIL,
        availableLanguage: "English",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
    },
  ],
};

export function productJsonLd({
  product,
  path,
  title,
  description,
  faqs,
  sourceUrls,
  keywords,
}: {
  product: OneTimeProduct;
  path: string;
  title: string;
  description: string;
  faqs: FaqItem[];
  sourceUrls: string[];
  keywords: string[];
}) {
  const url = absoluteUrl(path);
  const productId = `${url}#product`;
  const datasetId = `${url}#dataset`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: title,
            item: url,
          },
        ],
      },
      {
        "@type": "Product",
        "@id": productId,
        name: product.name,
        description,
        sku: product.id,
        url,
        image: absoluteUrl("/opengraph-image"),
        category: "Business data CSV",
        additionalType: "https://schema.org/Dataset",
        brand: { "@id": `${SITE_URL}/#organization` },
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "USD",
          price: product.price.toFixed(2),
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${SITE_URL}/#organization` },
        },
        isRelatedTo: { "@id": datasetId },
      },
      {
        "@type": "Dataset",
        "@id": datasetId,
        name: title,
        description,
        url,
        license: absoluteUrl("/terms"),
        creator: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        dateModified: SEO_UPDATED_AT,
        temporalCoverage: "2025/2026",
        spatialCoverage: {
          "@type": "Place",
          name: "Florida, United States",
        },
        keywords,
        isBasedOn: sourceUrls,
        distribution: {
          "@type": "DataDownload",
          encodingFormat: "text/csv",
          contentSize: `${product.leadCount.toLocaleString()} records`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };
}

export function articleJsonLd({
  title,
  description,
  path,
  publishedAt,
  updatedAt,
  sources,
}: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt: string;
  sources: string[];
}) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: title,
        description,
        url,
        mainEntityOfPage: url,
        datePublished: publishedAt,
        dateModified: updatedAt,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        citation: sources,
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Resources",
            item: absoluteUrl("/resources"),
          },
          { "@type": "ListItem", position: 3, name: title, item: url },
        ],
      },
    ],
  };
}
