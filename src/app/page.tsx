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
import Lenis from "lenis";
import { leadCategories as productCategories } from "@/lib/products";

/* ─── LENIS SMOOTH SCROLL ─── */
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);
}

/* ─── ANIMATE ON SCROLL ─── */
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

/* ─── DISTINCT ICONS PER CATEGORY ─── */
function ContractorIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
      <rect x="4" y="26" width="32" height="10" rx="2" fill="currentColor" opacity="0.15" />
      <rect x="8" y="18" width="24" height="10" rx="1" fill="currentColor" opacity="0.25" />
      <path d="M20 4L6 18h28L20 4z" fill="currentColor" opacity="0.9" />
      <rect x="16" y="28" width="8" height="8" rx="1" fill="currentColor" opacity="0.5" />
      <circle cx="20" cy="12" r="2" fill="white" />
    </svg>
  );
}

function RealEstateIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
      <rect x="3" y="12" width="16" height="24" rx="2" fill="currentColor" opacity="0.9" />
      <rect x="21" y="6" width="16" height="30" rx="2" fill="currentColor" opacity="0.6" />
      <rect x="6" y="16" width="4" height="4" rx="0.5" fill="white" opacity="0.7" />
      <rect x="12" y="16" width="4" height="4" rx="0.5" fill="white" opacity="0.7" />
      <rect x="6" y="24" width="4" height="4" rx="0.5" fill="white" opacity="0.7" />
      <rect x="12" y="24" width="4" height="4" rx="0.5" fill="white" opacity="0.7" />
      <rect x="24" y="10" width="4" height="4" rx="0.5" fill="white" opacity="0.5" />
      <rect x="30" y="10" width="4" height="4" rx="0.5" fill="white" opacity="0.5" />
      <rect x="24" y="18" width="4" height="4" rx="0.5" fill="white" opacity="0.5" />
      <rect x="30" y="18" width="4" height="4" rx="0.5" fill="white" opacity="0.5" />
      <rect x="24" y="26" width="4" height="4" rx="0.5" fill="white" opacity="0.5" />
      <rect x="30" y="26" width="4" height="4" rx="0.5" fill="white" opacity="0.5" />
    </svg>
  );
}

function InsuranceIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
      <path d="M20 2L4 10v12c0 9 7 15 16 18 9-3 16-9 16-18V10L20 2z" fill="currentColor" opacity="0.15" />
      <path d="M20 6L8 12v10c0 7 5.5 12 12 14.5 6.5-2.5 12-7.5 12-14.5V12L20 6z" fill="currentColor" opacity="0.9" />
      <path d="M17 20l3 3 6-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MortgageIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
      <circle cx="20" cy="20" r="16" fill="currentColor" opacity="0.15" />
      <circle cx="20" cy="20" r="12" fill="currentColor" opacity="0.9" />
      <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="900" fontFamily="system-ui">$</text>
    </svg>
  );
}

function NewBusinessIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
      <rect x="4" y="14" width="32" height="22" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="8" y="18" width="24" height="14" rx="2" fill="currentColor" opacity="0.9" />
      <rect x="14" y="8" width="12" height="10" rx="2" fill="currentColor" opacity="0.6" />
      <path d="M18 8V6a2 2 0 012-2h0a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" opacity="0.9" />
      <circle cx="20" cy="25" r="3" fill="white" opacity="0.7" />
    </svg>
  );
}

function AutomotiveIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
      <rect x="2" y="16" width="36" height="14" rx="4" fill="currentColor" opacity="0.9" />
      <path d="M8 16l3-8h18l3 8" fill="currentColor" opacity="0.4" />
      <circle cx="10" cy="30" r="4" fill="currentColor" opacity="0.15" />
      <circle cx="10" cy="30" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="30" cy="30" r="4" fill="currentColor" opacity="0.15" />
      <circle cx="30" cy="30" r="2.5" fill="currentColor" opacity="0.7" />
      <rect x="6" y="20" width="6" height="3" rx="1" fill="white" opacity="0.5" />
      <rect x="28" y="20" width="6" height="3" rx="1" fill="white" opacity="0.5" />
      <rect x="15" y="20" width="10" height="3" rx="1" fill="white" opacity="0.3" />
    </svg>
  );
}

