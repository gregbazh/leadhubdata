"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { leadCategories as productCategories } from "@/lib/products";

/* ─── ANIMATE ON SCROLL WRAPPER ─── */
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
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── REVIEWS DATA ─── */
const reviews = [
  {
    name: "Marcus T.",
    role: "Insurance Agency Owner",
    text: "Switched from another lead provider 3 months ago. The data quality is night and day. We went from a 2% close rate to almost 9%. Worth every penny.",
    stars: 5,
  },
  {
    name: "Jennifer L.",
    role: "Mortgage Broker",
    text: "I was skeptical at first but decided to try the starter pack. Got 3 closed loans from 50 leads in the first week. Already ordered the enterprise bundle.",
    stars: 5,
  },
  {
    name: "David R.",
    role: "Real Estate Investor",
    text: "The motivated seller leads are legit. These are actual distressed properties, not recycled lists from 2019. I've done 4 deals this month from their data.",
    stars: 5,
  },
  {
    name: "Sarah K.",
    role: "Roofing Contractor",
    text: "Building permit leads changed our business. Instead of door knocking random neighborhoods, we're calling homeowners who literally just filed for roof work. Game changer.",
    stars: 5,
  },
  {
    name: "Michael P.",
    role: "Commercial Auto Insurance",
    text: "We buy the 5,000 pack every month. At $0.20 per lead it's basically free compared to what we were paying. The DOT data is always fresh and accurate.",
    stars: 5,
  },
  {
    name: "Rachel W.",
    role: "Business Services Consultant",
    text: "New business filing leads are gold. These companies just incorporated and need EVERYTHING — insurance, payroll, websites, accounting. Easy conversations.",
    stars: 5,
  },
  {
    name: "Anthony G.",
    role: "Solar Sales Manager",
    text: "My team was struggling with aged leads from other vendors. LeadHubData sends us homeowners with active permits. Our reps are actually excited to make calls now.",
    stars: 4,
  },
  {
    name: "Lisa M.",
    role: "Health Insurance Agent",
    text: "The data is clean. No disconnected numbers, no wrong emails. I can actually focus on selling instead of cleaning up garbage spreadsheets.",
    stars: 5,
  },
  {
    name: "Carlos D.",
    role: "HVAC Company Owner",
    text: "Tried the 200-lead pack for our HVAC business. Booked 14 appointments the first week. My install crew is fully booked through next month.",
    stars: 5,
  },
  {
    name: "Nicole F.",
    role: "Loan Officer",
    text: "I've used 4 different lead companies in the past year. This is the only one where the phone numbers actually work and people pick up. Not even close to the others.",
    stars: 5,
  },
  {
    name: "Brandon H.",
    role: "Fleet Insurance Specialist",
    text: "The commercial auto leads with fleet size data let me prioritize the big accounts. Closed a 47-truck fleet policy last week from their list.",
    stars: 5,
  },
  {
    name: "Amanda S.",
    role: "Property Manager",
    text: "We use the real estate leads to find new properties to manage. Owner contact info is always accurate. Saves us hours of skip tracing.",
    stars: 4,
  },
];

