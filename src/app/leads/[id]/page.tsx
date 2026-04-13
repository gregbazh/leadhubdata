"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { leadCategories, type Bundle, type LeadCategory } from "@/lib/products";
import Link from "next/link";

const iconMap: Record<string, React.ReactNode> = {
  wrench: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
      <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
      <path d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
      <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  dollar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
      <path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  store: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
      <path d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.999 2.999 0 01.62-1.853L5.25 5.25A2.25 2.25 0 017.5 3h9a2.25 2.25 0 012.25 2.25l1.63 2.246A2.999 2.999 0 0121 9.349" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
      <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

function BundleCard({
  bundle,
  category,
  selected,
  onSelect,
}: {
  bundle: Bundle;
  category: LeadCategory;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      className={`relative w-full text-left p-6 md:p-8 border-2 transition-all duration-300 ${
        selected
          ? "border-[#0055FF] bg-[#0055FF]/[0.02] shadow-[0_8px_40px_rgba(0,85,255,0.1)]"
          : "border-[#0a0a0a]/5 bg-white hover:border-[#0a0a0a]/15"
      }`}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 92% 100%, 0 100%)" }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      {bundle.popular && (
        <div
          className="absolute top-0 right-0 px-3 py-1 bg-[#0055FF] text-white text-[10px] font-bold uppercase tracking-widest"
          style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }}
        >
          Best Value
        </div>
      )}

      {selected && (
        <motion.div
          className="absolute top-4 right-4 w-6 h-6 bg-[#0055FF] flex items-center justify-center"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}

      <div className="text-xs font-bold text-[#0a0a0a]/30 uppercase tracking-widest">
        {bundle.label}
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-black tracking-tight text-[#0a0a0a]">
          {bundle.leads.toLocaleString()}
        </span>
        <span className="text-sm font-bold text-[#0a0a0a]/30">leads</span>
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-2xl font-black text-[#0055FF]">
          ${bundle.price}
        </span>
        <span className="text-sm font-semibold text-[#0a0a0a]/30">
          one-time
        </span>
      </div>

      <div className="mt-2 text-sm font-semibold text-[#0a0a0a]/40">
        ${bundle.pricePerLead.toFixed(2)} per lead
      </div>

      {bundle.leads >= 500 && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold"
          style={{ clipPath: "polygon(0 0, 100% 0, 96% 100%, 0 100%)" }}
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Save {Math.round((1 - bundle.pricePerLead / category.bundles[0].pricePerLead) * 100)}%
        </div>
      )}
    </motion.button>
  );
}

export default function LeadCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const category = leadCategories.find((c) => c.id === categoryId);
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-black text-[#0a0a0a]">Category not found</h1>
          <Link href="/" className="mt-4 inline-block text-[#0055FF] font-bold hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const selected = category.bundles.find((b) => b.id === selectedBundle);

  async function handleCheckout() {
    if (!selectedBundle) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundleId: selectedBundle }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0055FF] flex items-center justify-center" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)" }}>
              <span className="text-white font-black text-sm">L</span>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-[#0a0a0a]">
              LEADHUB<span className="text-[#0055FF]">DATA</span>
            </span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-[#0a0a0a]/60 hover:text-[#0a0a0a] transition-colors">
            ← All Categories
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a0a0a]/40 hover:text-[#0055FF] transition-colors mb-6"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All Lead Categories
            </Link>

            <div className="flex items-start gap-5">
              <div
                className="w-16 h-16 bg-[#0055FF] text-white flex items-center justify-center shrink-0"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)" }}
              >
                {iconMap[category.icon]}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-[-0.02em] text-[#0a0a0a]">
                  {category.name}
                </h1>
                <p className="mt-1 text-lg font-semibold text-[#0a0a0a]/40">
                  {category.tagline}
                </p>
              </div>
            </div>

            <p className="mt-6 text-lg text-[#0a0a0a]/50 font-medium max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Data fields preview */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-xs font-bold text-[#0a0a0a]/30 uppercase tracking-widest mb-4">
              Data Fields Included
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.fields.map((field) => (
                <span
                  key={field}
                  className="px-3 py-1.5 bg-[#F5F7FA] text-sm font-semibold text-[#0a0a0a]/60 border border-[#0a0a0a]/5"
                  style={{ clipPath: "polygon(0 0, 100% 0, 97% 100%, 0 100%)" }}
                >
                  {field}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bundle selection */}
      <section className="py-12 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.02em] text-[#0a0a0a]">
              Choose your bundle
            </h2>
            <p className="mt-2 text-[#0a0a0a]/40 font-medium">
              One-time purchase. Delivered within 24 hours. No subscription required.
            </p>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {category.bundles.map((bundle, i) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <BundleCard
                  bundle={bundle}
                  category={category}
                  selected={selectedBundle === bundle.id}
                  onSelect={() => setSelectedBundle(bundle.id)}
                />
              </motion.div>
            ))}
          </div>

          {/* Checkout bar */}
          <motion.div
            className={`mt-8 p-6 md:p-8 border-2 transition-all duration-300 ${
              selected ? "border-[#0055FF] bg-[#0055FF]/[0.02]" : "border-[#0a0a0a]/5 bg-[#F5F7FA]"
            }`}
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 98% 100%, 0 100%)" }}
            layout
          >
            {selected ? (
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="text-sm font-bold text-[#0a0a0a]/30 uppercase tracking-widest">
                    Your Order
                  </div>
                  <div className="mt-2 text-2xl font-black text-[#0a0a0a]">
                    {selected.leads.toLocaleString()} {category.name}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[#0a0a0a]/40">
                    ${selected.pricePerLead.toFixed(2)}/lead — Delivered within 24hrs as CSV
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-3xl font-black text-[#0055FF]">
                      ${selected.price}
                    </div>
                    <div className="text-xs font-semibold text-[#0a0a0a]/30">one-time</div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="h-14 px-8 bg-[#0055FF] text-white font-bold text-base hover:bg-[#0033CC] transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 65%, 90% 100%, 0 100%)" }}
                  >
                    {loading ? "Processing..." : "Buy Now →"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-lg font-semibold text-[#0a0a0a]/30">
                  Select a bundle above to continue
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-12 px-6 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "24hr Delivery",
                desc: "Leads delivered to your inbox within 24 hours of purchase.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                    <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                title: "Verified Data",
                desc: "Every lead is verified for accuracy before delivery.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                    <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                title: "Replacement Guarantee",
                desc: "Bad leads? We replace them. No questions asked.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                    <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 bg-white border border-[#0a0a0a]/5"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%)" }}
              >
                <div
                  className="w-10 h-10 bg-[#0055FF]/5 text-[#0055FF] flex items-center justify-center"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)" }}
                >
                  {item.icon}
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-[#0a0a0a]">{item.title}</h3>
                <p className="mt-1 text-sm text-[#0a0a0a]/40 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0055FF] flex items-center justify-center" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)" }}>
              <span className="text-white font-black text-[10px]">L</span>
            </div>
            <span className="text-sm font-extrabold tracking-tight text-white">
              LEADHUB<span className="text-[#0055FF]">DATA</span>
            </span>
          </div>
          <p className="text-xs text-white/20 font-medium">© 2026 LeadHubData</p>
        </div>
      </footer>
    </div>
  );
}
