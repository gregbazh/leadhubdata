import { createMetadata } from "@/lib/seo";
import { getOneTimeProductById } from "@/lib/products";
const product = getOneTimeProductById("fl-restaurants")!;
export const metadata = createMetadata({ title: "Florida Food-Business Filings — Email List CSV", description: product.description, path: "/fl-restaurants" });
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
