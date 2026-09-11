export type LeadCategory = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  fields: string[];
  plans: Plan[];
};

export type Plan = {
  id: string;
  name: string;
  leadsPerMonth: number;
  price: number; // monthly price in dollars
  pricePerLead: number;
  popular?: boolean;
  features: string[];
};

export const leadCategories: LeadCategory[] = [
  {
    id: "contractors",
    name: "Contractor Leads",
    tagline: "Roofing, HVAC, Solar, Plumbing, Electrical",
    description:
      "Homeowners who recently filed building permits. These people are actively looking for contractors right now — delivered fresh to you every month.",
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
    plans: [
      {
        id: "contractors-starter",
        name: "Starter",
        leadsPerMonth: 100,
        price: 79,
        pricePerLead: 0.79,
        features: ["100 leads/month", "CSV delivery", "Email support"],
      },
      {
        id: "contractors-growth",
        name: "Growth",
        leadsPerMonth: 500,
        price: 249,
        pricePerLead: 0.50,
        popular: true,
        features: ["500 leads/month", "CSV delivery", "Priority support", "Custom filters"],
      },
      {
        id: "contractors-scale",
        name: "Scale",
        leadsPerMonth: 1000,
        price: 399,
        pricePerLead: 0.40,
        features: ["1,000 leads/month", "CSV delivery", "Priority support", "Custom filters", "Dedicated rep"],
      },
      {
        id: "contractors-enterprise",
        name: "Enterprise",
        leadsPerMonth: 5000,
        price: 999,
        pricePerLead: 0.20,
        features: ["5,000 leads/month", "CSV + API access", "Dedicated rep", "Custom filters", "SLA guarantee"],
      },
    ],
  },
  {
    id: "realestate",
    name: "Real Estate Leads",
    tagline: "Motivated sellers, tax delinquent, pre-foreclosure",
    description:
      "Distressed property owners identified through public court and tax records. High-intent seller leads for agents and investors — refreshed monthly.",
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
    plans: [
      {
        id: "realestate-starter",
        name: "Starter",
        leadsPerMonth: 100,
        price: 99,
        pricePerLead: 0.99,
        features: ["100 leads/month", "CSV delivery", "Email support"],
      },
      {
        id: "realestate-growth",
        name: "Growth",
        leadsPerMonth: 500,
        price: 349,
        pricePerLead: 0.70,
        popular: true,
        features: ["500 leads/month", "CSV delivery", "Priority support", "Custom filters"],
      },
      {
        id: "realestate-scale",
        name: "Scale",
        leadsPerMonth: 1000,
        price: 549,
        pricePerLead: 0.55,
        features: ["1,000 leads/month", "CSV delivery", "Priority support", "Custom filters", "Dedicated rep"],
      },
      {
        id: "realestate-enterprise",
        name: "Enterprise",
        leadsPerMonth: 5000,
        price: 1499,
        pricePerLead: 0.30,
        features: ["5,000 leads/month", "CSV + API access", "Dedicated rep", "Custom filters", "SLA guarantee"],
      },
    ],
  },
  {
    id: "insurance",
    name: "Insurance Leads",
    tagline: "Auto, commercial auto, health, life",
    description:
      "Consumers and businesses actively needing insurance coverage. Sourced from registration data, business filings, and public records — updated monthly.",
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
    plans: [
      {
        id: "insurance-starter",
        name: "Starter",
        leadsPerMonth: 100,
        price: 89,
        pricePerLead: 0.89,
        features: ["100 leads/month", "CSV delivery", "Email support"],
      },
      {
        id: "insurance-growth",
        name: "Growth",
        leadsPerMonth: 500,
        price: 299,
        pricePerLead: 0.60,
        popular: true,
        features: ["500 leads/month", "CSV delivery", "Priority support", "Custom filters"],
      },
      {
        id: "insurance-scale",
        name: "Scale",
        leadsPerMonth: 1000,
        price: 449,
        pricePerLead: 0.45,
        features: ["1,000 leads/month", "CSV delivery", "Priority support", "Custom filters", "Dedicated rep"],
      },
      {
        id: "insurance-enterprise",
        name: "Enterprise",
        leadsPerMonth: 5000,
        price: 1199,
        pricePerLead: 0.24,
        features: ["5,000 leads/month", "CSV + API access", "Dedicated rep", "Custom filters", "SLA guarantee"],
      },
    ],
  },
  {
    id: "mortgage",
    name: "Mortgage Leads",
    tagline: "New homeowners, refinance candidates",
    description:
      "Recent property buyers and refinance-eligible homeowners from county deed recordings. Perfect for loan officers and mortgage brokers — fresh data monthly.",
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
    plans: [
      {
        id: "mortgage-starter",
        name: "Starter",
        leadsPerMonth: 100,
        price: 109,
        pricePerLead: 1.09,
        features: ["100 leads/month", "CSV delivery", "Email support"],
      },
      {
        id: "mortgage-growth",
        name: "Growth",
        leadsPerMonth: 500,
        price: 399,
        pricePerLead: 0.80,
        popular: true,
        features: ["500 leads/month", "CSV delivery", "Priority support", "Custom filters"],
      },
      {
        id: "mortgage-scale",
        name: "Scale",
        leadsPerMonth: 1000,
        price: 649,
        pricePerLead: 0.65,
        features: ["1,000 leads/month", "CSV delivery", "Priority support", "Custom filters", "Dedicated rep"],
      },
      {
        id: "mortgage-enterprise",
        name: "Enterprise",
        leadsPerMonth: 5000,
        price: 1799,
        pricePerLead: 0.36,
        features: ["5,000 leads/month", "CSV + API access", "Dedicated rep", "Custom filters", "SLA guarantee"],
      },
    ],
  },
  {
    id: "newbusiness",
    name: "New Business Leads",
    tagline: "Fresh LLC & Corp formations daily",
    description:
      "Brand new businesses filed with the Secretary of State. They need everything — insurance, web design, payroll, banking, accounting. Updated monthly.",
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
    plans: [
      {
        id: "newbusiness-starter",
        name: "Starter",
        leadsPerMonth: 200,
        price: 49,
        pricePerLead: 0.25,
        features: ["200 leads/month", "CSV delivery", "Email support"],
      },
      {
        id: "newbusiness-growth",
        name: "Growth",
        leadsPerMonth: 1000,
        price: 149,
        pricePerLead: 0.15,
        popular: true,
        features: ["1,000 leads/month", "CSV delivery", "Priority support", "Custom filters"],
      },
      {
        id: "newbusiness-scale",
        name: "Scale",
        leadsPerMonth: 2500,
        price: 299,
        pricePerLead: 0.12,
        features: ["2,500 leads/month", "CSV delivery", "Priority support", "Custom filters", "Dedicated rep"],
      },
      {
        id: "newbusiness-enterprise",
        name: "Enterprise",
        leadsPerMonth: 10000,
        price: 799,
        pricePerLead: 0.08,
        features: ["10,000 leads/month", "CSV + API access", "Dedicated rep", "Custom filters", "SLA guarantee"],
      },
    ],
  },
  {
    id: "automotive",
    name: "Auto & Fleet Leads",
    tagline: "Commercial auto, trucking, fleet operators",
    description:
      "Motor carriers, fleet operators, and commercial vehicle owners from federal and state registrations. Ideal for commercial auto insurance agents — refreshed monthly.",
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
    plans: [
      {
        id: "automotive-starter",
        name: "Starter",
        leadsPerMonth: 200,
        price: 69,
        pricePerLead: 0.35,
        features: ["200 leads/month", "CSV delivery", "Email support"],
      },
      {
        id: "automotive-growth",
        name: "Growth",
        leadsPerMonth: 1000,
        price: 199,
        pricePerLead: 0.20,
        popular: true,
        features: ["1,000 leads/month", "CSV delivery", "Priority support", "Custom filters"],
      },
      {
        id: "automotive-scale",
        name: "Scale",
        leadsPerMonth: 2500,
        price: 399,
        pricePerLead: 0.16,
        features: ["2,500 leads/month", "CSV delivery", "Priority support", "Custom filters", "Dedicated rep"],
      },
      {
        id: "automotive-enterprise",
        name: "Enterprise",
        leadsPerMonth: 10000,
        price: 999,
        pricePerLead: 0.10,
        features: ["10,000 leads/month", "CSV + API access", "Dedicated rep", "Custom filters", "SLA guarantee"],
      },
    ],
  },
];

