"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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
          YOU&apos;RE
          <br />
          <span className="text-blue">SUBSCRIBED</span>
        </h1>

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

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-8 text-sm font-bold text-white bg-blue rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)]"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
