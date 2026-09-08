"use client";
import { useState } from "react";
export default function ManageBilling() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function open() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/portal", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error();
      window.location.assign(data.url);
    } catch { setError("Billing could not open. Please try again."); setLoading(false); }
  }
  return <div className="mt-4"><button onClick={open} disabled={loading} className="text-sm font-bold text-blue underline disabled:opacity-50">{loading ? "Opening…" : "Manage billing or cancel"}</button>{error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}</div>;
}
