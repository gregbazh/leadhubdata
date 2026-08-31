import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { getOneTimeProductById } from "@/lib/products";
import {
  contractorFaqs,
  createMetadata,
  productJsonLd,
} from "@/lib/seo";

const product = getOneTimeProductById("fl-contractors")!;
const title = "Florida Contractor List — 2026 Renewal CSV";
const description = `${(product.reachableCount ?? product.verifiedContactCount).toLocaleString()} contactable Florida contractors renewing by August 31, plus the complete ${product.leadCount.toLocaleString()}-record state license file. One-time $${product.price} CSV.`;
const faqs = contractorFaqs(product);

// The page itself is a Client Component, so its metadata lives here.
export const metadata: Metadata = createMetadata({
  title,
  description,
  path: "/fl-contractors",
});

export default function FlContractorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={productJsonLd({
          product,
          path: "/fl-contractors",
          title,
          description,
          faqs,
          sourceUrls: [
            "https://www2.myfloridalicense.com/construction-industry/",
            "https://www2.myfloridalicense.com/construction-industry/public-records/",
          ],
          keywords: [
            "Florida contractor list",
            "Florida contractor leads",
            "DBPR contractor CSV",
            "contractor license renewal list",
          ],
        })}
      />
      {children}
    </>
  );
}
