import { redirect } from "next/navigation";

// The six-category subscription storefront is not currently sold. All
// /leads/* URLs funnel to the one live product. The original plan-picker UI
// is archived at src/legacy/leads-category-page.tsx for re-enabling later.
export default function LeadCategoryPage() {
  redirect("/fl-contractors");
}
