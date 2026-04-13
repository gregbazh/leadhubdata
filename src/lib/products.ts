export type LeadCategory = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  fields: string[];
  bundles: Bundle[];
};

export type Bundle = {
  id: string;
  leads: number;
  price: number;
  pricePerLead: number;
  label: string;
  popular?: boolean;
};

export const leadCategories: LeadCategory[] = [
  {
    id: "contractors",
    name: "Contractor Leads",
    tagline: "Roofing, HVAC, Solar, Plumbing, Electrical",
    description:
      "Homeowners who recently filed building permits. These people are actively looking for contractors right now.",
    icon: "wrench",
    fields: [
      "Full Name",
      "Property Address",
      "Phone Number",
      "Email",
      "Permit Type",
      "Job Value Estimate",
      "Filing Date",
    ],
    bundles: [
      { id: "contractors-50", leads: 50, price: 49, pricePerLead: 0.98, label: "Starter" },
      { id: "contractors-200", leads: 200, price: 149, pricePerLead: 0.75, label: "Growth", popular: true },
      { id: "contractors-500", leads: 500, price: 299, pricePerLead: 0.6, label: "Scale" },
      { id: "contractors-1000", leads: 1000, price: 499, pricePerLead: 0.5, label: "Enterprise" },
    ],
  },
  {
    id: "realestate",
    name: "Real Estate Leads",
    tagline: "Motivated sellers, tax delinquent, pre-foreclosure",
    description:
      "Distressed property owners identified through public court and tax records. High-intent seller leads for agents and investors.",
    icon: "building",
    fields: [
      "Owner Name",
      "Property Address",
      "Mailing Address",
      "Phone Number",
      "Email",
      "Distress Type",
      "Estimated Equity",
      "Record Date",
    ],
    bundles: [
      { id: "realestate-50", leads: 50, price: 79, pricePerLead: 1.58, label: "Starter" },
      { id: "realestate-200", leads: 200, price: 249, pricePerLead: 1.25, label: "Growth", popular: true },
      { id: "realestate-500", leads: 500, price: 499, pricePerLead: 1.0, label: "Scale" },
      { id: "realestate-1000", leads: 1000, price: 799, pricePerLead: 0.8, label: "Enterprise" },
    ],
  },
  {
    id: "insurance",
    name: "Insurance Leads",
    tagline: "Auto, commercial auto, health, life",
    description:
      "Consumers and businesses actively needing insurance coverage. Sourced from registration data, business filings, and public records.",
    icon: "shield",
    fields: [
      "Full Name",
      "Business Name",
      "Address",
      "Phone Number",
      "Email",
      "Insurance Type Needed",
      "Source",
    ],
    bundles: [
      { id: "insurance-50", leads: 50, price: 69, pricePerLead: 1.38, label: "Starter" },
      { id: "insurance-200", leads: 200, price: 199, pricePerLead: 1.0, label: "Growth", popular: true },
      { id: "insurance-500", leads: 500, price: 399, pricePerLead: 0.8, label: "Scale" },
      { id: "insurance-1000", leads: 1000, price: 649, pricePerLead: 0.65, label: "Enterprise" },
    ],
  },
  {
    id: "mortgage",
    name: "Mortgage Leads",
    tagline: "New homeowners, refinance candidates",
    description:
      "Recent property buyers and refinance-eligible homeowners from county deed recordings. Perfect for loan officers and mortgage brokers.",
    icon: "dollar",
    fields: [
      "Buyer Name",
      "Property Address",
      "Phone Number",
      "Email",
      "Purchase Price",
      "Loan Amount",
      "Lender",
      "Recording Date",
    ],
    bundles: [
      { id: "mortgage-50", leads: 50, price: 89, pricePerLead: 1.78, label: "Starter" },
      { id: "mortgage-200", leads: 200, price: 279, pricePerLead: 1.4, label: "Growth", popular: true },
      { id: "mortgage-500", leads: 500, price: 549, pricePerLead: 1.1, label: "Scale" },
      { id: "mortgage-1000", leads: 1000, price: 899, pricePerLead: 0.9, label: "Enterprise" },
    ],
  },
  {
    id: "newbusiness",
    name: "New Business Leads",
    tagline: "Fresh LLC & Corp formations daily",
    description:
      "Brand new businesses filed with the Secretary of State. They need everything — insurance, web design, payroll, banking, accounting.",
    icon: "store",
    fields: [
      "Entity Name",
      "Entity Type",
      "Registered Agent",
      "Address",
      "Phone Number",
      "Email",
      "Filing Date",
      "State",
    ],
    bundles: [
      { id: "newbusiness-100", leads: 100, price: 39, pricePerLead: 0.39, label: "Starter" },
      { id: "newbusiness-500", leads: 500, price: 129, pricePerLead: 0.26, label: "Growth", popular: true },
      { id: "newbusiness-1000", leads: 1000, price: 199, pricePerLead: 0.2, label: "Scale" },
      { id: "newbusiness-5000", leads: 5000, price: 699, pricePerLead: 0.14, label: "Enterprise" },
    ],
  },
  {
    id: "automotive",
    name: "Auto & Fleet Leads",
    tagline: "Commercial auto, trucking, fleet operators",
    description:
      "Motor carriers, fleet operators, and commercial vehicle owners from federal and state registrations. Ideal for commercial auto insurance agents.",
    icon: "truck",
    fields: [
      "Company Name",
      "DOT Number",
      "MC Number",
      "Address",
      "Phone Number",
      "Email",
      "Fleet Size",
      "Cargo Type",
    ],
    bundles: [
      { id: "automotive-100", leads: 100, price: 59, pricePerLead: 0.59, label: "Starter" },
      { id: "automotive-500", leads: 500, price: 199, pricePerLead: 0.4, label: "Growth", popular: true },
      { id: "automotive-1000", leads: 1000, price: 349, pricePerLead: 0.35, label: "Scale" },
      { id: "automotive-5000", leads: 5000, price: 999, pricePerLead: 0.2, label: "Enterprise" },
    ],
  },
];

export function getCategoryById(id: string) {
  return leadCategories.find((c) => c.id === id);
}

export function getBundleById(bundleId: string) {
  for (const cat of leadCategories) {
    const bundle = cat.bundles.find((b) => b.id === bundleId);
    if (bundle) return { category: cat, bundle };
  }
  return null;
}
