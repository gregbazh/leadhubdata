import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail, createLoginCode, sendLoginCodeEmail } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = normalizeEmail((body as { email?: unknown })?.email);
  if (!email) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  try {
    const { result, code } = await createLoginCode(email);
    if (result === "rate_limited") {
      return NextResponse.json(
        { error: "Too many codes requested. Try again in 15 minutes." },
        { status: 429 }
      );
    }
    const sent = await sendLoginCodeEmail(email, code!);
    if (!sent) {
      return NextResponse.json(
        { error: "Couldn't send the email. Please try again." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("request-code error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