export type OneTimeProduct = {
  id: string;
  name: string;
  headline: string;
  description: string;
  price: number;
  leadCount: number;
  verifiedContactCount: number;
  reachableCount?: number;
  phoneCount?: number;
  emailCount?: number;
  uniqueEmailCount?: number;
  contactFormCount?: number;
  updatedAt?: string;
  latestApplication?: string;
  countyCount?: number;
  includedIn?: string;
  mix?: { label: string; count: number }[];
  fields: string[];
  table: string;
  columns: string[];
  orderBy: string;
  downloadName: string;
  sample: { rows: number; column: string; label: string; options: string[] };
};

const foodFields = ["Business Name", "Legal Name", "Facility Type", "County", "Street Address", "City", "ZIP", "Phone", "Email", "Plan Review Status", "Application Date", "Application Type", "Last Seen in State Source"];
const foodColumns = ["business_name", "legal_name", "facility_type", "county", "address", "city", "zip", "phone", "email", "plan_review_status", "application_date", "application_type", "source_checked_at"];
export const FL_COUNTIES = ["Alachua", "Baker", "Bay", "Bradford", "Brevard", "Broward", "Calhoun", "Charlotte", "Citrus", "Clay", "Collier", "Columbia", "Dade", "DeSoto", "Dixie", "Duval", "Escambia", "Flagler", "Franklin", "Gadsden", "Gilchrist", "Glades", "Gulf", "Hamilton", "Hardee", "Hendry", "Hernando", "Highlands", "Hillsborough", "Holmes", "Indian River", "Jackson", "Jefferson", "Lafayette", "Lake", "Lee", "Leon", "Levy", "Liberty", "Madison", "Manatee", "Marion", "Martin", "Monroe", "Nassau", "Okaloosa", "Okeechobee", "Orange", "Osceola", "Palm Beach", "Pasco", "Pinellas", "Polk", "Putnam", "Santa Rosa", "Sarasota", "Seminole", "St. Johns", "St. Lucie", "Sumter", "Suwannee", "Taylor", "Union", "Volusia", "Wakulla", "Walton", "Washington"];