const categoryIcons: Record<string, React.ReactNode> = {
  contractors: <ContractorIcon />,
  realestate: <RealEstateIcon />,
  insurance: <InsuranceIcon />,
  mortgage: <MortgageIcon />,
  newbusiness: <NewBusinessIcon />,
  automotive: <AutomotiveIcon />,
};

/* ─── NAV DROPDOWN ICONS (smaller) ─── */
const navIcons: Record<string, React.ReactNode> = {
  contractors: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 3L3 11h18L12 3z" fill="currentColor" opacity="0.8" />
      <rect x="5" y="11" width="14" height="9" rx="1" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  realestate: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <rect x="2" y="7" width="9" height="14" rx="1" fill="currentColor" opacity="0.8" />
      <rect x="13" y="3" width="9" height="18" rx="1" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  insurance: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2L4 6v6c0 5.5 3.5 9 8 11 4.5-2 8-5.5 8-11V6l-8-4z" fill="currentColor" opacity="0.8" />
      <path d="M9 12l2 2 4-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  mortgage: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.8" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="system-ui">$</text>
    </svg>
  ),
  newbusiness: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <rect x="3" y="9" width="18" height="12" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="8" y="5" width="8" height="6" rx="1" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  automotive: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <rect x="1" y="10" width="22" height="8" rx="3" fill="currentColor" opacity="0.8" />
      <path d="M5 10l2-5h10l2 5" fill="currentColor" opacity="0.4" />
      <circle cx="6" cy="18" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="18" cy="18" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  ),
};

/* ─── REVIEWS DATA ─── */
const reviews = [
  { name: "Marcus T.", role: "Insurance Agency Owner", text: "Switched from another lead provider 3 months ago. The data quality is night and day. We went from a 2% close rate to almost 9%. Worth every penny.", stars: 5 },
  { name: "Jennifer L.", role: "Mortgage Broker", text: "I was skeptical at first but decided to try the starter pack. Got 3 closed loans from 50 leads in the first week. Already ordered the enterprise bundle.", stars: 5 },
  { name: "David R.", role: "Real Estate Investor", text: "The motivated seller leads are legit. These are actual distressed properties, not recycled lists from 2019. I've done 4 deals this month from their data.", stars: 5 },
  { name: "Sarah K.", role: "Roofing Contractor", text: "Building permit leads changed our business. Instead of door knocking random neighborhoods, we're calling homeowners who literally just filed for roof work. Game changer.", stars: 5 },
  { name: "Michael P.", role: "Commercial Auto Insurance", text: "We buy the 5,000 pack every month. At $0.20 per lead it's basically free compared to what we were paying. The DOT data is always fresh and accurate.", stars: 5 },
  { name: "Rachel W.", role: "Business Services Consultant", text: "New business filing leads are gold. These companies just incorporated and need EVERYTHING — insurance, payroll, websites, accounting. Easy conversations.", stars: 5 },
  { name: "Anthony G.", role: "Solar Sales Manager", text: "My team was struggling with aged leads from other vendors. LeadHubData sends us homeowners with active permits. Our reps are actually excited to make calls now.", stars: 4 },
  { name: "Lisa M.", role: "Health Insurance Agent", text: "The data is clean. No disconnected numbers, no wrong emails. I can actually focus on selling instead of cleaning up garbage spreadsheets.", stars: 5 },
  { name: "Carlos D.", role: "HVAC Company Owner", text: "Tried the 200-lead pack for our HVAC business. Booked 14 appointments the first week. My install crew is fully booked through next month.", stars: 5 },
  { name: "Nicole F.", role: "Loan Officer", text: "I've used 4 different lead companies in the past year. This is the only one where the phone numbers actually work and people pick up. Not even close to the others.", stars: 5 },
  { name: "Brandon H.", role: "Fleet Insurance Specialist", text: "The commercial auto leads with fleet size data let me prioritize the big accounts. Closed a 47-truck fleet policy last week from their list.", stars: 5 },
  { name: "Amanda S.", role: "Property Manager", text: "We use the real estate leads to find new properties to manage. Owner contact info is always accurate. Saves us hours of skip tracing.", stars: 4 },
];

