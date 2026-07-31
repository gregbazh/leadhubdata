import type { Metadata } from "next";
import { getOneTimeProductById } from "@/lib/products";

const product = getOneTimeProductById("fl-contractors")!;

// The page itself is a Client Component, so its metadata lives here.
export const metadata: Metadata = {
  title: `${product.leadCount.toLocaleString()} FL Contractors Renewing by Aug 31 — Instant CSV | LeadHubData`,
  description: `Every active Florida contractor whose license expires within 90 days, sorted by expiration date. One-time $${product.price} purchase, instant CSV download. No subscription.`,
};

export default function FlContractorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