// Inventory counts are populated by catalog.ts from the same tables as fulfillment.
export const oneTimeProducts: OneTimeProduct[] = [
  {
    id: "fl-contractors", name: "Florida Contractors — Business Contacts",
    headline: "Florida contractor contacts, organized by trade",
    description: "Active Florida contractors with a researched phone number, email or contact form on every record. Find businesses in your trade and territory, with license details for context.",
    price: 299, leadCount: 0, verifiedContactCount: 0,
    fields: ["License Number", "Trade", "Business Name", "DBA", "Street Address", "City", "State", "ZIP", "County Code", "Originally Licensed", "License Expiration", "Days Until Expiry", "Website", "Email", "Phone", "Contact Form", "Contact Source", "Contact Checked", "License Source Checked"],
    table: "fl_contractors_contactable",
    columns: ["license_number", "trade_code", "trade", "licensee_name", "dba_name", "address", "city", "state", "zip", "county_code", "originally_licensed", "license_expires", "days_until_expiry", "website", "email", "phone", "contact_form_url", "contact_source_url", "contact_checked_at", "source_checked_at"],
    orderBy: "(coalesce(email,'') <> '' OR coalesce(phone,'') <> '') DESC, to_date(originally_licensed, 'MM/DD/YYYY') DESC NULLS LAST, license_number",
    downloadName: "fl_contractor_contacts.csv",
    sample: { rows: 100, column: "trade", label: "Which trade do you write?", options: ["Cert General", "Cert Building", "Cert Air", "Cert Roofing", "Cert Residential", "Cert Plumbing", "Cert Pool", "Cert Specialty", "Cert Underground", "Cert Mechanical", "Cert Solar", "Cert Pollutant", "Cert Metal"] },
  },
  {
    id: "fl-restaurants", name: "Florida Food Businesses — Filing Archive",
    headline: "Florida food-business filings, with email contacts",
    description: "Restaurant, food-truck and catering plan-review filings with contact emails, phone numbers where supplied, county, application date and status. Newest filings first.",
    price: 199, leadCount: 0, verifiedContactCount: 0,
    fields: foodFields, table: "fl_food_available", columns: foodColumns,
    orderBy: "to_date(application_date, 'MM/DD/YYYY') DESC NULLS LAST, record_key",
    downloadName: "fl_food_business_filings.csv",
    sample: { rows: 50, column: "county", label: "Which county do you serve?", options: FL_COUNTIES },
  },
  {
    id: "fl-food-trucks", name: "Florida Food Trucks — Business Prospects",
    headline: "Food-truck prospects for commercial auto agents",
    description: "Florida mobile-food-business filings with contact emails, phones where supplied, county and filing date. A focused starting point for agents who write food trucks and commercial auto.",
    price: 99, leadCount: 0, verifiedContactCount: 0, includedIn: "fl-restaurants",
    fields: foodFields, table: "fl_food_trucks", columns: foodColumns,
    orderBy: "to_date(application_date, 'MM/DD/YYYY') DESC NULLS LAST, record_key",
    downloadName: "fl_food_truck_prospects.csv",
    sample: { rows: 25, column: "county", label: "Which county do you serve?", options: FL_COUNTIES },
  },
];

export const SUBSCRIPTION = {
  id: "fl-all-access", name: "Florida All-Access", price: 299, interval: "month" as const,
  includes: ["Every list in the catalogue while subscribed", "New food-business records emailed weekly when available", "The food-business archive in your first delivery", "Current contractor downloads in your account", "Every new list we build at no extra cost"],
};

export function getOneTimeProductById(id: string) {
  return oneTimeProducts.find(p => p.id === id);
}
export function getCategoryById(id: string) {
  return leadCategories.find(c => c.id === id);
}
export function getPlanById(planId: string) {
  for (const category of leadCategories) {
    const plan = category.plans.find(p => p.id === planId);
    if (plan) return { category, plan };
  }
  return null;
}