/* ─── COUNTER ANIMATION ─── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * target);
      setCount(start);
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── MAIN PAGE ─── */
export default function Home() {
  const [leadsOpen, setLeadsOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -60]);

  useSmoothScroll();

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
            <div className="w-8 h-8 bg-blue rounded-lg flex items-center justify-center shadow-[0_2px_10px_rgba(0,85,255,0.3)]">
              <span className="text-white font-black text-sm">L</span>
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              LEADHUB<span className="text-blue">DATA</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLeadsOpen(!leadsOpen)}
                className="flex items-center gap-1 text-sm font-bold text-foreground/60 hover:text-blue transition-colors"
              >
                LEADS
                <svg className={`w-4 h-4 transition-transform duration-200 ${leadsOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              <AnimatePresence>
                {leadsOpen && (
                  <motion.div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,85,255,0.15)] border border-blue/10 overflow-hidden"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {productCategories.map((cat) => (
                      <Link key={cat.id} href={`/leads/${cat.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-blue/5 transition-colors group">
                        <div className="w-9 h-9 rounded-lg bg-blue/10 flex items-center justify-center text-blue group-hover:bg-blue group-hover:text-white transition-all duration-200">
                          {navIcons[cat.id]}
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

            <a href="#demo" className="text-sm font-bold text-foreground/60 hover:text-blue transition-colors">DEMO</a>
            <a href="#reviews" className="text-sm font-bold text-foreground/60 hover:text-blue transition-colors">REVIEWS</a>
            <Link href="#choose" className="text-sm font-bold text-white bg-blue px-6 py-2.5 rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)]">
              Get Leads
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle, #0055FF 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          <motion.div
            className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,85,255,0.08) 0%, transparent 70%)" }}
            animate={{ y: [0, -40, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,85,255,0.06) 0%, transparent 70%)" }}
            animate={{ y: [0, 30, 0], x: [0, -25, 0], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,85,255,0.05) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Decorative blue lines */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(0,85,255,0.2), transparent)" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-32"
          style={{ background: "linear-gradient(to right, transparent, rgba(0,85,255,0.15), transparent)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        />
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 h-px w-32"
          style={{ background: "linear-gradient(to left, transparent, rgba(0,85,255,0.15), transparent)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroY }} className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-blue/5 border border-blue/10 mb-12"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue" />
            </span>
            <span className="text-sm font-semibold text-blue tracking-wide">DELIVERING 50,000+ FRESH LEADS WEEKLY</span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-[-0.05em] leading-[0.85]"
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              WE SELL THE
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-[-0.05em] leading-[0.85] text-blue"
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              BEST LEADS.
            </motion.h1>
          </div>

          <motion.p
            className="mt-10 text-lg md:text-xl text-foreground/35 max-w-lg mx-auto font-medium leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Fresh. Verified. Exclusive. Sourced from public records daily.
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#choose"
          className="absolute bottom-10 z-10 flex flex-col items-center gap-3 cursor-pointer group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue/40 group-hover:text-blue transition-colors">Scroll</span>
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-blue/20 flex items-start justify-center p-1.5 group-hover:border-blue/40 transition-colors"
            animate={{}}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-blue"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.a>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue/15 to-transparent" />
      </section>

      {/* ─── CHOOSE YOUR LEADS ─── */}
      <section id="choose" className="relative py-32 md:py-44 px-6 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,85,255,0.04) 0%, transparent 70%)",
            y: useTransform(scrollYProgress, [0.08, 0.35], [120, -120]),
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <AnimateIn className="text-center mb-20">
            <p className="text-sm font-bold text-blue uppercase tracking-[0.25em] mb-5">Choose Your Leads</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[0.9]">
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
                    className="group relative rounded-2xl cursor-pointer overflow-hidden"
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Blue gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue via-blue-dark to-[#0022AA] opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Animated shimmer on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{
                        background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 2s infinite",
                      }}
                    />

                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-blue/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                    <div className="relative p-8 md:p-9">
                      <div className="w-16 h-16 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white mb-6 group-hover:bg-white/25 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
                        {categoryIcons[cat.id]}
                      </div>
                      <h3 className="text-xl font-extrabold text-white tracking-tight">
                        {cat.name}
                      </h3>
                      <p className="mt-2 text-sm text-white/60 font-medium leading-relaxed">
                        {cat.tagline}
                      </p>

                      <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                          From ${cat.bundles[0].price}
                        </span>
                        <div className="flex items-center gap-1.5 text-white text-sm font-bold opacity-60 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
                          View
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimateIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
              {[
                { value: 2000000, suffix: "+", label: "Leads Delivered" },
                { value: 98, suffix: "%", label: "Data Accuracy" },
                { value: 500, suffix: "+", label: "Happy Clients" },
                { value: 50, suffix: "+", label: "Data Sources" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-blue tracking-tight">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-2 text-sm font-semibold text-foreground/25 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── DEMO ─── */}
      <section id="demo" className="relative py-32 md:py-44 px-6 overflow-hidden">
        <motion.div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,85,255,0.04) 0%, transparent 70%)",
            y: useTransform(scrollYProgress, [0.2, 0.5], [100, -100]),
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <AnimateIn className="text-center mb-20">
            <p className="text-sm font-bold text-blue uppercase tracking-[0.25em] mb-5">See It In Action</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[0.9]">
              Real data.
              <br />
              <span className="text-blue">Real results.</span>
            </h2>
          </AnimateIn>

          <AnimateIn delay={0.15}>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute -inset-4 bg-blue/5 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl border border-blue/10 overflow-hidden bg-white shadow-[0_30px_100px_rgba(0,85,255,0.1)]">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-blue/5 bg-blue/[0.02]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-blue/10" />
                    <div className="w-3 h-3 rounded-full bg-blue/10" />
                    <div className="w-3 h-3 rounded-full bg-blue/10" />
                  </div>
                  <div className="flex-1 mx-4 h-7 rounded-lg bg-blue/[0.03] flex items-center px-3">
                    <span className="text-xs text-foreground/30 font-medium">leadhubdata.com/leads/contractors</span>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-extrabold">Contractor Leads</h4>
                      <p className="text-sm text-foreground/40 font-medium">Sample data — updated today</p>
                    </div>
                    <div className="px-3 py-1.5 bg-blue/5 rounded-full flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue" />
                      </span>
                      <span className="text-xs font-bold text-blue">LIVE</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto -mx-2">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-blue/5">
                          {["Name", "Address", "Permit", "Value", "Date"].map((h) => (
                            <th key={h} className="text-left py-3 px-4 font-bold text-foreground/25 text-xs uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "James ████████", addr: "1247 Oak Dr, Miami FL", permit: "Roof Replacement", value: "$18,500", date: "Apr 12" },
                          { name: "Maria ████████", addr: "892 Palm Ave, Tampa FL", permit: "HVAC Install", value: "$12,200", date: "Apr 12" },
                          { name: "Robert ████████", addr: "3301 Lake Rd, Orlando FL", permit: "Solar Panel", value: "$24,800", date: "Apr 11" },
                          { name: "Susan ████████", addr: "567 Bay St, Jacksonville FL", permit: "Plumbing", value: "$8,400", date: "Apr 11" },
                          { name: "Kevin ████████", addr: "2140 Pine Ln, Ft Lauderdale FL", permit: "Electrical", value: "$6,900", date: "Apr 10" },
                        ].map((row, i) => (
                          <motion.tr
                            key={i}
                            className="border-b border-blue/[0.03] hover:bg-blue/[0.02] transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                          >
                            <td className="py-3.5 px-4 font-semibold">{row.name}</td>
                            <td className="py-3.5 px-4 text-foreground/50">{row.addr}</td>
                            <td className="py-3.5 px-4"><span className="px-2.5 py-1 bg-blue/5 rounded-full text-xs font-bold text-blue">{row.permit}</span></td>
                            <td className="py-3.5 px-4 font-bold text-blue">{row.value}</td>
                            <td className="py-3.5 px-4 text-foreground/30">{row.date}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-xs text-foreground/25 font-medium">Showing 5 of 2,847 available leads</p>
                    <Link href="/leads/contractors" className="text-sm font-bold text-blue hover:text-blue-dark transition-colors">
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
      <section id="reviews" className="relative py-32 md:py-44 px-6 overflow-hidden">
        <motion.div
          className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,85,255,0.04) 0%, transparent 70%)",
            y: useTransform(scrollYProgress, [0.45, 0.75], [80, -80]),
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <AnimateIn className="text-center mb-6">
            <p className="text-sm font-bold text-blue uppercase tracking-[0.25em] mb-5">Reviews</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[0.9]">
              Don&apos;t take our word
              <br />
              <span className="text-blue">for it.</span>
            </h2>
          </AnimateIn>

          <AnimateIn className="text-center mb-16" delay={0.1}>
            <div className="inline-flex items-center gap-3 mt-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-blue" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-foreground/30 font-semibold text-sm">4.9 / 5 from 500+ customers</span>
            </div>
          </AnimateIn>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
            {reviews.map((review, i) => (
              <AnimateIn key={i} delay={i * 0.04}>
                <motion.div
                  className="break-inside-avoid rounded-2xl border border-blue/8 p-7 bg-white transition-all duration-300 hover:border-blue/20 hover:shadow-[0_15px_50px_rgba(0,85,255,0.08)]"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex mb-3">
                    {[...Array(review.stars)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-blue" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground/60 text-sm leading-relaxed font-medium">&ldquo;{review.text}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue to-blue-dark flex items-center justify-center shadow-[0_2px_8px_rgba(0,85,255,0.3)]">
                      <span className="text-xs font-bold text-white">{review.name.split(" ").map((n) => n[0]).join("")}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold">{review.name}</div>
                      <div className="text-xs text-foreground/30 font-medium">{review.role}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-32 md:py-44 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,85,255,0.06) 0%, transparent 60%)" }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <AnimateIn>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] leading-[0.85]">
              READY TO
              <br />
              <span className="text-blue">START CLOSING?</span>
            </h2>
            <p className="mt-8 text-lg text-foreground/35 font-medium max-w-md mx-auto leading-relaxed">
              Pick your leads. Choose a bundle. Start closing deals tomorrow.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#choose"
                className="inline-flex items-center justify-center h-14 px-10 text-base font-bold text-white bg-blue rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,85,255,0.35)] hover:scale-105"
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
              <a href="#choose" className="text-sm text-foreground/25 hover:text-blue transition-colors font-medium">Leads</a>
              <a href="#demo" className="text-sm text-foreground/25 hover:text-blue transition-colors font-medium">Demo</a>
              <a href="#reviews" className="text-sm text-foreground/25 hover:text-blue transition-colors font-medium">Reviews</a>
            </div>
            <p className="text-xs text-foreground/15 font-medium">© 2026 LeadHubData</p>
          </div>
        </div>
      </footer>

      {/* Shimmer keyframe */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
