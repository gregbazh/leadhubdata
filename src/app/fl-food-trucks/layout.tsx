import { createMetadata } from "@/lib/seo";
import { getOneTimeProductById } from "@/lib/products";
const product = getOneTimeProductById("fl-food-trucks")!;
export const metadata = createMetadata({ title: "Florida Food Truck Leads — Commercial Auto Prospects", description: product.description, path: "/fl-food-trucks" });
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
