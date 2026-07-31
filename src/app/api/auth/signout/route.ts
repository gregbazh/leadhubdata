import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  // Plain form posts get bounced back to /account; fetch() callers get JSON.
  if (req.headers.get("accept")?.includes("text/html")) {
    return NextResponse.redirect(new URL("/account", req.url), 303);
  }
  return NextResponse.json({ ok: true });
}
