import { createMetadata } from "@/lib/seo";
import { getOneTimeProductById } from "@/lib/products";
const product = getOneTimeProductById("fl-contractors")!;
export const metadata = createMetadata({ title: "Florida Contractor Contacts — Active License CSV", description: product.description, path: "/fl-contractors" });
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
