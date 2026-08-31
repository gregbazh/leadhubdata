"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { oneTimeProducts } from "@/lib/products";
import SampleForm from "@/app/sample-form";
import SiteFooter from "@/components/site-footer";
import { captureAttribution, readAttribution } from "@/lib/attribution";
import { restaurantFaqs } from "@/lib/seo";

const product = oneTimeProducts.find((p) => p.id === "fl-restaurants")!;
const faqs = restaurantFaqs(product);

// Every figure below is measured from the deliverable, not estimated. If the
// file is rebuilt, re-check these before shipping copy that cites them.
const UNIQUE_EMAILS = 7833;
const WITH_PHONE = 9724;
const COUNTIES = 67;
const MIX = [
  { label: "Mobile food vehicles", count: 4197 },
  { label: "Seating restaurants", count: 3184 },
  { label: "Not specified on filing", count: 1645 },
  { label: "Hot dog carts", count: 301 },
  { label: "Non-seating", count: 301 },
  { label: "Catering", count: 175 },
  { label: "Theme park", count: 3 },
];

export default function FlRestaurantsPage() {
  const [loading, setLoading] = useState(false);

  useEffect(captureAttribution, []);

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, attribution: readAttribution() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return; // keep the button in its loading state during navigation
      }
      alert("Checkout couldn't start. Please try again in a moment.");
      setLoading(false);
    } catch {
      alert("Something went wrong. Please try again.");
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
          <button
            onClick={handleBuy}
            disabled={loading}
            className="h-10 px-6 bg-blue text-white text-sm font-bold rounded-full hover:bg-blue-dark transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "..." : `Buy Now — $${product.price}`}
          </button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative pt-28 pb-14 md:pt-40 md:pb-20 px-6 overflow-hidden">
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

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue/5 border border-blue/15 text-blue text-sm font-bold">
              An email address on every single row
            </div>

            <h1 className="mt-8 text-5xl md:text-7xl font-black tracking-[-0.04em] text-foreground leading-[0.9]">
              {product.leadCount.toLocaleString()}
              <br />
              <span className="text-blue">FL food businesses</span>
              <br />
              newly licensed
            </h1>

            <p className="mt-8 text-lg md:text-xl text-foreground/60 font-medium max-w-2xl mx-auto leading-relaxed">
              {product.description}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleBuy}
                disabled={loading}
                className="h-14 px-10 bg-blue text-white font-bold text-base rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? "Processing..." : `Get Instant Access — $${product.price}`}
              </button>
              <span className="text-sm font-semibold text-foreground/45">
                One-time purchase · Instant CSV download · No subscription
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="pb-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { big: product.leadCount.toLocaleString(), small: "food businesses, all with an email" },
            { big: WITH_PHONE.toLocaleString(), small: "also carry a phone number" },
            { big: `${COUNTIES}`, small: "Florida counties covered" },
          ].map((stat, i) => (
            <motion.div
              key={stat.small}
              className="p-7 rounded-2xl border border-blue/8 bg-white text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-3xl font-black text-blue tracking-tight">{stat.big}</div>
              <div className="mt-2 text-sm font-medium text-foreground/55">{stat.small}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="py-14 md:py-20 px-6 bg-blue/[0.015] border-y border-blue/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-blue uppercase tracking-[0.25em] mb-4">Why this list</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.04em] text-foreground leading-[0.95] max-w-3xl">
            New filings create <span className="text-blue">timely business conversations</span>
          </h2>
          <p className="mt-6 text-lg text-foreground/60 font-medium max-w-2xl leading-relaxed">
            New and remodeled food businesses often evaluate insurance, payments, payroll,
            equipment, marketing, and other operating services. Needs vary by business.
            The application date and status columns help teams identify a relevant segment
            without treating a public filing as proof of purchase intent.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "Reachable by email",
                desc: `Every row has the contact address from the state filing — ${UNIQUE_EMAILS.toLocaleString()} unique inboxes. No enrichment guesswork.`,
              },
              {
                title: "Newest first",
                desc: "Sorted by filing date, most recent at the top. Roughly 500 new businesses file every month.",
              },
              {
                title: "Statewide",
                desc: `All ${COUNTIES} Florida counties, from Miami-Dade food trucks to Panhandle diners. Filter to your territory in seconds.`,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-7 rounded-2xl border border-blue/8 bg-white hover:border-blue/15 hover:shadow-[0_10px_40px_rgba(0,85,255,0.05)] transition-all duration-300"
              >
                <h3 className="text-lg font-extrabold text-foreground tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm text-foreground/55 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's actually in it */}
      <section className="py-14 md:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-blue uppercase tracking-[0.25em] mb-4">
            Exactly what you get
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.04em] text-foreground leading-[0.95]">
            The full <span className="text-blue">breakdown</span>
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-sm font-bold text-foreground/70 uppercase tracking-wider">
                Every column in the file
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.fields.map((field) => (
                  <span
                    key={field}
                    className="px-3 py-1.5 rounded-full text-sm font-semibold bg-blue/5 text-blue/80 border border-blue/8"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-foreground/70 uppercase tracking-wider">
                What kind of businesses
              </h3>
              <div className="mt-4 space-y-2">
                {MIX.map((m) => (
                  <div key={m.label} className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-foreground/65">{m.label}</span>
                    <span className="font-bold text-foreground tabular-nums">
                      {m.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 rounded-2xl border border-blue/10 bg-blue/[0.02]">
            <h3 className="text-sm font-bold text-foreground">Two things to know before you buy</h3>
            <p className="mt-3 text-sm text-foreground/60 font-medium leading-relaxed">
              The email on each row is the contact listed on the license application. That is
              usually the owner, but it is sometimes their consultant, attorney, or landlord.
              And {UNIQUE_EMAILS.toLocaleString()} of the {product.leadCount.toLocaleString()} addresses
              are unique — the rest repeat because one operator filed for more than one location.
            </p>
          </div>
        </div>
      </section>

      {/* Free sample */}
      <section className="py-14 md:py-20 px-6 bg-blue/[0.015] border-y border-blue/5">
        <div className="max-w-xl mx-auto">
          <SampleForm product={product} />
        </div>
      </section>

      {/* Buy box */}
      <section className="py-14 md:py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="p-8 md:p-12 rounded-3xl border-2 border-blue bg-blue/[0.02] shadow-[0_8px_40px_rgba(0,85,255,0.12)] text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-xs font-bold text-blue uppercase tracking-[0.25em]">
              One-time purchase
            </div>
            <div className="mt-4 flex items-baseline justify-center gap-2">
              <span className="text-6xl font-black tracking-tight text-foreground">
                ${product.price}
              </span>
              <span className="text-base font-semibold text-foreground/50">once</span>
            </div>
            <div className="mt-2 text-sm font-semibold text-blue">
              {((product.price / product.leadCount) * 100).toFixed(1)}¢ per business
            </div>

            <div className="mt-8 space-y-3 text-left max-w-sm mx-auto">
              {[
                `${product.leadCount.toLocaleString()} Florida food businesses`,
                "An email address on every row",
                `${WITH_PHONE.toLocaleString()} with a phone number too`,
                "Instant CSV download after checkout",
                "No subscription, no recurring charges",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm font-medium text-foreground/65">{feat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleBuy}
              disabled={loading}
              className="mt-10 h-14 w-full sm:w-auto px-12 bg-blue text-white font-bold text-base rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Processing..." : "Buy Now — Instant Access"}
            </button>
            <p className="mt-4 text-xs font-medium text-foreground/40">
              Secure checkout by Stripe
            </p>
          </motion.div>
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
            {faqs.map((faq) => (
              <div key={faq.q} className="p-6 rounded-2xl border border-blue/8 hover:border-blue/15 transition-colors">
                <h3 className="text-base font-bold text-foreground">{faq.q}</h3>
                <p className="mt-2 text-sm text-foreground/55 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
