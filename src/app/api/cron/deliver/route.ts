import { NextRequest, NextResponse } from "next/server";
import { deliverSubscriptions } from "@/lib/subscription-delivery";
export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const result = await deliverSubscriptions();
    const ok = result.results.every(r => r.status !== "failed");
    console.log("Subscription delivery:", JSON.stringify(result));
    return NextResponse.json({ ok, ...result }, { status: ok ? 200 : 500 });
  } catch (error) {
    console.error("Delivery unavailable:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Delivery unavailable" }, { status: 503 });
  }
}
