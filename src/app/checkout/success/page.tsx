"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <motion.div
        className="max-w-lg w-full text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="w-20 h-20 bg-[#0055FF] text-white flex items-center justify-center mx-auto"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>

        <h1 className="mt-8 text-4xl md:text-5xl font-black tracking-[-0.02em] text-[#0a0a0a]">
          ORDER CONFIRMED
        </h1>

        <p className="mt-4 text-lg text-[#0a0a0a]/50 font-medium leading-relaxed">
          Your leads are being prepared and will be delivered to your email
          within <span className="text-[#0a0a0a] font-bold">24 hours</span>.
        </p>

        <div
          className="mt-8 p-6 bg-[#F5F7FA] border border-[#0a0a0a]/5 text-left"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 95% 100%, 0 100%)" }}
        >
          <h3 className="text-xs font-bold text-[#0a0a0a]/30 uppercase tracking-widest">
            What happens next
          </h3>
          <ul className="mt-4 space-y-3">
            {[
              "We pull your leads from the latest public records",
              "Each lead is verified for accuracy and enriched with contact info",
              "Your CSV file is delivered to the email on your Stripe account",
              "Need help? Reply to the delivery email anytime",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 bg-[#0055FF] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)" }}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-[#0a0a0a]/60">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center h-12 px-6 text-sm font-bold text-white bg-[#0055FF] hover:bg-[#0033CC] transition-colors"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 65%, 92% 100%, 0 100%)" }}
        >
          ← Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
