"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

function AnimateIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const leadCategories = [
  {
    id: "contractors",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Contractors",
    desc: "Roofing, HVAC, Solar, Plumbing",
  },
  {
    id: "realestate",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Real Estate",
    desc: "Motivated sellers, property data",
  },
  {
    id: "insurance",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Insurance",
    desc: "Auto, commercial, health leads",
  },
  {
    id: "mortgage",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Mortgage",
    desc: "New homeowners, refinance",
  },
  {
    id: "newbusiness",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.999 2.999 0 01.62-1.853L5.25 5.25A2.25 2.25 0 017.5 3h9a2.25 2.25 0 012.25 2.25l1.63 2.246A2.999 2.999 0 0121 9.349" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "New Businesses",
    desc: "Fresh LLC & Corp formations",
  },
  {
    id: "automotive",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Auto & Fleet",
    desc: "Commercial auto, trucking",
  },
];

const stats = [
  { value: "2M+", label: "Leads Delivered" },
  { value: "98%", label: "Data Accuracy" },
  { value: "24hr", label: "Freshness" },
  { value: "50+", label: "Data Sources" },
];

const features = [
  {
    title: "Real-Time Data",
    desc: "Leads sourced from live public records, updated daily. No stale databases.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Verified & Enriched",
    desc: "Every lead verified with phone, email, and intent signals before delivery.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Exclusive Leads",
    desc: "Limited distribution. Your leads aren't shared with 50 other buyers.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Flexible Delivery",
    desc: "CSV, API, or direct CRM integration. Get leads the way you want them.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "49",
    period: "/mo",
    desc: "For solo operators testing a new channel",
    features: ["100 leads/month", "1 lead category", "CSV delivery", "Email support", "48hr refresh rate"],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "149",
    period: "/mo",
    desc: "For teams ready to scale pipeline",
    features: [
      "500 leads/month",
      "3 lead categories",
      "CSV + API access",
      "Priority support",
      "24hr refresh rate",
      "Enriched contacts",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Unlimited volume, white-glove service",
    features: [
      "Unlimited leads",
      "All categories",
      "API + CRM integration",
      "Dedicated account manager",
      "Real-time delivery",
      "Exclusive territories",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ─── NAV ─── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0055FF] flex items-center justify-center" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)" }}>
              <span className="text-white font-black text-sm">L</span>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-[#0a0a0a]">
              LEADHUB<span className="text-[#0055FF]">DATA</span>
            </span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="#leads" className="text-sm font-semibold text-[#0a0a0a]/60 hover:text-[#0a0a0a] transition-colors">
              Leads
            </a>
            <a href="#features" className="text-sm font-semibold text-[#0a0a0a]/60 hover:text-[#0a0a0a] transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-semibold text-[#0a0a0a]/60 hover:text-[#0a0a0a] transition-colors">
              Pricing
            </a>
            <a
              href="#cta"
              className="text-sm font-bold text-white bg-[#0055FF] px-5 py-2.5 hover:bg-[#0033CC] transition-colors"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 92% 100%, 0 100%)" }}
            >
              Get Leads →
            </a>
          </div>
        </div>
      </motion.nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-36 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[800px] h-[800px] opacity-[0.03]"
            style={{
              background: "linear-gradient(135deg, #0055FF 0%, transparent 60%)",
              clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-[0.02]"
            style={{
              background: "linear-gradient(315deg, #0055FF 0%, transparent 60%)",
              clipPath: "polygon(0 30%, 70% 0, 100% 100%, 0% 100%)",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0055FF]/5 border border-[#0055FF]/10 mb-8 text-sm font-semibold text-[#0055FF]"
              style={{ clipPath: "polygon(0 0, 100% 0, 97% 100%, 0 100%)" }}
            >
              <span className="w-2 h-2 bg-[#0055FF] rounded-full animate-pulse" />
              NOW DELIVERING 50,000+ FRESH LEADS WEEKLY
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.03em] leading-[0.9] text-[#0a0a0a]">
              WE SELL THE
              <br />
              <span className="text-[#0055FF]">BEST LEADS.</span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-[#0a0a0a]/50 max-w-xl leading-relaxed font-medium">
              Fresh, verified, exclusive leads sourced from public records daily.
              Stop chasing dead data. Start closing deals.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#leads"
                className="inline-flex items-center justify-center h-14 px-8 text-base font-bold text-white bg-[#0055FF] hover:bg-[#0033CC] transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)]"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 65%, 94% 100%, 0 100%)" }}
              >
                Browse Leads →
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center h-14 px-8 text-base font-bold text-[#0a0a0a] border-2 border-[#0a0a0a]/10 hover:border-[#0a0a0a]/30 transition-all duration-200"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 65%, 94% 100%, 0 100%)" }}
              >
                See Pricing
              </a>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#0a0a0a]/5"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 md:p-8 text-center">
                <div className="text-3xl md:text-4xl font-black text-[#0a0a0a] tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-semibold text-[#0a0a0a]/40 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── LEAD CATEGORIES ─── */}
      <section id="leads" className="py-24 md:py-32 px-6 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-[#0055FF] uppercase tracking-widest mb-4">
                Lead Categories
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.02em] text-[#0a0a0a] leading-[1.1]">
                What leads are you
                <br />
                looking for?
              </h2>
              <p className="mt-4 text-lg text-[#0a0a0a]/50 font-medium">
                Select a category to see available lead types, volume, and sample data.
              </p>
            </div>
          </AnimateIn>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leadCategories.map((cat, i) => (
              <AnimateIn key={cat.id} delay={i * 0.08}>
                <motion.button
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={`w-full text-left p-6 md:p-8 border-2 transition-all duration-300 group relative overflow-hidden ${
                    selectedCategory === cat.id
                      ? "border-[#0055FF] bg-white shadow-[0_8px_40px_rgba(0,85,255,0.12)]"
                      : "border-transparent bg-white hover:border-[#0055FF]/20 hover:shadow-lg"
                  }`}
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%)" }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {selectedCategory === cat.id && (
                    <motion.div
                      className="absolute top-0 right-0 w-16 h-16 bg-[#0055FF]"
                      style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="absolute top-1.5 right-1.5 w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  )}
                  <div
                    className={`w-14 h-14 flex items-center justify-center mb-4 transition-colors duration-300 ${
                      selectedCategory === cat.id
                        ? "bg-[#0055FF] text-white"
                        : "bg-[#F5F7FA] text-[#0a0a0a]/70 group-hover:bg-[#0055FF]/10 group-hover:text-[#0055FF]"
                    }`}
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)" }}
                  >
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0a0a0a] tracking-tight">
                    {cat.label}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[#0a0a0a]/40">
                    {cat.desc}
                  </p>
                </motion.button>
              </AnimateIn>
            ))}
          </div>

          {selectedCategory && (
            <motion.div
              className="mt-8 bg-white border-2 border-[#0055FF]/10 p-8 md:p-10"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 93%, 97% 100%, 0 100%)" }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0a0a0a] tracking-tight">
                    {leadCategories.find((c) => c.id === selectedCategory)?.label} Leads
                  </h3>
                  <p className="mt-2 text-[#0a0a0a]/50 font-medium max-w-lg">
                    Fresh data delivered daily. Each lead includes contact info, location, and intent signals. Request a sample to see the data quality.
                  </p>
                </div>
                <a
                  href="#cta"
                  className="inline-flex items-center justify-center h-12 px-6 text-sm font-bold text-white bg-[#0055FF] hover:bg-[#0033CC] transition-colors shrink-0"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 65%, 92% 100%, 0 100%)" }}
                >
                  Request Sample →
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-[#0055FF] uppercase tracking-widest mb-4">
                Why LeadHubData
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.02em] text-[#0a0a0a] leading-[1.1]">
                Data that actually
                <br />
                converts.
              </h2>
            </div>
          </AnimateIn>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-[#0a0a0a]/5">
            {features.map((feature, i) => (
              <AnimateIn key={feature.title} delay={i * 0.1}>
                <div className="bg-white p-8 md:p-12 group hover:bg-[#F5F7FA] transition-colors duration-300">
                  <div
                    className="w-12 h-12 bg-[#0055FF]/5 text-[#0055FF] flex items-center justify-center group-hover:bg-[#0055FF] group-hover:text-white transition-colors duration-300"
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)" }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-[#0a0a0a] tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-[#0a0a0a]/50 font-medium leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF BAR ─── */}
      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Trusted by 500+ agencies
                  <br />
                  and growing.
                </h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-gradient-to-br from-[#0055FF] to-[#3377FF] flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-white/60 text-sm font-medium">
                  <span className="text-white font-bold">4.9/5</span> average rating
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 md:py-32 px-6 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-sm font-bold text-[#0055FF] uppercase tracking-widest mb-4">
                Pricing
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.02em] text-[#0a0a0a] leading-[1.1]">
                Simple pricing.
                <br />
                Serious leads.
              </h2>
              <p className="mt-4 text-lg text-[#0a0a0a]/50 font-medium">
                No hidden fees. No long contracts. Cancel anytime.
              </p>
            </div>
          </AnimateIn>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <AnimateIn key={tier.name} delay={i * 0.1}>
                <motion.div
                  className={`relative p-8 md:p-10 flex flex-col h-full ${
                    tier.highlighted
                      ? "bg-[#0a0a0a] text-white border-2 border-[#0a0a0a]"
                      : "bg-white border-2 border-[#0a0a0a]/5"
                  }`}
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 93%, 93% 100%, 0 100%)" }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  {tier.highlighted && (
                    <div
                      className="absolute top-0 right-0 px-4 py-1 bg-[#0055FF] text-white text-xs font-bold uppercase tracking-wider"
                      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 10% 100%)" }}
                    >
                      Popular
                    </div>
                  )}

                  <div>
                    <h3
                      className={`text-lg font-extrabold uppercase tracking-wider ${
                        tier.highlighted ? "text-white/60" : "text-[#0a0a0a]/40"
                      }`}
                    >
                      {tier.name}
                    </h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      {tier.price !== "Custom" && (
                        <span className={`text-lg font-bold ${tier.highlighted ? "text-white/40" : "text-[#0a0a0a]/30"}`}>
                          $
                        </span>
                      )}
                      <span
                        className={`text-5xl font-black tracking-tight ${
                          tier.highlighted ? "text-white" : "text-[#0a0a0a]"
                        }`}
                      >
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className={`text-lg font-bold ${tier.highlighted ? "text-white/40" : "text-[#0a0a0a]/30"}`}>
                          {tier.period}
                        </span>
                      )}
                    </div>
                    <p
                      className={`mt-2 text-sm font-medium ${
                        tier.highlighted ? "text-white/50" : "text-[#0a0a0a]/40"
                      }`}
                    >
                      {tier.desc}
                    </p>
                  </div>

                  <div className="mt-8 flex-1">
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={tier.highlighted ? "#0055FF" : "#0055FF"}
                            strokeWidth={2.5}
                            className="w-4 h-4 shrink-0"
                          >
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span
                            className={`text-sm font-medium ${
                              tier.highlighted ? "text-white/80" : "text-[#0a0a0a]/60"
                            }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <a
                      href="#cta"
                      className={`flex items-center justify-center h-12 w-full text-sm font-bold transition-all duration-200 hover:translate-y-[-2px] ${
                        tier.highlighted
                          ? "bg-[#0055FF] text-white hover:bg-[#3377FF] hover:shadow-[0_8px_30px_rgba(0,85,255,0.4)]"
                          : "bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] hover:shadow-lg"
                      }`}
                      style={{ clipPath: "polygon(0 0, 100% 0, 100% 60%, 93% 100%, 0 100%)" }}
                    >
                      {tier.cta}
                    </a>
                  </div>
                </motion.div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section id="cta" className="py-24 md:py-32 px-6 bg-white relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-[0.02]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #0055FF 0, #0055FF 1px, transparent 0, transparent 50%)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <AnimateIn>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-[#0a0a0a] leading-[1]">
              READY TO CLOSE
              <br />
              <span className="text-[#0055FF]">MORE DEALS?</span>
            </h2>
            <p className="mt-6 text-lg text-[#0a0a0a]/50 font-medium max-w-lg mx-auto">
              Get started with a free sample. See the data quality before you commit.
              No credit card required.
            </p>

            <form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-14 px-5 border-2 border-[#0a0a0a]/10 text-[#0a0a0a] placeholder:text-[#0a0a0a]/30 font-medium focus:outline-none focus:border-[#0055FF] transition-colors"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 65%, 94% 100%, 0 100%)" }}
              />
              <button
                type="submit"
                className="h-14 px-8 bg-[#0055FF] text-white font-bold hover:bg-[#0033CC] transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)]"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 65%, 90% 100%, 0 100%)" }}
              >
                Get Free Sample →
              </button>
            </form>
          </AnimateIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 bg-[#0055FF] flex items-center justify-center"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)" }}
                >
                  <span className="text-white font-black text-xs">L</span>
                </div>
                <span className="text-base font-extrabold tracking-tight text-white">
                  LEADHUB<span className="text-[#0055FF]">DATA</span>
                </span>
              </div>
              <p className="mt-3 text-sm text-white/30 font-medium max-w-xs">
                Premium lead data sourced from verified public records. Updated daily.
              </p>
            </div>

            <div className="flex gap-12">
              <div>
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#leads" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Lead Categories</a></li>
                  <li><a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Pricing</a></li>
                  <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors font-medium">API Docs</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors font-medium">About</a></li>
                  <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Contact</a></li>
                  <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Privacy</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/20 font-medium">
              © 2026 LeadHubData. All rights reserved.
            </p>
            <p className="text-xs text-white/20 font-medium">
              Built different.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
