import { NextResponse } from "next/server";

// The Stripe billing portal only applies to subscriptions, which are not
// currently sold (the only live product is the one-time FL Contractors list).
// Restore the billingPortal.sessions.create handler from git history when
// subscriptions launch.
export async function POST() {
  return NextResponse.json({ error: "Not available" }, { status: 404 });
}
