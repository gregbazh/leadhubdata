import crypto from "node:crypto";
import { getSql, ensureAccountSchema } from "@/lib/db";

// Minimal passwordless auth: 6-digit codes emailed via Resend, hashed at
// rest in Neon, exchanged for a signed HttpOnly session cookie. No account
// is required to buy or download -- this only powers optional re-downloads
// from /account.

export const SESSION_COOKIE = "lh_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const CODE_TTL_MS = 10 * 60 * 1000; // codes expire after 10 minutes
const MAX_CODES_PER_WINDOW = 3; // per email per 15 minutes
const RATE_WINDOW_MINUTES = 15;
const MAX_VERIFY_ATTEMPTS = 5;

// Prefer an explicit AUTH_SECRET; otherwise derive a stable secret from
// DATABASE_URL (itself a secret) so sessions work without extra setup.
let _secret: string | null = null;
function getSecret(): string {
  if (_secret) return _secret;
  const explicit = process.env.AUTH_SECRET;
  if (explicit) {
    _secret = explicit;
  } else {
    const seed = process.env.DATABASE_URL;
    if (!seed) throw new Error("Set AUTH_SECRET (or DATABASE_URL) for session signing");
    _secret = crypto.createHash("sha256").update(`leadhubdata-auth:${seed}`).digest("hex");
  }
  return _secret;
}

function hmac(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

// ── Session cookie ──────────────────────────────────────────────────────

export function createSessionValue(email: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${Buffer.from(email).toString("base64url")}.${exp}`;
  return `${payload}.${hmac(payload)}`;
}

export function verifySessionValue(value: string | undefined): string | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [emailB64, expStr, sig] = parts;
  const payload = `${emailB64}.${expStr}`;
  const expected = hmac(payload);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null;
  try {
    return Buffer.from(emailB64, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

// ── One-time codes ──────────────────────────────────────────────────────

function hashCode(email: string, code: string): string {
  return crypto.createHash("sha256").update(`${email}:${code}:${getSecret()}`).digest("hex");
}

export type RequestCodeResult = "sent" | "rate_limited";

export async function createLoginCode(email: string): Promise<{ result: RequestCodeResult; code?: string }> {
  await ensureAccountSchema();
  const sql = getSql();

  const recent = (await sql.query(
    `SELECT count(*)::int AS n FROM login_codes
     WHERE email = $1 AND created_at > now() - make_interval(mins => $2)`,
    [email, RATE_WINDOW_MINUTES]
  )) as { n: number }[];
  if ((recent[0]?.n ?? 0) >= MAX_CODES_PER_WINDOW) {
    return { result: "rate_limited" };
  }

  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
  const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString();

  // A fresh code invalidates previous unused ones for this email.
  await sql.query(`UPDATE login_codes SET used = true WHERE email = $1 AND used = false`, [email]);
  await sql.query(
    `INSERT INTO login_codes (email, code_hash, expires_at) VALUES ($1, $2, $3)`,
    [email, hashCode(email, code), expiresAt]
  );

  return { result: "sent", code };
}

export type VerifyCodeResult = "ok" | "invalid" | "expired";

export async function verifyLoginCode(email: string, code: string): Promise<VerifyCodeResult> {
  if (!/^\d{6}$/.test(code)) return "invalid";
  await ensureAccountSchema();
  const sql = getSql();

  const rows = (await sql.query(
    `SELECT id, code_hash, expires_at, attempts FROM login_codes
     WHERE email = $1 AND used = false
     ORDER BY created_at DESC LIMIT 1`,
    [email]
  )) as { id: string; code_hash: string; expires_at: string; attempts: number }[];

  const row = rows[0];
  if (!row) return "invalid";
  if (new Date(row.expires_at).getTime() < Date.now()) return "expired";
  if (row.attempts >= MAX_VERIFY_ATTEMPTS) return "invalid";

  const candidate = Buffer.from(hashCode(email, code));
  const stored = Buffer.from(row.code_hash);
  const match =
    candidate.length === stored.length && crypto.timingSafeEqual(candidate, stored);

  if (!match) {
    await sql.query(`UPDATE login_codes SET attempts = attempts + 1 WHERE id = $1`, [row.id]);
    return "invalid";
  }

  await sql.query(`UPDATE login_codes SET used = true WHERE id = $1`, [row.id]);
  return "ok";
}

// ── Email delivery (Resend REST, same pattern as the Stripe webhook) ────

export async function sendLoginCodeEmail(to: string, code: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    console.error("sendLoginCodeEmail: RESEND_API_KEY / RESEND_FROM not set");
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM,
      to: [to],
      reply_to: process.env.RESEND_REPLY_TO || undefined,
      subject: `${code} is your LeadHubData sign-in code`,
      text: [
        `Your LeadHubData sign-in code is: ${code}`,
        ``,
        `It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
      ].join("\n"),
    }),
  });
  if (!res.ok) {
    console.error("Login code email failed:", res.status, await res.text().catch(() => ""));
    return false;
  }
  return true;
}
