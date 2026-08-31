import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { SUBSCRIPTION } from "@/lib/products";
import { absoluteUrl, createMetadata, SITE_URL } from "@/lib/seo";

const title = "Weekly Florida Business Leads Subscription";
const description = `Get every current LeadHubData CSV plus weekly Florida food-business updates for $${SUBSCRIPTION.price} per month. Review inclusions and cancel future renewals at any time.`;

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: "/subscribe",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id": `${absoluteUrl("/subscribe")}#product`,
      name: SUBSCRIPTION.name,
      description,
      sku: SUBSCRIPTION.id,
      url: absoluteUrl("/subscribe"),
      category: "Business data subscription",
      brand: { "@id": `${SITE_URL}/#organization` },
      offers: {
        "@type": "Offer",
        url: absoluteUrl("/subscribe"),
        price: SUBSCRIPTION.price.toFixed(2),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        seller: { "@id": `${SITE_URL}/#organization` },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: SUBSCRIPTION.price.toFixed(2),
          priceCurrency: "USD",
          unitText: "MONTH",
        },
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: title,
          item: absoluteUrl("/subscribe"),
        },
      ],
    },
  ],
};

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
