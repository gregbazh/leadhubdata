import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getStripe } from "@/lib/stripe";
import { getOneTimeProductById } from "@/lib/products";

export const runtime = "nodejs";

const CSV_COLUMNS = [
  "license_number", "trade_code", "trade", "licensee_name", "dba_name",
  "address", "city", "state", "zip", "county_code", "originally_licensed",
  "license_expires", "days_until_expiry",
];

function toCsv(rows: Record<string, unknown>[]): string {
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [CSV_COLUMNS.join(",")];
  for (const row of rows) {
    lines.push(CSV_COLUMNS.map((c) => esc(row[c])).join(","));
  }
  return lines.join("\n") + "\n";
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 404 });
  }

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
  }

  const product = getOneTimeProductById(session.metadata?.productId ?? "");
  if (!product) {
    return NextResponse.json({ error: "No downloadable product on this purchase" }, { status: 404 });
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return NextResponse.json({ error: "Download temporarily unavailable" }, { status: 503 });
  }

  const sql = neon(process.env.DATABASE_URL);
  // product.table comes from our own product catalog, never from user input.
  const rows = (await sql.query(
    `SELECT * FROM ${product.table} ORDER BY to_date(license_expires, 'MM/DD/YYYY'), license_number`
  )) as Record<string, unknown>[];

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${product.downloadName}"`,
      "Cache-Control": "no-store",
    },
  });
}
