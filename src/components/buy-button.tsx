"use client";

import { useEffect, useState } from "react";
import { captureAttribution, readAttribution } from "@/lib/attribution";

export default function BuyButton({ productId, price, subscription = false }: { productId: string; price: number; subscription?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(captureAttribution, []);
  async function buy() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, attribution: readAttribution() }) });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error("Checkout could not start. Please try again.");
      window.location.assign(data.url);
    } catch {
      setError("Checkout could not start. Please try again."); setLoading(false);
    }
  }
  return <div>
    <button onClick={buy} disabled={loading} className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-dark disabled:opacity-50">
      {loading ? "Opening checkout…" : subscription ? `Subscribe — $${price}/month` : `Buy the CSV — $${price}`}
    </button>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
  </div>;
}
