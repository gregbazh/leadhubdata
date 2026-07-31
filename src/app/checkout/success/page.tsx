"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getOneTimeProductById } from "@/lib/products";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const product = getOneTimeProductById(params.get("product") ?? "");
  const oneTime = Boolean(product && sessionId);

  return (
    <motion.div
      className="relative max-w-lg w-full text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="w-20 h-20 bg-blue rounded-2xl text-white flex items-center justify-center mx-auto shadow-[0_8px_30px_rgba(0,85,255,0.3)]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <h1 className="mt-8 text-4xl md:text-6xl font-black tracking-[-0.04em] text-foreground leading-[0.9]">
        {oneTime ? (
          <>
            PAYMENT
            <br />
            <span className="text-blue">RECEIVED</span>
          </>
        ) : (
          <>
            YOU&apos;RE
            <br />
            <span className="text-blue">SUBSCRIBED</span>
          </>
        )}
      </h1>

      {oneTime && product ? (
        <>
          <p className="mt-6 text-lg text-foreground/55 font-medium leading-relaxed">
            Your list of{" "}
            <span className="text-foreground font-bold">
              {product.leadCount.toLocaleString()} leads
            </span>{" "}
            is ready. Download it now — we&apos;ve also emailed you this link so you
            can re-download anytime.
          </p>

          <a
            href={`/api/download?session_id=${sessionId}`}
            className="mt-10 inline-flex items-center justify-center gap-2 h-14 px-10 text-base font-bold text-white bg-blue rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)] hover:scale-105"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download CSV
          </a>

          <p className="mt-6 text-sm text-foreground/45 font-medium">
            Trouble downloading? Reply to the receipt email and we&apos;ll sort it out.
          </p>
        </>
      ) : (
        <>
          <p className="mt-6 text-lg text-foreground/55 font-medium leading-relaxed">
            Your subscription is active. Your first batch of leads will be delivered
            to your email within <span className="text-foreground font-bold">24 hours</span>.
          </p>

          <div className="mt-10 p-6 rounded-2xl border border-blue/10 bg-blue/[0.02] text-left">
            <h3 className="text-xs font-bold text-blue uppercase tracking-[0.25em]">
              What happens next
            </h3>
            <ul className="mt-5 space-y-4">
              {[
                "We pull your leads from the latest public records",
                "Each lead is verified for accuracy and enriched with contact info",
                "Your CSV file is delivered to the email on your Stripe account",
                "New leads are delivered automatically every month",
                "Manage your subscription anytime from the customer portal",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-blue text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-[0_2px_8px_rgba(0,85,255,0.3)]">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground/60">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-8 text-sm font-bold text-foreground/60 border border-blue/15 rounded-full hover:border-blue/30 hover:text-blue transition-all duration-300"
        >
          ← Back to Home
        </Link>
      </div>
    </motion.div>
  );
}

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(circle, #0055FF 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        <div
          className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,85,255,0.06) 0%, transparent 70%)" }}
        />
      </div>

      <Suspense fallback={null}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
