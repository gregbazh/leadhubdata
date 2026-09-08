import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { neon } from "@neondatabase/serverless";
import { csvStream } from "@/lib/csv.mjs";
import { getStripe } from "@/lib/stripe";
import { getOneTimeProductById } from "@/lib/products";
import { verifySessionValue, SESSION_COOKIE } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 300;

// The stored value was computed on the day the file was built, so it goes
// stale every night. Recompute it against the buyer's download date.
function daysUntil(expires: unknown): string {
  const [m, d, y] = String(expires ?? "").split("/").map(Number);
  if (!m || !d || !y) return "";
  const today = new Date();
  const days = Math.ceil(
    (Date.UTC(y, m - 1, d) - Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
      / 86_400_000
  );
  return String(days);
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const requestedProduct = req.nextUrl.searchParams.get("product");

  let product;

  if (sessionId) {
    // Someone who bought a single list: the Stripe session is the receipt.
    let session;
    try {
      session = await getStripe().checkout.sessions.retrieve(sessionId);
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 404 });
    }
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }
    product = getOneTimeProductById(session.metadata?.productId ?? "");
    if (!product) {
      return NextResponse.json({ error: "No downloadable product on this purchase" }, { status: 404 });
    }
  } else {
    // A subscriber has no per-list Stripe session, so entitlement comes from
    // the signed-in session plus a live subscription.
    const cookieStore = await cookies();
    const email = verifySessionValue(cookieStore.get(SESSION_COOKIE)?.value);
    if (!email) {
      return NextResponse.json({ error: "Sign in to download" }, { status: 401 });
    }
    if (!(await hasActiveSubscription(email))) {
      return NextResponse.json({ error: "No active subscription" }, { status: 403 });
    }
    product = getOneTimeProductById(requestedProduct ?? "");
    if (!product) {
      return NextResponse.json({ error: "Unknown list" }, { status: 404 });
    }
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return NextResponse.json({ error: "Download temporarily unavailable" }, { status: 503 });
  }

  const sql = neon(process.env.DATABASE_URL);
  // table and orderBy come from our own product catalog, never from user input.
  const rows = (await sql.query(
    `SELECT * FROM ${product.table} ORDER BY ${product.orderBy}`
  )) as Record<string, unknown>[];

  const exportRows = product.columns.includes("days_until_expiry") ? rows.map(row => ({ ...row, days_until_expiry: daysUntil(row.license_expires) })) : rows;
  return new NextResponse(csvStream(exportRows, product.columns), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${product.downloadName}"`,
      "Cache-Control": "no-store",
    },
  });
}
