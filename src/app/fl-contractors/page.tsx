"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { oneTimeProducts } from "@/lib/products";

const product = oneTimeProducts.find((p) => p.id === "fl-contractors")!;

const RENEWAL_DEADLINE = new Date("2026-08-31T23:59:59-04:00");

function daysUntilDeadline() {
  return Math.max(0, Math.ceil((RENEWAL_DEADLINE.getTime() - Date.now()) / 86_400_000));
}

export default function FlContractorsPage() {
  const [loading, setLoading] = useState(false);
  const days = daysUntilDeadline();

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 text-sm font-bold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
              </span>
              License renewal deadline: August 31 — {days} days out
            </div>

            <h1 className="mt-8 text-5xl md:text-7xl font-black tracking-[-0.04em] text-foreground leading-[0.9]">
              {product.leadCount.toLocaleString()}
              <br />
              <span className="text-blue">FL Contractors</span>
              <br />
              renewing now
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
            { big: product.leadCount.toLocaleString(), small: "active licensed contractors" },
            { big: "≤ 90 days", small: "until every license expires" },
            { big: "Sorted", small: "by expiration date — call the most urgent first" },
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

      {/* Why now */}
      <section className="py-14 md:py-20 px-6 bg-blue/[0.015] border-y border-blue/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-blue uppercase tracking-[0.25em] mb-4">Why now</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.04em] text-foreground leading-[0.95] max-w-3xl">
            Every renewal needs a <span className="text-blue">bond, GL, and workers&apos; comp</span>
          </h2>
          <p className="mt-6 text-lg text-foreground/60 font-medium max-w-2xl leading-relaxed">
            Florida&apos;s contractor license renewal wave hits August 31. These businesses
            must have their insurance and bonding squared away to keep working — which
            makes the next few weeks the single best time of the year to call them.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "Built-in urgency",
                desc: "A hard state deadline does the selling for you. No cold pitch needed — they already have to act.",
              },
              {
                title: "Public-record accuracy",
                desc: "Sourced directly from Florida DBPR license files. Current, active licenses only — no recycled lists.",
              },
              {
                title: "Priority-ordered",
                desc: "Sorted by exact expiration date. Start at the top and work down as renewals come due.",
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

      {/* Data fields */}
      <section className="py-14 md:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-blue uppercase tracking-[0.25em] mb-4">
            What&apos;s in every record
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.04em] text-foreground leading-[0.95]">
            Full contact-ready <span className="text-blue">records</span>
          </h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {product.fields.map((field) => (
              <span
                key={field}
                className="px-3 py-1.5 rounded-full text-sm font-semibold bg-blue/5 text-blue/80 border border-blue/8"
              >
                {field}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-foreground/50 font-medium max-w-2xl">
            A growing share of records also carry email, phone, and website — verified by
            hand through our enrichment pipeline.
          </p>
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
              {(product.price / product.leadCount * 100).toFixed(1)}¢ per lead
            </div>

            <div className="mt-8 space-y-3 text-left max-w-sm mx-auto">
              {[
                `${product.leadCount.toLocaleString()} active FL contractors`,
                "Instant CSV download after checkout",
                "Download link emailed for re-download anytime",
                "Sorted by license expiration date",
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
            {[
              {
                q: "Where does the data come from?",
                a: "Directly from Florida DBPR public license records. Every record is a current, active contractor license with an expiration date inside the next 90 days.",
              },
              {
                q: "How do I get the file?",
                a: "Instantly. The download starts right after checkout, and we email you the same link so you can re-download whenever you need it.",
              },
              {
                q: "Is this a subscription?",
                a: "No. One payment, one CSV, yours to keep. No recurring charges.",
              },
              {
                q: "Do all records have emails and phones?",
                a: "Every record has the licensee's business identity, location, trade, and exact expiration date. A growing enriched subset also includes email, phone, and website.",
              },
              {
                q: "Can I see a sample first?",
                a: "Yes — email us and we'll send 100 free records from the county you work.",
              },
            ].map((faq) => (
              <div key={faq.q} className="p-6 rounded-2xl border border-blue/8 hover:border-blue/15 transition-colors">
                <h4 className="text-base font-bold text-foreground">{faq.q}</h4>
                <p className="mt-2 text-sm text-foreground/55 font-medium leading-relaxed">{faq.a}</p>
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
          <p className="text-xs text-foreground/35 font-medium">© 2026 LeadHubData</p>
        </div>
      </footer>
    </div>
  );
}
