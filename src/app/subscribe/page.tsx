"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import { SUBSCRIPTION, oneTimeProducts } from "@/lib/products";
import { captureAttribution, readAttribution } from "@/lib/attribution";

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);

  useEffect(captureAttribution, []);

  async function handleSubscribe() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: SUBSCRIPTION.id, attribution: readAttribution() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      alert("Checkout couldn't start. Please try again in a moment.");
      setLoading(false);
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const catalogueTotal = oneTimeProducts.reduce((n, p) => n + p.leadCount, 0);

  return (
    <div className="min-h-screen bg-white">
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
          <Link href="/account" className="text-sm font-bold text-foreground/60 hover:text-blue transition-colors">
            My Account
          </Link>
        </div>
      </motion.nav>

      <section className="relative pt-28 pb-14 md:pt-40 md:pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: "radial-gradient(circle, #0055FF 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue/5 border border-blue/15 text-blue text-sm font-bold">
              New businesses in your inbox every week
            </div>
            <h1 className="mt-8 text-5xl md:text-7xl font-black tracking-[-0.04em] text-foreground leading-[0.9]">
              Stop buying lists.
              <br />
              <span className="text-blue">Get the feed.</span>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-foreground/60 font-medium leading-relaxed">
              About {SUBSCRIPTION.newPerMonth.toLocaleString()} Florida food businesses file with
              the state every month, each one with a contact email. Every week we send you the
              ones that just filed — before anyone has sold them a policy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="p-8 md:p-12 rounded-3xl border-2 border-blue bg-blue/[0.02] shadow-[0_8px_40px_rgba(0,85,255,0.12)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center">
              <div className="text-xs font-bold text-blue uppercase tracking-[0.25em]">
                {SUBSCRIPTION.name}
              </div>
              <div className="mt-4 flex items-baseline justify-center gap-2">
                <span className="text-6xl font-black tracking-tight text-foreground">
                  ${SUBSCRIPTION.price}
                </span>
                <span className="text-base font-semibold text-foreground/50">/month</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-blue">
                Cancel anytime — one click, no phone call
              </div>
            </div>

            <div className="mt-10 space-y-3 max-w-md mx-auto">
              {SUBSCRIPTION.includes.map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 text-blue flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm font-medium text-foreground/70">{line}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="h-14 w-full sm:w-auto px-12 bg-blue text-white font-bold text-base rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? "Processing..." : `Start — $${SUBSCRIPTION.price}/month`}
              </button>
              <p className="mt-4 text-xs font-medium text-foreground/40">
                Secure checkout by Stripe · Your first delivery arrives within minutes
              </p>
            </div>
          </motion.div>

          <div className="mt-10 p-6 rounded-2xl border border-blue/10 bg-white">
            <h3 className="text-sm font-bold text-foreground">What you get on day one</h3>
            <p className="mt-3 text-sm text-foreground/60 font-medium leading-relaxed">
              The entire archive — {catalogueTotal.toLocaleString()} Florida businesses across
              every list we publish — emailed to you as soon as you subscribe. After that, a fresh
              batch every week containing only what&apos;s new, so you never sort through records
              you&apos;ve already worked.
            </p>
            <p className="mt-4 text-sm text-foreground/60 font-medium leading-relaxed">
              Florida deletes food businesses from its public file once they&apos;re licensed. We
              keep them. The longer you subscribe, the more you hold that nobody can get from the
              state anymore.
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-foreground/45">
              Just want one list instead?{" "}
              <Link href="/" className="font-bold text-blue hover:underline">
                Buy a single list outright
              </Link>
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