/* ─── LEAD TYPE ICONS (simple SVGs) ─── */
const categoryMeta: Record<string, { icon: React.ReactNode; color: string }> = {
  contractors: {
    color: "#0055FF",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  realestate: {
    color: "#0055FF",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  insurance: {
    color: "#0055FF",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  mortgage: {
    color: "#0055FF",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  newbusiness: {
    color: "#0055FF",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.999 2.999 0 01.62-1.853L5.25 5.25A2.25 2.25 0 017.5 3h9a2.25 2.25 0 012.25 2.25l1.63 2.246A2.999 2.999 0 0121 9.349" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  automotive: {
    color: "#0055FF",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

/* ─── MAIN PAGE ─── */
export default function Home() {
  const [leadsOpen, setLeadsOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    const close = () => setLeadsOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ─── NAV ─── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-blue/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">L</span>
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              LEADHUB<span className="text-blue">DATA</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {/* LEADS dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLeadsOpen(!leadsOpen)}
                className="flex items-center gap-1 text-sm font-bold text-foreground/60 hover:text-blue transition-colors"
              >
                LEADS
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${leadsOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              <AnimatePresence>
                {leadsOpen && (
                  <motion.div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,85,255,0.12)] border border-blue/10 overflow-hidden"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {productCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/leads/${cat.id}`}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-blue/5 transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-blue/5 flex items-center justify-center text-blue group-hover:bg-blue group-hover:text-white transition-colors">
                          {categoryMeta[cat.id]?.icon}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">{cat.name}</div>
                          <div className="text-xs text-foreground/40">{cat.tagline.split(",")[0]}</div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="#demo" className="text-sm font-bold text-foreground/60 hover:text-blue transition-colors">
              DEMO
            </a>
            <a href="#reviews" className="text-sm font-bold text-foreground/60 hover:text-blue transition-colors">
              REVIEWS
            </a>
            <Link
              href="#choose"
              className="text-sm font-bold text-white bg-blue px-6 py-2.5 rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)]"
            >
              Get Leads
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ─── HERO — FULL VIEWPORT ─── */}
      <section ref={heroRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Floating blue orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-[15%] left-[10%] w-72 h-72 bg-blue/5 rounded-full blur-3xl"
            animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue/4 rounded-full blur-3xl"
            animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[40%] right-[30%] w-48 h-48 bg-blue/3 rounded-full blur-2xl"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Blue line accents */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-blue/20 to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue/5 border border-blue/10 mb-10"
          >
            <span className="w-2 h-2 bg-blue rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-blue">DELIVERING 50,000+ FRESH LEADS WEEKLY</span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-[-0.04em] leading-[0.85]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            WE SELL THE
            <br />
            <span className="text-blue">BEST LEADS.</span>
          </motion.h1>

          <motion.p
            className="mt-8 text-lg md:text-xl text-foreground/40 max-w-lg mx-auto font-medium leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Fresh. Verified. Exclusive. Sourced from public records daily.
          </motion.p>
        </motion.div>

        {/* Animated arrow */}
        <motion.a
          href="#choose"
          className="absolute bottom-12 z-10 flex flex-col items-center gap-2 text-blue/60 hover:text-blue transition-colors cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="text-xs font-bold tracking-widest uppercase">Scroll</span>
          <motion.svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M19 14l-7 7m0 0l-7-7" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.a>

        {/* Bottom blue gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue/20 to-transparent" />
      </section>

      {/* ─── CHOOSE YOUR LEADS ─── */}
      <section id="choose" className="relative py-32 md:py-40 px-6 overflow-hidden">
        {/* Parallax blue accent */}
        <motion.div
          className="absolute -top-20 -right-40 w-[600px] h-[600px] bg-blue/[0.03] rounded-full blur-3xl pointer-events-none"
          style={{ y: useTransform(scrollYProgress, [0.1, 0.4], [100, -100]) }}
        />

        <div className="relative max-w-6xl mx-auto">
          <AnimateIn className="text-center mb-20">
            <p className="text-sm font-bold text-blue uppercase tracking-[0.2em] mb-5">
              Choose Your Leads
            </p>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] leading-[0.95]">
              What are you
              <br />
              <span className="text-blue">looking for?</span>
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {productCategories.map((cat, i) => (
              <AnimateIn key={cat.id} delay={i * 0.08}>
                <Link href={`/leads/${cat.id}`}>
                  <motion.div
                    className="group relative p-8 rounded-2xl border-2 border-blue/5 bg-white cursor-pointer overflow-hidden"
                    whileHover={{
                      y: -8,
                      borderColor: "rgba(0,85,255,0.2)",
                      boxShadow: "0 20px 60px rgba(0,85,255,0.1)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl bg-blue/5 flex items-center justify-center text-blue group-hover:bg-blue group-hover:text-white transition-all duration-300">
                        {categoryMeta[cat.id]?.icon}
                      </div>
                      <h3 className="mt-5 text-xl font-extrabold tracking-tight">
                        {cat.name}
                      </h3>
                      <p className="mt-2 text-sm text-foreground/40 font-medium leading-relaxed">
                        {cat.tagline}
                      </p>
                      <div className="mt-5 flex items-center gap-2 text-blue text-sm font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        View bundles
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEMO SECTION ─── */}
      <section id="demo" className="relative py-32 md:py-40 px-6 overflow-hidden">
        <motion.div
          className="absolute -bottom-32 -left-40 w-[500px] h-[500px] bg-blue/[0.03] rounded-full blur-3xl pointer-events-none"
          style={{ y: useTransform(scrollYProgress, [0.2, 0.5], [80, -80]) }}
        />

        <div className="relative max-w-6xl mx-auto">
          <AnimateIn className="text-center mb-20">
            <p className="text-sm font-bold text-blue uppercase tracking-[0.2em] mb-5">
              See It In Action
            </p>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] leading-[0.95]">
              Real data.
              <br />
              <span className="text-blue">Real results.</span>
            </h2>
          </AnimateIn>

          <AnimateIn delay={0.15}>
            <div className="relative max-w-4xl mx-auto">
              <div className="rounded-2xl border-2 border-blue/10 overflow-hidden bg-white shadow-[0_20px_80px_rgba(0,85,255,0.08)]">
                {/* Fake browser bar */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-blue/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-foreground/10" />
                    <div className="w-3 h-3 rounded-full bg-foreground/10" />
                    <div className="w-3 h-3 rounded-full bg-foreground/10" />
                  </div>
                  <div className="flex-1 mx-4 h-7 rounded-lg bg-blue/[0.03] flex items-center px-3">
                    <span className="text-xs text-foreground/30 font-medium">leadhubdata.com/leads/contractors</span>
                  </div>
                </div>

                {/* Data preview table */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-extrabold">Contractor Leads</h4>
                      <p className="text-sm text-foreground/40 font-medium">Sample data — updated today</p>
                    </div>
                    <div className="px-3 py-1.5 bg-blue/5 rounded-full">
                      <span className="text-xs font-bold text-blue">LIVE DATA</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-blue/5">
                          <th className="text-left py-3 px-4 font-bold text-foreground/30 text-xs uppercase tracking-wider">Name</th>
                          <th className="text-left py-3 px-4 font-bold text-foreground/30 text-xs uppercase tracking-wider">Address</th>
                          <th className="text-left py-3 px-4 font-bold text-foreground/30 text-xs uppercase tracking-wider">Permit</th>
                          <th className="text-left py-3 px-4 font-bold text-foreground/30 text-xs uppercase tracking-wider">Value</th>
                          <th className="text-left py-3 px-4 font-bold text-foreground/30 text-xs uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "James ████████", addr: "1247 Oak Dr, Miami FL", permit: "Roof Replacement", value: "$18,500", date: "Apr 12" },
                          { name: "Maria ████████", addr: "892 Palm Ave, Tampa FL", permit: "HVAC Install", value: "$12,200", date: "Apr 12" },
                          { name: "Robert ████████", addr: "3301 Lake Rd, Orlando FL", permit: "Solar Panel", value: "$24,800", date: "Apr 11" },
                          { name: "Susan ████████", addr: "567 Bay St, Jacksonville FL", permit: "Plumbing", value: "$8,400", date: "Apr 11" },
                          { name: "Kevin ████████", addr: "2140 Pine Ln, Fort Lauderdale FL", permit: "Electrical", value: "$6,900", date: "Apr 10" },
                        ].map((row, i) => (
                          <motion.tr
                            key={i}
                            className="border-b border-blue/[0.03] hover:bg-blue/[0.02] transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                          >
                            <td className="py-3.5 px-4 font-semibold">{row.name}</td>
                            <td className="py-3.5 px-4 text-foreground/50">{row.addr}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 bg-blue/5 rounded-full text-xs font-bold text-blue">{row.permit}</span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-blue">{row.value}</td>
                            <td className="py-3.5 px-4 text-foreground/30">{row.date}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-xs text-foreground/30 font-medium">Showing 5 of 2,847 available leads</p>
                    <Link
                      href="/leads/contractors"
                      className="text-sm font-bold text-blue hover:text-blue-dark transition-colors"
                    >
                      View all bundles →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section id="reviews" className="relative py-32 md:py-40 px-6 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue/[0.03] rounded-full blur-3xl pointer-events-none"
          style={{ y: useTransform(scrollYProgress, [0.4, 0.7], [60, -60]) }}
        />

        <div className="relative max-w-6xl mx-auto">
          <AnimateIn className="text-center mb-6">
            <p className="text-sm font-bold text-blue uppercase tracking-[0.2em] mb-5">
              Reviews
            </p>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] leading-[0.95]">
              Don&apos;t take our word
              <br />
              <span className="text-blue">for it.</span>
            </h2>
          </AnimateIn>

          <AnimateIn className="text-center mb-16" delay={0.1}>
            <div className="inline-flex items-center gap-3 mt-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-blue" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-foreground/40 font-semibold text-sm">4.9 / 5 from 500+ customers</span>
            </div>
          </AnimateIn>

          {/* Reviews grid — 3 columns, staggered */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
            {reviews.map((review, i) => (
              <AnimateIn key={i} delay={i * 0.05}>
                <div className="break-inside-avoid rounded-2xl border-2 border-blue/5 p-7 hover:border-blue/15 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,85,255,0.06)] bg-white">
                  <div className="flex mb-3">
                    {[...Array(review.stars)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-blue" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground/70 text-sm leading-relaxed font-medium">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue">
                        {review.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-bold">{review.name}</div>
                      <div className="text-xs text-foreground/30 font-medium">{review.role}</div>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative py-32 md:py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue/[0.04] rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <AnimateIn>
            <h2 className="text-4xl md:text-7xl font-black tracking-[-0.03em] leading-[0.9]">
              READY TO
              <br />
              <span className="text-blue">START CLOSING?</span>
            </h2>
            <p className="mt-8 text-lg text-foreground/40 font-medium max-w-md mx-auto leading-relaxed">
              Pick your leads. Choose a bundle. Start closing deals tomorrow.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#choose"
                className="inline-flex items-center justify-center h-14 px-10 text-base font-bold text-white bg-blue rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,85,255,0.35)] hover:scale-105"
              >
                Browse Leads
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center h-14 px-10 text-base font-bold text-foreground border-2 border-foreground/10 rounded-full hover:border-blue hover:text-blue transition-all duration-300"
              >
                See Demo
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-6 border-t border-blue/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xs">L</span>
              </div>
              <span className="text-base font-extrabold tracking-tight">
                LEADHUB<span className="text-blue">DATA</span>
              </span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#choose" className="text-sm text-foreground/30 hover:text-blue transition-colors font-medium">Leads</a>
              <a href="#demo" className="text-sm text-foreground/30 hover:text-blue transition-colors font-medium">Demo</a>
              <a href="#reviews" className="text-sm text-foreground/30 hover:text-blue transition-colors font-medium">Reviews</a>
            </div>
            <p className="text-xs text-foreground/20 font-medium">
              © 2026 LeadHubData. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
