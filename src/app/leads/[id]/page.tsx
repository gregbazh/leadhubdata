"use client";

import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { leadCategories, type Plan, type LeadCategory } from "@/lib/products";
import Link from "next/link";

const iconMap: Record<string, React.ReactNode> = {
  wrench: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path d="M2.25 21h19.5M3.75 21V7.5L12 3l8.25 4.5V21M8.25 21V13.5h7.5V21M8.25 10.5h.008v.008H8.25V10.5zm3.75 0h.008v.008H12V10.5zm3.75 0h.008v.008h-.008V10.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  dollar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  store: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

function PlanCard({
  plan,
  category,
  selected,
  onSelect,
}: {
  plan: Plan;
  category: LeadCategory;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      className={`relative w-full text-left p-6 md:p-7 rounded-2xl border-2 transition-all duration-300 ${
        selected
          ? "border-blue bg-blue/[0.03] shadow-[0_8px_40px_rgba(0,85,255,0.12)]"
          : "border-blue/8 bg-white hover:border-blue/20 hover:shadow-[0_10px_40px_rgba(0,85,255,0.06)]"
      }`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-6 px-3 py-1 bg-blue text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-[0_4px_12px_rgba(0,85,255,0.3)]">
          Most Popular
        </div>
      )}

      {selected && (
        <motion.div
          className="absolute top-5 right-5 w-6 h-6 bg-blue rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}

      <div className="text-xs font-bold text-foreground/30 uppercase tracking-[0.2em]">
        {plan.name}
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-black tracking-tight text-foreground">
          ${plan.price}
        </span>
        <span className="text-sm font-semibold text-foreground/30">/mo</span>
      </div>

      <div className="mt-1 text-sm font-semibold text-blue">
        {plan.leadsPerMonth.toLocaleString()} leads/month
      </div>

      <div className="mt-1 text-xs font-medium text-foreground/30">
        ${plan.pricePerLead.toFixed(2)} per lead
      </div>

      <div className="mt-5 pt-5 border-t border-blue/8 space-y-2.5">
        {plan.features.map((feat) => (
          <div key={feat} className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-medium text-foreground/50">{feat}</span>
          </div>
        ))}
      </div>

      {plan.leadsPerMonth >= 1000 && (
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Save {Math.round((1 - plan.pricePerLead / category.plans[0].pricePerLead) * 100)}%
        </div>
      )}
    </motion.button>
  );
}

export default function LeadCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const category = leadCategories.find((c) => c.id === categoryId);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-black text-foreground">Category not found</h1>
          <Link href="/" className="mt-4 inline-block text-blue font-bold hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const selected = category.plans.find((p) => p.id === selectedPlan);

  async function handleSubscribe() {
    if (!selectedPlan) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-blue/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue rounded-lg flex items-center justify-center shadow-[0_2px_10px_rgba(0,85,255,0.3)]">
              <span className="text-white font-black text-sm">L</span>
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              LEADHUB<span className="text-blue">DATA</span>
            </span>
          </Link>
          <Link href="/" className="text-sm font-bold text-foreground/40 hover:text-blue transition-colors">
            ← All Categories
          </Link>
        </div>
      </motion.nav>

      {/* Hero header */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: "radial-gradient(circle, #0055FF 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          <div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,85,255,0.06) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/30 hover:text-blue transition-colors mb-8"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All Lead Categories
            </Link>

            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-blue/8 border border-blue/15 rounded-2xl text-blue flex items-center justify-center shrink-0">
                {iconMap[category.icon]}
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-black tracking-[-0.04em] text-foreground leading-[0.9]">
                  {category.name}
                </h1>
                <p className="mt-3 text-lg font-medium text-foreground/35">
                  {category.tagline}
                </p>
              </div>
            </div>

            <p className="mt-8 text-lg text-foreground/40 font-medium max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Data fields */}
      <section className="pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-xs font-bold text-blue uppercase tracking-[0.25em] mb-4">
              Data Fields Included
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.fields.map((field) => (
                <span
                  key={field}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold bg-blue/5 text-blue/60 border border-blue/8"
                >
                  {field}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plan selection */}
      <section className="py-14 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-bold text-blue uppercase tracking-[0.25em] mb-4">Pricing</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.04em] text-foreground leading-[0.9]">
              Choose your <span className="text-blue">plan</span>
            </h2>
            <p className="mt-4 text-foreground/35 font-medium">
              Monthly subscription. Fresh leads delivered every month. Cancel anytime.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {category.plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <PlanCard
                  plan={plan}
                  category={category}
                  selected={selectedPlan === plan.id}
                  onSelect={() => setSelectedPlan(plan.id)}
                />
              </motion.div>
            ))}
          </div>

          {/* Subscribe bar */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected ? selected.id : "empty"}
              className={`mt-10 p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 ${
                selected ? "border-blue bg-blue/[0.02]" : "border-blue/8 bg-blue/[0.01]"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              {selected ? (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="text-xs font-bold text-blue uppercase tracking-[0.25em]">
                      Your Subscription
                    </div>
                    <div className="mt-2 text-2xl font-black text-foreground">
                      {selected.leadsPerMonth.toLocaleString()} {category.name} / month
                    </div>
                    <div className="mt-1 text-sm font-medium text-foreground/35">
                      ${selected.pricePerLead.toFixed(2)}/lead — Fresh CSV delivered monthly
                    </div>
                  </div>
                  <div className="flex items-center gap-5 shrink-0">
                    <div className="text-right">
                      <div className="text-3xl font-black text-blue">
                        ${selected.price}<span className="text-base font-semibold text-foreground/30">/mo</span>
                      </div>
                      <div className="text-xs font-medium text-foreground/25">cancel anytime</div>
                    </div>
                    <button
                      onClick={handleSubscribe}
                      disabled={loading}
                      className="h-14 px-8 bg-blue text-white font-bold text-base rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? "Processing..." : "Subscribe Now →"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-lg font-semibold text-foreground/25">
                    Select a plan above to continue
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-14 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "Fresh Monthly Data",
                desc: "New leads scraped and verified every month. Never recycled, never stale.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                    <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                title: "Verified & Accurate",
                desc: "Every lead is verified for accuracy before delivery. 98%+ contact rate.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                    <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                title: "Cancel Anytime",
                desc: "No contracts, no commitments. Pause or cancel your subscription whenever.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                    <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-7 rounded-2xl border border-blue/8 bg-white hover:border-blue/15 hover:shadow-[0_10px_40px_rgba(0,85,255,0.05)] transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-blue/8 border border-blue/12 text-blue flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-foreground tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm text-foreground/40 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 md:py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold text-blue uppercase tracking-[0.25em] mb-4">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.04em] text-foreground leading-[0.9] mb-10">
            Common <span className="text-blue">questions</span>
          </h2>
          <div className="space-y-4">
            {[
              { q: "How are leads delivered?", a: "Leads are delivered as a clean CSV file to the email on your account within 24 hours of each billing cycle." },
              { q: "Where does the data come from?", a: "All data is sourced from public government records — building permits, Secretary of State filings, FMCSA databases, county records, and more." },
              { q: "Can I cancel my subscription?", a: "Yes, you can cancel anytime from your account portal. No contracts, no cancellation fees." },
              { q: "What if I get bad leads?", a: "We replace any leads with invalid contact info. Our data is verified before delivery with a 98%+ accuracy rate." },
              { q: "Can I filter by state or region?", a: "Yes — Growth plans and above include custom geographic and demographic filters." },
            ].map((faq) => (
              <div key={faq.q} className="p-6 rounded-2xl border border-blue/8 hover:border-blue/15 transition-colors">
                <h4 className="text-base font-bold text-foreground">{faq.q}</h4>
                <p className="mt-2 text-sm text-foreground/40 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 md:py-12 px-6 border-t border-blue/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">L</span>
            </div>
            <span className="text-base font-extrabold tracking-tight">
              LEADHUB<span className="text-blue">DATA</span>
            </span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm text-foreground/25 hover:text-blue transition-colors font-medium">Home</Link>
            <Link href="/#demo" className="text-sm text-foreground/25 hover:text-blue transition-colors font-medium">Demo</Link>
            <Link href="/#reviews" className="text-sm text-foreground/25 hover:text-blue transition-colors font-medium">Reviews</Link>
          </div>
          <p className="text-xs text-foreground/15 font-medium">© 2026 LeadHubData</p>
        </div>
      </footer>
    </div>
  );
}
