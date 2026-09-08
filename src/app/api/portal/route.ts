import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionValue, SESSION_COOKIE } from "@/lib/auth";
import { getSql } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const email = verifySessionValue((await cookies()).get(SESSION_COOKIE)?.value);
  if (!email) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  try {
    const [row] = await getSql().query("SELECT stripe_subscription_id FROM subscriptions WHERE email=$1 ORDER BY created_at DESC LIMIT 1", [email]);
    if (!row) return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(row.stripe_subscription_id);
    const customer = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
    const session = await stripe.billingPortal.sessions.create({ customer, configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID?.trim(), return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.leadhubdata.com"}/account` });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Billing portal failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Billing is unavailable right now" }, { status: 503 });
  }
}
