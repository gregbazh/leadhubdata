import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getOneTimeProductById } from "@/lib/products";
import { recentSampleCount, recordSampleRequest } from "@/lib/db";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [columns.join(",")];
  for (const row of rows) lines.push(columns.map((c) => esc(row[c])).join(","));
  return lines.join("\n") + "\n";
}

async function emailSample(to: string, filename: string, csv: string, productName: string, rowCount: number) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_TRANSACTIONAL_FROM || process.env.RESEND_FROM,
      to: [to],
      reply_to: process.env.RESEND_REPLY_TO || undefined,
      subject: `Your ${rowCount}-record sample — ${productName}`,
      text: [
        `Here's your free sample: ${rowCount} records from ${productName}, attached as a CSV.`,
        ``,
        `These are real records from the full list, in the same format and with the same columns you'd get if you bought it.`,
        ``,
        `Questions? Just reply to this email.`,
      ].join("\n"),
      attachments: [{ filename, content: Buffer.from(csv).toString("base64") }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text().catch(() => "")}`);
  }
}

export async function POST(req: NextRequest) {
  let body: { email?: string; productId?: string; filter?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const product = getOneTimeProductById(body.productId ?? "");
  if (!product) {
    return NextResponse.json({ error: "Unknown product." }, { status: 400 });
  }

  // The filter goes into SQL, so it must be one of our own listed values --
  // never the raw string off the request.
  const filter = (body.filter ?? "").trim();
  if (filter && !product.sample.options.includes(filter)) {
    return NextResponse.json({ error: "Pick one of the listed options." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL || !process.env.RESEND_API_KEY || !(process.env.RESEND_TRANSACTIONAL_FROM || process.env.RESEND_FROM)) {
    console.error("sample: missing DATABASE_URL / RESEND_API_KEY / RESEND_FROM");
    return NextResponse.json({ error: "Samples are unavailable right now." }, { status: 503 });
  }

  try {
    if (await recentSampleCount(email, product.id) > 0) {
      return NextResponse.json(
        { error: "We already sent you a sample of this list today — check your inbox." },
        { status: 429 }
      );
    }

    const sql = neon(process.env.DATABASE_URL);
    const rows = (filter
      ? await sql.query(
          `SELECT * FROM ${product.table} WHERE ${product.sample.column} = $1
           ORDER BY ${product.orderBy} LIMIT ${product.sample.rows}`,
          [filter]
        )
      : await sql.query(
          `SELECT * FROM ${product.table} ORDER BY ${product.orderBy} LIMIT ${product.sample.rows}`
        )) as Record<string, unknown>[];

    if (!rows.length) {
      return NextResponse.json({ error: "No records matched that selection." }, { status: 404 });
    }

    await emailSample(
      email,
      `sample_${product.id.replace(/-/g, "_")}.csv`,
      toCsv(rows, product.columns.filter((c) => c !== "days_until_expiry")),
      product.name,
      rows.length
    );
    await recordSampleRequest({ email, productId: product.id, filter: filter || null });

    return NextResponse.json({ ok: true, rows: rows.length });
  } catch (err) {
    console.error("sample: failed to send:", err);
    return NextResponse.json({ error: "Couldn't send that sample. Try again shortly." }, { status: 500 });
  }
}
