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
