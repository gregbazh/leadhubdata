import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  normalizeEmail,
  verifyLoginCode,
  createSessionValue,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email: rawEmail, code: rawCode } = (body ?? {}) as {
    email?: unknown;
    code?: unknown;
  };
  const email = normalizeEmail(rawEmail);
  const code = typeof rawCode === "string" ? rawCode.trim() : "";
  if (!email || !code) {
    return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
  }

  try {
    const result = await verifyLoginCode(email, code);
    if (result === "expired") {
      return NextResponse.json(
        { error: "That code expired. Request a new one." },
        { status: 401 }
      );
    }
    if (result !== "ok") {
      return NextResponse.json({ error: "Invalid code. Check and try again." }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, createSessionValue(email), sessionCookieOptions);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("verify-code error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
