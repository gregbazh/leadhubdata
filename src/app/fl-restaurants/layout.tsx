import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { getOneTimeProductById } from "@/lib/products";
import {
  createMetadata,
  productJsonLd,
  restaurantFaqs,
} from "@/lib/seo";

const product = getOneTimeProductById("fl-restaurants")!;
const title = "New Florida Restaurant Leads — Email List CSV";
const description = `${product.leadCount.toLocaleString()} Florida restaurants, food trucks, caterers, and other food businesses from public plan-review filings. Email on every delivered row. One-time $${product.price} CSV.`;
const faqs = restaurantFaqs(product);

// The page itself is a Client Component, so its metadata lives here.
export const metadata: Metadata = createMetadata({
  title,
  description,
  path: "/fl-restaurants",
});

export default function FlRestaurantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={productJsonLd({
          product,
          path: "/fl-restaurants",
          title,
          description,
          faqs,
          sourceUrls: [
            "https://www2.myfloridalicense.com/hotels-restaurants/public-records/",
            "https://www2.myfloridalicense.com/hotels-restaurants/licensing/plan-review/",
          ],
          keywords: [
            "Florida restaurant leads",
            "new restaurant email list",
            "Florida food business list",
            "restaurant plan review data",
          ],
        })}
      />
      {children}
    </>
  );
}
