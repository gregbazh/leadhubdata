"use client";

// Carries campaign attribution from the landing URL through to Stripe, so a
// sale can be traced back to the email that caused it.
//
// Campaign-level only, by design. The UTM parameters name the campaign and the
// copy variant -- never the recipient. send-campaign.mjs deliberately keeps
// per-person identifiers out of links, and this preserves that: nothing here
// can identify who clicked, only which email did the work.

const KEY = "lhd_attribution";

export type Attribution = {
  campaign: string | null;
  variant: string | null;
  source: string | null;
  medium: string | null;
};

const EMPTY: Attribution = { campaign: null, variant: null, source: null, medium: null };

// Values land in Stripe metadata and in the ops tables, so they are clamped to
// a short, boring character set rather than trusted from the query string.
function clean(v: string | null): string | null {
  if (!v) return null;
  const s = v.trim().slice(0, 64);
  return /^[\w.\-]+$/.test(s) ? s : null;
}

// Call once on mount of any page an email can land on. The parameters are only
// present on the first pageview; a visitor who browses before buying would
// otherwise arrive at checkout with nothing attached.
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams(window.location.search);
  const found: Attribution = {
    campaign: clean(p.get("utm_campaign")),
    variant: clean(p.get("utm_content")),
    source: clean(p.get("utm_source")),
    medium: clean(p.get("utm_medium")),
  };
  if (!found.campaign && !found.source) return;
  try {
    // First touch wins: if someone arrives from one campaign and later clicks a
    // second, the first is what earned the visit.
    if (!window.sessionStorage.getItem(KEY)) {
      window.sessionStorage.setItem(KEY, JSON.stringify(found));
    }
  } catch {
    // Private mode or storage disabled -- attribution is best effort and must
    // never block a purchase.
  }
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Attribution>) };
  } catch {
    return EMPTY;
  }
}
