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
  price: number; // one-time price in dollars
  leadCount: number;
  // Records carrying a researched website/email/phone. Every other record is
  // license data only. Keep this at or below the true count in Neon -- the
  // loader prints the current number each time the table is reloaded.
  verifiedContactCount: number;
  // Records you can actually contact: a phone number or an email, not just a
  // website. This is what the page leads with, because it is the number a buyer
  // is really asking about. Measured from the delivered table, never estimated.
  reachableCount?: number;
  phoneCount?: number;
  emailCount?: number;
  fields: string[];
  table: string; // Neon table the download route exports
  columns: string[]; // exact CSV columns, in order, that the buyer receives
  orderBy: string; // SQL ordering for the exported file
  downloadName: string; // filename offered to the buyer
  sample: {
    rows: number; // how many records the free sample contains
    column: string; // column the visitor narrows the sample by
    label: string; // what to call it on the form
    options: string[]; // allowed values -- also the whitelist the API checks
  };
};

export const oneTimeProducts: OneTimeProduct[] = [
  {
    id: "fl-contractors",
    name: "FL Contractors — Expiring Licenses",
    headline: "3,695 Florida contractors with researched contact details",
    description:
      "3,695 contractors with a phone number or email researched and matched to the licensed business — all from the August 31, 2026 renewal cohort. The complete 48,795-record state license file is included.",
    price: 299,
    leadCount: 48795,
    verifiedContactCount: 3737,
    reachableCount: 3695,
    phoneCount: 3588,
    emailCount: 1909,
    fields: [
      "License Number",
      "Trade",
      "Business Name",
      "DBA",
      "Street Address",
      "City",
      "ZIP",
      "County Code",
      "Originally Licensed Date",
      "License Expiration Date",
      "Days Until Expiry",
    ],
    table: "fl_contractors",
    columns: [
      "license_number", "trade_code", "trade", "licensee_name", "dba_name",
      "address", "city", "state", "zip", "county_code", "originally_licensed",
      "license_expires", "days_until_expiry", "website", "email", "phone",
    ],
    orderBy: "to_date(license_expires, 'MM/DD/YYYY'), license_number",
    downloadName: "fl_contractors_expiring_90d.csv",
    sample: {
      rows: 100,
      column: "trade",
      label: "Which trade do you write?",
      options: [
        "Cert General", "Cert Building", "Cert Air", "Cert Roofing",
        "Cert Residental", "Cert Plumbing", "Cert Pool", "Cert Specialty",
        "Cert Under", "Cert Mechanical", "Cert Solar",
      ],
    },
  },
  {
    id: "fl-restaurants",
    name: "FL Food Businesses — Newly Licensed",
    headline: "9,806 Florida food businesses, every one with an email",
    description:
      "Every restaurant, food truck, caterer, and food stand that filed a Florida plan review since January 2025 — 9,806 businesses, each with the contact email from its state filing. Newest filings first.",
    price: 199,
    leadCount: 9806,
    verifiedContactCount: 9806,
    fields: [
      "Business Name",
      "Legal Name",
      "Facility Type",
      "County",
      "Street Address",
      "City",
      "ZIP",
      "Phone",
      "Email",
      "Plan Review Status",
      "Application Date",
      "Application Type",
    ],
    table: "fl_restaurants",
    columns: [
      "business_name", "legal_name", "facility_type", "county", "address",
      "city", "zip", "phone", "email", "plan_review_status",
      "application_date", "application_type",
    ],
    orderBy: "to_date(application_date, 'MM/DD/YYYY') DESC NULLS LAST, business_name",
    downloadName: "fl_new_food_businesses.csv",
    sample: {
      rows: 50,
      column: "county",
      label: "Which county do you work?",
      options: [
        "Dade", "Orange", "Hillsborough", "Broward", "Palm Beach", "Pinellas",
        "Duval", "Lee", "Polk", "Volusia", "Lake", "Pasco", "Brevard",
        "Manatee", "Marion", "Osceola", "St. Lucie", "Sarasota", "Escambia",
        "St. Johns", "Bay", "Collier", "Seminole", "Okaloosa", "Alachua",
        "Leon", "Walton", "Hernando", "Monroe", "Santa Rosa", "Charlotte",
        "Martin", "Citrus", "Indian River", "Sumter", "Clay", "Highlands",
      ],
    },
  },
];

// The recurring product. Priced by the owner; don't change it without asking.
// What justifies the price is the standing feed plus everything in the
// catalogue, not the weekly delta on its own.
export const SUBSCRIPTION = {
  id: "fl-all-access",
  name: "Florida All-Access",
  price: 299, // per month, in dollars
  interval: "month" as const,
  newPerMonth: 825, // measured from real source movement, not estimated
  includes: [
    "Every list in the catalogue, yours while subscribed",
    "New Florida food businesses emailed to you every week",
    "The full back archive on day one",
    "Records we keep after the state deletes them",
    "Every new list we build, at no extra cost",
  ],
};

export function getOneTimeProductById(id: string) {
  return oneTimeProducts.find((p) => p.id === id);
}

export function getCategoryById(id: string) {
  return leadCategories.find((c) => c.id === id);
}

export function getPlanById(planId: string) {
  for (const cat of leadCategories) {
    const plan = cat.plans.find((p) => p.id === planId);
    if (plan) return { category: cat, plan };
  }
  return null;
}
