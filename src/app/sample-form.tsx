"use client";

import { useState } from "react";
import type { OneTimeProduct } from "@/lib/products";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; rows: number } | { kind: "error"; message: string };

export default function SampleForm({ product }: { product: OneTimeProduct }) {
  const [email, setEmail] = useState("");
  const [filter, setFilter] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId: product.id, filter }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setState({ kind: "sent", rows: data.rows ?? product.sample.rows });
      else setState({ kind: "error", message: data.error ?? "Something went wrong." });
    } catch {
      setState({ kind: "error", message: "Network error — try again." });
    }
  }

  if (state.kind === "sent") {
    return (
      <div className="p-8 rounded-3xl border-2 border-blue bg-blue/[0.03] text-center">
        <div className="w-14 h-14 mx-auto bg-blue rounded-2xl text-white flex items-center justify-center">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-5 text-2xl font-black tracking-tight text-foreground">
          Sent — check your inbox
        </h3>
        <p className="mt-3 text-sm font-medium text-foreground/60 leading-relaxed">
          {state.rows} real records are on their way to{" "}
          <span className="font-bold text-foreground">{email}</span>, attached as a CSV.
          Same columns you get in the full file.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-3xl border-2 border-blue/15 bg-white">
      <h3 className="text-2xl font-black tracking-[-0.02em] text-foreground">
        See {product.sample.rows} records free
      </h3>
      <p className="mt-2 text-sm font-medium text-foreground/55 leading-relaxed">
        Real records from the list, emailed to you now. No card, no call.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <div>
          <label htmlFor="sample-filter" className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1.5">
            {product.sample.label}
          </label>
          <select
            id="sample-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-blue/15 bg-white text-sm font-medium text-foreground focus:border-blue focus:outline-none transition-colors"
          >
            <option value="">All of them</option>
            {product.sample.options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sample-email" className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1.5">
            Where should we send it?
          </label>
          <input
            id="sample-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@youragency.com"
            className="w-full h-12 px-4 rounded-xl border border-blue/15 bg-white text-sm font-medium text-foreground placeholder:text-foreground/30 focus:border-blue focus:outline-none transition-colors"
          />
        </div>

        {state.kind === "error" && (
          <p className="text-sm font-semibold text-red-600">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={state.kind === "sending"}
          className="w-full h-13 py-3.5 bg-blue text-white font-bold text-base rounded-full hover:bg-blue-dark transition-all duration-300 disabled:opacity-50"
        >
          {state.kind === "sending" ? "Sending..." : `Email me ${product.sample.rows} free records`}
        </button>
        <p className="text-xs font-medium text-foreground/40 text-center">
          We&apos;ll only email you about this list. Reply &quot;unsubscribe&quot; anytime.
        </p>
      </form>
    </div>
  );
}
